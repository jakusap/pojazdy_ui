<template>
  <el-table-column v-if="mobile" :label="$t('info')" align="center" min-width="50px">
    <template slot-scope="scope">
      <el-popover placement="right" trigger="click">
        <div class="">
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
export default {};
</script>

<style lang="scss" scoped></style>
