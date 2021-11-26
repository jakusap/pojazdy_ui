<template>
  <el-table-column :label="$t('status')" min-width="40px" align="center">
    <template slot-scope="scope">
      <span v-if="!scope.row.driver.email">
        <el-tooltip placement="top">
          <span slot="content">
            {{ $t('PendingSettlements.driver_without_email') }}<br />
            {{ $t('PendingSettlements.settlement_will_not_send') }}
          </span>
          <i class="el-icon-warning icon-warning" />
        </el-tooltip>
      </span>
      <span v-else>
        <el-tooltip placement="top">
          <span slot="content">
            {{ $t('PendingSettlements.driver_with_email') }}<br />
            {{ $t('PendingSettlements.settlement_will_send') }}
          </span>
          <i class="el-icon-success icon-success" />
        </el-tooltip>
      </span>
    </template>
  </el-table-column>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
