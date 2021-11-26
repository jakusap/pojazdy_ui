<template>
  <div class="add-driver-account-container">
    <div class="title-container">
      <h3 class="title">{{ $t('AddDriverAccount.title') }}</h3>
    </div>

    <DriverInfoForm
      reference="addDriverAccount"
      :dark-theme="darkTheme"
      :show-company-tax-id="false"
      @formUpdate="formUpdate"
    />

    <div class="add-button-wrapper">
      <el-button type="primary" class="add-driver-account-button" @click.native.prevent="handleAddDriverAccount">
        {{ $t('AddDriverAccount.button_label') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import DriverInfoForm from '@/components/DriverInfoForm';

const INITIAL_ACTIVITY_STATE = {
  driverStatus: 'UNKNOWN',
  drivingType: null,
  partner: '',
  providers: [],
};

const INITIAL_CAR_STATE = {
  vehicleStatus: 'UNKNOWN',
};

export default {
  name: 'AddDriverAccount',
  components: {
    DriverInfoForm,
  },
  data: function() {
    return {
      addDriverAccount: {},
      darkTheme: true,
    };
  },
  computed: {
    ...mapGetters('providers', ['getSelectedProviders']),
    ...mapGetters('driverAccount', ['referencedPartner']),
    ...mapGetters('partners', ['getPartnersList']),
  },
  methods: {
    ...mapActions('driverAccount', ['saveDriverInfo', 'fetchLoggedDriverInfo']),
    ...mapGetters('driverAccount', ['getSaveDriverInfo']),
    handleAddDriverAccount: async function() {
      const { valid } = this.addDriverAccount;
      if (valid) {
        await this.saveDriverInfo(this.prepareAddDriverAccountData());
        if (this.getSaveDriverInfo().status == 200) {
          await this.fetchLoggedDriverInfo();
          this.$router.push({ name: 'RoleRedirect' });
          this.$message({ type: 'success', message: this.$t('AddDriverAccount.success_message'), center: true });
        } else {
          this.$message({ type: 'error', message: this.$t('AddDriverAccount.error_message'), center: true });
        }
      }
    },
    formUpdate: function(data) {
      this.addDriverAccount = data;
      const partnerUuid = data.data.activityData.partner;
      const partners = this.getPartnersList;
      this.darkTheme = partners.find((e) => e.uuid === partnerUuid)?.code !== 'AVALONLOGISTICS';
    },
    prepareAddDriverAccountData: function() {
      const { carData, activityData, citiesData, contactData } = this.addDriverAccount.data;
      const { partner, providers } = activityData;
      const { showActivitySection, showVehicleSection } = this.addDriverAccount.sections;
      const regex = new RegExp(`[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}`);
      const isUUID = regex.test(partner);
      const carDataPrepared = showVehicleSection ? carData : INITIAL_CAR_STATE;
      const activityDataPrepared = showActivitySection ? activityData : INITIAL_ACTIVITY_STATE;
      const selectedProviders = this.getSelectedProviders(providers);
      const referenceId = this.referencedPartner && this.referencedPartner.uuid;
      return {
        ...carDataPrepared,
        ...activityDataPrepared,
        ...citiesData,
        ...contactData,
        providers: selectedProviders,
        partnerUuid: isUUID ? partner : '',
        partnerDescription: !isUUID ? partner : '',
        referenceId,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.add-driver-account-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  width: 100%;
  background: var(--brand-gray-background);
  overflow: hidden;
  padding: 16px 0;
  .title-container {
    .title {
      font-size: 26px;
      color: var(--brand-gray-color);
      margin: 0px auto 24px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .add-button-wrapper {
    display: flex;
    justify-content: center;
    .add-driver-account-button {
      width: 250px;
      font-weight: bold;
      font-size: 16px;
    }
  }
}
@media screen and (max-width: 650px) {
  .add-driver-account-container {
    padding: 16px 0;
  }
}
</style>
