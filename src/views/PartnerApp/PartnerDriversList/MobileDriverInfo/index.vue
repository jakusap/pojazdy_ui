<template>
  <el-table-column v-if="mobile" :label="$t('info')" align="center" min-width="50px">
    <template slot-scope="scope">
      <el-popover placement="right" trigger="click">
        <div class="">
<!--          <div class="">-->
<!--            {{ $t('SchemaInfo.contract_type') }}{{ `:` }}-->
<!--            <SchemaTooltip :schema="scope.row.settlementSchema" />-->
<!--          </div>-->
          <div class="">
            {{ $t('email_address') }}{{ `:` }}
            {{ scope.row.email ? scope.row.email : $t('dash') }}
          </div>
          <div class="">
            {{ $t('phone_number') }}{{ `:` }}
            {{ scope.row.phoneNumber ? scope.row.phoneNumber : $t('dash') }}
          </div>
        </div>
        <button slot="reference" class="more-actions" size="mini">
          <i class="el-icon-warning-outline" />
        </button>
      </el-popover>
    </template>
  </el-table-column>
</template>

<script>
import SchemaTooltip from '@/components/SchemaTooltip';
export default {
  components: {
    SchemaTooltip,
  },
};
</script>

<style lang="scss" scoped></style>
