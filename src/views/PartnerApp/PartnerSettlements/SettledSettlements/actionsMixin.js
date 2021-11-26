import GenerateBulkTransfers from '@/effects/GenerateBulkTransfers';

import changePaidStatusMixin from '../mixins/changePaidStatusMixin';

const actionsMixin = {
  mixins: [changePaidStatusMixin],
  methods: {
    generateBulkTransfers(settlements, partnerIban) {
      this.$modalOn(GenerateBulkTransfers, { settlements: settlements, partnerIban: partnerIban });
    },
  },
};

export default actionsMixin;
