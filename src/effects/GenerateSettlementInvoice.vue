<template>
  <ModalGateway :title="$t('GenerateSettlementInvoice.title')" :close="close" :slight="true">
    <el-form ref="invoiceForm" :model="formData" :rules="rules">
      <div class="el-row">
        <el-form-item :label="$t('GenerateSettlementInvoice.invoice_number')" prop="invoiceNumber">
          <el-input v-model="formData.invoiceNumber"></el-input>
        </el-form-item>
      </div>
      <div class="el-row">
        <el-form-item :label="$t('GenerateSettlementInvoice.driver_company_tax_id')" prop="companyTaxId">
          <el-input v-model="formData.companyTaxId"></el-input>
        </el-form-item>
      </div>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="!isValid" @click="downloadInvoice()">{{
        $t('GenerateSettlementInvoice.download_pdf')
      }}</el-button>
    </span>
  </ModalGateway>
</template>

<script>
import ModalGateway from '@/modals/ModalGateway';
import { checkNip } from '@/validators';
export default {
  components: {
    ModalGateway,
  },
  props: {
    invoiceData: Object,
  },
  data() {
    return {
      close: false,
      isValid: false,
      formData: {
        invoiceNumber: null,
        companyTaxId: null,
      },
      rules: {
        invoiceNumber: [
          {
            required: true,
            message: this.$t('validation.invoice_number_cannot_be_empty'),
            trigger: 'blur',
          },
          {
            min: 1,
            max: 40,
            message: this.$t('validation.invoice_number_wrong_length'),
            trigger: 'change',
          },
        ],
        companyTaxId: [
          {
            required: true,
            message: this.$t('validation.tax_id_cannot_be_empty'),
            trigger: 'change',
          },
          { validator: checkNip, trigger: 'change' },
        ],
      },
    };
  },
  watch: {
    formData: {
      deep: true,
      handler: function() {
        this.isFormValid();
      },
    },
  },
  mounted() {
    this.formData.companyTaxId = this.invoiceData.driverCompanyTaxId || null;
  },
  methods: {
    isFormValid: function() {
      this.$refs['invoiceForm']?.validate((valid) => (this.isValid = valid));
    },
    downloadInvoice() {
      this.close = true;
      let params = `invoiceNumber=${this.formData.invoiceNumber}&driverCompanyTaxId=${this.formData.companyTaxId}&invoiceType=${this.invoiceData.type}`;
      let url = `/api/settlements/${this.invoiceData.settlementUuid}/invoices?` + params;
      window.open(url, '_self');
    },
  },
};
</script>
<style lang="scss" scoped>
.el-form-item {
  width: 100%;
  margin: 0;
  + .el-form-item {
    padding-left: 8px;
  }
  &__label {
    text-align: left;
  }
}
</style>
