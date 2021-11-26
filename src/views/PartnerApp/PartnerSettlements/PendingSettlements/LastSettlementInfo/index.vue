<template>
  <el-table-column
    v-if="!mobile"
    :label="$t('last_settlement')"
    align="center"
    prop="lastSettlementDate"
    sortable="custom"
  >
    <template slot-scope="scope">
      {{ scope.row.lastSettlement || $t('dash') }}
    </template>
  </el-table-column>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
