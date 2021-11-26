<template>
  <el-table-column :label="$t('Drivers.profile')" min-width="40px" align="center">
    <template slot-scope="scope">
      <span v-if="scope.row.linkStatus && !scope.row.linkStatus.blocked">
        <el-tooltip placement="top">
          <span slot="content">
            {{ $t('Drivers.driver_has_profile') }}
          </span>
          <i class="el-icon-success icon-success" />
        </el-tooltip>
      </span>
      <span v-else>
        <el-tooltip placement="top">
          <span slot="content">
            {{ $t('Drivers.driver_no_profile') }}
          </span>
          <i class="el-icon-error icon-warning" />
        </el-tooltip>
      </span>
    </template>
  </el-table-column>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
