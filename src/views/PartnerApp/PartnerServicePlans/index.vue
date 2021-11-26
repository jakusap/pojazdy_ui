<template>
  <DataWrapper>
    <template slot="table-header">
      <TableHeader :filters="filters" />
    </template>
    <div slot="table-body" v-loading="dataLoading">
      <el-table
        :empty-text="$t('ServicePlans.no_servicePlans_placeholder')"
        :data="paginatedData"
        :height="mobile ? 'calc(100vh - 48px - 64px - 64px - 16px)' : 'calc(100vh - 48px - 64px - 64px - 64px)'"
        @selection-change="handleSelectionChange"
        @select-all="handleSelectAll"
      >
        <el-table-column type="selection" align="center" />
        <TableRowActions />
        <el-table-column :label="$t('DocumentsWizard.formLabels.servicePlan_name')" min-width="120px" align="center">
          <template slot-scope="scope">
            {{ scope.row.servicePlanName }}
          </template>
        </el-table-column>

        <MobileCarInfo />

        <el-table-column v-if="!mobile" :label="$t('Cars.car_make_model')" align="center">
          <template slot-scope="scope"> {{ scope.row.carMake }} {{ scope.row.carModel }} </template>
        </el-table-column>
      </el-table>
      <TableActions></TableActions>
    </div>
  </DataWrapper>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { getServicePlansList } from '@/api/servicePlansApi';
import DataWrapper from '@/components/DataWrapper';
import servicePlansListViewStore from '@/views/PartnerApp/PartnerServicePlans/servicePlansListViewStore';

import MobileCarInfo from './MobileCarInfo';
import TableActions from './TableActions';
import TableHeader from './TableHeader';
import TableRowActions from './TableRowActions';

export default {
  components: {
    DataWrapper,
    TableRowActions,
    TableActions,
    TableHeader,
    MobileCarInfo,
  },
  data() {
    return {
      servicePlansList: null,
      selectedServicePlan: [],
      filters: {
        servicePlanMakeModel: null,
        servicePlanName: null,
      },
      pagination: {
        limit: 30,
        currentPage: 1,
      },
    };
  },
  computed: {
    ...mapGetters(['dataLoading']),
    ...mapGetters('servicePlansListViewStore', ['reloadServicePlans']),
    servicePlans() {
      if (this.servicePlansList) {
        return this.filteredServicePlans(this.servicePlansList, this.filters);
      }
      return [];
    },
    paginatedData() {
      const limit = this.pagination.limit;
      const currentPage = this.pagination.currentPage;
      return this.servicePlans.slice(limit * (currentPage - 1), limit * currentPage);
    },
  },
  watch: {
    async reloadServicePlans(reload) {
      if (reload === true) {
        await this.loadServicePlansList();
        this.reloadedServicePlans();
      }
    },
  },
  beforeCreate() {
    this.$store.registerModule('servicePlansListViewStore', servicePlansListViewStore);
  },
  destroyed() {
    this.$store.unregisterModule('servicePlansListViewStore');
  },
  async created() {
    await this.loadServicePlansList();
  },
  methods: {
    ...mapActions('servicePlansListViewStore', ['reloadedServicePlans']),
    ...mapActions('app', ['toggleDataLoading']),

    handleSelectionChange(selected) {
      this.selectedServicePlan = selected;
    },
    handleSelectAll(selected) {
      this.selectedServicePlan = this.servicePlans;
    },
    async loadServicePlansList() {
      this.toggleDataLoading(true);
      getServicePlansList()
        .then((response) => {
          response.ok ? (this.servicePlansList = response.data) : this.loadingFailed();
        })
        .finally(() => {
          this.toggleDataLoading(false);
        });
    },
    loadingFailed() {
      this.$message({
        type: 'error',
        message: this.$t('loading_cars_error'),
        center: true,
      });
      this.toggleDataLoading(false);
    },
    filteredServicePlans(servicePlans, filters) {
      let servicePlansFiltered = servicePlans;
      if (filters.servicePlanName) {
        const searchedServicePlan = filters.servicePlanName.toLowerCase();
        servicePlansFiltered = servicePlans.filter((servicePlan) => {
          if (servicePlan.servicePlanName) {
            const fullName = servicePlan.servicePlanName;
            if (fullName.toLowerCase().search(searchedServicePlan) >= 0) return servicePlan;
          }
        });
      }
      if (filters.servicePlanMakeModel) {
        const searchedServicePLanMakeModel = filters.servicePlanMakeModel.toLowerCase();
        servicePlansFiltered = servicePlans.filter((servicePlan) => {
          if (servicePlan.carMake?.toLowerCase().search(searchedServicePLanMakeModel) >= 0) {
            return servicePlan;
          } else if (servicePlan.carModel?.toLowerCase().search(searchedServicePLanMakeModel) >= 0) {
            return servicePlan;
          }
        });
      }
      return servicePlansFiltered;
    },
  },
};
</script>

<style lang="scss" scoped></style>
