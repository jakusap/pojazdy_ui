<template>
  <el-select v-model="selectedView" class="filter-item">
    <el-option :label="$t('pending_settlements')" value="pendingSettlements" />
    <el-option :label="$t('settled_settlements')" value="settledSettlements" />
    <el-option :label="$t('paid_settlements')" value="paidSettlements" />
  </el-select>
</template>

<script>
export default {
  props: {
    view: {
      type: String,
    },
  },
  data() {
    return {
      selectedView: null,
    };
  },
  watch: {
    selectedView(view) {
      this.$emit('change-view', view);
    },
  },
  created() {
    this.selectedView = this.view;
  },
};
</script>

<style lang="scss" scoped></style>
