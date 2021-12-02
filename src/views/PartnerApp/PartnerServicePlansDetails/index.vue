<template>
  <div class="container">
    <el-row :gutter="16">
      <el-col :sm="6">
        <ServicePlanDetails />
      </el-col>
      <el-col :sm="18">
        <ServicePlanCars />
      </el-col>
    </el-row>
    <ServicePlanEvents />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import ServicePlanCars from './components/ServicePlanCars';
import ServicePlanDetails from './components/ServicePlanDetails';
import ServicePlanEvents from './components/ServicePlanEvents';
import servicePlansDetailsStore from './store/servicePlansDetailsStore';

export default {
  components: { ServicePlanDetails, ServicePlanEvents, ServicePlanCars },
  computed: {
    ...mapGetters('servicePlansDetailsStore', ['reloadServicePlanCars']),
    servicePlanId() {
      return String(this.$route.params.servicePlanId);
    },
  },
  beforeCreate() {
    this.$store.registerModule('servicePlansDetailsStore', servicePlansDetailsStore);
  },
  beforeDestroy() {
    this.$store.unregisterModule('servicePlansDetailsStore');
  },
  async created() {
    this.setServicePlanId(this.servicePlanId);
    await this.getViewInfo(this.servicePlanId);
    await this.getServicePlanCars();
  },

  methods: {
    ...mapActions('servicePlansDetailsStore', ['reloadedServicePlanCars']),
    ...mapActions('servicePlansDetailsStore', ['getViewInfo', 'setServicePlanId', 'getServicePlanCars']),
  },
};
</script>

<style scoped>
.event-list {
  margin-top: 5px;
  margin-left: 5px;
  min-height: 400px;
  /*border: solid 1px black;*/
}
</style>
