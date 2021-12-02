<template>
  <DataWrapper>
    <div slot="table-body" class="event-list">
      <el-table :data="paginatedData" :empty-text="$t('Cars.no_cars_placeholder')">
        <el-table-column :label="$t('Cars.car_make_model')" min-width="60px" align="center">
          <template slot-scope="scope">{{ scope.row.carMake }} {{ scope.row.carModel }}</template>
        </el-table-column>
        <el-table-column :label="$t('DocumentsWizard.formLabels.registrationNumber')" min-width="60px" align="center">
          <template slot-scope="scope">{{ scope.row.registrationNumber }}</template>
        </el-table-column>
        <el-table-column
          :label="$t('DocumentsWizard.formLabels.identificationNumber_tooltip')"
          min-width="60px"
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.carVin }}</template>
        </el-table-column>
        <el-table-column :label="$t('ServicePlans.delete_servicePlanCar')" min-width="40px" align="center">
          <template slot-scope="scope">
            <el-button
              :type="editMode ? 'warning' : 'primary'"
              class="card-edit"
              size="small"
              icon="el-icon-edit"
              circle
              @click="removeCar(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <div class="buttons">
        <el-button-group>
          <el-button type="primary" class="cars__action" @click="showAddServiceEventModal()">
            {{ $t('AddServiceEvent.add_serviceEvent') }}
          </el-button>
        </el-button-group>
        <slot></slot>
      </div>
    </div>
  </DataWrapper>
</template>

<script>
import { mapActions, mapGetters} from 'vuex';

import { getServicePlanCarsList } from '@/api/carsApi';
import DataWrapper from '@/components/DataWrapper';
import AddServiceEvent from '@/effects/AddServiceEvent';
import DialogWindow from '@/effects/DialogWindow';

export default {
  components: {
    DataWrapper,
  },
  data() {
    return {
      editMode: false,
      carsList: [],
      servicePlanDetails: {
        firstName: null,
        lastName: null,
        email: null,
        phoneNumber: null,
        active: null,
      },
      pagination: {
        limit: 30,
        currentPage: 1,
      },
    };
  },
  computed: {
    ...mapGetters('servicePlansDetailsStore', [
      'servicePlan',
      'servicePlanId',
      'servicePlanCars',
      'reloadServicePlanCars',
    ]),
    servicePlanCars() {
      return this.carsList;
    },
    paginatedData() {
      const limit = this.pagination.limit;
      const currentPage = this.pagination.currentPage;
      return this.servicePlanCars.slice(limit * (currentPage - 1), limit * currentPage);
    },
  },
  watch: {
    async reloadServicePlanCars(reload) {
      console.log(this.reloadServicePlanCars + " watcher");
      if (reload === true) {
        await this.getServiceCars();
        this.reloadedServicePlanCars();
      }
    },
  },
  async created() {
    await this.getServiceCars();
  },
  methods: {
    ...mapActions('servicePlansDetailsStore', ['reloadedServicePlanCars']),
    ...mapActions('app', ['toggleDataLoading']),
    ...mapActions('servicePlansDetailsStore', ['getViewInfo', 'setViewLoading', 'getServicePlanCars']),
    removeCar(row) {
      this.$modalOn(DialogWindow, { dialogVisible: true, carId: row.carId });
    },
    showAddServiceEventModal() {
      this.$modalOn(AddServiceEvent);
    },
    getServiceCars() {
      this.toggleDataLoading(true);
      getServicePlanCarsList(this.servicePlanId)
        .then((response) => {
          if (response.ok) {
            this.carsList = response.data;
          } else {
            this.$message({
              message: this.$t('AddCar.car_make_failed'),
              type: 'error',
              center: true,
            });
          }
        })
        .finally(() => {
          this.toggleDataLoading(false);
        });
    },
  },
};
</script>

<style scoped>
.buttons {
  margin-top: 10px;
}
</style>