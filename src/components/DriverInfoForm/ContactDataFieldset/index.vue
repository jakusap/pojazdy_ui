<template>
  <fieldset :class="['form-group', { 'dark-theme': darkTheme }]">
    <div class="form-group-header">
      <p class="form-group-title">{{ $t('DriverInfoForm.form_group_title_contact_data') }}</p>
    </div>
    <div class="form-group-content">
      <div class="row-wrapper">
        <InputCustom
          v-model="model.firstName"
          :placeholder="`${$t('DriverInfoForm.input_placeholder_first_name')}*`"
          :dark-theme="darkTheme"
          name="contactData.firstName"
          type="text"
          icon-name="user-solid"
        />
        <InputCustom
          v-model="model.lastName"
          :placeholder="`${$t('DriverInfoForm.input_placeholder_last_name')}*`"
          :dark-theme="darkTheme"
          name="contactData.lastName"
          type="text"
          icon-name="user-solid"
        />
      </div>
      <InputCustom
        v-model="model.phoneNumber"
        :placeholder="$t('DriverInfoForm.input_placeholder_phone_number')"
        :dark-theme="darkTheme"
        name="contactData.phoneNumber"
        type="text"
        icon-name="phone"
      />
      <InputCustom
        v-if="model.email"
        v-model="model.email"
        :placeholder="$t('DriverInfoForm.input_placeholder_email')"
        :dark-theme="darkTheme"
        :disabled="true"
        name="contactData.email"
        type="text"
        icon-name="message"
      />
      <InputCustom
        v-if="showCompanyTaxId"
        v-model="model.companyTaxId"
        :placeholder="$t('DriverInfoForm.input_placeholder_company_tax_id')"
        :dark-theme="darkTheme"
        name="contactData.companyTaxId"
        type="number"
        icon-name="office-building"
      />
    </div>
  </fieldset>
</template>

<script>
import InputCustom from '@/components/InputCustom';

export default {
  name: 'ContactDataFieldset',
  components: {
    InputCustom,
  },
  props: {
    model: Object,
    darkTheme: Boolean,
    showCompanyTaxId: Boolean,
  },
};
</script>

<style lang="scss" scoped></style>
