import { mapActions } from 'vuex';

import { putPaidStatus } from '@/api/settlementsApi';
const changePaidStatusMixin = {
  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    changePaidStatus(settlements, status) {
      this.toggleDataLoading(true);
      const settlementsUUIDs = settlements.map((settlement) => settlement.uuid);
      putPaidStatus(settlementsUUIDs, status).then((response) => {
        if (status) {
          if (response.ok) {
            this.$message({
              type: 'success',
              message: this.$t('marked_as_paid_success'),
              center: true,
            });
            this.$store.dispatch('settlementsViewStore/reloadSettlements');
          } else {
            this.$message({
              type: 'error',
              message: this.$t('marked_as_paid_failed'),
              center: true,
            });
          }
        } else {
          if (response.ok) {
            this.$message({
              type: 'success',
              message: this.$t('unmarked_as_paid_success'),
              center: true,
            });
            this.$store.dispatch('settlementsViewStore/reloadSettlements');
          } else {
            this.$message({
              type: 'error',
              message: this.$t('unmarked_as_paid_failed'),
              center: true,
            });
          }
        }
      });
    },
  },
};

export default changePaidStatusMixin;
