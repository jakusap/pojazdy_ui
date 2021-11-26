<template>
  <fieldset class="fieldset">
    <p v-if="getCooperationType === 'LEASE_CONTRACT_BIKE'" class="section-title">
      {{ $t('DocumentsWizard.formSections.bike_section') }}
    </p>
    <p v-else class="section-title">
      {{ $t('DocumentsWizard.formSections.vehicle_section') }}
    </p>
    <div class="form-row">
      <InputCustom
        v-model="model.mark"
        :placeholder="$t('DocumentsWizard.formLabels.mark')"
        :tooltip="$t('DocumentsWizard.formLabels.mark_tooltip')"
        name="vehicleStep.mark"
        type="text"
      />
      <InputCustom
        v-model="model.model"
        :placeholder="$t('DocumentsWizard.formLabels.model')"
        :tooltip="$t('DocumentsWizard.formLabels.model_tooltip')"
        name="vehicleStep.model"
        type="text"
      />
    </div>
    <div class="form-row">
      <InputCustom
        v-model="model.productionYear"
        :placeholder="$t('DocumentsWizard.formLabels.productionYear')"
        :tooltip="$t('DocumentsWizard.formLabels.productionYear_tooltip')"
        name="vehicleStep.productionYear"
        type="text"
      />
      <InputCustom
        v-if="getCooperationType === 'LEASE_CONTRACT_BIKE'"
        v-model="model.frameNumber"
        :placeholder="$t('DocumentsWizard.formLabels.frameNumber')"
        :tooltip="$t('DocumentsWizard.formLabels.frameNumber_tooltip')"
        name="vehicleStep.frameNumber"
        type="text"
      />
      <InputCustom
        v-else
        v-model="model.registrationNumber"
        :placeholder="$t('DocumentsWizard.formLabels.registrationNumber')"
        :tooltip="$t('DocumentsWizard.formLabels.registrationNumber_tooltip')"
        name="vehicleStep.registrationNumber"
        type="text"
      />
    </div>
  </fieldset>
</template>

<script>
import { mapGetters } from 'vuex';

import InputCustom from '@/components/InputCustom';

export default {
  name: 'VehicleStep',
  components: { InputCustom },
  props: {
    model: Object,
  },
  computed: {
    ...mapGetters('documentsWizard', ['getCooperationType']),
  },
};
</script>

<style scoped lang="scss">
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
