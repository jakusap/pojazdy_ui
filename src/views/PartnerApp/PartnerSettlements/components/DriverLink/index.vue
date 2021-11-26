<template>
  <el-table-column :label="$t('driver')" sortable="custom" prop="driver.lastName">
    <template slot-scope="scope">
      <el-button
        type="text"
        class="driver-link"
        @click="$router.push({ name: 'DriverDetails', params: { driverUUID: scope.row.driver.driverUUID } })"
      >
        {{ scope.row.driver.lastName }}
        {{ mobile ? scope.row.driver.firstName.slice(0, 1) + '.' : scope.row.driver.firstName }}
      </el-button>
    </template>
  </el-table-column>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
