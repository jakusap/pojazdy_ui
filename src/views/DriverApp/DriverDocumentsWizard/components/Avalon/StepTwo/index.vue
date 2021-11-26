<template>
  <fieldset class="fieldset">
    <p class="section-title">{{ $t('DocumentsWizard.formSections.iban_section') }}</p>
    <div class="form-row">
      <InputCustom
        v-model="model.paymentIban"
        :placeholder="$t('DocumentsWizard.formLabels.paymentIban')"
        :tooltip="$t('DocumentsWizard.formLabels.paymentIban_tooltip')"
        name="stepTwo.paymentIban"
        type="text"
        @blur="formatIban"
      />
    </div>
    <p class="section-title">{{ $t('DocumentsWizard.formSections.contact_section') }}</p>
    <div class="form-row">
      <InputCustom
        v-model="model.emailAddress"
        :placeholder="$t('DocumentsWizard.formLabels.email_address')"
        :tooltip="$t('DocumentsWizard.formLabels.email_address_tooltip')"
        name="stepTwo.emailAddress"
        type="text"
        disabled
      />
      <InputCustom
        v-model="model.phoneNumber"
        :placeholder="$t('DocumentsWizard.formLabels.phone_number')"
        :tooltip="$t('DocumentsWizard.formLabels.phone_number_tooltip')"
        name="stepTwo.phoneNumber"
        type="text"
      />
    </div>

    <hr class="divider" />
    <div>
      <p class="section-title">
        {{ $t('DocumentsWizard.formSections.address_section') }}
      </p>
    </div>
    <AddressDataFieldset :model="model" :dark-theme="false" :parent="'stepTwo'" />
  </fieldset>
</template>

<script>
import { mapGetters } from 'vuex';

import AddressDataFieldset from '@/components/DriverInfoForm/AddressDataFieldset';
import InputCustom from '@/components/InputCustom';

export default {
  name: 'StepTwo',
  components: { AddressDataFieldset, InputCustom },
  props: {
    model: Object,
  },
  methods: {
    ...mapGetters('suggestions', ['getDictionaries']),
    createOptions(category, defaultOption = null) {
      const options = this.getDictionaries()
        .filter((e) => e.isActive && category.includes(e.category))
        .map((e) => ({ label: e.content, value: e.categoryCode }));
      return defaultOption ? [defaultOption, ...options] : options;
    },
    formatIban() {
      const iban = this.$props.model.paymentIban;
      this.$props.model.paymentIban = iban.replace(/ /g, '').replace(/-/g, '');
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

    &.half-width {
      width: 50%;
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
