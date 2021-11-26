<template>
  <div class="el-row">
    <el-form-item :label="$t('AddDriver.bolt_id')" prop="boltId">
      <el-input v-model="addDriverForm.boltId" class="new-transaction__input--small"></el-input>
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
