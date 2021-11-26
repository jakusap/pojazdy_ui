<template>
  <el-select v-model="filters.active" :placeholder="$t('Drivers.all')" class="filter-item" filterable>
    <el-option :value="null" :label="$t('Drivers.all')"></el-option>
    <el-option value="ACTIVE" :label="$t('Drivers.active_filter')"></el-option>
    <el-option value="INCLUDE_INCOME" :label="$t('Drivers.only_with_income')"></el-option>
  </el-select>
</template>

<script>
import filterMixin from './filterMixin';
export default {
  mixins: [filterMixin],
};
</script>

<style lang="scss" scoped></style>
