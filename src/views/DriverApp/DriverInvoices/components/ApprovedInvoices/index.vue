<template>
  <div class="uploaded">
    <h3 class="uploaded__title">{{ $t('DriverInvoices.approved_invoices') }}</h3>
    <div v-if="approvedInvoices.length" class="uploaded-list">
      <div v-for="invoice in approvedInvoices" :key="invoice.uuid" class="uploaded-list__invoice">
        <div class="invoice-info">
          <span> {{ $t('DriverInvoices.file_name') }} {{ invoice.filename }} </span>
          <span> {{ $t('DriverInvoices.upload_date') }} {{ invoice.systemEntryDate }} </span>
        </div>

        <el-button-group>
          <a :href="`/api/invoice-images/${invoice.uuid}/preview`" target="_blank" class="el-button el-button--info">
            {{ $t('DriverInvoices.download') }}
          </a>
          <el-button class="el-button  el-button--primary" @click="showInvoiceDescription(invoice)">
            {{ $t('DriverInvoices.description') }}
          </el-button>
        </el-button-group>
      </div>
    </div>
    <div v-else class="uploaded__placeholder">
      <h3>
        {{ $t('DriverInvoices.no_approved') }}
      </h3>
    </div>
  </div>
</template>

<script>
import SetInvoiceDescription from '@/effects/SetInvoiceDescription';
export default {
  props: {
    approvedInvoices: {
      type: Array,
    },
  },
  methods: {
    showInvoiceDescription(invoice) {
      const { uuid, invoiceImageDescription, driverFirstName, driverLastName, filename, systemEntryDate } = invoice;

      const driver = {
        firstName: driverFirstName,
        lastName: driverLastName,
        filename: filename,
        date: systemEntryDate,
      };

      this.$modalOn(SetInvoiceDescription, {
        uuid: uuid,
        createdDescription: invoiceImageDescription,
        driver: driver,
        disabled: true,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.uploaded-title {
  margin-top: 32px;
}
.uploaded-list {
  display: grid;
  grid-template-columns: 1fr;
  max-height: 300px;
  overflow-y: auto;
}
.uploaded-list__invoice {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  margin: 4px;
  border-radius: 4px;
  border: 1px solid var(--gray-border);
}
.uploaded__placeholder {
  display: flex;
  justify-content: center;
  & > h3 {
    background: var(--smoke-white-background);
    border: 2px solid var(--light-blue-border);
    padding: 8px;
    border-radius: 8px;
  }
}
.invoice-info {
  display: flex;
  flex-flow: column;
  margin-bottom: 8px;
}
@media screen and (min-width: 768px) {
  .uploaded-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
</style>
