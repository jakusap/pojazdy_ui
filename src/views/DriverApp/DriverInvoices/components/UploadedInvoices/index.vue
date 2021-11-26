<template>
  <div class="uploaded">
    <h3 class="uploaded__title">{{ $t('DriverInvoices.uploaded_invoices') }}</h3>
    <div v-if="uploadededInvoices.length" class="uploaded-list">
      <div v-for="invoice in uploadededInvoices" :key="invoice.uuid" class="uploaded-list__invoice">
        <el-tooltip
          v-if="invoiceWithDescription(invoice.invoiceImageDescription)"
          effect="dark"
          :content="invoice.invoiceImageDescription.partnerFeedback"
          placement="top"
        >
          <i class="el-icon-chat-line-square icon-info" />
        </el-tooltip>
        <div class="invoice-info">
          <span> {{ $t('DriverInvoices.file_name') }} {{ invoice.filename }} </span>
          <span> {{ $t('DriverInvoices.upload_date') }} {{ invoice.systemEntryDate }} </span>
        </div>
        <el-button-group>
          <a :href="`/api/invoice-images/${invoice.uuid}/preview`" target="_blank" class="el-button  el-button--info">
            {{ $t('DriverInvoices.download') }}
          </a>

          <el-button type="danger" @click="removeInvoice(invoice.uuid)">
            {{ $t('DriverInvoices.remove') }}
          </el-button>

          <el-button v-if="invoice.describedByDriver" type="primary" @click="createInvoiceDescription(invoice)">
            {{ $t('DriverInvoices.edit') }}
          </el-button>
        </el-button-group>
      </div>
    </div>
    <div v-else class="uploaded__placeholder">
      <h3>
        {{ $t('DriverInvoices.no_uploaded') }}
      </h3>
    </div>
  </div>
</template>

<script>
import { deleteInvoice } from '@/api/invoicesApi';
import SetInvoiceDescription from '@/effects/SetInvoiceDescription';
export default {
  props: {
    uploadededInvoices: {
      type: Array,
    },
  },
  methods: {
    async removeInvoice(uuid) {
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
        .finally(() => this.$emit('fetch-uploaded'));
    },
    invoiceWithDescription(invoiceDescription) {
      if (invoiceDescription) {
        return !!invoiceDescription.partnerFeedback;
      }
    },
    createInvoiceDescription(invoice) {
      const {
        uuid,
        driverFirstName,
        driverLastName,
        driverUUID,
        filename,
        systemEntryDate,
        invoiceImageDescription,
      } = invoice;
      const driver = {
        firstName: driverFirstName,
        lastName: driverLastName,
        driverUUID: driverUUID,
        filename: filename,
        date: systemEntryDate,
      };

      this.$modalOn(SetInvoiceDescription, {
        uuid: uuid,
        driver: driver,
        createdDescription: invoiceImageDescription,
        disabled: false,
        editingByDriver: true,
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
  & .el-tooltip {
    display: flex;
    flex-flow: column;
    margin-left: 90%;
  }
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
  margin-top: auto;
}
@media screen and (min-width: 768px) {
  .uploaded-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
</style>
