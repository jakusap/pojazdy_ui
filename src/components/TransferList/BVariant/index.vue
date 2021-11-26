<template>
  <div v-if="transferDetails.invoice">
    <div v-if="transfer" class="invoice-info">
      <p v-if="transferDetails.b2bWithVat">
        {{ $t('transfers.bvariant_vat_transfer', { transfer: $amount(transfer) }) }}
      </p>
      <p v-else>
        {{ $t('transfers.bvariant_no_vat_transfer', { transfer: $amount(transfer) }) }}
      </p>
      <div>
        <el-button
          class="invoice-generate-button"
          :disabled="!generateInvoiceIsPosibble"
          type="primary"
          @click="generateInvoice('TRANSFER')"
          >{{ $t('transfers.generate_invoice') }}
        </el-button>
        <el-tooltip v-if="!generateInvoiceIsPosibble" :content="tooltipContent" placement="top">
          <i class="el-icon-warning icon-warning" />
        </el-tooltip>
      </div>
    </div>

    <div v-if="cashCollected" class="invoice-info">
      <p v-if="transferDetails.b2bWithVat">
        {{ $t('transfers.bvariant_vat_cash_collected', { cashCollected: $amount(cashCollected) }) }}
      </p>
      <p v-else>
        {{ $t('transfers.bvariant_no_vat_cash_collected', { cashCollected: $amount(cashCollected) }) }}
      </p>
      <div>
        <el-button
          class="invoice-generate-button"
          :disabled="!generateInvoiceIsPosibble"
          type="primary"
          @click="generateInvoice('CASH')"
          >{{ $t('transfers.generate_invoice') }}
        </el-button>
        <el-tooltip v-if="!generateInvoiceIsPosibble" :content="tooltipContent" placement="top">
          <i class="el-icon-warning icon-warning" />
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import GenerateSettlementInvoice from '@/effects/GenerateSettlementInvoice';

export default {
  name: 'BVariant',
  props: {
    transferDetails: {
      type: Object,
    },
  },
  data() {
    return {
      invoiceDetails: null,
    };
  },
  computed: {
    transfer() {
      return this.transferDetails.invoice[0].transfer;
    },
    cashCollected() {
      return this.transferDetails.invoice[0].cashCollected;
    },
    generateInvoiceIsPosibble() {
      return this.transferDetails.partnerTaxId;
    },
    tooltipContent() {
      if (!this.transferDetails.partnerMode && !this.getLoggedDriverInfo()) {
        return this.$t('transfers.driver_not_logged_in');
      }
      if (this.transferDetails.partnerMode && !this.transferDetails.partnerTaxId) {
        return this.$t('transfers.partner_without_tax_id_for_partner_view');
      }
      if (!this.transferDetails.partnerMode && !this.transferDetails.partnerTaxId) {
        return this.$t('transfers.partner_without_tax_id_for_driver_view');
      }
      if (!this.transferDetails.partnerMode && !this.transferDetails.driverCompanyTaxId) {
        return this.$t('transfers.driver_without_company_tax_id');
      }
      return null;
    },
  },
  methods: {
    ...mapGetters('driverAccount', ['getLoggedDriverInfo']),
    generateInvoice(invoiceType) {
      this.$modalOn(GenerateSettlementInvoice, {
        invoiceData: {
          settlementUuid: this.transferDetails.settlementUUID,
          type: invoiceType,
          driverCompanyTaxId: this.transferDetails.driverCompanyTaxId,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.transfer-list__table {
  margin-bottom: 16px;
}
.invoice-info {
  background: var(--smoke-white-background);
  border: 2px solid var(--light-blue-border);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}
.invoice-generate-button {
  margin-right: 10px;
}
</style>
