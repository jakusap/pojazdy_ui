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
    <div class="form-row">
      <InputCustom
        v-model="model.taxInformation.taxIdentificationNumber"
        :placeholder="$t('DocumentsWizard.formLabels.taxIdentificationNumber')"
        :tooltip="$t('DocumentsWizard.formLabels.taxIdentificationNumber_tooltip')"
        name="stepThree.taxInformation.taxIdentificationNumber"
        type="text"
      />
      <InputCustom
        v-if="isB2BCooperationType"
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

    <hr class="divider" />

    <div v-if="!model.taxInformation.correspondenceAddress">
      <div class="form-row">
        <SelectCustom
          v-model="model.correspondenceAddress.city"
          :placeholder="$t('DocumentsWizard.formLabels.city')"
          :options="cities"
          :remote-method="searchForSuggestions"
          remote
          name="stepThree.correspondenceAddress.city"
          icon-name="location"
          clearable
          filterable
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

    <p class="section-title">{{ $t('DocumentsWizard.formSections.statements_section') }}</p>
    <div class="form-row">
      <div class="with_label">
        <span class="label">{{ $t('DocumentsWizard.formSections.statements_label_retired_type') }}</span>
        <SelectCustom
          v-model="model.taxInformation.statements.retiredType"
          :placeholder="$t('DocumentsWizard.formLabels.statements')"
          :tooltip="$t('DocumentsWizard.formLabels.statements_tooltip')"
          :options="createOptions(['RETIRED_OR_PENSIONER'], defaultOption)"
          remote
          name="stepThree.taxInformation.statements.retiredType"
          clearable
          filterable
        />
      </div>
      <div class="with_label">
        <span class="label">{{ $t('DocumentsWizard.formSections.statements_label_disability') }}</span>
        <SelectCustom
          v-model="model.taxInformation.statements.disability"
          :placeholder="$t('DocumentsWizard.formLabels.statements')"
          :tooltip="$t('DocumentsWizard.formLabels.statements_tooltip')"
          :options="createOptions(['DISABILITY_DEGREE'], defaultOption)"
          remote
          name="stepThree.taxInformation.statements.disability"
          clearable
          filterable
        />
      </div>
    </div>

    <div class="form-row">
      <div class="with_label">
        <span class="label">{{ $t('DocumentsWizard.formSections.statements_label_status') }}</span>
        <CheckList
          v-model="model.taxInformation.statements.status"
          :options="createOptions(['TAX_DECLARATION'])"
          name="stepThree.taxInformation.statements.status"
        />
      </div>
    </div>
  </fieldset>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import InputCustom from '@/components/InputCustom';
import InputCustomCheckbox from '@/components/InputCustomCheckbox';
import SelectCustom from '@/components/SelectCustom';

import CheckList from '../../CheckList';

export default {
  name: 'StepThree',
  components: { InputCustom, InputCustomCheckbox, SelectCustom, CheckList },
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
    cities() {
      return this.getSuggestionsCities().map((suggestion) => ({
        label: suggestion,
        value: suggestion,
      }));
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
    border-bottom: 1px solid var(--light-gray-border);
  }

  .section-title {
    font-size: 18px;
  }
}
</style>
