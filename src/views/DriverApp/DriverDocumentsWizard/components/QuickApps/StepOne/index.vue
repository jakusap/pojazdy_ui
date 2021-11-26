<template>
  <fieldset class="fieldset">
    <hr class="divider" />
    <p class="section-title">{{ $t('DocumentsWizard.formSections.personal_section') }}</p>
    <div class="form-row">
      <InputCustom
        v-model="model.personalInformation.firstName"
        :placeholder="$t('DocumentsWizard.formLabels.firstName')"
        :tooltip="$t('DocumentsWizard.formLabels.firstName_tooltip')"
        name="stepOne.personalInformation.firstName"
        type="text"
        disabled
      />
      <InputCustom
        v-model="model.personalInformation.lastName"
        :placeholder="$t('DocumentsWizard.formLabels.lastName')"
        :tooltip="$t('DocumentsWizard.formLabels.lastName_tooltip')"
        name="stepOne.personalInformation.lastName"
        type="text"
        disabled
      />
      <InputCustom
        v-model="model.personalInformation.identityCardNumber"
        :placeholder="$t('DocumentsWizard.formLabels.identityCardNumber')"
        :tooltip="$t('DocumentsWizard.formLabels.identityCardNumber_tooltip')"
        name="stepOne.personalInformation.identityCardNumber"
        type="text"
      />
    </div>
    <p class="section-title">{{ $t('DocumentsWizard.formSections.iban_section') }}</p>
    <hr class="divider" />
    <div class="form-row">
      <InputCustom
        v-model="model.paymentIban"
        :placeholder="$t('DocumentsWizard.formLabels.paymentIban')"
        :tooltip="$t('DocumentsWizard.formLabels.paymentIban_tooltip')"
        name="stepOne.paymentIban"
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
        name="stepOne.emailAddress"
        type="text"
        disabled
      />
      <InputCustom
        v-model="model.phoneNumber"
        :placeholder="$t('DocumentsWizard.formLabels.phone_number')"
        :tooltip="$t('DocumentsWizard.formLabels.phone_number_tooltip')"
        name="stepOne.phoneNumber"
        type="text"
      />
    </div>
  </fieldset>
</template>

<script>
import { mapGetters } from 'vuex';

import InputCustom from '@/components/InputCustom';

export default {
  name: 'StepOne',
  components: { InputCustom },
  props: {
    model: Object,
  },
  methods: {
    ...mapGetters('documentsWizard', ['getCooperationType']),
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
