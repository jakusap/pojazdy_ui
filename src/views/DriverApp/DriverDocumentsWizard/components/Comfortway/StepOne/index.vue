<template>
  <fieldset class="fieldset">
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
        v-model="model.personalInformation.secondName"
        :placeholder="$t('DocumentsWizard.formLabels.secondName')"
        :tooltip="$t('DocumentsWizard.formLabels.secondName_tooltip')"
        name="stepOne.personalInformation.secondName"
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
        v-model="model.personalInformation.motherName"
        :placeholder="$t('DocumentsWizard.formLabels.motherName')"
        :tooltip="$t('DocumentsWizard.formLabels.motherName_tooltip')"
        name="stepOne.personalInformation.motherName"
        type="text"
      />
      <InputCustom
        v-model="model.personalInformation.fatherName"
        :placeholder="$t('DocumentsWizard.formLabels.fatherName')"
        :tooltip="$t('DocumentsWizard.formLabels.fatherName_tooltip')"
        name="stepOne.personalInformation.fatherName"
        type="text"
      />
    </div>
    <div class="form-row">
      <InputCustom
        v-model="model.personalInformation.birthPlace"
        :placeholder="$t('DocumentsWizard.formLabels.birthPlace')"
        :tooltip="$t('DocumentsWizard.formLabels.birthPlace_tooltip')"
        name="stepOne.personalInformation.birthPlace"
        type="text"
      />
      <InputCustomDatePicker
        v-model="model.personalInformation.birthDate"
        :placeholder="$t('DocumentsWizard.formLabels.birthDate')"
        :tooltip="$t('DocumentsWizard.formLabels.birthDate_tooltip')"
        name="stepOne.personalInformation.birthDate"
        icon-name="date"
      />
    </div>
    <div class="form-row">
      <InputCustom
        v-model="model.personalInformation.personalIdentityNumber"
        :placeholder="$t('DocumentsWizard.formLabels.personalIdentityNumber')"
        :tooltip="$t('DocumentsWizard.formLabels.personalIdentityNumber_tooltip')"
        name="stepOne.personalInformation.personalIdentityNumber"
        type="text"
      />
      <InputCustom
        v-model="model.personalInformation.identityCardNumber"
        :placeholder="$t('DocumentsWizard.formLabels.identityCardNumber')"
        :tooltip="$t('DocumentsWizard.formLabels.identityCardNumber_tooltip')"
        name="stepOne.personalInformation.identityCardNumber"
        type="text"
      />
    </div>

    <hr class="divider" />

    <p class="section-title">{{ $t('DocumentsWizard.formSections.address_section') }}</p>
    <div class="form-row">
      <SelectCustom
        v-model="model.address.city"
        :placeholder="$t('DocumentsWizard.formLabels.city')"
        :tooltip="$t('DocumentsWizard.formLabels.city_tooltip')"
        :options="cities"
        :remote-method="searchForSuggestions"
        remote
        name="stepOne.address.city"
        icon-name="location"
        clearable
        filterable
      />
      <InputCustom
        v-model="model.address.street"
        :placeholder="$t('DocumentsWizard.formLabels.street')"
        :tooltip="$t('DocumentsWizard.formLabels.street_tooltip')"
        name="stepOne.address.street"
        type="text"
      />
      <InputCustom
        v-model="model.address.postCode"
        :placeholder="$t('DocumentsWizard.formLabels.postCode')"
        :tooltip="$t('DocumentsWizard.formLabels.postCode_tooltip')"
        name="stepOne.address.postCode"
        type="text"
      />
    </div>
    <div class="form-row">
      <InputCustom
        v-model="model.address.houseNumber"
        :placeholder="$t('DocumentsWizard.formLabels.houseNumber')"
        :tooltip="$t('DocumentsWizard.formLabels.houseNumber_tooltip')"
        name="stepOne.address.houseNumber"
        type="text"
      />
      <InputCustom
        v-model="model.address.apartmentNumber"
        :placeholder="$t('DocumentsWizard.formLabels.apartmentNumber')"
        :tooltip="$t('DocumentsWizard.formLabels.apartmentNumber_tooltip')"
        name="stepOne.address.apartmentNumber"
        type="text"
      />
    </div>

    <div class="form-row">
      <InputCustom
        v-model="model.address.extendedInfo.voivodeship"
        :placeholder="$t('DocumentsWizard.formLabels.voivodeship')"
        :tooltip="$t('DocumentsWizard.formLabels.voivodeship_tooltip')"
        name="stepOne.address.voivodeship"
        type="text"
      />
      <InputCustom
        v-model="model.address.extendedInfo.county"
        :placeholder="$t('DocumentsWizard.formLabels.county')"
        :tooltip="$t('DocumentsWizard.formLabels.county_tooltip')"
        name="stepOne.address.county"
        type="text"
      />
    </div>
    <div class="form-row">
      <InputCustom
        v-model="model.address.extendedInfo.district"
        :placeholder="$t('DocumentsWizard.formLabels.district')"
        :tooltip="$t('DocumentsWizard.formLabels.district_tooltip')"
        name="stepOne.address.district"
        type="text"
      />
      <InputCustom
        v-model="model.address.extendedInfo.commune"
        :placeholder="$t('DocumentsWizard.formLabels.commune')"
        :tooltip="$t('DocumentsWizard.formLabels.commune_tooltip')"
        name="stepOne.address.commune"
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
  name: 'StepOne',
  components: { InputCustom, InputCustomDatePicker, SelectCustom },
  props: {
    model: Object,
  },
  computed: {
    cities() {
      return this.getSuggestionsCities().map((suggestion) => ({
        label: suggestion,
        value: suggestion,
      }));
    },
  },
  methods: {
    ...mapGetters('suggestions', ['getSuggestionsCities']),
    ...mapActions('suggestions', ['fetchSuggestionsCities']),
    searchForSuggestions: async function(query) {
      if (query != '') await this.fetchSuggestionsCities(query);
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
