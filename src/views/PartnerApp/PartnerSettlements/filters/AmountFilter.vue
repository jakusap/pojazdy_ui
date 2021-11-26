<template>
  <el-input v-model="filters.payout" :placeholder="$t('min_amount')" clearable class="filter-item" />
</template>

<script>
import filterMixin from './filterMixin';
export default {
  mixins: [filterMixin],
};
</script>

<style lang="scss" scoped></style>
