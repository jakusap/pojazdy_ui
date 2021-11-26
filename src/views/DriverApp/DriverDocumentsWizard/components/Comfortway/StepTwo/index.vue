<template>
  <fieldset class="fieldset">
    <p class="section-title">{{ $t('DocumentsWizard.formSections.documents_section') }}</p>
    <div class="form-row">
      <InputCustom
        v-model="model.paymentIban"
        :placeholder="$t('DocumentsWizard.formLabels.paymentIban')"
        :tooltip="$t('DocumentsWizard.formLabels.paymentIban_tooltip')"
        name="stepTwo.paymentIban"
        type="text"
      />
      <InputCustom
        v-model="model.refundIban"
        :placeholder="$t('DocumentsWizard.formLabels.refundIban')"
        :tooltip="$t('DocumentsWizard.formLabels.refundIban_tooltip')"
        name="stepTwo.refundIban"
        type="text"
      />
    </div>
    <div class="form-row half-width">
      <SelectCustom
        v-model="model.settlementFrequency"
        :placeholder="$t('DocumentsWizard.formLabels.settlementFrequency')"
        :tooltip="$t('DocumentsWizard.formLabels.settlementFrequency_tooltip')"
        :options="createOptions(['SETTLEMENT_FREQUENCY'])"
        name="stepTwo.settlementFrequency"
        remote
        clearable
        filterable
      />
    </div>

    <hr class="divider" />

    <p class="section-title">{{ $t('DocumentsWizard.formSections.vehicle_section') }}</p>
    <div class="form-row">
      <InputCustom
        v-model="model.vehicleInformation.mark"
        :placeholder="$t('DocumentsWizard.formLabels.mark')"
        :tooltip="$t('DocumentsWizard.formLabels.mark_tooltip')"
        name="stepTwo.vehicleInformation.mark"
        type="text"
      />
      <InputCustom
        v-model="model.vehicleInformation.model"
        :placeholder="$t('DocumentsWizard.formLabels.model')"
        :tooltip="$t('DocumentsWizard.formLabels.model_tooltip')"
        name="stepTwo.vehicleInformation.model"
        type="text"
      />
    </div>
    <div class="form-row">
      <InputCustom
        v-model="model.vehicleInformation.registrationNumber"
        :placeholder="$t('DocumentsWizard.formLabels.registrationNumber')"
        :tooltip="$t('DocumentsWizard.formLabels.registrationNumber_tooltip')"
        name="stepTwo.vehicleInformation.registrationNumber"
        type="text"
      />
      <InputCustom
        v-model="model.vehicleInformation.productionYear"
        :placeholder="$t('DocumentsWizard.formLabels.productionYear')"
        :tooltip="$t('DocumentsWizard.formLabels.productionYear_tooltip')"
        name="stepTwo.vehicleInformation.productionYear"
        type="text"
      />
    </div>
    <div class="form-row">
      <InputCustom
        v-model="model.vehicleInformation.identificationNumber"
        :placeholder="$t('DocumentsWizard.formLabels.identificationNumber')"
        :tooltip="$t('DocumentsWizard.formLabels.identificationNumber_tooltip')"
        name="stepTwo.vehicleInformation.identificationNumber"
        type="text"
      />
      <InputCustom
        v-model="model.vehicleInformation.rentalIban"
        :placeholder="$t('DocumentsWizard.formLabels.rentalIban')"
        :tooltip="$t('DocumentsWizard.formLabels.rentalIban_tooltip')"
        name="stepTwo.vehicleInformation.rentalIban"
        type="text"
      />
    </div>
  </fieldset>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import InputCustom from '@/components/InputCustom';
import InputCustomDatePicker from '@/components/InputCustomDatePicker';
import SelectCustom from '@/components/SelectCustom';

export default {
  name: 'StepTwo',
  components: { SelectCustom, InputCustom },
  props: {
    model: Object,
  },
  methods: {
    ...mapGetters('suggestions', ['getDictionaries', 'getSuggestionsCities']),
    createOptions(category, defaultOption = null) {
      const options = this.getDictionaries()
        .filter((e) => e.isActive && category.includes(e.category))
        .map((e) => ({ label: e.content, value: e.categoryCode }));
      return defaultOption ? [defaultOption, ...options] : options;
    },
  },
};
</script>

<style lang="scss" scoped>
.fieldset {
  border: none;
  padding: 0;
  max-width: 800px;

  .form-row {
    display: flex;

    &.half-width {
      width: 50%;
    }
  }

  .divider {
    width: 100%;
    border: none;
    border-bottom: 1px solid var(--light-gray-border);
  }

  .section-title {
    font-size: 18px;
  }
}
</style>
