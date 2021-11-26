<template>
  <div class="">
    <el-table :data="settlementSummary" :summary-method="getSettlementSummary" show-summary>
      <el-table-column :label="$t('entry')">
        <template slot-scope="scope">
          {{ scope.row.noI18n ? scope.row.description : $t('Transactions.' + scope.row.description) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('amount')" prop="value" align="center">
        <template slot-scope="scope">
          <div>{{ $amount(scope.row.value) }}</div>
        </template>
      </el-table-column>
    </el-table>

    <hr />

    <el-table :data="weeklySummary.summary" :summary-method="getTaxSummary" show-summary>
      <el-table-column :label="$t('period')" prop="weekStart">
        <template slot-scope="scope">
          <div class="weekly-entry">
            <div>
              <div>
                {{ scope.row.weekStart }}
              </div>
              <div>
                {{ scope.row.weekEnd }}
              </div>
            </div>
            <i class="el-icon-bottom date-span" />
          </div>
        </template>
      </el-table-column>

      <el-table-column
        v-for="(provider, idx) in weeklySummary.providers"
        :key="idx"
        :label="$t(`providers.${provider}`)"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.incomes.find((income) => income.provider === provider)
              ? $amount(scope.row.incomes.find((income) => income.provider === provider).income)
              : ``
          }}</span>
        </template>
      </el-table-column>
    </el-table>
    <hr />

    <div v-if="driverStatus.isCivil">
      <el-table :data="invoicesSummary" :summary-method="getInvoicesSummary" show-summary>
        <el-table-column label="Typ FV">
          <template slot-scope="scope">
            {{ $t('Transactions.' + scope.row.description) }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('Transactions.gross_value')" align="center" prop="grossValue">
          <template slot-scope="scope">{{ $amount(scope.row.grossValue) }}</template>
        </el-table-column>
        <el-table-column :label="$t('Transactions.vat_return')" align="center" prop="vatReturn">
          <template slot-scope="scope">{{ $amount(scope.row.vatReturn) }}</template>
        </el-table-column>
      </el-table>
      <hr />
    </div>
  </div>
</template>

<script>
import summaryMixin from './summaryMixin';

export default {
  name: 'AVariant',
  mixins: [summaryMixin],
  props: {
    details: {
      type: Object,
    },
  },
};
</script>
<style lang="scss" scoped>
.weekly-entry {
  display: flex;
  align-items: center;
}
</style>
