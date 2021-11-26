<template>
  <span v-if="mobile" class="filter-item--period">
    <el-select v-model="selectedPeriodCode">
      <el-option
        v-for="settlementPeriod in settlementPeriods"
        :key="settlementPeriod.code"
        :label="$t('settlement_period_to') + settlementPeriod.dateTo"
        :value="settlementPeriod.code"
      >
      </el-option>
    </el-select>
  </span>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import filterMixin from './filterMixin';
export default {
  mixins: [filterMixin],
  data() {
    return {
      selectedPeriodCode: null,
      radio: 'pendingSettlements',
    };
  },

  computed: {
    ...mapGetters(['settlementPeriods', 'selectedSettlementPeriodCode']),
  },
  watch: {
    selectedSettlementPeriodCode: {
      handler(value) {
        this.selectedPeriodCode = value;
      },
      immediate: true,
    },
    selectedPeriodCode(value) {
      this.selectPeriod(value);
      this.$store.dispatch('settlementsViewStore/reloadSettlements');
    },
  },
  methods: {
    ...mapActions('periods', ['selectPeriod']),
  },
};
</script>

<style lang="scss" scoped></style>
