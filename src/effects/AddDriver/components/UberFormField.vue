<template>
  <div class="el-row">
    <el-form-item :label="$t('AddDriver.uber_id')" prop="uberId">
      <el-input v-model="addDriverForm.uberId" class="new-transaction__input--small"></el-input>
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
