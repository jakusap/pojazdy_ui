<template>
  <el-select v-model="filters.schemaNumbers" :placeholder="$t('all_schemas')" multiple class="filter-item" filterable>
    <el-option
      v-for="schema in settlementsSchemas"
      :key="schema.schemaNumber"
      :label="schema.name"
      :value="schema.schemaNumber"
    >
    </el-option>
  </el-select>
</template>

<script>
import { mapGetters } from 'vuex';

import filterMixin from './filterMixin';
export default {
  mixins: [filterMixin],
  computed: {
    ...mapGetters(['settlementsSchemas']),
  },
};
</script>

<style lang="scss" scoped></style>
