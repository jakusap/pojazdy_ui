<template>
  <el-table-column v-if="!mobile" :label="$t('period')" align="center">
    <template slot-scope="scope">
      {{ scope.row.settlementFrom }} {{ $t('dash') }} {{ scope.row.settlementTo }}
    </template>
  </el-table-column>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
