import { mapActions, mapGetters } from 'vuex';

import DataWrapper from '@/components/DataWrapper';
import Pagination from '@/components/Pagination';
import SchemaTooltip from '@/components/SchemaTooltip';

import { filterTable } from '../utils';
const settlementsViewsMixin = {
  components: {
    DataWrapper,
    SchemaTooltip,
    Pagination,
  },
  data() {
    return {
      pagination: {
        limit: 25,
        currentPage: 1,
      },
      sort: null,
    };
  },
  computed: {
    ...mapGetters(['settlementsSchemas', 'dataLoading']),
    ...mapGetters('settlementsViewStore', ['filters', 'reloadSettlements']),
    paginatedData() {
      const limit = this.pagination.limit;
      const currentPage = this.pagination.currentPage;

      if (this.sort) {
        const prop = this.sort.prop.split('.');
        const order = this.sort.order === 'ascending' ? 'ASC' : 'DESC';
        const sortedSettlements = [...this.settlements].sort((a, b) => {
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
        return sortedSettlements.slice(limit * (currentPage - 1), limit * currentPage);
      }

      return this.settlements.slice(limit * (currentPage - 1), limit * currentPage);
    },
  },
  watch: {
    async reloadSettlements(reload) {
      if (reload === true) {
        await this.fetchSettlements();
        this.reloadedSettlements();
      }
    },
  },

  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    ...mapActions('settlementsViewStore', ['reloadedSettlements', 'loadSettlements', 'selectSettlements']),
    filterTable: filterTable,
    handleSortChange(e) {
      e.order ? (this.sort = { prop: e.prop, order: e.order }) : (this.sort = null);
    },
    loadingSettlementsFailedMessage() {
      this.$message({
        type: 'error',
        message: this.$t('error_loading_settlements'),
        center: true,
      });
    },
    handleSelectionChange(selected) {
      this.selectSettlements(selected);
    },
    handleSelectAll() {
      this.selectSettlements(this.settlements);
    },
  },
};

export default settlementsViewsMixin;
