<template>
  <div class="drivers">
    <DataWrapper>
      <template slot="table-header">
        <TableHeader :filters="filters" :extended-filters="extendedFilters" :get-filtered-drivers="loadDriversList" />
      </template>

      <div slot="table-body" v-loading="dataLoading">
        <el-table
          :empty-text="$t('Drivers.no_drivers_placeholder')"
          :data="paginatedData"
          :height="mobile ? 'calc(100vh - 48px - 64px - 64px - 16px)' : 'calc(100vh - 48px - 64px - 64px - 64px)'"
          @selection-change="handleSelectionChange"
          @select-all="handleSelectAll"
        >
          <el-table-column type="selection" align="center" />

          <TableRowActions />

          <el-table-column :label="$t('driver')" min-width="120px" align="center">
            <template slot-scope="scope"> {{ scope.row.lastName }} {{ scope.row.firstName }} </template>
          </el-table-column>

          <MobileDriverInfo />

          <el-table-column v-if="!mobile" :label="$t('email_address')" align="center">
            <template slot-scope="scope">
              {{ scope.row.email ? scope.row.email : $t('dash') }}
            </template>
          </el-table-column>
          <el-table-column v-if="!mobile" :label="$t('phone_number')" align="center" prop="phone">
            <template slot-scope="scope">
              {{ scope.row.phoneNumber ? scope.row.phoneNumber : $t('dash') }}
            </template>
          </el-table-column>
        </el-table>

        <TableActions :selected-drivers="selectedDrivers">
          <Pagination
            :pagination="pagination"
            :length="drivers.length"
            class="pagination"
            @change-page="(e) => (pagination.currentPage = e.page)"
            @change-pagination-limit="(e) => (pagination.limit = e)"
          />
        </TableActions>
      </div>
    </DataWrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { getDriversList } from '@/api/driversApi';
import DataWrapper from '@/components/DataWrapper';
import Pagination from '@/components/Pagination';

import driversListViewStore from './driversListViewStore';
import MobileDriverInfo from './MobileDriverInfo';
import TableActions from './TableActions';
import TableHeader from './TableHeader';
import TableRowActions from './TableRowActions';

export default {
  components: {
    DataWrapper,
    Pagination,
    TableHeader,
    TableRowActions,
    MobileDriverInfo,
    TableActions,
  },
  data() {
    return {
      driversList: null,
      selectedDrivers: [],
      filters: {
        driver: null,
        schemaNumber: null,
        profile: null,
        active: null,
        phoneNumber: null,
        email: null,
      },
      extendedFilters: {
        provider: null,
        identifier: null,
      },
      pagination: {
        limit: 30,
        currentPage: 1,
      },
    };
  },
  computed: {
    ...mapGetters(['settlementsSchemas', 'dataLoading']),
    ...mapGetters('driversListViewStore', ['reloadDrivers']),
    drivers() {
      if (this.driversList) {
        return this.filterDrivers(this.driversList, this.filters);
      }
      return [];
    },
    paginatedData() {
      const limit = this.pagination.limit;
      const currentPage = this.pagination.currentPage;
      return this.drivers.slice(limit * (currentPage - 1), limit * currentPage);
    },
  },
  watch: {
    async reloadDrivers(reload) {
      if (reload === true) {
        await this.loadDriversList();
        this.reloadedDrivers();
      }
    },
  },
  beforeCreate() {
    this.$store.registerModule('driversListViewStore', driversListViewStore);
  },
  destroyed() {
    this.$store.unregisterModule('driversListViewStore');
  },
  async created() {
    await this.loadDriversList();
  },
  methods: {
    ...mapActions('driversListViewStore', ['reloadedDrivers']),
    ...mapActions('app', ['toggleDataLoading']),

    handleSelectionChange(selected) {
      this.selectedDrivers = selected;
    },
    handleSelectAll(selected) {
      this.selectedDrivers = this.drivers;
    },

    async loadDriversList() {
      this.toggleDataLoading(true);
      if (this.extendedFilters.provider === '') {
        this.extendedFilters.provider = null;
      }
      if (this.extendedFilters.identifier === '') {
        this.extendedFilters.identifier = null;
      }
      getDriversList(this.extendedFilters.provider, this.extendedFilters.identifier)
        .then((response) => {
          response.ok
            ? (this.driversList = response.data.sort((driver, nextDriver) => {
                if (driver.lastName < nextDriver.lastName) {
                  return -1;
                }
                if (nextDriver.lastName < driver.lastName) {
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
        message: this.$t('loading_drivers_error'),
        center: true,
      });
      this.toggleDataLoading(false);
    },
    filterDrivers(drivers, filters) {
      let driversFiltered = drivers;
      if (filters.driver) {
        const searchedDriver = filters.driver.toLowerCase();
        driversFiltered = drivers.filter((driver) => {
          const fullName = driver.lastName + ' ' + driver.firstName;
          if (fullName.toLowerCase().search(searchedDriver) >= 0) return driver;
        });
      }
      if (filters.schemaNumbers?.length) {
        const schemaNumbers = filters.schemaNumbers;
        driversFiltered = drivers.filter((driver) => {
          if (schemaNumbers.includes(driver.settlementSchema.schemaNumber)) return driver;
        });
      }
      if (filters.profile) {
        const profile = filters.profile;
        if (profile === 'LINKED') {
          driversFiltered = driversFiltered.filter((driver) => {
            if (driver.linkStatus && !driver.linkStatus.blocked) return driver;
          });
        }
        if (profile === 'NOT_LINKED') {
          driversFiltered = driversFiltered.filter((driver) => {
            if (!driver.linkStatus || driver.linkStatus.blocked) return driver;
          });
        }
      }
      if (filters.active) {
        driversFiltered = driversFiltered.filter((driver) => {
          if (filters.active === 'ACTIVE' && driver.active) return driver;
          if (filters.active === 'INACTIVE' && !driver.active) return driver;
        });
      }
      if (filters.email) {
        const searchedDriver = filters.email.toLowerCase().replace('+', '');
        driversFiltered = drivers.filter((driver) => {
          if (driver.email?.toLowerCase().search(searchedDriver) >= 0) return driver;
        });
      }
      if (filters.phoneNumber) {
        const clearPhoneNumber = filters.phoneNumber.replace('+', '');
        driversFiltered = drivers.filter((driver) => {
          if (driver.phoneNumber?.search(clearPhoneNumber) >= 0) return driver;
        });
      }
      return driversFiltered;
    },
  },
};
</script>

<style lang="scss">
.el-switch:hover {
  cursor: pointer;
}
</style>
