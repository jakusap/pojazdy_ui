<template>
  <div class="transfer-list__b2b">
    <h3 v-if="invoice">{{ $t('transfers.b2b_title') }}</h3>
    <component :is="detailsComponent" :transfer-details="transferDetails" />
    <div v-if="showTransfers" class="transfer-list">
      <h3>
        {{ $t('transfers.title') }}
        <el-tooltip v-if="showIbanStatus" :content="$t('transfers.driver_without_iban')" placement="top">
          <i class="el-icon-warning icon-warning" />
        </el-tooltip>
      </h3>
      <BankTransfer
        v-for="(transfer, id) in transfers"
        :key="id"
        :transfer-data="transfer"
        :show-qr="partnerMode"
        :settlement-u-u-i-d="settlementUUID"
        :iban="iban"
      />
    </div>
  </div>
</template>

<script>
import BankTransfer from '@/components/BankTransfer';

import AVariant from './AVariant';
import BVariant from './BVariant';

export default {
  components: {
    BankTransfer,
    AVariant,
    BVariant,
  },
  props: {
    transfers: {
      type: Array,
    },
    settlementUUID: {
      type: String,
    },
    iban: {
      type: String,
    },
    isB2b: {
      type: Boolean,
      default: false,
    },
    partnerMode: {
      type: Boolean,
      default: false,
    },
    b2bWithVat: {
      type: Boolean,
    },
    variant: {
      type: String,
    },
    invoice: {
      type: Object,
    },
    driverCompanyTaxId: {
      type: String,
    },
    partnerTaxId: {
      type: String,
    },
  },
  computed: {
    showIbanStatus() {
      const { iban, partnerMode } = this.transferDetails;
      return partnerMode && !iban;
    },
    transferDetails() {
      return {
        partnerMode: this.partnerMode,
        settlementUUID: this.settlementUUID,
        iban: this.iban,
        b2bWithVat: this.b2bWithVat,
        invoice: this.invoice && [
          {
            transfer: this.invoice.transfer,
            cashCollected: this.invoice.cashCollected,
          },
        ],
        driverCompanyTaxId: this.driverCompanyTaxId,
        partnerTaxId: this.partnerTaxId,
      };
    },
    detailsComponent() {
      switch (this.variant) {
        case 'B':
          return BVariant;
        default:
          return AVariant;
      }
    },
    showTransfers() {
      if (!this.transfers) return false;
      if (!this.partnerMode && this.variant === 'B') return false;
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.transfer-list {
  &__b2b {
    max-width: 768px;
  }
}
</style>
