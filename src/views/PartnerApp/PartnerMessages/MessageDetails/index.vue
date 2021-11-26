<template>
  <DataWrapper>
    <template slot="table-header">
      <h1>
        {{ $t('MessageDetails.table_title') }}
      </h1>
    </template>
    <template slot="table-body">
      <el-table
        :data="messageDetails"
        :row-style="{ cursor: 'pointer' }"
        height="calc(100vh - 64px - 32px - 32px - 32px)"
        @row-click="(e) => showDriverDetails(e)"
      >
        <el-table-column :label="$t('MessageDetails.recipent')" align="center" prop="name"> </el-table-column>
        <el-table-column :label="$t('email_address')" align="center" prop="email"> </el-table-column>
        <el-table-column :label="$t('MessageDetails.status')" align="center" prop="status">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.status === 'SENT_OUT'" placement="top">
              <span slot="content">
                {{ $t('MessageDetails.success') }}
              </span>
              <i class="el-icon-success icon-success" />
            </el-tooltip>
            <el-tooltip v-if="scope.row.status === 'COMMISSIONED'" placement="top">
              <span slot="content">
                {{ $t('MessageDetails.commissioned') }}
              </span>
              <i class="el-icon-info icon-info" />
            </el-tooltip>
            <el-tooltip v-if="scope.row.status === 'ERROR'" placement="top">
              <span slot="content">
                {{ $t('MessageDetails.error') }}
              </span>
              <i class="el-icon-warning icon-warning" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :label="$t('MessageDetails.sent_date')" prop="sentOutDate">
          <template slot-scope="scope">
            <span>{{ scope.row.sentOutDate | formatDateLong }}</span>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </DataWrapper>
</template>

<script>
import { getMessageDetails } from '@/api/messagesApi';
import DataWrapper from '@/components/DataWrapper';

export default {
  components: {
    DataWrapper,
  },
  props: {
    messageId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      messageDetails: [],
    };
  },
  async created() {
    this.loading = true;
    await getMessageDetails(this.messageId).then((response) => {
      if (response.ok) {
        this.messageDetails = response.data.dispatches;
      }
    });
    this.loading = false;
  },
  methods: {
    showDriverDetails(driver) {
      this.$router.push({ name: 'DriverDetails', params: driver });
    },
  },
};
</script>

<style lang="scss" scoped></style>
