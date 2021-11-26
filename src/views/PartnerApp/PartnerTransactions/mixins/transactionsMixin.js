const transactionsMixin = {
  data() {
    return {
      messageOptions: {
        center: true,
        duration: 2000,
      },
    };
  },
  watch: {
    radio(value) {
      if (value === 'transactionsDetails')
        this.$router.push({ name: 'TransactionsDetails', params: this.$route.params });
      if (value === 'transactionsSummary')
        this.$router.push({ name: 'TransactionsSummary', params: this.$route.params });
    },
  },

  methods: {
    settlementSuccess() {
      this.$message({
        type: 'success',
        message: this.$t('settlement_success'),
        ...this.messageOptions,
      });
      this.$store.dispatch('partnerProfile/updateSettlementsLimits');
      this.$store.dispatch('tabs/removeTransactionTabs');
      this.$router.push({ name: 'PendingSettlements' });
    },
    settlementFailed() {
      this.$message({
        type: 'error',
        message: this.$t('settlement_failed'),
        ...this.messageOptions,
      });
    },
    revokeSuccess() {
      this.$message({
        type: 'success',
        message: this.$t('revoke_success'),
        ...this.messageOptions,
      });
      this.$store.dispatch('partnerProfile/updateSettlementsLimits');
      this.$store.dispatch('tabs/removeTransactionTabs');
      this.$router.push({ name: 'SettledSettlements' });
    },
    revokeFailed() {
      this.$message({
        type: 'error',
        message: this.$t('revoke_failed'),
        ...this.messageOptions,
      });
    },
    billingSuccess() {
      this.$message({
        type: 'success',
        message: this.$t('billing_send_success'),
        ...this.messageOptions,
      });
    },
    billingFailed() {
      this.$message({
        type: 'error',
        message: this.$t('billing_send_failed'),
        ...this.messageOptions,
      });
    },
  },
};

export default transactionsMixin;
