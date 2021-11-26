<template>
  <div class="transactions">
    <DataWrapper>
      <template slot="table-header">
        <h1 v-if="$route.name === 'DriverToken'">
          <el-button
            class="driver-name"
            type="text"
            @click="$router.push({ name: 'DriverDetails', params: { driverUUID: driver.driverUUID } })"
          >
            {{ driver.lastName }} {{ driver.firstName }}
          </el-button>
        </h1>
      </template>

      <template slot="table-body">
        <section class="transactions-summary__info">
          <div class="info__period">
            {{ billingPeriod }}
          </div>
          <div class="info__period">
            {{ $t('Transactions.settlement_entry') + details.systemEntryDate }}
          </div>
        </section>

        <SummaryModel :details="details" :driver="driver" />

        <TransferList
          v-if="details.invoiceData"
          :partner-mode="partnerMode"
          :transfers="details.transfers"
          :settlement-u-u-i-d="details.uuid"
          :iban="driver.iban"
          :is-b2b="isB2b"
          :variant="details.variant"
          :invoice="invoiceData"
        />
      </template>
    </DataWrapper>
  </div>
</template>

<script>
import DataWrapper from '@/components/DataWrapper';
import SummaryModel from '@/components/SummaryModels/AVariant';
import TransferList from '@/components/TransferList';

export default {
  components: {
    DataWrapper,
    TransferList,
    SummaryModel,
  },
  props: {
    partnerMode: {
      type: Boolean,
    },
    details: {
      type: Object,
    },
    driver: {
      type: Object,
    },
  },
  computed: {
    isB2b() {
      return this.details.settlementSchema.contractType !== 'CIVIL_CONTRACT';
    },
    billingPeriod() {
      return (
        this.$t('Transactions.settlement_period') +
        this.details.settlementFrom +
        ' ' +
        this.$t('dash') +
        ' ' +
        this.details.settlementTo
      );
    },
    invoiceData() {
      return {
        transfer: this.details.payout,
        cashCollected: this.details.providerSettlementSummaries.reduce(
          (prev, curr) => prev + Math.abs(curr.cashCollected),
          0
        ),
      };
    },
  },
};
</script>

<style lang="scss">
.el-popover {
  font-weight: bold;
  padding-bottom: 0;
}
.cell {
  word-break: initial !important;
}
</style>
<style lang="scss" scoped>
.driver-name {
  min-width: 150px;
  display: flex;
  justify-content: center;
  font-weight: 700;
  border-radius: 8px;
  box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.15);
  padding: 8px;
  font-size: 16px;
  background: white;
  color: black;
  &:hover {
    background: $brand-yellow;
    color: $brand-gray;
  }
}
.driver-name {
  width: auto;
  margin: 0;
  margin-right: 8px;
}
.transactions {
  min-height: 500px;
}
.transactions__additional-costs {
  list-style-type: none;
  padding: 0;
  & li {
    margin: 0 -12px;
    padding: 8px;
    font-weight: bold;
    &:nth-of-type(2n) {
      background: #f4f4f5;
    }
  }
}
.date-span {
  position: absolute;
  margin-left: 75px;
  top: 23px;
}
.transactions-summary__info {
  & div {
    padding: 4px 0;
  }
}
</style>
