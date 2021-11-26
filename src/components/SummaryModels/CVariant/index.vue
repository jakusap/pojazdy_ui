<template>
  <div>
    <el-table
      v-for="(providerSummary, idx) in providerSummaries"
      :key="idx"
      :data="providerSummary.rows"
      :span-method="(e) => objectSpanMethod(e, providerSummary.rows.length)"
    >
      <el-table-column width="150px" align="center">
        <template>
          <ProviderBadge :provider="providerSummary.provider" :large="true" />
        </template>
      </el-table-column>

      <el-table-column>
        <template slot-scope="scope">
          {{ $t('TransactionsC.' + scope.row.description) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('amount')" prop="value" align="center">
        <template slot-scope="scope">
          <div>{{ amountVariantC(scope.row.value) }}</div>
        </template>
      </el-table-column>
    </el-table>
    <hr />

    <div>
      <el-table :data="previousPeriodBalance" :show-header="false" :row-class-name="middleBalanceRowName">
        <el-table-column>
          <template slot-scope="scope">
            {{ $t('TransactionsC.' + scope.row.description) }}
          </template>
        </el-table-column>
        <el-table-column width="150px" align="center" />
        <el-table-column prop="value" align="center">
          <template slot-scope="scope">
            <div>{{ amountVariantC(scope.row.value) }}</div>
          </template>
        </el-table-column>
      </el-table>
      <hr />
    </div>

    <div v-if="negativeCostTransactions.length || invoiceVat.length">
      <h1 class="section-title">{{ $t('TransactionsC.extras') }}</h1>

      <div v-if="invoiceVat.length">
        <el-table :data="invoiceVat" :show-header="false">
          <el-table-column :label="$t('TransactionsC.extras')" prop="description">
            <template slot-scope="scope"> {{ $t('TransactionsC.' + scope.row.description) }}</template>
          </el-table-column>
          <el-table-column width="150px" align="center" />
          <el-table-column prop="value" align="center">
            <template slot-scope="scope">
              <div>{{ amountVariantC(scope.row.value) }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="negativeCostTransactions.length">
        <el-table :data="negativeCostTransactions" :show-header="false">
          <el-table-column prop="description">
            <template slot-scope="scope">
              {{ scope.row.description }}
            </template>
          </el-table-column>
          <el-table-column width="150px" align="center" />
          <el-table-column prop="value" align="center">
            <template slot-scope="scope">
              <div>{{ amountVariantC(scope.row.value) }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="extrasBalance.length">
        <el-table :data="extrasBalance" :show-header="false" :row-class-name="middleBalanceRowName">
          <el-table-column prop="description">
            <template slot-scope="scope"> {{ $t('TransactionsC.' + scope.row.description) }}</template>
          </el-table-column>
          <el-table-column width="150px" align="center" />
          <el-table-column prop="value" align="center">
            <template slot-scope="scope">
              <div>{{ amountVariantC(scope.row.value) }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <hr />
    </div>
    <div v-if="charges.length || finalSettlementCost.length || payoutRate">
      <h1 class="section-title">{{ $t('TransactionsC.charges') }}</h1>
      <div v-if="charges.length">
        <el-table :data="charges" :show-header="false">
          <el-table-column :label="$t('TransactionsC.charges')" prop="description">
            <template slot-scope="scope">
              {{ scope.row.description }}
            </template>
          </el-table-column>
          <el-table-column width="150px" align="center" />
          <el-table-column prop="value" align="center">
            <template slot-scope="scope">
              <div>{{ amountVariantC(scope.row.value) }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="payoutRate">
        <el-table :data="taxCharges" :show-header="false">
          <el-table-column prop="description">
            <template slot-scope="scope">
              {{ $t('TransactionsC.' + scope.row.description) }}
            </template>
          </el-table-column>
          <el-table-column width="150px" align="center" />
          <el-table-column prop="value" align="center">
            <template slot-scope="scope">
              <div>{{ amountVariantC(scope.row.value) }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="finalSettlementCost.length">
        <el-table :data="finalSettlementCost" :show-header="false">
          <el-table-column prop="description">
            <template slot-scope="scope"> {{ $t('TransactionsC.' + scope.row.description) }}</template>
          </el-table-column>
          <el-table-column width="150px" align="center" />
          <el-table-column prop="value" align="center">
            <template slot-scope="scope">
              <div>{{ amountVariantC(scope.row.value) }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-if="fuelSummary.length">
      <hr />
      <h1 class="section-title">{{ $t('TransactionsC.fuel_label') }}</h1>
      <el-table :data="fuelSummary" :show-header="false" :row-class-name="middleBalanceRowName">
        <el-table-column prop="description">
          <template slot-scope="scope">
            {{ $t('TransactionsC.' + scope.row.description) }} {{ scope.row.date }}</template
          >
        </el-table-column>
        <el-table-column width="150px" align="right">
          <template slot-scope="scope">
            <ProviderBadge :provider="scope.row.provider" :large="false" />
          </template>
        </el-table-column>
        <el-table-column prop="value" align="center">
          <template slot-scope="scope">
            <div>{{ amountVariantC(scope.row.value) }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <hr />
    <el-table v-show="false" :data="settlementSummary">
      <el-table-column :label="$t('entry')">
        <template slot-scope="scope">
          {{ $t('TransactionsC.' + scope.row.description) }}
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" />
      <el-table-column :label="$t('amount')" prop="value" align="center">
        <template slot-scope="scope">
          <div>{{ amountVariantC(scope.row.value) }}</div>
        </template>
      </el-table-column>
    </el-table>

    <el-table :data="payoutSummary" :show-header="false" :row-class-name="tableRowClassName">
      <el-table-column prop="description">
        <template slot-scope="scope">
          {{ $t('TransactionsC.' + scope.row.description) }}
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" />
      <el-table-column prop="value" align="center">
        <template slot-scope="scope">
          <div>{{ amountVariantC(scope.row.value) }}</div>
        </template>
      </el-table-column>
    </el-table>

    <hr />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import ProviderBadge from '@/components/ProviderBadge';

import summaryMixin from './summaryMixin';

export default {
  name: 'CVariant',
  components: { ProviderBadge },
  mixins: [summaryMixin],
  props: {
    details: {
      type: Object,
    },
  },

  methods: {
    ...mapGetters('transactionsViewStore', ['transactionsDetails', 'transactionTypes', 'providerNames']),
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'success-row';
      }
      return '';
    },
    middleBalanceRowName({ row, rowIndex }) {
      if (row.description === 'balance') {
        return 'middle-balance-row';
      }
      return '';
    },
    objectSpanMethod(data, length) {
      const { row, column, rowIndex, columnIndex } = data;

      if (columnIndex === 0) {
        if (rowIndex % length === 0) {
          return {
            rowspan: length,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.section-title {
  font-size: medium;
  font-weight: bold;
  color: #888888;
}
</style>
