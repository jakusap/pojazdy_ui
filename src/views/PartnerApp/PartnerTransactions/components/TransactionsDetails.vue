<template>
  <div v-loading="dataLoading" class="transactions-wrapper">
    <DataWrapper class="transactions">
      <template slot="table-header">
        <h1>
          <div class="transactions__title">
            {{
              !settlementUUID ? $t('Transactions.not_settled_transactions') : $t('Transactions.settled_transactions')
            }}
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
        <el-date-picker
          v-model="filters.transactionDateFrom"
          :placeholder="$t('date_from')"
          type="date"
          class="filter-item"
        />
        <el-date-picker
          v-if="filters.transactionDateFrom"
          v-model="filters.transactionDateTo"
          :picker-options="dateToPickerOptions"
          :placeholder="$t('date_to')"
          type="date"
          class="filter-item"
        />
        <el-select v-model="filters.type" placeholder="Typ" class="filter-item">
          <el-option :value="null" :label="$t('all_select')"> </el-option>
          <el-option
            v-for="type in transactionTypes"
            :key="type"
            :label="$t(`types.${type.toUpperCase()}`)"
            :value="type"
          >
            <span>{{ $t(`types.${type.toUpperCase()}`) }}</span>
          </el-option>
        </el-select>
        <el-select v-model="filters.provider" placeholder="Podmiot" class="filter-item">
          <el-option :value="null" :label="$t('all_select')"> </el-option>
          <el-option
            v-for="provider in providerNames"
            :key="provider"
            :label="$t(`providers.${provider}`)"
            :value="provider"
          >
            <span>{{ $t(`providers.${provider}`) }}</span>
          </el-option>
        </el-select>
        <el-button
          v-if="filtersOn(filters)"
          class="filter-item"
          type="info"
          icon="el-icon-close"
          @click="resetFilters(filters)"
        >
          {{ $t('reset') }}
        </el-button>
      </template>
      <template slot="table-body">
        <el-table :data="transactions" height="calc(100vh - 64px - 32px - 32px - 16px - 64px - 32px)" stripe>
          <el-table-column align="center" min-width="50px">
            <template
              v-if="['OTHER', 'COST', 'INVOICE'].includes(scope.row.type) && !settlementUUID"
              slot-scope="scope"
            >
              <el-tooltip :content="$t('Transactions.remove')" placement="top">
                <el-button :circle="true" type="danger" size="mini" @click="removeTransaction(scope.row.uuid)">
                  <i class="el-icon-delete" />
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="$t('date')" prop="transactionDate" sortable align="center" min-width="100px">
          </el-table-column>
          <el-table-column :label="$t('type')" min-width="110px" align="center">
            <template slot-scope="scope">
              {{ scope.row.type === 'COST' ? scope.row.description : $t(`types.${scope.row.type.toUpperCase()}`) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('provider')" min-width="100px" align="center">
            <template slot-scope="scope">
              <ProviderBadge :provider="scope.row.provider" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('amount')" min-width="100px" sortable prop="grossAmount">
            <template slot-scope="scope">
              {{ $amount(scope.row.grossAmount) }}
            </template>
          </el-table-column>
        </el-table>
        <div v-if="!settlementUUID">
          <el-button v-if="isCivilContract" class="settlement-button" type="success" @click="addInvoice([driver])">
            {{ $t('DriverDetails.add_invoice') }}
          </el-button>
          <el-button class="settlement-button" type="primary" @click="addCostTransaction([driver])">
            {{ $t('DriverDetails.add_cost') }}
          </el-button>
        </div>
      </template>
    </DataWrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import DataWrapper from '@/components/DataWrapper';
import ProviderBadge from '@/components/ProviderBadge';
import transactionsEffectsMixin from '@/mixins/transactionsEffectsMixin';
import { filtersOn, filterTable, resetFilters } from '@/views/PartnerApp/PartnerSettlements/utils';

import transactionsMixin from '../mixins/transactionsMixin';
export default {
  components: {
    ProviderBadge,
    DataWrapper,
  },
  mixins: [transactionsMixin, transactionsEffectsMixin],
  props: {
    driver: {
      type: Object,
    },
    settlementUUID: {
      type: String,
    },
  },
  data() {
    return {
      radio: 'transactionsDetails',
      filters: {
        transactionDateFrom: null,
        transactionDateTo: null,
        provider: null,
        type: null,
      },
      dateToPickerOptions: {
        disabledDate: this.disabledFrom,
      },
    };
  },
  computed: {
    ...mapGetters(['settlementsSchemas', 'selectedSettlementPeriodCode', 'dataLoading']),
    ...mapGetters('transactionsViewStore', ['transactionsDetails', 'transactionTypes', 'providerNames']),
    transactions() {
      return filterTable(this.transactionsDetails, this.filters);
    },
    isCivilContract() {
      const schema = this.settlementsSchemas.find(
        (schema) => schema.schemaNumber === this.driver.settlementSchema.schemaNumber
      );

      return schema ? schema.contractType === 'CIVIL_CONTRACT' : false;
    },
  },

  created() {
    this.loadConfig({ settlementUUID: this.settlementUUID, driverUUID: this.driver.driverUUID });
    this.loadTransactionsDetails();
  },

  methods: {
    ...mapActions('transactionsViewStore', ['loadConfig', 'loadTransactionsDetails', 'removeTransaction']),
    resetFilters: resetFilters,
    filtersOn: filtersOn,
    disabledFrom(date) {
      return date < new Date(this.filters.transactionDateFrom);
    },
    deleteTransaction(transactionUuid) {
      this.removeTransaction(transactionUuid).then((response) => {
        if (response.ok) {
          this.$message({
            center: true,
            type: 'success',
            message: this.$t('Transactions.transaction_removed_success'),
          });
        } else {
          this.$message({
            center: true,
            type: 'error',
            message: this.$t('Transactions.transaction_removed_failed'),
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/_transactions.scss';
</style>
