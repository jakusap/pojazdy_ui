<template>
  <fieldset class="fieldset">
    <p class="section-title">{{ $t('DocumentsWizard.formSections.tax_section') }}</p>
    <div class="form-row">
      <SelectCustom
        v-model="model.taxInformation.nationalHealthFund"
        :placeholder="$t('DocumentsWizard.formLabels.nationalHealthFund')"
        :tooltip="$t('DocumentsWizard.formLabels.nationalHealthFund_tooltip')"
        :options="createOptions(['NATIONAL_HEALTH_FOUND'])"
        remote
        name="stepThree.taxInformation.nationalHealthFund"
        icon-name="first-aid-kit"
        clearable
        filterable
      />
    </div>
    <div class="form-row">
      <SelectCustom
        v-model="model.taxInformation.taxOffice"
        :placeholder="$t('DocumentsWizard.formLabels.taxOffice')"
        :tooltip="$t('DocumentsWizard.formLabels.taxOffice_tooltip')"
        :options="createOptions(['TAX_OFFICE'])"
        remote
        name="stepThree.taxInformation.taxOffice"
        icon-name="add-location"
        clearable
        filterable
      />
    </div>
    <div v-if="isB2BCooperationType" class="form-row">
      <InputCustom
        v-model="model.taxInformation.taxIdentificationNumber"
        :placeholder="$t('DocumentsWizard.formLabels.taxIdentificationNumber')"
        :tooltip="$t('DocumentsWizard.formLabels.taxIdentificationNumber_tooltip')"
        name="stepThree.taxInformation.taxIdentificationNumber"
        type="text"
      />
      <InputCustom
        v-model="model.taxInformation.regon"
        :placeholder="$t('DocumentsWizard.formLabels.regon')"
        :tooltip="$t('DocumentsWizard.formLabels.regon_tooltip')"
        name="stepThree.taxInformation.regon"
        type="text"
      />
    </div>

    <div class="form-row">
      <InputCustomCheckbox
        v-model="model.taxInformation.correspondenceAddress"
        :label="$t('DocumentsWizard.formLabels.correspondenceAddress')"
        :tooltip="$t('DocumentsWizard.formLabels.correspondenceAddress_tooltip')"
        name="stepThree.taxInformation.correspondenceAddress"
        border
      />
    </div>

    <div v-if="!model.taxInformation.correspondenceAddress">
      <div class="form-row">
        <InputCustom
          v-model="model.correspondenceAddress.city"
          :placeholder="$t('DocumentsWizard.formLabels.city')"
          name="stepThree.correspondenceAddress.city"
          :tooltip="$t('DocumentsWizard.formLabels.city_tooltip')"
          icon-name="location"
          type="text"
        />
        <InputCustom
          v-model="model.correspondenceAddress.street"
          :placeholder="$t('DocumentsWizard.formLabels.street')"
          name="stepThree.correspondenceAddress.street"
          type="text"
        />
        <InputCustom
          v-model="model.correspondenceAddress.postCode"
          :placeholder="$t('DocumentsWizard.formLabels.postCode')"
          name="stepThree.correspondenceAddress.postCode"
          type="text"
          @input="formatPostCode"
        />
      </div>
      <div class="form-row">
        <InputCustom
          v-model="model.correspondenceAddress.houseNumber"
          :placeholder="$t('DocumentsWizard.formLabels.houseNumber')"
          name="stepThree.correspondenceAddress.houseNumber"
          type="text"
        />
        <InputCustom
          v-model="model.correspondenceAddress.apartmentNumber"
          :placeholder="$t('DocumentsWizard.formLabels.apartmentNumber')"
          name="stepThree.correspondenceAddress.apartmentNumber"
          type="text"
        />
      </div>
    </div>

    <hr class="divider" />
    <p class="section-title">{{ $t('DocumentsWizard.formSections.statements_label_status') }}</p>

    <StatementsSection
      :tax-information="model.taxInformation"
      :check-list-options="createOptions(['TAX_DECLARATION_AVALON'])"
      :disability-options="createOptions(['DISABILITY_DEGREE'])"
      :retired-options="createOptions(['RETIRED_OR_PENSIONER'])"
    />
  </fieldset>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import InputCustom from '@/components/InputCustom';
import InputCustomCheckbox from '@/components/InputCustomCheckbox';
import SelectCustom from '@/components/SelectCustom';

import StatementsSection from './StatementsSection';

export default {
  name: 'StepThree',
  components: { InputCustom, InputCustomCheckbox, SelectCustom, StatementsSection },
  props: {
    model: Object,
  },
  computed: {
    defaultOption() {
      return {
        label: this.$t('DocumentsWizard.formLabels.statements_default_option_label'),
        value: null,
      };
    },
    isB2BCooperationType() {
      return this.getCooperationType() === 'B2B';
    },
  },
  methods: {
    ...mapGetters('suggestions', ['getDictionaries', 'getSuggestionsCities']),
    ...mapActions('suggestions', ['fetchSuggestionsCities']),
    ...mapGetters('documentsWizard', ['getCooperationType']),
    searchForSuggestions: async function(query) {
      if (query != '') await this.fetchSuggestionsCities(query);
    },
    createOptions(category, defaultOption = null) {
      const options = this.getDictionaries()
        .filter((e) => e.isActive && category.includes(e.category))
        .map((e) => ({ label: e.content, value: e.categoryCode }));
      return defaultOption ? [defaultOption, ...options] : options;
    },
    formatPostCode() {
      const postCode = this.$props.model.correspondenceAddress.postCode;
      if (postCode.length === 5 && postCode.match(/^\b([0-9]{5})\b/)) {
        this.$props.model.correspondenceAddress.postCode = postCode.substring(0, 2) + '-' + postCode.substring(2);
      }
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
    flex-wrap: wrap;

    .with_label {
      display: flex;
      flex: 1;
      flex-direction: column;

      .label {
        margin-left: 11px;
        font-size: 14px;
        margin-bottom: 4px;
      }
    }
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
