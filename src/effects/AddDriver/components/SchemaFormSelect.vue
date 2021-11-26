<template>
  <div class="el-row">
    <el-form-item :label="$t('AddDriver.settlement_schema')">
      <el-select v-model="selectedSchema.number">
        <el-option
          v-for="schema in settlementsSchemas"
          :key="schema.name + schema.schemaNumber"
          :label="schema.name"
          :value="schema.schemaNumber"
        />
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    selectedSchema: {
      type: Object,
    },
    settlementsSchemas: {
      type: Array,
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item {
  width: 100%;
  margin: 0;
  + .el-form-item {
    padding-left: 8px;
  }
}
</style>
