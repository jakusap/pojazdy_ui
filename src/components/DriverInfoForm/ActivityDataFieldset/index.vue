<template>
  <fieldset :class="['form-group', { 'dark-theme': darkTheme }]">
    <div class="form-group-header">
      <p class="form-group-title">{{ $t('DriverInfoForm.form_group_title_activity') }}</p>
      <InputCustomSwitch
        v-model="showSection.showActivitySection"
        :dark-theme="darkTheme"
        :active-text="$t('DriverInfoForm.show_section_label')"
        :inactive-text="$t('DriverInfoForm.hide_section_label')"
        :disabled="isReferencedAccount"
      />
    </div>
    <div v-show="showSection.showActivitySection" class="form-group-content">
      <div class="row-wrapper">
        <InputCustomRadio
          v-model="model.driverStatus"
          :model-value="model.driverStatus"
          :options="driverStatusOptions"
          :dark-theme="darkTheme"
          :disabled="isReferencedAccount"
          name="activityData.driverStatus"
          type="text"
          icon-name="s-tools"
          border
        />
      </div>
      <InputCustomRadio
        v-show="showExtendedActivity"
        key="1"
        v-model="model.drivingType"
        :options="drivingTypeOptions"
        :dark-theme="darkTheme"
        :disabled="isReferencedAccount"
        custom-class="radio-group"
        name="activityData.drivingType"
        type="text"
        border
      />
      <div v-show="showPartnersInput" key="2">
        <SelectCustom
          v-model="model.partner"
          :placeholder="$t('DriverInfoForm.input_placeholder_partner')"
          :options="partnersList"
          :dark-theme="darkTheme"
          :disabled="isReferencedAccount"
          allow-create
          filterable
          clearable
          name="activityData.partner"
          icon-name="s-comment"
        />
        <p :class="['share-personal-info-data', { 'dark-theme': darkTheme }]">
          {{ $t('DriverInfoForm.information_about_sharing_personal_data') }}
        </p>
      </div>

      <InputCustomCheckbox
        v-show="showExtendedActivity"
        key="3"
        v-model="model.providers"
        :options="providersOptions"
        :dark-theme="darkTheme"
        name="activityData.providers"
        type="text"
        icon-name="s-custom"
        border
      />
    </div>
  </fieldset>
</template>

<script>
import { mapGetters } from 'vuex';

import InputCustomCheckbox from '@/components/InputCustomCheckbox';
import InputCustomRadio from '@/components/InputCustomRadio';
import InputCustomSwitch from '@/components/InputCustomSwitch';
import SelectCustom from '@/components/SelectCustom';

export default {
  name: 'ActivityDataFieldset',
  components: { InputCustomRadio, InputCustomCheckbox, SelectCustom, InputCustomSwitch },
  props: {
    model: Object,
    showSection: Object,
    darkTheme: Boolean,
  },
  data: function() {
    return {
      driverStatusOptions: [
        { label: this.$t('DriverInfoForm.activity.unknown'), value: 'UNKNOWN' },
        { label: this.$t('DriverInfoForm.activity.active'), value: 'ACTIVE' },
        { label: this.$t('DriverInfoForm.activity.plan_to'), value: 'PLAN_TO' },
      ],
      drivingTypeOptions: [
        { label: this.$t('DriverInfoForm.activity.self'), value: 'SELF' },
        { label: this.$t('DriverInfoForm.activity.with_partner'), value: 'WITH_PARTNER' },
      ],
    };
  },
  computed: {
    ...mapGetters('driverAccount', ['referencedPartner']),
    showExtendedActivity: function() {
      return this.model.driverStatus != 'UNKNOWN';
    },
    showPartnersInput: function() {
      const { driverStatus, drivingType } = this.model;
      return drivingType == 'WITH_PARTNER' && driverStatus != 'UNKNOWN';
    },
    providersOptions: function() {
      const providers = this.getAvailableProviders();
      return providers.map((provider) => {
        return {
          label: provider.displayName,
          value: provider.providerCode,
        };
      });
    },
    partnersList: function() {
      return this.getPartnersList().map((partner) => {
        return {
          label: partner.name,
          value: partner.uuid,
        };
      });
    },
    isReferencedAccount: function() {
      return this.referencedPartner != null;
    },
  },
  methods: {
    ...mapGetters('providers', ['getAvailableProviders']),
    ...mapGetters('partners', ['getPartnersList']),
  },
};
</script>
