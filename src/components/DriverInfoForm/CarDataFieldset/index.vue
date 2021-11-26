<template>
  <fieldset :class="['form-group', { 'dark-theme': darkTheme }]">
    <div class="form-group-header">
      <p class="form-group-title">{{ $t('DriverInfoForm.form_group_title_vehicle') }}</p>
      <InputCustomSwitch
        v-model="showSection.showVehicleSection"
        :active-text="$t('DriverInfoForm.show_section_label')"
        :inactive-text="$t('DriverInfoForm.hide_section_label')"
        :dark-theme="darkTheme"
      />
    </div>
    <transition name="slide-out">
      <div v-show="showSection.showVehicleSection" class="form-group-content">
        <div class="row-wrapper">
          <InputCustomRadio
            v-model="model.vehicleStatus"
            :options="vehicleStatusOptions"
            :dark-theme="darkTheme"
            name="carData.vehicleStatus"
            type="text"
            icon-name="s-tools"
            border
          />
        </div>
      </div>
    </transition>
  </fieldset>
</template>

<script>
import InputCustomRadio from '@/components/InputCustomRadio';
import InputCustomSwitch from '@/components/InputCustomSwitch';

export default {
  name: 'CarDataFieldset',
  components: { InputCustomSwitch, InputCustomRadio },
  props: {
    model: Object,
    showSection: Object,
    darkTheme: Boolean,
  },
  data: function() {
    return {
      vehicleStatusOptions: [
        { label: this.$t('DriverInfoForm.car.own'), value: 'OWN' },
        { label: this.$t('DriverInfoForm.car.rented'), value: 'RENTED' },
        { label: this.$t('DriverInfoForm.car.want_to_rent'), value: 'WANT_TO_RENT' },
      ],
    };
  },
};
</script>
