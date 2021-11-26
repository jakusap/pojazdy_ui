import { mapGetters } from 'vuex';

const filterMixin = {
  computed: {
    ...mapGetters('settlementsViewStore', ['filters']),
  },
};

export default filterMixin;
