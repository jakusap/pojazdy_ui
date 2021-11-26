<template>
  <div class="el-row">
    <el-form-item :label="$t('phone_number')" prop="phoneNumber">
      <el-input v-model="addDriverForm.phoneNumber" class="new-transaction__input--large" type="phone" />
    </el-form-item>
    <el-form-item :label="$t('email_address')" prop="email">
      <el-input v-model="addDriverForm.email" type="email" class="new-transaction__input--large" />
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
