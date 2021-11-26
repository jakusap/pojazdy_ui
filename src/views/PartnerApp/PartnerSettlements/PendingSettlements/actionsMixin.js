import { mapActions } from 'vuex';

import { sendSettlementBilling } from '@/api/notificationsApi.js';
import { calculateSettlements } from '@/api/settlementsApi.js';
import AddCost from '@/effects/AddCost';

const actionsMixin = {
  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    addCostTransaction(drivers) {
      this.$modalOn(AddCost, { drivers: drivers });
    },
    confirmSettleAll() {
      this.$confirm(this.$t('settle_all_warning'), this.$t('confirm_warning'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning',
      })
        .then(() => {
          this.createSettlements();
        })
        .catch(() => {});
    },
    confirmSendAll() {
      this.$confirm(this.$t('send_all_warning'), this.$t('confirm_warning'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning',
      })
        .then(() => {
          this.sendBilling();
        })
        .catch(() => {});
    },
    createSettlements(selectedSettlements) {
      this.toggleDataLoading(true);
      const drivers = selectedSettlements
        ? selectedSettlements.length
          ? selectedSettlements.map((settlement) => settlement.driver.driverUUID)
          : [selectedSettlements.driver.driverUUID]
        : this.settlements.map((settlement) => settlement.driver.driverUUID);

      calculateSettlements(drivers, this.selectedSettlementPeriodCode)
        .then((response) => {
          if (response.ok) {
            this.selectedSettlements.length === 0 || drivers.length === this.selectedSettlements.length
              ? this.$message({ center: true, type: 'success', message: this.$t('settlement_success') })
              : this.$message({
                  center: true,
                  type: 'success',
                  message: this.$t('settlement_success_negative_present'),
                });
            this.$store.dispatch('tabs/removeTransactionTabs');
            this.$store.dispatch('settlementsViewStore/reloadSettlements');
          } else {
            this.$message({
              center: true,
              type: 'error',
              message: this.$t('settlement_failed'),
            });
          }
        })
        .catch((error) => {
          this.toggleDataLoading(false);
          if (error.response.status === 402) {
            this.$message({
              center: true,
              type: 'error',
              message: this.$t('settlements_used_limit'),
            });
          }
        });
    },
    sendBilling(selectedDrivers) {
      this.toggleDataLoading(true);
      const drivers = selectedDrivers?.length
        ? selectedDrivers
            .filter((settlement) => settlement.driver.email)
            .map((settlement) => settlement.driver.driverUUID)
        : this.settlements
            .filter((settlement) => settlement.driver.email)
            .map((settlement) => settlement.driver.driverUUID);

      sendSettlementBilling(drivers, this.selectedSettlementPeriodCode)
        .then((response) => {
          if (response.ok) {
            this.$message({ center: true, type: 'success', message: this.$t('billing_send_success') });
            this.$emit('sent');
          } else {
            this.$message({
              center: true,
              type: 'error',
              message: this.$t('billing_send_failed'),
            });
          }
        })
        .finally(() => {
          this.toggleDataLoading(false);
        });
    },
    toggleSettlementsDetails(settlement) {
      this.$router.push({
        name: 'Transactions',
        params: {
          driverUUID: settlement.driver.driverUUID,
        },
      });
    },
  },
};

export default actionsMixin;
