<template>
  <div v-if="!mobile" class="el-row">
    <el-form-item :label="$t('DocumentsWizard.formLabels.notify_mileage')" prop="mileageNotification">
      <el-input v-model="addServiceEventForm.mileageNotification" class="new-transaction__input--large" />
    </el-form-item>
    <el-form-item :label="$t('DocumentsWizard.formLabels.max_mileage')" prop="mileage">
      <el-input v-model="addServiceEventForm.mileage" class="new-transaction__input--large" />
    </el-form-item>
  </div>
  <div v-else-if="mobile">
    <div class="mobile-div">
      <el-form-item :label="$t('DocumentsWizard.formLabels.notify_mileage')" prop="mileageNotification">
        <el-input v-model="addServiceEventForm.mileageNotification" class="new-transaction__input--large" />
      </el-form-item>
    </div>
    <div class="mobile-div">
      <el-form-item :label="$t('DocumentsWizard.formLabels.max_mileage')" prop="mileage">
        <el-input v-model="addServiceEventForm.mileage" class="new-transaction__input--large" />
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
.mobile-div {
  width: 245px;
  margin-bottom: 10px;
}
.el-form-item {
  width: 100%;
  margin: 0;
  + .el-form-item {
    padding-left: 8px;
  }
}
</style>
