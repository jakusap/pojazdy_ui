<template>
  <fieldset class="fieldset">
    <div>
      <p class="section-title">
        {{ $t('DocumentsWizard.formSections.address_section') }}
      </p>
    </div>
    <div class="form-row">
      <InputCustom
        v-model="model.address.city"
        :placeholder="$t('DocumentsWizard.formLabels.city')"
        :tooltip="$t('DocumentsWizard.formLabels.city_tooltip')"
        name="stepTwo.address.city"
        icon-name="location"
        type="text"
      />
      <InputCustom
        v-model="model.address.street"
        :placeholder="$t('DocumentsWizard.formLabels.street')"
        :tooltip="$t('DocumentsWizard.formLabels.street_tooltip')"
        name="stepTwo.address.street"
        type="text"
      />
      <InputCustom
        v-model="model.address.postCode"
        :placeholder="$t('DocumentsWizard.formLabels.postCode')"
        :tooltip="$t('DocumentsWizard.formLabels.postCode_tooltip')"
        name="stepTwo.address.postCode"
        type="text"
      />
    </div>
    <div class="form-row">
      <InputCustom
        v-model="model.address.houseNumber"
        :placeholder="$t('DocumentsWizard.formLabels.houseNumber')"
        :tooltip="$t('DocumentsWizard.formLabels.houseNumber_tooltip')"
        name="stepTwo.address.houseNumber"
        type="text"
      />
      <InputCustom
        v-model="model.address.apartmentNumber"
        :placeholder="$t('DocumentsWizard.formLabels.apartmentNumber')"
        :tooltip="$t('DocumentsWizard.formLabels.apartmentNumber_tooltip')"
        name="stepTwo.address.apartmentNumber"
        type="text"
      />
    </div>
  </fieldset>
</template>

<script>
import InputCustom from '@/components/InputCustom';

export default {
  name: 'StepTwo',
  components: { InputCustom },
  props: {
    model: Object,
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
