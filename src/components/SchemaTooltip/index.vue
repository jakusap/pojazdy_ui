<template>
  <el-tooltip v-if="schema" :placement="placement">
    <div slot="content">
      {{ `${$t('SchemaInfo.contract_type')}: ${$t('SchemaInfo.' + schema.contractType)}` }}<br />
      {{ `${$t('SchemaInfo.monthly_contract_costs')}: ${$amount(schema.monthlyContractCosts || 0)}` }}<br />
      {{ `${$t('SchemaInfo.settlement_cost')}: ${$amount(settlementCost)}` }}<br />
      <template v-if="schema.vatSplitRate >= 0">
        {{ `${$t('SchemaInfo.vat_split')}: ${schema.vatSplitRate * 100}%` }}<br />
      </template>
    </div>
    <span>{{ schema.name }}</span>
  </el-tooltip>
</template>

<script>
export default {
  props: {
    schema: {
      type: Object,
    },
    placement: {
      type: String,
      default: 'top',
    },
  },
  computed: {
    settlementCost() {
      return this.schema.additionalCosts
        ? this.schema.additionalCosts.reduce((acc, curr) => acc + curr.amount, 0.0)
        : 0;
    },
  },
};
</script>

<style lang="scss" scoped>
span {
  font-weight: 700;
  color: var(--dark-gray-color);
  transition: all 0.1s ease;
  &:hover {
    color: var(--orange-color-hover);
  }
}
</style>
