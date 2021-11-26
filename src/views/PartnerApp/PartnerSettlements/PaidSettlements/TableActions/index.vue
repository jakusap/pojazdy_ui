<template>
  <div class="table__actions">
    <div class="buttons">
      <el-button-group>
        <el-button
          :disabled="!(selectedSettlements && selectedSettlements.length)"
          class="settlements__action"
          type="primary"
          @click="changePaidStatus(selectedSettlements, false)"
          >{{ $t('unmark_as_paid') }}
        </el-button>
        <el-button
          :disabled="disableTransferGeneration"
          class="settlements__action"
          type="info"
          @click="generateBulkTransfers(selectedSettlements, profileInfo.iban)"
          >{{ $t('to_bulk_transfer') }}
        </el-button>
      </el-button-group>
      <slot name="pagination"></slot>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import actionsMixin from '../actionsMixin';

export default {
  mixins: [actionsMixin],

  computed: {
    ...mapGetters('partnerProfile', ['settlementsLimits', 'profileInfo']),
    ...mapGetters('settlementsViewStore', ['settlements', 'selectedSettlements', 'driver']),
    settlementsWithIban() {
      return this.selectedSettlements.filter((settlement) => settlement.driver.iban && settlement.payout > 0);
    },
    disableTransferGeneration() {
      return !this.settlementsWithIban?.length;
    },
  },
};
</script>

<style lang="scss" scoped></style>
