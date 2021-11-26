<template>
  <ModalGateway :title="$t('MergeDrivers.title')" :close="close">
    <div v-loading="loading">
      <el-select v-model="selectedDriverUUID" filterable>
        <el-option
          v-for="(loadedDriver, idx) in driversList"
          :key="idx"
          :disabled="loadedDriver.driverUUID === driver.driverUUID"
          :value="loadedDriver.driverUUID"
          :label="loadedDriver.firstName + ' ' + loadedDriver.lastName"
        >
          {{ loadedDriver.firstName }}
          {{ loadedDriver.lastName }}
        </el-option>
      </el-select>
      <div v-if="selectedDriver" class="merge-drivers__drivers">
        <el-radio v-model="radio" label="currentDriver">
          {{ `${driver.firstName + ' ' + driver.lastName}` }}
        </el-radio>
        <el-radio v-model="radio" label="selectedDriver">
          {{ `${selectedDriver.firstName + ' ' + selectedDriver.lastName}` }}
        </el-radio>
      </div>

      <div class="merge-drivers__drivers">
        <MergingDriver :driver="driver" />
        <MergingDriver v-if="selectedDriver" :driver="selectedDriver" />
      </div>

      <div v-if="mergedDriver">
        <h3>
          {{ $t('MergeDrivers.after_merge') }}
        </h3>
        <MergingDriver :driver="mergedDriver" />
        <div slot="footer" class="merge-drivers__actions">
          <el-button @click="close = true">{{ $t('cancel') }}</el-button>
          <el-button type="primary" @click="mergeDrivers">{{ $t('MergeDrivers.merge') }}</el-button>
        </div>
      </div>
    </div>
  </ModalGateway>
</template>

<script>
import { getDriversList, putMergeDrivers } from '@/api/driversApi';
import MergingDriver from '@/components/MergingDriver';
import ModalGateway from '@/modals/ModalGateway';

export default {
  components: {
    ModalGateway,
    MergingDriver,
  },
  props: {
    driver: {
      type: Object,
    },
  },
  data() {
    return {
      close: false,
      selectedDriverUUID: null,
      mergedDriver: null,
      radio: null,
      driversList: [],
      loading: false,
    };
  },
  computed: {
    selectedDriver() {
      const selectedDriver = this.driversList.find((driver) => driver.driverUUID === this.selectedDriverUUID);
      return selectedDriver;
    },
    mergedIdentifiers() {
      return this.selectedDriver
        ? this.driver.identifiers.concat(this.selectedDriver.identifiers)
        : this.driver.identifiers;
    },
    mergedLinkStatus() {
      return this.radio === 'currentDriver'
        ? this.driver.linkStatus || this.selectedDriver.linkStatus
        : this.selectedDriver.linkStatus || this.driver.linkStatus;
    },
  },
  watch: {
    radio(value) {
      value === 'currentDriver' ? this.setDriver(this.driver) : this.setDriver(this.selectedDriver);
    },
    selectedDriver(driver) {
      this.radio === 'currentDriver' ? this.setDriver(this.driver) : this.setDriver(this.selectedDriver);
    },
  },
  async created() {
    this.loading = true;
    await getDriversList()
      .then((response) => {
        if (response.ok) {
          this.settlementSchemas = new Set(response.data.map((driver) => driver.schema));
          response.data.sort((driver, nextDriver) => {
            if (driver.lastName < nextDriver.lastName) {
              return -1;
            }
            if (nextDriver.lastName < driver.lastName) {
              return 1;
            }
            return 0;
          });
          this.driversList = response.data;
        } else {
          this.$message({
            type: 'error',
            message: this.$t('loading_drivers_error'),
            center: true,
          });
        }
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    setDriver(driver) {
      this.mergedDriver = {
        ...driver,
        linkStatus: this.mergedLinkStatus,
        identifiers: this.mergedIdentifiers,
      };
    },
    mergeDrivers() {
      this.loading = true;
      const correctDriverUUID =
        this.radio === 'currentDriver' ? this.driver.driverUUID : this.selectedDriver.driverUUID;
      const wrongDriverUUID = this.radio === 'currentDriver' ? this.selectedDriver.driverUUID : this.driver.driverUUID;

      putMergeDrivers(correctDriverUUID, wrongDriverUUID)
        .then((response) => {
          if (response.ok) {
            this.$message({ message: this.$t('MergeDrivers.success'), type: 'success', center: true });
            this.$router.push(`/drivers/${correctDriverUUID}`);
            this.close = true;
          } else {
            this.$message({ message: this.$t('MergeDrivers.failed'), type: 'error', center: true });
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
.merge-drivers {
  &__drivers {
    margin-top: 16px;
    display: flex;
    justify-content: space-evenly;
  }
  &__actions {
    margin-top: 8px;
    display: flex;
    justify-content: center;
  }
}
</style>
