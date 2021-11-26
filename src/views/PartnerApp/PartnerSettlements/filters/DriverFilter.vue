<template>
  <el-input v-model="filters.driver" :placeholder="$t('driver')" clearable class="filter-item" />
</template>

<script>
import filterMixin from './filterMixin';
export default {
  mixins: [filterMixin],
};
</script>

<style lang="scss" scoped></style>
