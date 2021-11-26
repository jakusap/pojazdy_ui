<template>
  <div v-loading="dataLoading" class="driver-settlements">
    <el-select v-model="settlementsType" class="driver-settlements__select">
      <el-option :label="$t('pending_settlements')" :value="'PENDING'"></el-option>
      <el-option :label="$t('settled_settlements')" :value="'SETTLED'"></el-option>
      <el-option :label="$t('paid_settlements')" :value="'PAID'"></el-option>
    </el-select>
    <el-select v-if="settlementsType === 'PENDING'" v-model="selectedPeriodCode" class="driver-settlements__select">
      <el-option
        v-for="settlementPeriod in settlementPeriods"
        :key="settlementPeriod.code"
        :label="$t('settlement_period_to') + settlementPeriod.dateTo"
        :value="settlementPeriod.code"
      >
      </el-option>
    </el-select>
    <el-table
      v-if="settlementsType === 'PENDING'"
      :empty-text="$t('PendingSettlements.pending_settlements_placeholder')"
      :data="currentSettlements"
      header-cell-class-name="table-header"
      @sort-change="handleSortChange"
    >
      <PendingActions @loadSettlements="fetchPendingSettlements()" @sent="getDriverMessagesInfo()" />
      <EmailStatus />
      <DriverLink />
      <ContractType />
      <PayoutAmount />
      <LastSettlementInfo />
    </el-table>

    <el-table
      v-if="settlementsType === 'SETTLED'"
      :empty-text="$t('done_settlement_placeholder')"
      :data="currentSettlements"
      header-cell-class-name="table-header"
      @sort-change="handleSortChange"
    >
      <SettledActions :expanded-qr-codes="expandedQrCodes" @loadSettlements="fetchSettledSettlements()" />
      <RowDetails />
      <IbanStatus />
      <DriverLink />
      <PayoutAmount />
      <SystemEntryDateInfo />
      <SettlementPeriod />
      <ContractType />
    </el-table>

    <el-table
      v-if="settlementsType === 'PAID'"
      :empty-text="$t('paid_settlement_placeholder')"
      :data="currentSettlements"
      header-cell-class-name="table-header"
      @sort-change="handleSortChange"
    >
      <PaidActions @loadSettlements="fetchPaidSettlements()" />
      <IbanStatus />
      <DriverLink />
      <ContractType />
      <PayoutAmount />
      <PaidDateInfo />
      <ContractType />
    </el-table>

    <div class="driver-settlements__buttons">
      <el-button-group>
        <el-button class="driver-settlements__action" type="success" @click="addInvoice([driver])">
          {{ $t('DriverDetails.add_invoice') }}
        </el-button>
        <el-button class="driver-settlements__action" type="info" @click="addCostTransaction([driver])">
          {{ $t('DriverDetails.add_cost') }}
        </el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import transactionsEffectsMixin from '@/mixins/transactionsEffectsMixin';
import ContractType from '@/views/PartnerApp/PartnerSettlements/components/ContractType';
import DriverLink from '@/views/PartnerApp/PartnerSettlements/components/DriverLink';
import IbanStatus from '@/views/PartnerApp/PartnerSettlements/components/IbanStatus';
import PayoutAmount from '@/views/PartnerApp/PartnerSettlements/components/PayoutAmount';
import PaidDateInfo from '@/views/PartnerApp/PartnerSettlements/PaidSettlements/PaidDateInfo';
import PaidActions from '@/views/PartnerApp/PartnerSettlements/PaidSettlements/RowActions';
import EmailStatus from '@/views/PartnerApp/PartnerSettlements/PendingSettlements/EmailStatus';
import LastSettlementInfo from '@/views/PartnerApp/PartnerSettlements/PendingSettlements/LastSettlementInfo';
import PendingActions from '@/views/PartnerApp/PartnerSettlements/PendingSettlements/RowActions';
import SettledActions from '@/views/PartnerApp/PartnerSettlements/SettledSettlements/RowActions';
import RowDetails from '@/views/PartnerApp/PartnerSettlements/SettledSettlements/RowDetails';
import SettlementPeriod from '@/views/PartnerApp/PartnerSettlements/SettledSettlements/SettlementPeriod';
import SystemEntryDateInfo from '@/views/PartnerApp/PartnerSettlements/SettledSettlements/SystemEntryDateInfo';
import settlementsViewStore from '@/views/PartnerApp/PartnerSettlements/settlementsViewStore';

