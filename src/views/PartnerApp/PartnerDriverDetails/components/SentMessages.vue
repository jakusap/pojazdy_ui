<template>
  <DataWrapper v-loading="messagesFetching">
    <template slot="table-header">
      <h1>
        {{ $t('SentMessages.title') }}
      </h1>
    </template>
    <template slot="table-body">
      <el-table :empty-text="$t('SentMessages.no_messages')" :data="messages" :height="180">
        <el-table-column :label="$t('SentMessages.sent_out_date')" min-width="150px" align="center">
          <template slot-scope="scope">
            {{ scope.row.commissionedDate | formatDateLong }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('SentMessages.email')" prop="email" align="center"></el-table-column>
        <el-table-column :label="$t('SentMessages.payout')" align="center">
          <template slot-scope="scope">
            {{ $amount(scope.row.payout || 0) }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('SentMessages.status')" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 'ERROR'">
              <el-tooltip placement="top">
                <span slot="content">
                  {{ $t('SentMessages.error') }}
                </span>
                <i class="el-icon-warning icon-warning" />
              </el-tooltip>
            </span>
            <span v-else-if="scope.row.status === 'COMMISSIONED'">
              <el-tooltip placement="top">
                <span slot="content">
                  {{ $t('SentMessages.commissioned') }}
                </span>
                <i class="el-icon-info icon-info" />
              </el-tooltip>
            </span>
            <span v-else>
              <el-tooltip placement="top">
                <span slot="content">
                  {{ $t('SentMessages.success') }}
                </span>
                <i class="el-icon-success icon-success" />
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="goToDriverSummary(scope.row.token)">
              {{ $t('SentMessages.details') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </DataWrapper>
</template>

<script>
import { mapGetters } from 'vuex';

import DataWrapper from '@/components/DataWrapper';
export default {
  components: {
    DataWrapper,
  },
  computed: {
    ...mapGetters('driverDetailsStore', ['driver', 'messages', 'messagesFetching']),
  },
  methods: {
    goToDriverSummary(token) {
      this.$router.push({ path: `/drivers/sent-summary/${token}/${this.driver.driverUUID}` });
    },
  },
};
</script>

<style lang="scss" scoped></style>
