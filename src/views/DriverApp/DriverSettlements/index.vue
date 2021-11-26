<template>
  <section v-loading="dataLoading" class="driver-settlements-section">
    <DataWrapper v-if="!dataLoading">
      <template slot="table-header">
        <div v-if="showEmptyView && hasPartner" class="empty-view">
          <el-alert
            :title="$t('DriverSettlements.no_settlements_with_partner')"
            :description="$t('DriverSettlements.no_settlements_with_partner_description')"
            type="info"
            show-icon
            :closable="false"
          />
        </div>
        <div v-if="showEmptyView && !hasPartner" class="empty-view">
          <el-alert
            :title="$t('DriverSettlements.no_settlements_without_partner')"
            :description="$t('DriverSettlements.no_settlements_without_partner_description')"
            type="info"
            show-icon
            :closable="false"
          />
          <router-link :to="{ name: 'DriverPartnersList' }">
            <el-button type="primary">{{ $t('DriverSettlements.select_partner') }}</el-button>
          </router-link>
        </div>
        <div v-if="settlementsData" class="driver-settlements-partner-title">
          <el-form :model="settlementsOptions" class="settlement-form">
            <div class="select-wrapper">
              <span>{{ $t('DriverSettlements.title_partner_name') }}</span>
              <SelectCustom
                v-model="settlementsOptions.partnerUuid"
                :options="driverSettlementsPartnerOptions"
                :on-select-option="resetSelectedSettlementsPeriod"
                name="partnerUuid"
                icon-name="user-solid"
                filterable
              />
            </div>
            <div class="select-wrapper">
              <span>{{ $t('DriverSettlements.title_settlemend_period') }}</span>
              <SelectCustom
                v-model="settlementsOptions.settlementPeriod"
                :options="driverSettlementsPeriodOptions"
                name="settlementPeriod"
                icon-name="date"
                filterable
              />
            </div>
          </el-form>
        </div>
      </template>
      <template slot="table-body">
        <SettlementsTable v-if="settlementsData" :data="settlementsData" :opacity="showEmptyView" />
      </template>
    </DataWrapper>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import DataWrapper from '@/components/DataWrapper';
import SelectCustom from '@/components/SelectCustom';

import SettlementsTable from './SettlementsTable';

export default {
  name: 'DriverSettlements',
  components: { DataWrapper, SelectCustom, SettlementsTable },
  data() {
    return {
      dataLoading: false,
      settlementsOptions: {
        partnerUuid: '',
        settlementPeriod: '',
      },
    };
  },
  computed: {
    ...mapGetters('driverAccount', { driverSettlements: 'getDriverSettlements', driverProfile: 'getLoggedDriverInfo' }),
    ...mapGetters('partners', { partnersList: 'getPartnersList' }),
    showEmptyView() {
      return !this.findSettlementsForSelectedPartner();
    },
    settlementsData() {
      const selectedPartner = this.findSettlementsForSelectedPartner();
      if (selectedPartner) return this.findSelectedSettlementPeriod(selectedPartner?.settlements);
      else return false;
    },
    driverSettlementsPartnerOptions() {
      return this.driverSettlements.map((ele) => {
        return {
          label: ele.partnerName,
          value: ele.partnerUuid,
        };
      });
    },
    driverSettlementsPeriodOptions() {
      const selectedPartner = this.findSettlementsForSelectedPartner();
      if (selectedPartner) {
        return selectedPartner.settlements.sort(this.sortByDate).map((ele) => {
          return {
            label: `${ele.settlementFrom} - ${ele.settlementTo}`,
            value: ele.uuid,
          };
        });
      } else return null;
    },
    hasPartner() {
      const loggedUser = this.getLoggedDriverInfo();
      const driverSettlements = this.getDriverSettlements();
      return Boolean(driverSettlements && (loggedUser?.partnerUuid || loggedUser?.partnerDescription));
    },
  },
  async created() {
    this.dataLoading = true;
    await this.fetchDriverSettlements();
    this.dataLoading = false;
    this.setDefaultFirstPartner();
    this.setDefaultLastSettlement();
  },
  methods: {
    ...mapGetters('driverAccount', ['getLoggedDriverInfo', 'getDriverSettlements']),
    ...mapActions('driverAccount', ['fetchDriverSettlements']),
    setDefaultFirstPartner() {
      if (this.driverSettlements.length) {
        this.settlementsOptions.partnerUuid = this.driverSettlements[0].partnerUuid;
      }
    },
    setDefaultLastSettlement() {
      const selectedPartner = this.findSettlementsForSelectedPartner();
      if (selectedPartner?.settlements.length) {
        this.settlementsOptions.settlementPeriod = selectedPartner.settlements.sort(this.sortByDate)[0].uuid;
      }
    },
    findSettlementsForSelectedPartner() {
      return this.driverSettlements.find((ele) => ele.partnerUuid == this.settlementsOptions.partnerUuid);
    },
    findSelectedSettlementPeriod(settlements) {
      return {
        ...settlements.find((ele) => ele.uuid == this.settlementsOptions.settlementPeriod),
        partnerTaxId: this.partnersList.find((ele) => ele.uuid == this.settlementsOptions.partnerUuid).taxId,
        driverCompanyTaxId: this.driverProfile.companyTaxId,
      };
    },
    sortByDate(a, b) {
      const dateFrom = new Date(b.settlementFrom) - new Date(a.settlementFrom);
      const dateTo = new Date(b.settlementTo) - new Date(a.settlementTo);
      if (dateFrom == 0 && dateTo < 0) {
        return dateTo;
      } else return dateFrom;
    },
    resetSelectedSettlementsPeriod() {
      this.setDefaultLastSettlement();
    },
  },
};
</script>

<style lang="scss" scoped>
.driver-settlements-section {
  margin-top: 32px;
  .driver-settlements-partner-title {
    .settlement-form {
      display: flex;
      flex-wrap: wrap;
      .select-wrapper {
        display: flex;
        flex-direction: column;
        margin-right: 32px;
        > span {
          margin-bottom: 22px;
          font-size: 20px;
          font-weight: bold;
        }
      }
    }
  }

  .empty-view {
    button {
      margin-top: 24px;
    }
  }
}
</style>
