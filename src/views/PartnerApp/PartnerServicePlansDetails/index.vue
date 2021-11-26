<template>
  <div class="conteiner">
    <el-row :gutter="16">
      <el-col :sm="16">
        <ServicePlanEvents />
      </el-col>
      <el-col :sm="8">
        <ServicePlanDetails />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { getSpecificServicePlanDetails } from '@/api/servicePlansApi';

import ServicePlanDetails from './components/ServicePlanDetails';
import ServicePlanEvents from './components/ServicePlanEvents';
import servicePlansDetailsStore from './store/servicePlansDetailsStore';

export default {
  components: { ServicePlanDetails, ServicePlanEvents },
  computed: {
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
  },
  methods: {
    ...mapActions('servicePlansDetailsStore', ['getViewInfo', 'setServicePlanId']),
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
