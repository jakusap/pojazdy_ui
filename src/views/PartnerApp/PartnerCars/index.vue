<template>
  <DataWrapper>
    <template slot="table-header">
      <TableHeader :filters="filters" />
    </template>
    <div slot="table-body" v-loading="dataLoading">
      <el-table
        :empty-text="$t('Cars.no_cars_placeholder')"
        :data="paginatedData"
        :height="mobile ? 'calc(100vh - 48px - 64px - 64px - 16px)' : 'calc(100vh - 48px - 64px - 64px - 64px)'"
        @selection-change="handleSelectionChange"
        @select-all="handleSelectAll"
      >
        <el-table-column type="selection" align="center" />
        <TableRowActions />
        <el-table-column :label="$t('driver')" min-width="120px" align="center">
          <template slot-scope="scope">
            {{ scope.row.driver ? scope.row.driver.lastName + ' ' + scope.row.driver.firstName : $t('dash') }}
          </template>
        </el-table-column>

        <MobileCarInfo />

        <el-table-column v-if="!mobile" :label="$t('Cars.car_make_model')" align="center">
          <template slot-scope="scope"> {{ scope.row.carMake }} {{ scope.row.carModel }} </template>
        </el-table-column>
        <el-table-column
          v-if="!mobile"
          :label="$t('DocumentsWizard.formLabels.registrationNumber')"
          align="center"
          prop="phone"
        >
          <template slot-scope="scope">
            {{ scope.row.registrationNumber }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="!mobile"
          :label="$t('DocumentsWizard.formLabels.identificationNumber_tooltip')"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.carVin ? scope.row.carVin : $t('dash') }}
          </template>
        </el-table-column>
      </el-table>
      <TableActions></TableActions>
    </div>
  </DataWrapper>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { getCarsList } from '@/api/carsApi';
import DataWrapper from '@/components/DataWrapper';
import carsListViewStore from '@/views/PartnerApp/PartnerCars/carsListViewStore';

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
      carsList: null,
      selectedCars: [],
      filters: {
        carMakeModel: null,
        carModel: null,
        carVin: null,
        registrationNumber: null,
        driver: null,
      },
      pagination: {
        limit: 30,
        currentPage: 1,
      },
    };
  },
  computed: {
    ...mapGetters(['dataLoading']),
    ...mapGetters('carsListViewStore', ['reloadCars']),
    cars() {
      if (this.carsList) {
        return this.filteredCars(this.carsList, this.filters);
      }
      return [];
    },
    paginatedData() {
      const limit = this.pagination.limit;
      const currentPage = this.pagination.currentPage;
      return this.cars.slice(limit * (currentPage - 1), limit * currentPage);
    },
  },
  watch: {
    async reloadCars(reload) {
      if (reload === true) {
        await this.loadCarsList();
        this.reloadedCars();
      }
    },
  },
  beforeCreate() {
    this.$store.registerModule('carsListViewStore', carsListViewStore);
  },
  destroyed() {
    this.$store.unregisterModule('carsListViewStore');
  },
  async created() {
    await this.loadCarsList();
  },
  methods: {
    ...mapActions('carsListViewStore', ['reloadedCars']),
    ...mapActions('app', ['toggleDataLoading']),

    handleSelectionChange(selected) {
      this.selectedCars = selected;
    },
    handleSelectAll(selected) {
      this.selectedCars = this.cars;
    },
    async loadCarsList() {
      this.toggleDataLoading(true);
      getCarsList()
        .then((response) => {
          response.ok
            ? (this.carsList = response.data.sort((car, nextCar) => {
                if (car.mark < nextCar.mark) {
                  return -1;
                }
                if (nextCar.mark < car.mark) {
                  return 1;
                }
                return 0;
              }))
            : this.loadingFailed();
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
    filteredCars(cars, filters) {
      let carsFiltered = cars;
      if (filters.driver) {
        const searchedCarDriver = filters.driver.toLowerCase();
        carsFiltered = cars.filter((car) => {
          if (car.driver) {
            const fullName = car.driver.lastName + ' ' + car.driver.firstName;
            if (fullName.toLowerCase().search(searchedCarDriver) >= 0) return car;
          }
        });
      }
      if (filters.carMakeModel) {
        const searchedCarMakeModel = filters.carMakeModel.toLowerCase();
        carsFiltered = cars.filter((car) => {
          if (car.carMake?.toLowerCase().search(searchedCarMakeModel) >= 0) {
            return car;
          } else if (car.carModel?.toLowerCase().search(searchedCarMakeModel) >= 0) {
            return car;
          }
        });
      }
      if (filters.carVin) {
        const searchedCarVin = filters.carVin.toLowerCase();
        carsFiltered = cars.filter((car) => {
          if (car.carVin?.toLowerCase().search(searchedCarVin) >= 0) return car;
        });
      }
      if (filters.registrationNumber) {
        const searchedCarRegistrationNb = filters.registrationNumber.toLowerCase();
        carsFiltered = cars.filter((car) => {
          if (car.registrationNumber?.toLowerCase().search(searchedCarRegistrationNb) >= 0) return car;
        });
      }
      return carsFiltered;
    },
  },
};
</script>

<style lang="scss" scoped></style>
