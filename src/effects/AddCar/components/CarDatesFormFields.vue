<template>
  <div v-if="!mobile" class="el-row">
    <el-form-item :label="$t('DocumentsWizard.formLabels.productionYear')" prop="productionYear">
      <el-date-picker v-model="addCarForm.productionYear" type="year" />
    </el-form-item>
    <el-form-item :label="$t('DocumentsWizard.formLabels.registrationDate')" prop="registrationDate">
      <el-date-picker v-model="addCarForm.registrationDate" />
    </el-form-item>
    <el-form-item :label="$t('DocumentsWizard.formLabels.admissionDate')" prop="admissionDate">
      <el-date-picker v-model="addCarForm.admissionDate" type="datetime" />
    </el-form-item>
  </div>
  <div v-else-if="mobile">
    <div class="">
      <el-form-item :label="$t('DocumentsWizard.formLabels.productionYear')" prop="productionYear">
        <el-date-picker v-model="addCarForm.productionYear" type="year" />
      </el-form-item>
    </div>
    <div class="">
      <el-form-item :label="$t('DocumentsWizard.formLabels.registrationDate')" prop="registrationDate">
        <el-date-picker v-model="addCarForm.registrationDate" />
      </el-form-item>
    </div>
    <div class="">
      <el-form-item :label="$t('DocumentsWizard.formLabels.admissionDate')" prop="admissionDate">
        <el-date-picker v-model="addCarForm.admissionDate" type="datetime" />
      </el-form-item>
    </div>
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
