<template>
  <div class="main-container">
    <InputCustomCheckbox
      v-model="taxInformation.editableStatements.employment.checked"
      :dark-theme="false"
      name="stepThree.taxInformation.editableStatements.employment.checked"
      type="text"
      :label="$t('DocumentsWizard.formSections.statements_label_employment')"
      border
    />
    <div v-if="taxInformation.editableStatements.employment.checked">
      <div class="with_label">
        <div class="form-row">
          <InputCustomDatePicker
            v-model="taxInformation.editableStatements.employment.dateFrom"
            :placeholder="$t('DocumentsWizard.formSections.statements_label_from')"
            :tooltip="$t('DocumentsWizard.formLabels.dateFrom_tooltip')"
            name="stepThree.taxInformation.editableStatements.employment.dateFrom"
            icon-name="date"
          />
          <InputCustomDatePicker
            v-model="taxInformation.editableStatements.employment.dateTo"
            :placeholder="$t('DocumentsWizard.formSections.statements_label_to')"
            :tooltip="$t('DocumentsWizard.formLabels.dateTo_tooltip')"
            name="stepThree.taxInformation.editableStatements.employment.dateTo"
            icon-name="date"
          />
        </div>
      </div>
      <span class="label">{{ $t('DocumentsWizard.formSections.statements_label_employment_salary') }}</span>
      <InputCustomRadio
        v-model="taxInformation.editableStatements.employment.salary"
        :options="salaryTypes"
        :tooltip="$t('DocumentsWizard.formLabels.editable_statements_tooltip')"
        :dark-theme="false"
        name="stepThree.taxInformation.editableStatements.employment.salary"
        type="text"
        border
      />
    </div>

    <InputCustomCheckbox
      v-model="taxInformation.editableStatements.insurance.checked"
      :dark-theme="false"
      name="stepThree.taxInformation.editableStatements.insurance.checked"
      type="text"
      :label="$t('DocumentsWizard.formSections.statements_label_insurance')"
      border
    />
    <div v-if="taxInformation.editableStatements.insurance.checked">
      <div class="with_label">
        <span class="label">{{ $t('DocumentsWizard.formSections.statements_label_employment_period') }}</span>
        <div class="form-row">
          <InputCustomDatePicker
            v-model="taxInformation.editableStatements.insurance.dateFrom"
            :placeholder="$t('DocumentsWizard.formSections.statements_label_from')"
            :tooltip="$t('DocumentsWizard.formLabels.dateFrom_tooltip')"
            name="stepThree.taxInformation.editableStatements.insurance.dateFrom"
            icon-name="date"
          />
          <InputCustomDatePicker
            v-model="taxInformation.editableStatements.insurance.dateTo"
            :placeholder="$t('DocumentsWizard.formSections.statements_label_to')"
            :tooltip="$t('DocumentsWizard.formLabels.dateTo_tooltip')"
            name="stepThree.taxInformation.editableStatements.insurance.dateTo"
            icon-name="date"
          />
        </div>
      </div>
      <span class="label">{{ $t('DocumentsWizard.formSections.statements_label_employment_salary') }}</span>
      <InputCustomRadio
        v-model="taxInformation.editableStatements.insurance.salary"
        :options="salaryTypes"
        :dark-theme="false"
        name="stepThree.taxInformation.editableStatements.insurance.salary"
        :tooltip="$t('DocumentsWizard.formLabels.editable_statements_tooltip')"
        type="text"
        border
      />
    </div>

    <InputCustomCheckbox
      v-model="taxInformation.editableStatements.otherInsurance.checked"
      :dark-theme="false"
      name="stepThree.taxInformation.editableStatements.insurance.checked"
      type="text"
      :label="$t('DocumentsWizard.formSections.statements_label_other_insurance')"
      border
    />
    <div v-if="taxInformation.editableStatements.otherInsurance.checked">
      <span class="label">{{ $t('DocumentsWizard.formSections.statements_label_other_insurance_tile_label') }}</span>
      <InputCustom
        v-model="taxInformation.editableStatements.otherInsurance.title"
        :dark-theme="false"
        name="stepThree.taxInformation.editableStatements.otherInsurance.title"
        type="text"
        :placeholder="$t('DocumentsWizard.formSections.statements_label_other_insurance_tile')"
        border
      />
    </div>

    <InputCustomCheckbox
      v-model="taxInformation.editableStatements.retired.checked"
      :dark-theme="false"
      name="stepThree.taxInformation.editableStatements.retired.checked"
      type="text"
      :label="$t('DocumentsWizard.formSections.statements_label_retired_type_long')"
      border
    />
    <div v-if="taxInformation.editableStatements.retired.checked">
      <div class="form-row">
        <SelectCustom
          v-model="taxInformation.editableStatements.retired.categoryCode"
          :placeholder="$t('DocumentsWizard.formLabels.retired_pensioner')"
          :tooltip="$t('DocumentsWizard.formLabels.editable_statements_tooltip')"
          :options="retiredOptions"
          remote
          name="stepThree.taxInformation.editableStatements.retired.categoryCode"
          clearable
          filterable
        />

        <InputCustom
          v-model="taxInformation.editableStatements.retired.decisionNumber"
          :placeholder="$t('DocumentsWizard.formSections.statements_label_decision')"
          name="stepThree.taxInformation.editableStatements.retired.decisionNumber"
          :tooltip="$t('DocumentsWizard.formLabels.editable_statements_tooltip')"
          type="text"
        />
      </div>
      <InputCustomDatePicker
        v-model="taxInformation.editableStatements.retired.decisionDate"
        :placeholder="$t('DocumentsWizard.formSections.statements_label_decision_date')"
        name="stepThree.taxInformation.editableStatements.retired.decisionDate"
        :tooltip="$t('DocumentsWizard.formLabels.editable_statements_tooltip')"
        icon-name="date"
      />
    </div>

    <InputCustomCheckbox
      v-model="taxInformation.editableStatements.disability.checked"
      :dark-theme="false"
      name="stepThree.taxInformation.editableStatements.disability.checked"
      type="text"
      :label="$t('DocumentsWizard.formSections.statements_label_disability')"
      border
    />
    <div v-if="taxInformation.editableStatements.disability.checked">
      <div class="form-row">
        <SelectCustom
          v-model="taxInformation.editableStatements.disability.categoryCode"
          :placeholder="$t('DocumentsWizard.formLabels.disability')"
          :tooltip="$t('DocumentsWizard.formLabels.editable_statements_tooltip')"
          :options="disabilityOptions"
          remote
          name="stepThree.taxInformation.editableStatements.disability.categoryCode"
          clearable
          filterable
        />
      </div>
      <div class="form-row">
        <InputCustomDatePicker
          v-model="taxInformation.editableStatements.disability.dateFrom"
          :placeholder="$t('DocumentsWizard.formSections.statements_label_from')"
          :tooltip="$t('DocumentsWizard.formLabels.dateFrom_tooltip')"
          name="stepThree.taxInformation.editableStatements.disability.dateFrom"
          icon-name="date"
        />

        <InputCustomDatePicker
          v-model="taxInformation.editableStatements.disability.dateTo"
          :placeholder="$t('DocumentsWizard.formSections.statements_label_to')"
          :tooltip="$t('DocumentsWizard.formLabels.dateTo_tooltip')"
          name="stepThree.taxInformation.editableStatements.disability.dateTo"
          icon-name="date"
        />
      </div>
    </div>

    <div class="other-statements">
      <InputCustomCheckbox
        v-model="taxInformation.statements"
        :dark-theme="false"
        name="stepThree.taxInformation.statements"
        type="text"
        border
        :options="checkListOptions"
      />
    </div>
  </div>
