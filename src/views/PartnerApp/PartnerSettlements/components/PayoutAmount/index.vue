<template>
  <el-table-column :label="$t('amount')" sortable="custom" prop="payout" align="center">
    <template slot-scope="scope">
      {{ $amount(scope.row.payout || 0) }}
    </template>
  </el-table-column>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
