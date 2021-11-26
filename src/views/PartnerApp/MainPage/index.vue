<template>
  <div class="container">
<!--    <el-row :gutter="16">-->
<!--      <el-col :sm="13">-->
    <div class="event-list">
      <h1>Test lewy panel</h1>
      <el-table :data="serviceEventsList" :empty-text="$t('ServiceEvents.no_serviceEvents_placeholder')">
        <el-table-column :label="$t('DocumentsWizard.formLabels.servicePlan_name')" min-width="60px" align="center">
          <template slot-scope="scope">{{ scope.row.servicePlan.servicePlanName }}</template>
        </el-table-column>
        <el-table-column :label="$t('DocumentsWizard.formLabels.mileage')" min-width="60px" align="center">
          <template slot-scope="scope">{{ scope.row.serviceEvent.comments }}</template>
        </el-table-column>
        <el-table-column :label="$t('DocumentsWizard.formLabels.make_model')" min-width="60px" align="center">
          <template slot-scope="scope">
            {{ scope.row.servicePlan.carMake }} {{ scope.row.servicePlan.carModel }}</template
          >
        </el-table-column>
        <el-table-column :label="$t('DocumentsWizard.formLabels.mileage')" min-width="60px" align="center">
          <template slot-scope="scope">{{ scope.row.serviceEvent.mileage }}</template>
        </el-table-column>
        <el-table-column :label="$t('DocumentsWizard.formLabels.notify_mileage')" min-width="60px" align="center">
          <template slot-scope="scope">{{ scope.row.serviceEvent.mileageNotification }}</template>
        </el-table-column>
      </el-table>
    </div>
<!--      </el-col>-->
<!--      <el-col :sm="11">-->
<!--        <h1>Test środkowy panel</h1>-->
<!--        <AddCarEventPanel />-->
<!--      </el-col>-->
<!--    </el-row>-->
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { getPartnerServiceEventsList } from '@/api/servicePlansApi';

import AddCarEventPanel from './components/AddCarEventPanel';

export default {
  components: {
    // AddCarEventPanel,
  },
  data() {
    return {
      serviceEventsList: [],
    };
  },
  async created() {
    await this.loadServiceEventList();
  },
  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    async loadServiceEventList() {
      this.toggleDataLoading(true);
      getPartnerServiceEventsList()
        .then((response) => {
          response.ok ? (this.serviceEventsList = response.data) : this.loadingFailed();
        })
        .finally(() => {
          this.toggleDataLoading(false);
        });
    },
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
