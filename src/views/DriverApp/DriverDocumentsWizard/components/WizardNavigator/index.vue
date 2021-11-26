<template>
  <section class="wizardNavigator">
    <el-button v-if="!isFirstStep" type="info" @click="goToPreviousStep()">{{
      $t('DocumentsWizard.stepper.previousStep')
    }}</el-button>
    <el-button v-if="!isLastStep" type="primary" @click="goToNextStep()">{{
      $t('DocumentsWizard.stepper.nextStep')
    }}</el-button>
    <el-button v-if="isLastStep" type="primary" class="sign-btn" @click="submit()">
      <i class="el-icon-check" />
      <span>{{ $t('DocumentsWizard.save_documents') }}</span>
    </el-button>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'WizardNavigator',
  props: {
    formReference: Object,
    steps: Array,
  },
  computed: {
    currentStep() {
      return this.getCurrentStep();
    },
    currentStepNo() {
      this.verifyStepList();
      return this.steps.find((s) => s.stepName == this.currentStep).stepNo;
    },
    nextStepName() {
      this.verifyStepList();
      return this.steps.find((s) => s.stepNo === this.currentStepNo + 1)?.stepName;
    },
    previousStepName() {
      this.verifyStepList();
      return this.steps.find((s) => s.stepNo === this.currentStepNo - 1)?.stepName;
    },
    isFirstStep() {
      return this.currentStepNo === 0;
    },
    isLastStep() {
      return this.currentStep === 'SIGN_STEP';
    },
  },
  methods: {
    ...mapGetters('documentsWizard', ['getCurrentStep']),
    ...mapActions('documentsWizard', ['setCurrentStep']),
    goToNextStep() {
      this.formReference.validate((valid) => {
        if (valid) {
          this.setCurrentStep(this.nextStepName);
        } else {
          this.$message({
            type: 'error',
            message: this.$t('DocumentsWizard.failure_fill_documents_label'),
            center: true,
          });
        }
      });
    },
    goToPreviousStep() {
      this.setCurrentStep(this.previousStepName);
    },
    submit() {
      this.$emit('submit');
    },
    verifyStepList() {
      if (!this.steps.find((s) => s.stepName === this.currentStep)) {
        this.setCurrentStep('STEP_ONE');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wizardNavigator {
  .el-button {
    margin-top: 16px;
  }
}

@media screen and (max-width: 768px) {
  .sign-btn {
    display: block;
    margin-left: 0;
  }
}
</style>
