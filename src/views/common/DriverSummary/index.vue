<template>
  <component
    :is="driverComponent"
    v-if="variant"
    v-loading="loading"
    :partner-mode="!tokenUUID"
    :details="details"
    :driver="driver"
  />
</template>

<script>
import { getDriver } from '@/api/driversApi.js';
import { getDriverSummary } from '@/api/notificationsApi.js';
import ADriver from '@/views/PartnerApp/PartnerTransactions/partner/ADriver';
import BDriver from '@/views/PartnerApp/PartnerTransactions/partner/BDriver';
import CDriver from '@/views/PartnerApp/PartnerTransactions/partner/CDriver';
import DDriver from '@/views/PartnerApp/PartnerTransactions/partner/DDriver';

export default {
  name: 'DriverSummary',
  components: {
    ADriver,
    BDriver,
    CDriver,
    DDriver,
  },
  props: {
    tokenUUID: {
      type: String,
    },
    driverUUID: {
      type: String,
    },
  },
  data() {
    return {
      details: {},
      driver: {},
      loading: false,
    };
  },
  computed: {
    driverComponent() {
      switch (this.variant) {
        case 'B':
          return BDriver;
        case 'C':
          return CDriver;
        case 'D':
          return DDriver;
        default:
          return ADriver;
      }
    },
    variant() {
      return this.details.variant || null;
    },
  },
  async created() {
    this.loading = true;
    await this.getDetails();
    this.loading = false;
  },
  methods: {
    async getDetails() {
      let result;
      if (this.driverUUID) {
        result = await getDriver(this.driverUUID);
        this.driver = result.data;
      }
      result = await getDriverSummary(this.tokenUUID);
      this.details = result.data;

      if (this.$route.name === 'DriverSummary' && !result.ok) {
        this.$router.push('/404');
      }
    },
  },
};
</script>
