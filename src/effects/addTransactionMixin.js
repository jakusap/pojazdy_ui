import { mapActions, mapGetters } from 'vuex';

import { addTransaction } from '@/api/transactions';
import ModalGateway from '@/modals/ModalGateway';
import { dateToJSONLocal } from '@/utils';
import { validateNumber } from '@/validators';

const addTransactionMixin = {
  components: {
    ModalGateway,
  },
  props: {
    drivers: {
      type: Array,
    },
  },
  data() {
    return {
      amountType: 'gross',
      close: false,
      transaction: {
        description: '',
        driverUUID: null,
        transactionDate: null,
        amount: null,
      },
      rules: {
        description: [{ required: true, message: this.$t('description_is_required') }],
        amount: [{ required: true, validator: validateNumber }],
      },
    };
  },
  computed: {
    ...mapGetters(['dataLoading']),
    finalAmount() {
      const vat = this.transaction.vatRate === '23%' ? 1.23 : 1.08;
      return this.amountType === 'gross' ? this.transaction.amount / vat : this.transaction.amount * vat;
    },
    valid() {
      return !(this.transaction.transactionDate && Number(this.transaction.amount));
    },
  },
  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    ...mapActions('transactionsViewStore', ['loadTransactionsDetails']),
    ...mapActions('settlementsViewStore', ['reloadSettlements']),
    addTransaction: addTransaction,
    disabledTo(date) {
      return date > new Date();
    },
    submitTransaction() {
      this.toggleDataLoading(true);
      const amount = this.transaction.amount;

      const vatRate = Number(this.transaction.vatRate?.slice(0, 2) / 100);

      const netAmount = this.amountType === 'gross' ? Number(amount) / (1 + vatRate) : Number(amount);
      const grossAmount = this.amountType === 'gross' ? Number(amount) : amount * (1 + vatRate);
      const vatAmount = grossAmount - grossAmount / (1 + vatRate);

      const drivers = this.drivers.map((driver) => driver.driverUUID);

      const newTransaction = {
        description: this.transaction.description.length ? this.transaction.description : 'INVOICE',
        transactionDate: dateToJSONLocal(this.transaction.transactionDate),
        vatRate: vatRate || null,
        netAmount: netAmount || null,
        grossAmount: grossAmount,
        vatAmount: vatAmount || null,
        type: this.type,
        provider: this.provider,
      };

      addTransaction(drivers, newTransaction)
        .then((response) => {
          if (response.ok) {
            this.$message({
              message: this.$t('AddTransaction.add_transaction_success'),
              type: 'success',
              center: true,
            });
            this.close = true;

            const { transactionsViewStore, settlementsViewStore } = this.$store.state;

            transactionsViewStore && this.loadTransactionsDetails();
            settlementsViewStore && this.reloadSettlements();
          } else {
            this.$message({
              message: this.$t('AddTransaction.add_transaction_error'),
              type: 'error',
              center: true,
            });
          }
        })
        .finally(() => {
          this.toggleDataLoading(false);
        });
    },
  },
};

export default addTransactionMixin;
