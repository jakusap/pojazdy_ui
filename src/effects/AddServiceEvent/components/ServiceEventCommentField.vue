<template>
  <div v-if="!mobile" class="el-row">
    <el-form-item :label="$t('DocumentsWizard.formLabels.serviceEvent_name')" prop="comments">
      <el-input v-model="addServiceEventForm.comments" class="new-transaction__input--large" />
    </el-form-item>
  </div>
  <div v-else-if="mobile" class="mobile-div">
    <el-form-item :label="$t('DocumentsWizard.formLabels.serviceEvent_name')" prop="comments">
      <el-input v-model="addServiceEventForm.comments" class="new-transaction__input--large" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    addServiceEventForm: {
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
