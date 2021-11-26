<template>
  <div v-if="details.variant">
    <component
      :is="summaryComponent"
      :details="details"
      :settlement-u-u-i-d="settlementUUID"
      :driver="driver"
      @get-details="getDetails()"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import {
  calculateSettlements,
  deleteDoneSettlement,
  getPendingSettlements,
  getSettlementDetails,
} from '@/api/settlementsApi.js';

import ASummary from '../partner/ASummary';
import BSummary from '../partner/BSummary';
import CSummary from '../partner/CSummary';
import DSummary from '../partner/DSummary';
export default {
  components: {
    ASummary,
    BSummary,
    DSummary,
  },
  props: {
    settlementUUID: {
      type: String,
    },
    driver: {
      type: Object,
    },
  },
  data() {
    return {
      details: {},
    };
  },
  computed: {
    ...mapGetters(['selectedSettlementPeriodCode', 'settlementPeriods']),
    variant() {
      return this.details.variant || null;
    },
    summaryComponent() {
      switch (this.variant) {
        case 'B':
          return BSummary;
        case 'C':
          return CSummary;
        case 'D':
          return DSummary;
        default:
          return ASummary;
      }
    },
  },

  created() {
    this.getDetails();
  },
  methods: {
    ...mapActions('periods', ['selectPeriod']),
    getDetails() {
      if (!this.settlementUUID) {
        getPendingSettlements(this.driver.driverUUID, this.selectedSettlementPeriodCode, true)
          .then((response) => {
            if (response.ok) {
              this.details = response.data[0];
            }
          })
          .finally(() => (this.loading = false));
      } else {
        getSettlementDetails(this.settlementUUID)
          .then((response) => {
            if (response.ok) {
              this.details = response.data;
            }
          })
          .finally(() => (this.loading = false));
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
