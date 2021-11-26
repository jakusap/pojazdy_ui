<template>
  <fieldset class="fieldset">
    <div v-if="isB2BCooperationType">
      <p class="section-title">{{ $t('DocumentsWizard.formSections.company_section') }}</p>
      <div class="form-row">
        <InputCustom
          v-model="model.companyInformation.taxIdentificationNumber"
          :placeholder="$t('DocumentsWizard.formLabels.taxIdentificationNumber')"
          name="stepOne.companyInformation.taxIdentificationNumber"
          type="text"
          :label="$t('DocumentsWizard.formLabels.taxIdentificationNumber')"
        />
        <InputCustom
          v-model="model.companyInformation.regon"
          :placeholder="$t('DocumentsWizard.formLabels.regon')"
          name="stepOne.companyInformation.regon"
          type="text"
          disabled
        />
      </div>
      <div class="form-row">
        <InputCustom
          v-model="model.companyInformation.companyName"
          :placeholder="$t('DocumentsWizard.formLabels.company_name')"
          name="stepOne.companyInformation.companyName"
          type="text"
          disabled
        />
      </div>
    </div>
    <hr class="divider" />
    <p class="section-title">{{ $t('DocumentsWizard.formSections.personal_section') }}</p>
    <div class="form-row">
      <InputCustom
        v-model="model.personalInformation.firstName"
        :placeholder="$t('DocumentsWizard.formLabels.firstName')"
        :tooltip="$t('DocumentsWizard.formLabels.firstName_tooltip')"
        name="stepOne.personalInformation.firstName"
        type="text"
      />
      <InputCustom
        v-model="model.personalInformation.lastName"
        :placeholder="$t('DocumentsWizard.formLabels.lastName')"
        :tooltip="$t('DocumentsWizard.formLabels.lastName_tooltip')"
        name="stepOne.personalInformation.lastName"
        type="text"
      />
    </div>
    <div class="form-row">
      <InputCustom
        v-model="model.personalInformation.personalIdentityNumber"
        :placeholder="$t('DocumentsWizard.formLabels.personalIdentityNumber')"
        :tooltip="$t('DocumentsWizard.formLabels.personalIdentityNumber_tooltip')"
        name="stepOne.personalInformation.personalIdentityNumber"
        type="text"
        :icon-name="personalIdentifyNumberChange"
      />
      <InputCustom
        v-model="model.personalInformation.identityCardNumber"
        :placeholder="$t('DocumentsWizard.formLabels.identityCardNumber')"
        :tooltip="$t('DocumentsWizard.formLabels.identityCardNumber_tooltip')"
        name="stepOne.personalInformation.identityCardNumber"
        type="text"
      />
      <span v-if="isB2BCooperationType">
        <InputCustom
          v-model="model.personalInformation.identityCardCity"
          :placeholder="$t('DocumentsWizard.formLabels.evidence_authority')"
          :tooltip="$t('DocumentsWizard.formLabels.personalIdentityNumber_tooltip')"
          name="stepOne.personalInformation.identityCardCity"
          type="text"
        />
      </span>
      <span v-else>
        <InputCustom
          :value="$t('DocumentsWizard.formLabels.citizenship_placeholder')"
          :placeholder="$t('DocumentsWizard.formLabels.citizenship')"
          :tooltip="$t('DocumentsWizard.formLabels.citizenship_tooltip')"
          name="stepOne.personalInformation.citizenship"
          type="text"
          disabled
        />
      </span>
    </div>
    <div v-if="!isB2BCooperationType" class="form-row">
      <InputCustomDatePicker
        v-model="model.personalInformation.birthDate"
        :placeholder="$t('DocumentsWizard.formLabels.birthDate')"
        :tooltip="$t('DocumentsWizard.formLabels.birthDate_tooltip')"
        name="stepOne.personalInformation.birthDate"
        icon-name="date"
        disabled=""
      />
      <InputCustom
        v-model="model.personalInformation.birthPlace"
        :placeholder="$t('DocumentsWizard.formLabels.birthPlace')"
        :tooltip="$t('DocumentsWizard.formLabels.birthPlace_tooltip')"
        name="stepOne.personalInformation.birthPlace"
        type="text"
      />
    </div>
  </fieldset>
</template>

<script>
import { mapGetters } from 'vuex';

import InputCustom from '@/components/InputCustom';
import InputCustomDatePicker from '@/components/InputCustomDatePicker';

export default {
  name: 'StepOne',
  components: { InputCustom, InputCustomDatePicker },
  props: {
    model: Object,
  },
  computed: {
    isB2BCooperationType() {
      return this.getCooperationType() === 'B2B';
    },
    personalIdentifyNumberChange() {
      if (this.model.personalInformation.personalIdentityNumber.length < 11) {
        return '';
      } else if (parseInt(this.model.personalInformation.personalIdentityNumber.substring(9, 10), 10) % 2 === 1) {
        return 'male';
      }
      return 'female';
    },
  },
  methods: {
    ...mapGetters('documentsWizard', ['getCooperationType']),
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
    flex-wrap: wrap;
  }

  .divider {
    width: 100%;
    border: none;
    border-bottom: 1px solid #eee;
  }

  .section-title {
    font-size: 18px;
  }
}
</style>
