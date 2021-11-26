<template>
  <section>
    <el-input disabled :value="`${$t('SetInvoiceDescription.driver')} ${driver.firstName} ${driver.lastName}`" />
    <el-input disabled :value="`${$t('SetInvoiceDescription.filename')} ${driver.filename}`" />
    <el-input disabled :value="`${$t('SetInvoiceDescription.date')} ${driver.date} `" />
  </section>
</template>

<script>
export default {
  props: {
    driver: {
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../_styles.scss';
</style>
