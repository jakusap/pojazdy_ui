<template>
  <div>
    <el-table v-if="transferDetails.invoice" :data="transferDetails.invoice" class="transfer-list__table">
      <el-table-column :label="$t('transfers.invoice_amount')" align="center">
        <template slot-scope="scope"> {{ $amount(scope.row.transfer + scope.row.cashCollected) }} </template>
      </el-table-column>
      <el-table-column :label="$t('transfers.invoice_left')" align="center">
        <template slot-scope="scope"> {{ $amount(scope.row.transfer) }} </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'AVariant',
  props: {
    transferDetails: {
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped>
.transfer-list__table {
  margin-bottom: 16px;
}
</style>
