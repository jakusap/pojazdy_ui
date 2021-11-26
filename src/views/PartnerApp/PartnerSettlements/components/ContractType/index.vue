<template>
  <el-table-column v-if="!mobile" :label="$t('contract_type')" align="center" prop="schemaId" sortable="custom">
    <template slot-scope="scope">
      <SchemaTooltip v-if="scope.row.settlementSchema" :schema="scope.row.settlementSchema" />
      <div v-else>{{ `-` }}</div>
    </template>
  </el-table-column>
</template>

<script>
import SchemaTooltip from '@/components/SchemaTooltip';
export default {
  components: {
    SchemaTooltip,
  },
};
</script>

<style lang="scss" scoped></style>
