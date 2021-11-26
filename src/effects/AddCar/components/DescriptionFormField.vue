<template>
  <div v-if="!mobile" class="el-row">
    <el-form-item :label="$t('DriverInvoices.description')" prop="description">
      <el-input v-model="addCarForm.description" type="textarea" class="new-transaction__input--large" />
    </el-form-item>
  </div>
  <div v-else-if="mobile" class="mobile-div">
    <el-form-item :label="$t('DriverInvoices.description')" prop="description">
      <el-input v-model="addCarForm.description" type="textarea" class="new-transaction__input--large" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    addCarForm: {
      type: Object,
    },
  },
};
</script>
<style lang="scss">
.mobile-div {
  word-break: initial;
  width: 245px;
  margin-bottom: 20px;
}
</style>
<style lang="scss" scoped>
.el-form-item {
  width: 100%;
  margin: 0;
  + .el-form-item {
    padding-left: 8px;
  }
}
</style>
