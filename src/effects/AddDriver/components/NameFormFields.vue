<template>
  <div class="el-row">
    <el-form-item :label="$t('first_name')" prop="firstName">
      <el-input v-model="addDriverForm.firstName" class="new-transaction__input--large" />
    </el-form-item>
    <el-form-item :label="$t('last_name')" prop="lastName">
      <el-input v-model="addDriverForm.lastName" class="new-transaction__input--large" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    addDriverForm: {
      type: Object,
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
