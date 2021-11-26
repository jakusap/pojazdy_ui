<template>
  <el-form
    :ref="reference"
    v-loading="loading"
    :model="driverInfo"
    :rules="driverInfoFormRules"
    :disabled="disabled"
    class="driver-info-form"
    auto-complete="on"
    label-position="left"
    @submit.native.prevent
  >
    <ContactDataFieldset
      :model="driverInfo.contactData"
      :dark-theme="darkTheme"
      :show-company-tax-id="showCompanyTaxId"
    />
    <AddressDataFieldset
      v-if="isAvalonPartnerSet"
      :model="driverInfo.contactData"
      :dark-theme="darkTheme"
      :parent="'contactData'"
    />
    <CarDataFieldset
      v-if="!isAvalonReferenced"
      :model="driverInfo.carData"
      :show-section="showSection"
      :dark-theme="darkTheme"
    />
    <ActivityDataFieldset
      v-if="!isAvalonReferenced"
      :model="driverInfo.activityData"
      :show-section="showSection"
      :dark-theme="darkTheme"
    />
    <CitiesDataFieldset
      v-if="!isAvalonPartnerSet"
      :model="driverInfo.citiesData"
      :dark-theme="darkTheme"
      :avalon-form="isAvalonReferenced"
    />
    <p v-if="isAvalonReferenced" :class="['share-personal-info-data', { 'dark-theme': darkTheme }]">
      {{ $t('DriverInfoForm.information_about_sharing_personal_data_for_avalon') }}
    </p>
  </el-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { checkNip, validatePostCode } from '@/validators';

