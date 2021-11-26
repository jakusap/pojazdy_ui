<template>
  <div class="navbar-routes">
    <div v-if="showPartnerRoutes">
      <MainPageRoute />
      <DriversRoute />
      <CarsRoute />
      <ServicePlansRoute />
    </div>
  </div>
</template>

<script>
import themeMixin from '@/mixins/themeMixin';
import { userIsPartner } from '@/utils/keycloak';

import CarsRoute from './routes/CarsRoute';
import DriversRoute from './routes/DriversRoute';
import MainPageRoute from './routes/MainPageRoute';
import ServicePlansRoute from './routes/ServicePlansRoute';

export default {
  components: {
    MainPageRoute,
    ServicePlansRoute,
    DriversRoute,
    CarsRoute,
  },
  mixins: [themeMixin],
  computed: {
    showPartnerRoutes() {
      return userIsPartner();
    },
    hasUserSelectedPartner() {
      const userInfo = this.getLoggedDriverInfo;
      return userInfo ? Boolean(userInfo.partnerUuid || userInfo.partnerDescription) : false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
