<template>
  <DataWrapper v-loading="dataLoading" class="settlements">
    <template slot="table-header">
      <TableTitle />
      <TableSettings />
    </template>
    <template slot="table-body">
      <el-table
        :empty-text="$t('done_settlement_placeholder')"
        :data="paginatedData"
        :row-key="'uuid'"
        :expand-row-keys="expandedQrCodes.items"
        :height="height ? height : 'calc(100vh - 64px - 32px - 32px - 32px - 64px - 12px)'"
        @select-all="handleSelectAll"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
      >
        <SelectionColumn />
        <RowDetails />
        <RowActions :expanded-qr-codes="expandedQrCodes" />
        <IbanStatus />
        <DriverLink />
        <PayoutAmount />
        <SystemEntryDateInfo />
        <SettlementPeriod />
        <ContractType />
      </el-table>
      <TableActions>
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
import { getSettledSettlements } from '@/api/settlementsApi';

import ContractType from '../components/ContractType';
import DriverLink from '../components/DriverLink';
import IbanStatus from '../components/IbanStatus';
import PayoutAmount from '../components/PayoutAmount';
import SelectionColumn from '../components/SelectionColumn';
import settlementsViewsMixin from '../mixins/settlementsViewsMixin';
import RowActions from './RowActions';
import RowDetails from './RowDetails';
import SettlementPeriod from './SettlementPeriod';
import SystemEntryDateInfo from './SystemEntryDateInfo';
import TableActions from './TableActions';
import TableSettings from './TableSettings';
import TableTitle from './TableTitle';

export default {
  name: 'SettledSettlements',
  components: {
    TableTitle,
    TableSettings,
    TableActions,
    SelectionColumn,
    ContractType,
    DriverLink,
    PayoutAmount,
    RowDetails,
    IbanStatus,
    RowActions,
    SystemEntryDateInfo,
    SettlementPeriod,
  },
  mixins: [settlementsViewsMixin],
  props: {
    height: {
      type: Number,
    },
  },
  data() {
    return {
      settledSettlements: null,
      expandedQrCodes: { items: [] },
    };
  },
  computed: {
    settlements() {
      if (this.settledSettlements) {
        const settledSettlements = this.filterTable(this.settledSettlements, this.filters);
        this.loadSettlements(settledSettlements);
        return settledSettlements;
      }
      return [];
    },
  },
  async created() {
    await this.fetchSettlements();
  },
  methods: {
    async fetchSettlements() {
      this.toggleDataLoading(true);
      getSettledSettlements()
        .then((response) => {
          this.settledSettlements = response.data;
        })
        .finally(() => {
          this.toggleDataLoading(false);
        });
    },
  },
};
</script>
