<template>
  <div id="settings" class="table__settings">
    <div v-if="mobile" class="change-mode">
      <ViewSelector :view="radio" @change-view="(e) => (radio = e)" />
    </div>
    <PeriodCodeFilter />
    <DriverFilter />
    <SchemaSelect />
    <AmountFilter />
    <ActiveFilter />
    <el-button
      v-if="filtersOn(filters)"
      class="filter-item reset"
      type="info"
      icon="el-icon-close"
      @click="resetFilters(filters)"
      >{{ $t('reset') }}
    </el-button>
  </div>
</template>

<script>
import ActiveFilter from '../../filters/ActiveFilter';
import AmountFilter from '../../filters/AmountFilter';
import DateFilter from '../../filters/DateFilter';
import DriverFilter from '../../filters/DriverFilter';
import PeriodCodeFilter from '../../filters/PeriodCodeFilter';
import SchemaSelect from '../../filters/SchemaSelect';
import tableSettingsMixin from '../../mixins/tableSettingsMixin';

export default {
  components: {
    ActiveFilter,
    DriverFilter,
    PeriodCodeFilter,
    SchemaSelect,
    AmountFilter,
  },
  mixins: [tableSettingsMixin],
  data() {
    return {
      radio: 'pendingSettlements',
    };
  },
};
</script>

<style lang="scss" scoped></style>
