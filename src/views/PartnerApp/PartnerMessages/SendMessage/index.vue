<template>
  <div v-loading="loading" class="messages">
    <DataWrapper>
      <template slot="table-header">
        <h1>
          {{ $t('SendMessage.table_title') }}
        </h1>
        <div class="table__settings">
          <el-input v-model="filters.driver" :placeholder="$t('driver')" clearable class="drivers__filter-item" />
        </div>
      </template>
      <template slot="table-body">
        <el-table
          ref="table"
          :empty-text="$t('Drivers.no_drivers_placeholder')"
          :data="driverWithEmails"
          :height="
            mobile ? 'calc(100vh - 48px - 64px - 64px - 16px)' : 'calc(100vh - 48px - 64px - 64px - 64px - 96px)'
          "
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column :label="$t('driver')" min-width="120px" align="center">
            <template slot-scope="scope"> {{ scope.row.lastName }} {{ scope.row.firstName }} </template>
          </el-table-column>
          <el-table-column :label="$t('email_address')" align="center">
            <template slot-scope="scope">
              {{ scope.row.email ? scope.row.email : $t('dash') }}
            </template>
          </el-table-column>
        </el-table>
        <div class="messages__view">
          <el-form>
            <el-form-item :label="$t('SendMessage.content')">
              <el-input v-model="newMessage.content" type="textarea"></el-input>
            </el-form-item>
            <div class="messages__buttons">
              <el-button-group>
                <el-button
                  :disabled="!selectedDrivers.length || !newMessage.content"
                  type="primary"
                  class="messages__action"
                  @click="sendMessage(selectedDrivers)"
                  >{{ $t('SendMessage.send') }}
                </el-button>
                <el-button :disabled="!newMessage.content" type="info" class="messages__action" @click="sendMessage()">
                  {{ $t('SendMessage.send_all') }}
                </el-button>
              </el-button-group>
            </div>
          </el-form>
        </div>
      </template>
    </DataWrapper>
  </div>
</template>

<script>
import { getDriversList } from '@/api/driversApi';
import { getMessages, postMessage } from '@/api/messagesApi';
import DataWrapper from '@/components/DataWrapper';

export default {
  components: {
    DataWrapper,
  },
  data() {
    return {
      loading: false,
      messages: [],
      drivers: [],
      selectedDrivers: [],
      newMessage: {
        driverUUIDs: [],
        content: null,
        channel: 'EMAIL',
      },
      filters: {
        driver: null,
      },
    };
  },
  computed: {
    driverWithEmails() {
      return this.filterDrivers(
        this.drivers.filter((driver) => driver.email),
        this.filters
      );
    },
  },
  async created() {
    this.loading = true;
    await Promise.all([
      getDriversList().then((response) => {
        if (response.ok) {
          this.drivers = response.data;
        }
      }),
      getMessages().then((response) => {
        if (response.ok) {
          this.messages = response.data;
        }
      }),
    ]);
    this.loading = false;
  },
  methods: {
    handleSelectionChange(selected) {
      this.selectedDrivers = selected;
    },
    filterDrivers(drivers, filters) {
      let driversFiltered = drivers;
      if (filters.driver) {
        const searchedDriver = filters.driver.toLowerCase();
        driversFiltered = drivers.filter((driver) => {
          const fullName = driver.lastName + ' ' + driver.firstName;
          if (fullName.toLowerCase().search(searchedDriver) >= 0) return driver;
        });
      }
      return driversFiltered;
    },
    sendMessage(selectedDrivers) {
      this.loading = true;
      this.newMessage.driverUUIDs = selectedDrivers?.length
        ? selectedDrivers.map((driver) => driver.driverUUID)
        : this.driverWithEmails.map((driver) => driver.driverUUID);

      postMessage(this.newMessage)
        .then((response) => {
          if (response.ok) {
            this.$message({
              type: 'success',
              message: this.$t('SendMessage.success'),
              center: true,
            });
            this.newMessage.content = null;
            this.$refs.table.clearSelection();
          } else {
            this.$message({
              type: 'error',
              message: this.$t('SendMessage.failed'),
              center: true,
            });
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.messages {
  &__nav {
    background: $brand-gray;
    position: relative;
    min-height: inherit;
    width: 64px;

    i {
      display: block;
      padding: 12px;
      color: $brand-yellow;
      font-size: 33px;
      text-align: center;
      cursor: pointer;
      &:hover {
        color: $brand-gray;
        background: $brand-yellow;
      }
    }
  }
  &__buttons {
    display: flex;
    width: 100%;
    justify-content: center;
  }
  &__action {
    width: 100%;
    margin-left: 0 !important;
    & + .messages__action {
      margin-top: 8px;
    }
  }
}
@media screen and (min-width: 576px) {
  .messages {
    &__buttons {
      justify-content: space-between;
    }
    &__action {
      width: auto;
      & + .messages__action {
        margin-top: 0;
      }
    }
  }
}
</style>
