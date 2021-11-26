<template>
  <section>
    <div>
      <h4>{{ $t('SetInvoiceDescription.dates') }}</h4>
    </div>
    <div class="invoice-description__small">
      <el-form-item prop="invoiceDate">
        <el-date-picker
          v-model="invoiceDescription.invoiceDate"
          :placeholder="$t('DriverInvoices.invoice_date')"
          :picker-options="{ disabledDate: disabledTo }"
        />
      </el-form-item>

      <el-form-item prop="saleDate">
        <el-date-picker
          v-model="invoiceDescription.saleDate"
          :placeholder="$t('DriverInvoices.sale_date')"
          :picker-options="{ disabledDate: disabledTo }"
        />
      </el-form-item>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    invoiceDescription: {
      type: Object,
    },
  },
  computed: {
    saleDate() {
      return this.invoiceDescription.saleDate;
    },
    invoiceDate() {
      return this.invoiceDescription.invoiceDate;
    },
  },
  watch: {
    saleDate(date) {
      if (!this.invoiceDate) this.invoiceDescription.invoiceDate = date;
    },
    invoiceDate(date) {
      if (!this.saleDate) this.invoiceDescription.saleDate = date;
    },
  },
  methods: {
    disabledTo(date) {
      return date > new Date();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../_styles.scss';
</style>
