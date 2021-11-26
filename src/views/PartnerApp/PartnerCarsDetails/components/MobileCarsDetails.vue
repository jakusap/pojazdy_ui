<template>
  <el-table-column v-if="mobile" align="center" min-width="50px">
    <template slot-scope="scope">
      <el-popover placement="right" trigger="click">
        <div class="">
          <div class="">
            {{ $t('DocumentsWizard.formLabels.registrationNumber') }}{{ `:` }}
            {{ scope.row.registrationNumber ? scope.row.registrationNumber.toUpperCase() : $t('dash') }}
          </div>
          <div class="">
            {{ $t('DocumentsWizard.formLabels.identificationNumber_tooltip') }}{{ `:` }}
            {{ scope.row.carVin ? scope.row.carVin.toUpperCase() : $t('dash') }}
          </div>
          <div class="">
            {{ $t('DocumentsWizard.formLabels.productionYear') }}{{ `:` }}
            {{ scope.row.productionYear ? scope.row.productionYear.substr(0, 4) : $t('dash') }}
          </div>
          <div class="">
            {{ $t('DocumentsWizard.formLabels.registrationDate') }}{{ `:` }}
            {{ scope.row.registrationDate }}
          </div>
          <div class="">
            {{ $t('DocumentsWizard.formLabels.carDescription') }}{{ `:` }}
            {{ scope.row.description ? scope.row.description : $t('dash') }}
          </div>
        </div>
        <button slot="reference" class="more-actions" size="mini">
          <i class="el-icon-warning-outline" />
        </button>
      </el-popover>
    </template>
  </el-table-column>
</template>

<script></script>

<style lang="scss" scoped></style>
