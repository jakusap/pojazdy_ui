<template>
  <div v-if="!mobile" class="el-row">
    <el-form-item :label="$t('DocumentsWizard.formLabels.identificationNumber')" prop="carVin">
      <el-input v-model="addCarForm.carVin" class="new-transaction__input--large" />
    </el-form-item>
    <el-form-item :label="$t('DocumentsWizard.formLabels.registrationNumber')" prop="registrationNumber">
      <el-input v-model="addCarForm.registrationNumber" class="new-transaction__input--large" />
    </el-form-item>
  </div>
  <div v-else-if="mobile">
    <div class="mobile-div">
      <el-form-item :label="$t('DocumentsWizard.formLabels.identificationNumber')" prop="carVin">
        <el-input v-model="addCarForm.carVin" class="new-transaction__input--large" />
      </el-form-item>
    </div>
    <div class="mobile-div">
      <el-form-item :label="$t('DocumentsWizard.formLabels.registrationNumber')" prop="registrationNumber">
        <el-input v-model="addCarForm.registrationNumber" class="new-transaction__input--large" />
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
