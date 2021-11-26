<template>
  <el-table-column :label="$t('table_actions')" :min-width="mobile ? '35px' : '100px'" align="center">
    <template slot-scope="scope">
      <el-popover v-if="mobile" placement="right" trigger="click">
        <el-button-group>
          <button
            :disabled="!scope.row.driver.email"
            class="el-button el-button--info el-button--mini"
            @click="sendBilling([scope.row])"
          >
            {{ $t('sent_billing') }}
          </button>
          <button
            :disabled="scope.row.payout < 0"
            class="el-button el-button--success el-button--mini"
            @click="createSettlements(scope.row)"
          >
            {{ $t('PendingSettlements.settle_pending') }}
          </button>
          <button class="el-button el-button--primary el-button--mini" @click="toggleSettlementsDetails(scope.row)">
            {{ $t('details') }}
          </button>
        </el-button-group>
        <button slot="reference" class="more-actions" size="mini">
          <i class="el-icon-more" />
        </button>
      </el-popover>
      <el-button-group v-else>
        <button
          :disabled="!scope.row.driver.email"
          :class="{ 'is-disabled': !scope.row.driver.email }"
          class="el-button el-button--info el-button--mini"
          @click="sendBilling([scope.row], selectedSettlementPeriodCode), $emit('sent')"
        >
          {{ $t('sent_billing') }}
        </button>
        <button
          class="el-button el-button--success el-button--mini"
          @click="createSettlements(scope.row, selectedSettlementPeriodCode)"
        >
          {{ $t('PendingSettlements.settle_pending') }}
        </button>
        <button class="el-button el-button--primary el-button--mini" @click="toggleSettlementsDetails(scope.row)">
          {{ $t('details') }}
        </button>
      </el-button-group>
    </template>
  </el-table-column>
</template>

<script>
import { mapGetters } from 'vuex';

import actionsMixin from '../actionsMixin';

export default {
  mixins: [actionsMixin],

  computed: {
    ...mapGetters(['selectedSettlementPeriodCode']),
    ...mapGetters('settlementsViewStore', ['settlements', 'selectedSettlements']),
  },
};
</script>

<style lang="scss" scoped></style>