import ActivityDataFieldset from './ActivityDataFieldset';
import AddressDataFieldset from './AddressDataFieldset';
import CarDataFieldset from './CarDataFieldset';
import CitiesDataFieldset from './CitiesDataFieldset';
import ContactDataFieldset from './ContactDataFieldset';

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
  name: 'DriverInfoForm',
  components: {
    AddressDataFieldset,
    ContactDataFieldset,
    CarDataFieldset,
    ActivityDataFieldset,
    CitiesDataFieldset,
  },
  props: {
    reference: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    darkTheme: Boolean,
    showCompanyTaxId: Boolean,
  },
  data() {
    return {
      loading: true,
      driverInfo: {
        contactData: {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          companyTaxId: '',
          address: {
            id: null,
            city: '',
            borough: {
              name: '',
              terc: null,
            },
            street: '',
            houseNumber: '',
            postCode: '',
            apartmentNumber: '',
          },
        },
        carData: {
          vehicleStatus: 'UNKNOWN',
        },
        activityData: {
          driverStatus: 'UNKNOWN',
          drivingType: null,
          partner: '',
          providers: [],
        },
        citiesData: {
          cities: [],
          newsletterSubscription: false,
        },
      },
      isValid: false,
      showSection: {
        showActivitySection: true,
        showVehicleSection: true,
      },
      driverInfoFormRules: {
        contactData: {
          firstName: [
            {
              required: true,
              message: this.$t('DriverInfoForm.input_error_message_first_name'),
              trigger: 'blur',
            },
            {
              min: 1,
              max: 150,
              message: this.$t('DriverInfoForm.input_error_message_max_150_signs'),
              trigger: 'change',
            },
          ],
          lastName: [
            { required: true, message: this.$t('DriverInfoForm.input_error_message_last_name'), trigger: 'blur' },
            {
              min: 1,
              max: 150,
              message: this.$t('DriverInfoForm.input_error_message_max_50_signs'),
              trigger: 'change',
            },
          ],
          phoneNumber: [
            {
              min: 1,
              max: 50,
              message: this.$t('DriverInfoForm.input_error_message_max_50_signs'),
              trigger: 'change',
            },
          ],
          companyTaxId: [
            {
              validator: checkNip,
              trigger: 'change',
            },
          ],
          address: {
            city: [{ validator: this.validateCity, trigger: 'change' }],
            postCode: [{ allowEmpty: true, validator: validatePostCode, trigger: 'blur' }],
          },
        },
        activityData: {
          partner: [
            {
              min: 1,
              max: 150,
              message: this.$t('DriverInfoForm.input_error_message_max_150_signs'),
              trigger: 'change',
            },
          ],
        },
      },
    };
  },
  computed: {
    ...mapGetters('driverAccount', ['referencedPartner']),
    ...mapGetters('partners', ['getPartnersList']),

    isAvalonReferenced() {
      const partnerUuid = this.referencedPartner?.uuid;
      const partners = this.getPartnersList;
      const code = partners.find((e) => e.uuid === partnerUuid)?.code;
      return ['AVALONLOGISTICS', 'QUICKAPPS'].includes(code);
    },
    isAvalonPartnerSet() {
      const partnerUuid = this.driverInfo.activityData.partner;
      const partners = this.getPartnersList;
      return partners.find((e) => e.uuid === partnerUuid)?.code === 'AVALONLOGISTICS';
    },
  },
  watch: {
    driverInfo: {
      deep: true,
      handler: function() {
        this.isFormValid();
        this.formUpdated();
      },
    },
    isValid: function() {
      this.formUpdated();
    },
  },
  created: async function() {
    this.loading = true;
    if (this.getLoggedDriverInfo()) {
      this.setInitialData();
      this.loading = false;
      await this.fetchLoggedDriverInfo();
      await this.fetchPartnersList();
      await this.fetchAllProviders(true);
    } else {
      await this.fetchLoggedDriverInfo();
      await this.fetchPartnersList();
      await this.fetchAllProviders(true);
      this.setInitialData();
      this.loading = false;
    }
  },
  methods: {
    ...mapActions('providers', ['fetchAllProviders']),
    ...mapActions('partners', ['fetchPartnersList']),
    ...mapActions('driverAccount', ['fetchLoggedDriverInfo']),
    ...mapGetters('driverAccount', ['getLoggedDriverInfo']),
    isFormValid: function() {
      this.$refs[this.reference].validate((valid) => (this.isValid = valid));
    },
    formUpdated: function() {
      this.$emit('formUpdate', {
        data: this.driverInfo,
        valid: this.isValid,
        sections: this.showSection,
        initialState: {
          INITIAL_ACTIVITY_STATE,
          INITIAL_CAR_STATE,
        },
      });
    },
    setDriverInfoIfReferencedPartner: function() {
      if (this.referencedPartner) {
        this.driverInfo.activityData.driverStatus = 'ACTIVE';
        this.driverInfo.activityData.drivingType = 'WITH_PARTNER';
        this.driverInfo.activityData.partner = this.referencedPartner.uuid;
      }
    },
    setInitialData: function() {
      const {
        firstName,
        lastName,
        phoneNumber,
        email,
        companyTaxId,
        vehicleStatus,
        driverStatus,
        drivingType,
        partnerUuid,
        partnerDescription,
        providers,
        cities,
        newsletterSubscription,
        address,
      } = this.getLoggedDriverInfo();

      this.driverInfo = {
        contactData: {
          firstName: firstName || '',
          lastName: lastName || '',
          phoneNumber: phoneNumber || '',
          email: email || '',
          companyTaxId: companyTaxId || '',
          address: {
            id: address?.id,
            city: address?.city,
            borough: {
              name: address?.borough?.name,
              terc: address?.borough?.terc,
            },
            street: address?.street,
            houseNumber: address?.houseNumber,
            postCode: address?.postCode,
            apartmentNumber: address?.apartmentNumber,
          },
        },
        carData: {
          vehicleStatus: vehicleStatus || 'UNKNOWN',
        },
        activityData: {
          driverStatus: driverStatus || 'UNKNOWN',
          drivingType: drivingType || null,
          partner: partnerUuid || partnerDescription,
          providers: providers ? this.prepareProviders(providers) : [],
        },
        citiesData: {
          cities: cities || [],
          newsletterSubscription: newsletterSubscription || false,
        },
      };
      this.setDriverInfoIfReferencedPartner();
    },
    prepareProviders: function(providers) {
      return providers.map((e) => e.providerCode);
    },
    validateCity: function(rule, value, callback) {
      if (!value && this.driverInfo.contactData.address.borough.terc) {
        callback(new Error(this.$t('DriverInfoForm.input_error_message_city')));
      } else {
        callback();
      }
    },
  },
};
</script>

<style lang="scss">
@import './driverFormStyles.scss';
</style>

<style lang="scss" scoped>
.driver-info-form {
  position: relative;
  width: 100%;
  max-width: 650px;
}
</style>
