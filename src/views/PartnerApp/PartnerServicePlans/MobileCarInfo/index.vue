<template>
  <el-table-column v-if="mobile" :label="$t('info')" align="center" min-width="60px">
    <template slot-scope="scope">
      <el-popover placement="right" trigger="click">
        <div class="">
          <div class="">{{ $t('Cars.car_make_model') }}{{ `:` }} {{ scope.row.carMake }} {{ scope.row.carModel }}</div>
          <div class="">
            {{ $t('DocumentsWizard.formLabels.registrationNumber') }}{{ `:` }}
            {{ scope.row.registrationNumber ? scope.row.registrationNumber.toUpperCase() : $t('dash') }}
          </div>
          <div class="">
            {{ $t('DocumentsWizard.formLabels.identificationNumber_tooltip') }}{{ `:` }}
            {{ scope.row.carVin ? scope.row.carVin.toUpperCase() : $t('dash') }}
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
