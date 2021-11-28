<template>
  <div v-if="!mobile" class="el-row">
    <el-form-item :label="$t('DocumentsWizard.formLabels.productionYear')" prop="period">
      <el-date-picker v-model="addServiceEventForm.period" />
    </el-form-item>
    <el-form-item :label="$t('DocumentsWizard.formLabels.registrationDate')" prop="periodNotification">
      <el-date-picker v-model="addServiceEventForm.periodNotification" />
    </el-form-item>
  </div>
  <div v-else-if="mobile">
    <div class="">
      <el-form-item :label="$t('DocumentsWizard.formLabels.productionYear')" prop="period">
        <el-date-picker v-model="addServiceEventForm.period" />
      </el-form-item>
    </div>
    <div class="">
      <el-form-item :label="$t('DocumentsWizard.formLabels.registrationDate')" prop="periodNotification">
        <el-date-picker v-model="addServiceEventForm.periodNotification" />
      </el-form-item>
    </div>
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

<style lang="scss" scoped>
.el-form-item {
  width: 100%;
  margin: 0;
  + .el-form-item {
    padding-left: 8px;
    margin-left: 100px;
  }
}
</style>
