<template>
  <section>
    <div>
      <h4>
        <el-checkbox :checked="!disabled" @change="(e) => $emit('enable', e)" />
        {{ $t('SetInvoiceDescription.vat_23') }}
      </h4>
    </div>
    <div class="invoice-description__small">
      <el-form-item prop="net23Amount">
        <el-input v-model="invoiceDescription.net23Amount" :disabled="disabled" :placeholder="$t('net')" />
      </el-form-item>

      <el-form-item prop="vat23Amount">
        <el-input
          v-model="invoiceDescription.vat23Amount"
          :disabled="disabled"
          :placeholder="$t('SetInvoiceDescription.vat_23_amount')"
        />
        <span v-if="vatWarning" class="invoice-description__vat-warning">
          {{ $t('SetInvoiceDescription.vat_changed') }}
        </span>
      </el-form-item>
    </div>

    <div>
      <el-form-item prop="gross23Amount">
        <el-input v-model="invoiceDescription.gross23Amount" :disabled="disabled" :placeholder="$t('gross')" />
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
    vatRate: {
      type: Number,
    },
    disabled: {
      type: Boolean,
    },
  },
  computed: {
    netAmount() {
      return this.invoiceDescription.net23Amount;
    },
    vatAmount() {
      return this.invoiceDescription.vat23Amount;
    },
    vatWarning() {
      if (Number(this.netAmount * this.vatRate).toFixed(2) !== Number(this.invoiceDescription.vat23Amount).toFixed(2)) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    netAmount(value) {
      const vatAmount = Number(value * this.vatRate);
      this.invoiceDescription.vat23Amount = Number(Math.round(vatAmount * 1000) / 1000).toFixed(2);
    },
    vatAmount(value) {
      this.invoiceDescription.gross23Amount = Number(Number(this.netAmount) + Number(value)).toFixed(2);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../_styles.scss';
</style>
