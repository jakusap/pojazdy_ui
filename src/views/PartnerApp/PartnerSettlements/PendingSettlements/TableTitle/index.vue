<template>
  <h1 class="settlements__title">
    <div v-if="mobile" class="pending-title">
      <span>
        {{ $t('pending_settlements') }}
        <LimitStatus />
      </span>
      <el-button size="mini" type="info" @click="showSettings()">
        <i class="el-icon-setting" />
      </el-button>
    </div>
    <div v-else class="title-settings">
      <ViewSelector :view="radio" @change-view="(e) => (radio = e)" />
      <el-select v-model="selectedPeriodCode" class="filter-item pending-period">
        <el-option
          v-for="settlementPeriod in settlementPeriods"
          :key="settlementPeriod.code"
          :label="$t('settlement_period_to') + settlementPeriod.dateTo"
          :value="settlementPeriod.code"
        >
        </el-option>
      </el-select>
      <LimitStatus />
    </div>
  </h1>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import tableTitleMixin from '../../mixins/tableTitleMixin';
import LimitStatus from '../LimitStatus';
export default {
  components: {
    LimitStatus,
  },
  mixins: [tableTitleMixin],
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

<style lang="scss" scoped>
.pending-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  & > span {
    margin-right: 4px;
  }
}
.title-settings {
  display: flex;
  align-items: center;
}
.pending-period {
  margin-right: 4px;
}
</style>
