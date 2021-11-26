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
          {{ $t('TransactionsD.' + scope.row.description) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('amount')" prop="value" align="center">
        <template slot-scope="scope">
          <div>{{ $amount(scope.row.value) }}</div>
        </template>
      </el-table-column>
    </el-table>
    <hr />

    <div v-if="pluses.length">
      <el-table :data="pluses" :show-header="true">
        <el-table-column :label="$t('TransactionsD.pluses')" prop="description">
          <template slot-scope="scope">
            {{ $t(scope.row.description) }}
          </template>
        </el-table-column>
        <el-table-column width="150px" align="center" />
        <el-table-column prop="value" align="center">
          <template slot-scope="scope">
            <div>{{ $amount(scope.row.value) }}</div>
          </template>
        </el-table-column>
      </el-table>
      <hr />
    </div>

    <div v-if="minuses.length">
      <el-table :data="minuses" :show-header="true">
        <el-table-column :label="$t('TransactionsD.minuses')" prop="description">
          <template slot-scope="scope">
            {{ $t(scope.row.description) }}
          </template>
        </el-table-column>
        <el-table-column width="150px" align="center" />
        <el-table-column prop="value" align="center">
          <template slot-scope="scope">
            <div>{{ $amount(scope.row.value) }}</div>
          </template>
        </el-table-column>
      </el-table>
      <hr />
    </div>

    <el-table :data="settlementSummary">
      <el-table-column :label="$t('entry')">
        <template slot-scope="scope">
          {{ $t(scope.row.description) }}
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" />
      <el-table-column :label="$t('amount')" prop="value" align="center">
        <template slot-scope="scope">
          <div>{{ $amount(scope.row.value) }}</div>
        </template>
      </el-table-column>
    </el-table>
    <hr />

    <div v-if="taxSummary.length">
      <el-table :data="taxSummary">
        <el-table-column :label="$t('TransactionsD.tax')" prop="description">
          <template slot-scope="scope">
            {{ $t('TransactionsD.' + scope.row.description) }}
          </template>
        </el-table-column>
        <el-table-column width="150px" align="center" />
        <el-table-column :label="$t('amount')" prop="value" align="center">
          <template slot-scope="scope">
            <div>{{ $amount(scope.row.value) }}</div>
          </template>
        </el-table-column>
      </el-table>
      <hr />
    </div>

    <el-table :data="payoutSummary" :show-header="false" :row-class-name="tableRowClassName">
      <el-table-column prop="description">
        <template slot-scope="scope">
          {{ $t('TransactionsD.' + scope.row.description) }}
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" />
      <el-table-column prop="value" align="center">
        <template slot-scope="scope">
          <div>{{ $amount(scope.row.value) }}</div>
        </template>
      </el-table-column>
    </el-table>

    <hr />
  </div>
</template>

<script>
import ProviderBadge from '@/components/ProviderBadge';

import summaryMixin from './summaryMixin';

export default {
  name: 'DVariant',
  components: { ProviderBadge },
  mixins: [summaryMixin],
  props: {
    details: {
      type: Object,
    },
  },

  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'success-row';
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
