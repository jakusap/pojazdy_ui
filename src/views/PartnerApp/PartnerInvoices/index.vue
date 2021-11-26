<template>
  <div v-loading="loading" class="driver-invoices">
    <UploadedInvoices
      :uploadeded-invoices="uploadededInvoices"
      :dates="dates"
      @start-loading="loading = true"
      @fetch-invoices="loadInvoices()"
    />
    <ApprovedInvoices
      :approved-invoices="approvedInvoices"
      :dates="dates"
      @start-loading="loading = true"
      @fetch-invoices="loadInvoices()"
    />
  </div>
</template>

<script>
import { getInvoices } from '@/api/invoicesApi';
import eventBus from '@/eventBus';
import { dateToJSONLocal } from '@/utils/index';

import ApprovedInvoices from './components/ApprovedInvoices';
import UploadedInvoices from './components/UploadedInvoices';

export default {
  components: {
    UploadedInvoices,
    ApprovedInvoices,
  },
  data() {
    return {
      loading: false,
      uploadededInvoices: [],
      approvedInvoices: [],
      dates: {
        from: null,
        to: null,
      },
    };
  },

  watch: {
    dates: {
      handler() {
        this.loadInvoices();
      },
      deep: true,
    },
  },

  async created() {
    eventBus.$on('set-invoice-description', this.loadInvoices);

    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    date.setDate(1);
    this.dates.from = date;
  },
  beforeDestroy() {
    eventBus.$off('set-invoice-description', this.loadInvoices);
  },

  methods: {
    async loadInvoices() {
      const dateFrom = this.dates.from ? dateToJSONLocal(this.dates.from) : null;
      const dateTo = this.dates.to ? dateToJSONLocal(this.dates.to) : null;

      this.loading = true;
      await getInvoices(this.partnerUUID, false, dateFrom, dateTo).then((response) => {
        if (response.ok) {
          this.uploadededInvoices = response.data;
        }
      });
      await getInvoices(this.partnerUUID, true, dateFrom, dateTo).then((response) => {
        if (response.ok) {
          this.approvedInvoices = response.data;
        }
      });
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.driver-invoices {
  padding: 16px;
}
</style>
