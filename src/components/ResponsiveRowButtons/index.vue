<template>
  <el-popover v-if="mobile" placement="right" trigger="click">
    <el-button-group>
      <slot />
    </el-button-group>
    <button slot="reference" class="more-actions" size="mini">
      <i class="el-icon-more" />
    </button>
  </el-popover>
  <el-button-group v-else>
    <slot />
  </el-button-group>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
