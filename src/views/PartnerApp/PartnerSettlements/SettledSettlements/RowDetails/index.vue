<template>
  <el-table-column type="expand">
    <template slot-scope="scope">
      <TransferCodes :settlement-u-u-i-d="scope.row.uuid" />
      <div class="center">
        <el-button type="primary" @click="changePaidStatus([scope.row], true)">
          {{ $t('mark_as_paid') }}
        </el-button>
      </div>
    </template>
  </el-table-column>
</template>

<script>
import changePaidStatusMixin from '../../mixins/changePaidStatusMixin';
import TransferCodes from '../TransferCodes';
export default {
  components: {
    TransferCodes,
  },
  mixins: [changePaidStatusMixin],
};
</script>

<style lang="scss" scoped></style>
