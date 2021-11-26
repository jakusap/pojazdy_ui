<template>
  <div class="">
    <component :is="summaryComponent" :details="data" />

    <TransferList
      :transfers="data.transfers"
      :b2b-with-vat="b2bWithVat"
      :settlement-u-u-i-d="settlementUUID"
      :is-b2b="isB2b"
      :variant="data.variant"
      :invoice="data.invoiceData"
      :partner-tax-id="data.partnerTaxId"
      :driver-company-tax-id="data.driverCompanyTaxId"
    />
  </div>
</template>

<script>
import AVariant from '@/components/SummaryModels/AVariant';
import BVariant from '@/components/SummaryModels/BVariant';
import CVariant from '@/components/SummaryModels/CVariant';
import DVariant from '@/components/SummaryModels/DVariant';
import TransferList from '@/components/TransferList';
export default {
  name: 'SettlementsTable',
  components: {
    AVariant,
    BVariant,
    CVariant,
    DVariant,
    TransferList,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    opacity: Boolean,
  },

  computed: {
    b2bWithVat() {
      return this.data.settlementSchema.contractType === 'B2B_VAT';
    },
    isB2b() {
      return this.data.settlementSchema.contractType !== 'CIVIL_CONTRACT';
    },
    settlementUUID() {
      return this.data.uuid;
    },
    summaryComponent() {
      switch (this.data.variant) {
        case 'B':
          return BVariant;
        case 'C':
          return CVariant;
        case 'D':
          return DVariant;
        default:
          return AVariant;
      }
    },
  },
};
</script>
<style lang="scss">
.el-table .success-row {
  background: var(--light-green-background);
  color: var(--black-color);
  font-weight: bold;
}
.el-table .middle-balance-row {
  background: var(--light-orange-background);
  color: var(--black-color);
  font-weight: bold;
}
</style>

<style lang="scss" scoped>
.section-settlements-table {
  &.opacity {
    opacity: 0.5;
  }
  .transfer-list {
    &__b2b {
      max-width: 768px;
    }
    &__table {
      margin-bottom: 16px;
    }
  }

  .bank-transfer {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
    border-radius: 8px;
    justify-content: space-between;
    .transfer-title {
      padding: 16px;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      border: 1px solid var(--brand-gray-border);
      flex: 1;
      border-right: none;
      background: var(--light-gray-background);
    }
    .transfer-value {
      border: 1px solid var(--brand-gray-border);
      padding: 16px;
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
      background: var(--light-gray-background);
    }
  }
}
.invoice-info {
  background: var(--smoke-white-background);
  border: 2px solid var(--light-blue-border);
  padding: 16px;
  border-radius: 8px;
}
@media screen and (min-width: 768px) {
  .section-settlements-table {
    .bank-transfer {
      max-width: 500px;
    }
  }
}
</style>
