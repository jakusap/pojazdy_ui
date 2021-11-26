<template>
  <section class="wizardStepper">
    <div v-for="(step, idx) in steps" :key="idx" class="stepper">
      <div :class="['stepWrapper', { active: step.stepName === currentStep }]" @click="setWizardStep(step.stepName)">
        <button class="stepNumber">{{ idx + 1 }}</button>
        <span class="stepLabel">{{ $t(step.label) }}</span>
      </div>
      <div class="divider"></div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'WizardStepper',
  props: {
    formReference: Object,
    steps: Array,
  },
  computed: {
    currentStep() {
      return this.getCurrentStep();
    },
  },
  methods: {
    ...mapGetters('documentsWizard', ['getCurrentStep']),
    ...mapActions('documentsWizard', ['setCurrentStep']),
    setWizardStep(stepName) {
      const currentStepNo = this.steps.find((s) => s.stepName == this.currentStep)?.stepNo;
      const nextStepNo = this.steps.find((s) => s.stepName == stepName)?.stepNo;
      this.formReference.validate((valid) => {
        if (valid || nextStepNo < currentStepNo) {
          this.setCurrentStep(stepName);
        } else {
          this.$message({
            type: 'error',
            message: this.$t('DocumentsWizard.failure_fill_documents_label'),
            center: true,
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.wizardStepper {
  max-width: 250px;
  border-right: 1px solid var(--light-gray-border);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-height: 500px;
  position: sticky;
  top: 0;

  .stepper {
    display: flex;
    justify-content: center;
    flex-direction: column;
    flex: 1;
    align-items: center;

    &:last-child {
      flex: 0;

      .divider {
        display: none;
      }
    }

    .stepWrapper {
      margin: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      &:not(.active) {
        .stepNumber {
          &:hover {
            background: var(--brand-yellow-background-hover);
            color: var(--brand-gray-color-hover);
          }
        }
      }

      &.active {
        .stepNumber {
          background: var(--orange-background-active);
          color: var(--brand-gray-color-active);
          border-color: var(--brand-gray-border-active);
          box-shadow: var(--box-shadow-extra-high);
        }

        .stepLabel {
          color: var(--brand-gray-color);
        }
      }

      .stepNumber {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin-bottom: 8px;
        background: var(--light-gray-background);
        color: var(--gray-color);
        font-weight: 600;
        font-size: 20px;
        border: 1px solid var(--gray-border);
        outline: none;
        cursor: pointer;
        transition: 0.25s all ease-in-out;
      }

      .stepLabel {
        font-size: 16px;
        color: var(--gray-color);
        word-break: break-word;
        text-align: center;
      }
    }

    .divider {
      width: 1px;
      background: var(--gray-background);
      height: 100%;
      flex: 1;
    }
  }
}
</style>
