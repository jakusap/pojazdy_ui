<template>
  <el-table-column v-if="!mobile" :label="$t('settled')" prop="systemEntryDate" sortable="custom" align="center">
  </el-table-column>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
