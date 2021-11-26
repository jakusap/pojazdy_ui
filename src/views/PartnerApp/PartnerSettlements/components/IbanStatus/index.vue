<template>
  <el-table-column align="center" width="50px">
    <template slot-scope="scope">
      <div v-if="!scope.row.driver.iban">
        <el-tooltip placement="top">
          <div slot="content">
            {{ $t('SettledSettlements.driver_without_iban') }}
          </div>
          <i class="el-icon-warning icon-warning"></i
        ></el-tooltip>
      </div>
      <div v-else>
        <el-tooltip placement="top">
          <div slot="content">
            {{ $t('SettledSettlements.driver_ready') }}
          </div>
          <i class="el-icon-success icon-success"></i
        ></el-tooltip>
      </div>
    </template>
  </el-table-column>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
