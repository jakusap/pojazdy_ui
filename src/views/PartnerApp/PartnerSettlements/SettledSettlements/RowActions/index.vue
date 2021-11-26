<template>
  <el-table-column :label="$t('table_actions')" align="center">
    <template slot-scope="scope">
      <el-popover v-if="mobile" placement="right" trigger="click">
        <el-button-group>
          <button class="el-button el-button--primary el-button--mini" @click="toggleSettlementsDetails(scope.row)">
            {{ $t('details') }}
          </button>
          <button
            :disabled="!scope.row.driver.iban"
            class="el-button el-button--info el-button--mini"
            @click="toggleQrCode(scope.row.uuid)"
          >
            {{ `QR` }}
          </button>
        </el-button-group>
        <button slot="reference" class="more-actions" size="mini">
          <i class="el-icon-more" />
        </button>
      </el-popover>
      <el-button-group v-else>
        <button
          :class="{ 'is-disabled': !scope.row.driver.iban }"
          :disabled="!scope.row.driver.iban"
          class="el-button el-button--info el-button--mini"
          @click="toggleQrCode(scope.row.uuid)"
        >
          {{ `QR` }}
        </button>
        <button class="el-button el-button--primary el-button--mini" @click="toggleSettlementsDetails(scope.row)">
          {{ $t('details') }}
        </button>
      </el-button-group>
    </template>
  </el-table-column>
</template>

<script>
import actionsMixin from '../actionsMixin';

export default {
  mixins: [actionsMixin],
  props: {
    expandedQrCodes: {
      type: Object,
    },
  },
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
    toggleQrCode(uuid) {
      if (this.expandedQrCodes.items.includes(uuid)) {
        this.expandedQrCodes.items = this.expandedQrCodes.items.filter((item) => item != uuid);
      } else {
        this.expandedQrCodes.items.push(uuid);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
