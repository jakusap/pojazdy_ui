import { validateNumber, validateValue } from '@/validators';

const schemaRules = {
  data() {
    return {
      schemaSections: [
        {
          title: 'daily_fees',
          schemaElements: [
            { prop: 'dailySettlementCost', label: 'daily_settlement_cost', append: 'currency' },
            { prop: 'maxDailySettlementCosts1', label: 'max_daily_1', append: 'currency' },
            { prop: 'maxDailySettlementCosts2', label: 'max_daily_2', append: 'currency' },
            { prop: 'maxDailySettlementCosts3', label: 'max_daily_3', append: 'currency' },
          ],
        },
        {
          title: 'trip_fees',
          schemaElements: [
            { prop: 'tripSettlementCost', label: 'trip_settlement_cost', append: 'currency' },
            { prop: 'maxTripSettlementCost', label: 'max_trip_settlement_cost', append: 'currency' },
          ],
        },
        {
          title: 'taxes',
          schemaElements: [{ prop: 'vatSplitRate', label: 'vat_split_rate', append: 'percent' }],
        },
        {
          title: 'payout',
          schemaElements: [
            {
              prop: 'payoutRate',
              label: 'payout_rate',
              append: 'percent',
              radio: { 0: { label: 'REVENUE', text: 'revenue' }, 1: { label: 'INCOME', text: 'income' } },
            },
            {
              prop: 'payoutCashIncluded',
              label: 'payout_cash_included',
              radio: { 0: { label: true, text: 'Yes' }, 1: { label: false, text: 'No' } },
            },
          ],
        },
        {
          title: 'transfers',
          schemaElements: [
            { prop: 'minContractIncome', label: 'min_contract_income', append: 'currency' },
            { prop: 'taxDeductionRate', label: 'tax_deduction_rate', append: 'percent' },
            { prop: 'minTransferAmount', label: 'min_transfer_amount', append: 'currency' },
          ],
        },
      ],
      schemaRules: {
        name: [
          { required: true, message: this.$t('validation.schema_name_required'), trigger: 'blur' },
          { max: 150, message: this.$t('validation.schema_too_long'), trigger: 'blur' },
        ],
        contractType: [{ required: true }],

        dailySettlementCost: [
          { required: true, validator: validateNumber, trigger: 'blur' },
          {
            validator: validateValue,
            maxValue: 999.99,
            minValue: 0,
            trigger: 'blur',
          },
        ],
        maxDailySettlementCosts1: [
          { required: true, validator: validateNumber, trigger: 'blur' },
          {
            validator: validateValue,
            maxValue: 999.99,
            minValue: 0,
            trigger: 'blur',
          },
        ],
        maxDailySettlementCosts2: [
          { required: true, validator: validateNumber, trigger: 'blur' },
          {
            validator: validateValue,
            maxValue: 999.99,
            minValue: 0,
            trigger: 'blur',
          },
        ],
        maxDailySettlementCosts3: [
          { required: true, validator: validateNumber, trigger: 'blur' },
          {
            validator: validateValue,
            maxValue: 999.99,
            minValue: 0,
            trigger: 'blur',
          },
        ],
        minContractIncome: [
          { required: true, validator: validateNumber, trigger: 'blur' },
          {
            validator: validateValue,
            maxValue: 9999.99,
            minValue: 0,
            trigger: 'blur',
          },
        ],
        tripSettlementCost: [
          { required: true, validator: validateNumber, trigger: 'blur' },
          {
            validator: validateValue,
            maxValue: 999.99,
            minValue: 0,
            trigger: 'blur',
          },
        ],
        maxTripSettlementCost: [
          { required: true, validator: validateNumber, trigger: 'blur' },
          {
            validator: validateValue,
            maxValue: 999.99,
            minValue: 0,
            trigger: 'blur',
          },
        ],
        taxDeductionRate: [
          { required: true, validator: validateNumber, trigger: 'blur' },
          {
            validator: validateValue,
            maxValue: 100.0,
            minValue: 0,
            trigger: 'blur',
          },
        ],
        vatSplitRate: [
          { required: true, validator: validateNumber, trigger: 'blur' },
          {
            validator: validateValue,
            maxValue: 100.0,
            minValue: 0,
            trigger: 'blur',
          },
        ],
        payoutRate: [
          { required: true, validator: validateNumber, trigger: 'blur' },
          {
            validator: validateValue,
            maxValue: 100.0,
            minValue: 0,
            trigger: 'blur',
          },
        ],
        payoutCashIncluded: [{ required: true, trigger: 'blur' }],
        minTransferAmount: [{ required: true, validator: validateNumber, trigger: 'blur' }],
      },
    };
  },
};

export default schemaRules;
