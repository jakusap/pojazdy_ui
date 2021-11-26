import AddCost from '@/effects/AddCost';
import AddInvoice from '@/effects/AddInvoice';

const transactionsEffectsMixin = {
  methods: {
    addCostTransaction(drivers) {
      this.$modalOn(AddCost, { drivers: drivers });
    },
    addInvoice(drivers) {
      this.$modalOn(AddInvoice, { drivers: drivers });
    },
  },
};

export default transactionsEffectsMixin;
