import { mapActions } from 'vuex';

const tableNavigationMixin = {
  watch: {
    radio(value) {
      if (value === 'pendingSettlements') {
        this.$route.name === 'DriverDetails'
          ? this.changeView('pendingSettlements')
          : this.$router.push('/settlements/pending');
      }
      if (value === 'settledSettlements') {
        this.$route.name === 'DriverDetails'
          ? this.changeView('settledSettlements')
          : this.$router.push('/settlements/settled');
      }
      if (value === 'paidSettlements') {
        this.$route.name === 'DriverDetails'
          ? this.changeView('paidSettlements')
          : this.$router.push('/settlements/paid');
      }
    },
  },
  methods: {
    ...mapActions('settlementsViewStore', ['changeView']),
  },
};

export default tableNavigationMixin;