export default {
  components: {
    ContractType,
    DriverLink,
    IbanStatus,
    PayoutAmount,
    PaidDateInfo,
    PaidActions,
    EmailStatus,
    LastSettlementInfo,
    PendingActions,
    SettledActions,
    RowDetails,
    SettlementPeriod,
    SystemEntryDateInfo,
  },
  mixins: [transactionsEffectsMixin],
  data() {
    return {
      selectedPeriodCode: null,
      settlementsType: 'PENDING',
      expandedQrCodes: { items: [] },
      sort: { prop: 'systemEntryDate', order: 'ascending' },
    };
  },
  computed: {
    ...mapGetters(['settlementPeriods', 'selectedSettlementPeriodCode', 'dataLoading']),
    ...mapGetters('settlementsViewStore', ['reloadSettlements']),
    ...mapGetters('driverDetailsStore', ['settlements', 'driver']),

    currentSettlements() {
      switch (this.settlementsType) {
        case 'PENDING':
          return this.sortSettlements(this.settlements.pending);
        case 'SETTLED':
          return this.sortSettlements(this.settlements.settled);
        case 'PAID':
          return this.sortSettlements(this.settlements.paid);
        default:
          return this.sortSettlements(this.settlements.pending);
      }
    },
  },
  watch: {
    async reloadSettlements(reload) {
      if (reload === true) {
        await this.fetchPendingSettlements();
        this.reloadedSettlements();
      }
    },
    selectedSettlementPeriodCode: {
      handler(value) {
        this.selectedPeriodCode = value;
      },
      immediate: true,
    },
    selectedPeriodCode(value) {
      this.selectPeriod(value);
      this.fetchPendingSettlements();
    },
    settlementsType(value) {
      switch (value) {
        case 'PENDING':
          this.fetchPendingSettlements();
          break;
        case 'SETTLED':
          this.fetchSettledSettlements();
          break;
        case 'PAID':
          this.fetchPaidSettlements();
          break;
      }
    },
  },
  beforeCreate() {
    this.$store.registerModule('settlementsViewStore', settlementsViewStore);
  },
  beforeDestroy() {
    this.$store.unregisterModule('settlementsViewStore');
  },
  methods: {
    ...mapActions('settlementsViewStore', ['reloadedSettlements']),
    ...mapActions('driverDetailsStore', [
      'getDriverMessagesInfo',
      'fetchPendingSettlements',
      'fetchSettledSettlements',
      'fetchPaidSettlements',
    ]),
    ...mapActions('periods', ['selectPeriod']),
    handleSortChange(e) {
      e.order ? (this.sort = { prop: e.prop, order: e.order }) : (this.sort = null);
    },
    sortSettlements(settlements) {
      if (this.sort) {
        const prop = this.sort.prop.split('.');
        const order = this.sort.order === 'ascending' ? 'ASC' : 'DESC';
        return [...settlements].sort((a, b) => {
          let compareValue;
          if (prop[0] == 'payout') {
            compareValue = a[prop[0]] - b[prop[0]];
          } else {
            compareValue = prop[1]
              ? String(a[prop[0]][prop[1]]).localeCompare(String(b[prop[0]][prop[1]]))
              : String(a[prop[0]]).localeCompare(String(b[prop[0]]));
          }
          if (order === 'ASC') {
            return compareValue >= 0 ? -1 : 1;
          } else {
            return compareValue >= 0 ? 1 : -1;
          }
        });
      }
      return settlements;
    },
  },
};
</script>

<style lang="scss" scoped>
.driver-settlements {
  padding: 0 16px;
  &__select {
    width: 100%;
  }
  &__buttons {
    margin: 16px 0;
    display: flex;
    justify-content: center;
  }
  &__action {
    width: 100%;
    margin-left: 0 !important;
    margin-bottom: 8px;
  }
}

@media screen and (min-width: 576px) {
  .driver-settlements {
    &__select {
      width: auto;
    }
    &__action {
      width: 200px;
    }
    &__buttons {
      justify-content: initial;
    }
  }
}
</style>
