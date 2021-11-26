import ViewSelector from '../components/ViewSelector';
import { filtersOn, filterTable, resetFilters } from '../utils';
import tableNavigationMixin from './tableNavigationMixin';

const tableSettingsMixin = {
  mixins: [tableNavigationMixin],
  components: {
    ViewSelector,
  },
  computed: {
    filters() {
      return this.$store.getters['settlementsViewStore/filters'];
    },
  },

  methods: {
    filterTable: filterTable,
    resetFilters: resetFilters,
    filtersOn: filtersOn,
  },
};

export default tableSettingsMixin;
