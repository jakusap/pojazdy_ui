<template>
  <DataWrapper v-loading="dataLoading" class="settlements">
    <template slot="table-header">
      <TableTitle />
      <TableSettings />
    </template>
    <template slot="table-body">
      <el-table
        :empty-text="$t('paid_settlement_placeholder')"
        :data="paginatedData"
        :row-key="'uuid'"
        :height="height ? height : 'calc(100vh - 64px - 32px - 32px - 32px - 64px - 12px)'"
        @select-all="handleSelectAll"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
      >
        <SelectionColumn />
        <RowActions />
        <IbanStatus />
        <DriverLink />
        <PayoutAmount />
        <PaidDateInfo />
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
import { mapGetters } from 'vuex';

import { getPaidSettlements } from '@/api/settlementsApi';

import ContractType from '../components/ContractType';
import DriverLink from '../components/DriverLink';
import IbanStatus from '../components/IbanStatus';
import PayoutAmount from '../components/PayoutAmount';
import SelectionColumn from '../components/SelectionColumn';
import changePaidStatusMixin from '../mixins/changePaidStatusMixin';
import settlementsViewsMixin from '../mixins/settlementsViewsMixin';
import PaidDateInfo from './PaidDateInfo';
import RowActions from './RowActions';
import TableActions from './TableActions';
import TableSettings from './TableSettings';
import TableTitle from './TableTitle';

export default {
  name: 'PaidSettlements',
  components: {
    TableTitle,
    TableSettings,
    TableActions,
    ContractType,
    DriverLink,
    IbanStatus,
    PayoutAmount,
    RowActions,
    PaidDateInfo,
    SelectionColumn,
  },
  mixins: [settlementsViewsMixin, changePaidStatusMixin],
  props: {
    height: {
      type: Number,
    },
  },
  data() {
    return {
      paidSettlements: null,
    };
  },
  computed: {
    ...mapGetters('settlementsViewStore', ['filters']),
    settlements() {
      if (this.paidSettlements) {
        const paidSettlements = this.filterTable(this.paidSettlements, this.filters);
        this.loadSettlements(paidSettlements);
        return paidSettlements;
      }
      return [];
    },
    dateFrom() {
      return this.filters.dateFrom;
    },
  },
  watch: {
    async dateFrom(prev, value) {
      if (prev !== value) {
        await this.fetchSettlements();
      }
    },
  },
  async created() {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    date.setDate(1);
    this.filters.dateFrom = date;
  },
  methods: {
    async fetchSettlements() {
      this.toggleDataLoading(true);
      await getPaidSettlements(this.filters.dateFrom)
        .then((response) => {
          this.paidSettlements = response.data;
        })
        .finally(() => {
          this.toggleDataLoading(false);
        });
    },
  },
};
</script>
