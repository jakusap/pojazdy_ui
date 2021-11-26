<template>
  <div v-if="details.variant" class="transactions">
    <DataWrapper>
      <template slot="table-header">
        <h1>
          <div class="transactions__title">
            {{ settlementUUID ? $t('Transactions.settled_transactions') : $t('Transactions.not_settled_transactions') }}
          </div>
          <el-button
            class="driver-name"
            type="text"
            @click="$router.push({ name: 'DriverDetails', params: { driverUUID: driver.driverUUID } })"
          >
            {{ driver.lastName }} {{ driver.firstName }}
          </el-button>
          <div class="change-mode">
            <el-select v-model="radio">
              <el-option value="transactionsSummary" :label="$t('Transactions.transactions_summary')" />
              <el-option value="transactionsDetails" :label="$t('Transactions.transactions_details')" />
            </el-select>
          </div>
        </h1>
      </template>

      <template slot="table-body">
        <section class="transactions-summary__info">
          <div class="info__schema">
            {{ $t('settlement_schema') }} <SchemaTooltip :schema="driverSchema" placement="right" />
          </div>
          <div v-if="settlementUUID" class="info__period">
            {{ billingPeriod }}
          </div>

          <div v-else class="info__period">
            <span>
              {{ $t('Transactions.settlement_period') }}
            </span>

            <div>
              <el-input :value="$t('settlement_period_from') + details.settlementFrom" disabled />
              <el-select v-model="selectedPeriod">
                <el-option
                  v-for="settlementPeriod in filteredPeriods"
                  :key="settlementPeriod.period"
                  :label="$t('settlement_period_to') + settlementPeriod.dateTo"
                  :value="settlementPeriod.code"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div v-if="settlementUUID" class="info__period">
            {{ $t('Transactions.settlement_entry') + details.systemEntryDate }}
          </div>
        </section>

        <SummaryModel :details="details" />

        <div>
          <TransferList
            v-if="settlementUUID"
            :partner-mode="true"
            :transfers="details.transfers"
            :settlement-u-u-i-d="settlementUUID"
            :iban="driver.iban"
            :b2b-with-vat="b2bWithVat"
            :is-b2b="isB2b"
            :variant="variant"
            :invoice="invoice"
            :driver-company-tax-id="driver.companyTaxId"
            :partner-tax-id="profileInfo.taxId"
          />
          <el-button
            v-if="settlementUUID"
            :disabled="!driver.email"
            type="info"
            class="settlement-button"
            @click="resendBilling(settlementUUID)"
            >{{ $t('resend_billing') }}
          </el-button>
          <el-button
            v-else-if="!settlementUUID && driver"
            :disabled="!driver.email"
            type="info"
            class="settlement-button"
            @click="sendBilling(driver.driverUUID)"
            >{{ $t('send_billing') }}
          </el-button>
          <el-button
            v-if="details.isLastSettlement && !details.paidDate"
            class="settlement-button"
            type="primary"
            @click="revokeSettlement()"
            >{{ $t('revoke_settlement') }}
          </el-button>
          <el-button
            v-if="driver && !settlementUUID"
            class="settlement-button"
            type="primary"
            @click="createSettlement()"
            >{{ $t('make_settlement') }}
          </el-button>
        </div>
      </template>
    </DataWrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { resendSettlementBilling, sendSettlementBilling } from '@/api/notificationsApi.js';
import {
  calculateSettlements,
  deleteDoneSettlement,
  getPendingSettlements,
  getSettlementDetails,
  getSettlementInvoice,
} from '@/api/settlementsApi.js';
import DataWrapper from '@/components/DataWrapper';
import SchemaTooltip from '@/components/SchemaTooltip';
import SummaryModel from '@/components/SummaryModels/DVariant';
import TransferList from '@/components/TransferList';

import transactionsMixin from '../mixins/transactionsMixin';
export default {
  components: {
    DataWrapper,
    SchemaTooltip,
    SummaryModel,
    TransferList,
  },
  mixins: [transactionsMixin],
  props: {
    settlementUUID: {
      type: String,
    },
    driver: {
      type: Object,
    },
    details: {
      type: Object,
    },
  },
  data() {
    return {
      selectedSchema: 1,
      selectedPeriod: null,
      radio: 'transactionsSummary',
      invoice: null,
    };
  },

  computed: {
    ...mapGetters(['selectedSettlementPeriodCode', 'dataLoading', 'settlementPeriods']),
    ...mapGetters('partnerProfile', ['profileInfo']),
    variant() {
      return this.details.variant;
    },
    driverSchema() {
      return this.details.settlementSchema;
    },
    filteredPeriods() {
      const lastIndex = this.settlementPeriods.findIndex((period) => period.dateFrom < this.details.settlementFrom);
      return this.settlementPeriods.slice(0, lastIndex);
    },
    b2bWithVat() {
      return this.details.settlementSchema.contractType === 'B2B_VAT';
    },
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
  },

  watch: {
    selectedSettlementPeriodCode: {
      handler(value) {
        (value !== this.selectPeriod || value) && (this.selectedPeriod = value);
      },
      immediate: true,
    },
    selectedPeriod(value) {
      this.selectPeriod(value);
      this.$emit('get-details');
    },
  },

  created() {
    if (this.settlementUUID && this.isB2b) {
      getSettlementInvoice(this.settlementUUID).then((response) => {
        if (response.ok) {
          this.invoice = response.data;
        }
      });
    }
  },

  methods: {
    ...mapActions('periods', ['selectPeriod']),
    createSettlement() {
      calculateSettlements([this.driver.driverUUID], this.selectedSettlementPeriodCode)
        .then((response) => {
          if (response.ok) {
            this.settlementSuccess();
          } else {
            const error = response;
            if (error.response.status === 402) {
              this.$message({
                center: true,
                type: 'error',
                message: this.$t('settlements_used_limit'),
              });
            } else {
              this.settlementFailed();
            }
          }
        })
        .finally(() => this.$store.dispatch('app/toggleDataLoading', false));
    },

    revokeSettlement() {
      deleteDoneSettlement([this.settlementUUID]).then((response) => {
        response.ok ? this.revokeSuccess() : this.revokeFailed();
      });
    },
    sendBilling(driverUUID) {
      sendSettlementBilling([driverUUID], this.selectedSettlementPeriodCode).then((response) => {
        response.ok ? this.billingSuccess() : this.billingFailed();
      });
    },
    resendBilling(settlementUUID) {
      resendSettlementBilling(settlementUUID).then((response) => {
        response.ok ? this.billingSuccess() : this.billingFailed();
      });
    },
  },
};
</script>

<style lang="scss">
.cell {
  word-break: initial !important;
}

.el-table .success-row {
  background: #c1faa3;
  color: black;
  font-weight: bold;
}
</style>
<style lang="scss" scoped>
@import '../styles/_transactions.scss';
.transactions-summary__info {
  & div {
    padding: 4px 0;
  }
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
.info__period {
  margin-top: 8px;
  display: flex;
  align-items: center;
  flex-flow: wrap;
  & > span {
    margin-right: 8px;
  }
  & .el-input,
  & .el-select {
    width: 100%;
  }
}
.date-span {
  position: absolute;
  margin-left: 75px;
  top: 23px;
}
@media screen and (min-width: 576px) {
  .info__period {
    & .el-input,
    & .el-select {
      width: auto;
    }
  }
}
</style>
