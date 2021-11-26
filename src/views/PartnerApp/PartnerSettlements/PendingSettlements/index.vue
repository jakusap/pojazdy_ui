<template>
  <DataWrapper v-loading="dataLoading" class="settlements">
    <template slot="table-header">
      <TableTitle @loadSettlements="loadSettlements()" />
      <TableSettings />
    </template>
    <template slot="table-body">
      <el-table
        ref="table"
        :empty-text="$t('PendingSettlements.pending_settlements_placeholder')"
        :data="paginatedData"
        :height="height ? height : 'calc(100vh - 64px - 32px - 32px - 32px - 64px - 12px)'"
        header-cell-class-name="table-header"
        @select-all="handleSelectAll"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
      >
        <SelectionColumn />
        <RowActions @loadSettlements="loadSettlements()" />
        <EmailStatus />
        <DriverLink />
        <ContractType />
        <PayoutAmount />
        <LastSettlementInfo />
      </el-table>
      <TableActions @loadSettlements="loadSettlements()">
        <template slot="pagination">
          <Pagination
            :pagination="pagination"
            :length="settlements.length"
            class="pagination"
            @change-page="(e) => (pagination.currentPage = e.page)"
            @change-pagination-limit="(e) => (pagination.limit = e)"
          />
        </template>
      </TableActions>
    </template>
  </DataWrapper>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { getPendingSettlements } from '@/api/settlementsApi';

import ContractType from '../components/ContractType';
import DriverLink from '../components/DriverLink';
import PayoutAmount from '../components/PayoutAmount';
import SelectionColumn from '../components/SelectionColumn';
import settlementsViewsMixin from '../mixins/settlementsViewsMixin';
import EmailStatus from './EmailStatus';
import LastSettlementInfo from './LastSettlementInfo';
import RowActions from './RowActions';
import TableActions from './TableActions';
import TableSettings from './TableSettings';
import TableTitle from './TableTitle';

export default {
  name: 'PendingSettlements',
  components: {
    TableTitle,
    TableSettings,
    SelectionColumn,
    RowActions,
    EmailStatus,
    DriverLink,
    ContractType,
    PayoutAmount,
    LastSettlementInfo,
    TableActions,
  },
  mixins: [settlementsViewsMixin],
  props: {
    height: {
      type: Number,
    },
  },

  data() {
    return {
      selectedPeriodCode: null,
      pendingSettlements: null,
    };
  },

  computed: {
    ...mapGetters(['selectedSettlementPeriodCode']),
    settlements() {
      if (this.pendingSettlements) {
        const pendingSettlements = this.filterTable(this.pendingSettlements, this.filters);
        this.loadSettlements(pendingSettlements);
        return pendingSettlements;
      }
      return [];
    },
  },
  async created() {
    await this.fetchSettlements();
  },

  methods: {
    ...mapActions('periods', ['loadPeriods']),

    async fetchSettlements() {
      const driverUUID = this.driver?.driverUUID;
      this.toggleDataLoading(true);
      if (this.selectedSettlementPeriodCode) {
        this.loadPeriods();

        await getPendingSettlements(driverUUID, this.selectedSettlementPeriodCode, null)
          .then((response) => {
            this.pendingSettlements = response.data;
          })
          .finally(() => {
            this.toggleDataLoading(false);
          });
      }
    },
  },
};
</script>
