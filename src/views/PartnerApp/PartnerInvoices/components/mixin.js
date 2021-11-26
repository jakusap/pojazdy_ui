import { deleteInvoice } from '@/api/invoicesApi';

const invoicesMixin = {
  methods: {
    async removeInvoice(uuid) {
      this.$confirm(this.$t('DriverInvoices.confirm_delete'), this.$t('confirm_warning'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning',
      })
        .then(async () => {
          this.$emit('start-loading');
          await deleteInvoice(uuid)
            .then((response) => {
              if (response.ok) {
                this.$message({
                  type: 'success',
                  message: this.$t('DriverInvoices.remove_success'),
                  center: true,
                  duration: 2000,
                });
              } else {
                this.$message({
                  type: 'error',
                  message: this.$t('DriverInvoices.remove_failed'),
                  center: true,
                  duration: 2000,
                });
              }
            })
            .finally(() => this.$emit(`fetch-invoices`));
        })
        .catch(() => {});
    },
  },
};

export default invoicesMixin;