</template>

<script>
import InputCustom from '@/components/InputCustom';
import InputCustomCheckbox from '@/components/InputCustomCheckbox';
import InputCustomDatePicker from '@/components/InputCustomDatePicker';
import InputCustomRadio from '@/components/InputCustomRadio';
import SelectCustom from '@/components/SelectCustom';

export default {
  name: 'StatementsSection',
  components: { InputCustom, InputCustomCheckbox, SelectCustom, InputCustomDatePicker, InputCustomRadio },
  props: {
    taxInformation: Object,
    checkListOptions: Array,
    taxChoiceOptions: Array,
    retiredOptions: Array,
    disabilityOptions: Array,
  },
  data() {
    return {
      retiredSelected: false,
      disabilitySelected: false,
      employmentSelected: false,
      insuranceSelected: false,
      salaryEmploymentSelected: '',
      salaryInsuranceSelected: '',
      salaryTypes: [
        {
          label: this.$t('DocumentsWizard.formLabels.salary_less_than_minimal'),
          value: this.$t('DocumentsWizard.formLabels.salary_less_than_minimal'),
        },
        {
          label: this.$t('DocumentsWizard.formLabels.salary_more_than_minimal'),
          value: this.$t('DocumentsWizard.formLabels.salary_more_than_minimal'),
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
$input_gray: #282830;

.main-container {
  @media screen and (min-width: 768px) {
    border: 1px solid $gray;
    padding: 16px;
    border-radius: 8px;
    margin-left: 11px;
    margin-bottom: 16px;
    background-color: #f9f9f9;
  }

  .label {
    font-size: 16px;
    color: $input_gray;
    white-space: break-spaces;
  }
  .form-row {
    display: flex;
    flex-wrap: wrap;

    .with_label {
      display: flex;
      flex-direction: column;
    }
  }
  .other-statements {
    width: 90%;
  }
}
</style>
