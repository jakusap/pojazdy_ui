<template>
  <div id="settings" class="table__settings">
    <div v-if="mobile" class="change-mode">
      <ViewSelector :view="radio" @change-view="(e) => (radio = e)" />
    </div>

    <DriverFilter />
    <DateFilter />
    <SchemaSelect />
    <AmountFilter />

    <el-button
      v-if="filtersOn(filters)"
      class="filter-item"
      type="info"
      icon="el-icon-close"
      @click="resetFilters(filters)"
    >
      {{ $t('reset') }}
    </el-button>
  </div>
</template>

<script>
import AmountFilter from '../../filters/AmountFilter';
import DateFilter from '../../filters/DateFilter';
import DriverFilter from '../../filters/DriverFilter';
import SchemaSelect from '../../filters/SchemaSelect';
import tableSettingsMixin from '../../mixins/tableSettingsMixin';
export default {
  components: {
    DriverFilter,
    DateFilter,
    SchemaSelect,
    AmountFilter,
  },
  mixins: [tableSettingsMixin],
  data() {
    return {
      radio: 'paidSettlements',
    };
  },
};
</script>
<style lang="scss" scoped></style>
