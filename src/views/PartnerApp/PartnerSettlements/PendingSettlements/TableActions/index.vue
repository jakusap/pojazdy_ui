<template>
  <div class="table__actions">
    <div class="buttons">
      <el-button-group>
        <el-button
          :disabled="!(selectedSettlements && selectedSettlements.length)"
          class="settlements__action"
          type="success"
          @click="addCostTransaction(selectedSettlements.map((settlement) => settlement.driver))"
        >
          {{ $t('DriverDetails.add_cost') }}
        </el-button>
        <el-button
          :disabled="!(selectedSettlements && selectedSettlements.length)"
          class="settlements__action"
          type="success"
          @click="addInvoice(selectedSettlements.map((settlement) => settlement.driver))"
        >
          {{ $t('DriverDetails.add_invoice') }}
        </el-button>
        <el-button
          :disabled="selectedSettlements.filter((settlement) => settlement.driver.email).length === 0"
          class="settlements__action"
          type="info"
          @click="sendBilling(selectedSettlements)"
        >
          {{ $t('PendingSettlements.send_selected') }}
        </el-button>
        <el-button
          :disabled="!(settlements && settlements.length)"
          class="settlements__action"
          type="info"
          @click="confirmSendAll()"
        >
          {{ $t('PendingSettlements.send_all') }}
        </el-button>
        <el-button
          :disabled="!(selectedSettlements && selectedSettlements.length)"
          class="settlements__action"
          type="primary"
          @click="createSettlements(selectedSettlements)"
        >
          {{ $t('PendingSettlements.settle_selected') }}
        </el-button>
        <el-button
          :disabled="!(settlements && settlements.length)"
          class="settlements__action"
          type="success"
          @click="confirmSettleAll()"
        >
          {{ $t('PendingSettlements.settle_all') }}
        </el-button>
      </el-button-group>
      <slot name="pagination"></slot>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import AddCost from '@/effects/AddCost';
import AddInvoice from '@/effects/AddInvoice';

import actionsMixin from '../actionsMixin';

export default {
  mixins: [actionsMixin],

  computed: {
    ...mapGetters(['settlementPeriods', 'selectedSettlementPeriodCode']),
    ...mapGetters('settlementsViewStore', ['settlements', 'selectedSettlements']),
  },
  methods: {
    addCostTransaction(drivers) {
      this.$modalOn(AddCost, { drivers: drivers });
    },
    addInvoice(drivers) {
      this.$modalOn(AddInvoice, { drivers: drivers });
    },
  },
};
</script>

<style lang="scss" scoped></style>
