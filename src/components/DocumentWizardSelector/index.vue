<template>
  <div>
    <el-form>
      <p>{{ $t('DriverPartners.contract_label') }}</p>
      <InputCustomRadio
        v-model="selectedCooperationType"
        :options="filteredCooperationTypesContract"
        :dark-theme="true"
        name="cooperationType"
        type="text"
        border
      />
      <div v-if="filteredCooperationTypesLease.length > 0">
        <p>{{ $t('DriverPartners.lease_label') }}</p>
        <InputCustomRadio
          v-model="selectedCooperationType"
          :options="filteredCooperationTypesLease"
          :dark-theme="true"
          name="cooperationType"
          type="text"
          border
        />
      </div>
    </el-form>
    <el-button type="primary" class="fill-documents" @click="goFillDocumentsData()">{{
      $t('DriverDocuments.fill_documents_btn_label')
    }}</el-button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import InputCustomRadio from '@/components/InputCustomRadio';
import { AVALONLOGISTICS, QUICKAPPS } from '@/utils/referenced-partners';

export default {
  name: 'DocumentsWizardSelector',
  components: { InputCustomRadio },
  data() {
    return {
      selectedCooperationType: 'CIVIL_CONTRACT',
      cooperationTypesContract: [
        {
          label: this.$t('DriverPartners.civil_contract_radio_label'),
          value: 'CIVIL_CONTRACT',
          partnerCode: AVALONLOGISTICS,
        },
        {
          label: this.$t('DriverPartners.quick_apps_contract_radio_label'),
          value: 'CIVIL_CONTRACT',
          partnerCode: QUICKAPPS,
        },
        { label: this.$t('DriverPartners.b2b_contract_radio_label'), value: 'B2B', partnerCode: AVALONLOGISTICS },
      ],
      cooperationTypesLease: [
        {
          label: this.$t('DriverPartners.lease_vehicle_contract_radio_label'),
          value: 'LEASE_CONTRACT_CAR',
          partnerCode: AVALONLOGISTICS,
        },
        {
          label: this.$t('DriverPartners.lease_bike_contract_radio_label'),
          value: 'LEASE_CONTRACT_BIKE',
          partnerCode: AVALONLOGISTICS,
        },
      ],
    };
  },
  computed: {
    getPartnerCode() {
      const partnerUuid = this.getLoggedDriverInfo() && this.getLoggedDriverInfo().partnerUuid;
      return this.getPartnersList().find((ele) => ele.uuid == partnerUuid).code;
    },
    filteredCooperationTypesContract() {
      return this.cooperationTypesContract.filter((element) => {
        if (element.partnerCode === this.getPartnerCode) return element;
      });
    },
    filteredCooperationTypesLease() {
      return this.cooperationTypesLease.filter((element) => {
        if (element.partnerCode === this.getPartnerCode) return element;
      });
    },
  },
  methods: {
    ...mapActions('documentsWizard', ['setCooperationType']),
    ...mapGetters('partners', ['getPartnersList']),
    ...mapGetters('driverAccount', ['getLoggedDriverInfo']),

    goFillDocumentsData() {
      this.setCooperationType(this.selectedCooperationType);
      this.$router.push({ name: 'DriverDocumentsWizard' });
    },
  },
};
</script>

<style scoped></style>
