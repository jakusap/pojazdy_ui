<template>
  <div class="el-row">
    <el-form-item :label="$t('AddDriver.iban')" prop="iban">
      <div class="">
        <el-input v-model="addDriverForm.iban" class="new-transaction__input--small" @blur="formatIban"> </el-input>
        <span class="bank-branch">
          {{ ibanInfo.bankName }}
        </span>
      </div>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    addDriverForm: {
      type: Object,
    },
    ibanInfo: {
      type: Object,
    },
  },
  methods: {
    formatIban() {
      const iban = this.$props.addDriverForm.iban;
      this.$props.addDriverForm.iban = iban.replace(/ /g, '').replace(/-/g, '');
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
}
</style>
