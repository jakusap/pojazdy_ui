<template>
  <el-table-column :label="$t('table_actions')" align="center">
    <template slot-scope="scope">
      <el-popover v-if="mobile" placement="right" trigger="click">
        <el-button-group>
          <button class="el-button el-button--info el-button--mini" @click="changePaidStatus([scope.row], false)">
            {{ $t('unpaid') }}
          </button>
          <button class="el-button el-button--primary el-button--mini" @click="toggleSettlementsDetails(scope.row)">
            {{ $t('details') }}
          </button>
        </el-button-group>
        <button slot="reference" class="more-actions" size="mini">
          <i class="el-icon-more" />
        </button>
      </el-popover>
      <el-button-group v-else>
        <button class="el-button el-button--info el-button--mini" @click="changePaidStatus([scope.row], false)">
          {{ $t('unpaid') }}
        </button>
        <button class="el-button el-button--primary el-button--mini" @click="toggleSettlementsDetails(scope.row)">
          {{ $t('details') }}
        </button>
      </el-button-group>
    </template>
  </el-table-column>
</template>
<script>
import changePaidStatusMixin from '../../mixins/changePaidStatusMixin';
export default {
  mixins: [changePaidStatusMixin],

  methods: {
    toggleSettlementsDetails(settlement) {
      this.$router.push({
        name: 'Transactions',
        params: {
          driverUUID: settlement?.driver?.driverUUID,
          settlementUUID: settlement.uuid,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
