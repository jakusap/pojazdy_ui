import { providerExistsInProviderSettlementSummaries } from '../utils';
const summaryMixin = {
  computed: {
    driverStatus() {
      return {
        isCivil: this.details.settlementSchema.contractType === 'CIVIL_CONTRACT',
      };
    },
    settlementSummary() {
      if (this.details) {
        return this.calculateSettlementSummary(this.details, this.driverStatus);
      }
      return [];
    },
    weeklySummary() {
      if (this.details?.weeklyIncomes) {
        const providers = this.details.weeklyIncomes[0].incomes.map((income) => income.provider);
        return { summary: this.details.weeklyIncomes, providers: providers };
      } else return [];
    },
    invoicesSummary() {
      if (this.details) {
        return [
          {
            description: 'fv_8',
            grossValue: this.details.invoice8GrossAmount,
            vatReturn: this.details.vat8Amount,
          },
          {
            description: 'fv_23',
            grossValue: this.details.invoice23GrossAmount,
            vatReturn: this.details.vat23Amount,
          },
          {
            description: 'fuel_card',
            grossValue: this.details.fuelInvoiceAmount + this.details.fuelTransactionsAmount,
            vatReturn: this.details.fuelInvoiceVatAmount + this.details.fuelTransactionsVatAmount,
          },
        ];
      }
      return [];
    },
    subVariant() {
      return this.details.variant.split('_')[1];
    },
  },
  methods: {
    getSettlementSummary() {
      const payout = this.calculatePayout();
      return [this.$t('Transactions.payout'), this.$amount(payout)];
    },
    calculatePayout() {
      const minTransferAmount = this.details.settlementSchema.minTransferAmount;
      if (minTransferAmount > 0) {
        return this.details.payout > minTransferAmount ? this.details.payout : 0;
      } else {
        return this.details.payout > 0 ? this.details.payout : 0;
      }
    },
    getTaxSummary(params) {
      if (params.data?.length) {
        const summary = this.weeklySummary.providers
          .map((provider) =>
            this.details.providerSettlementSummaries.find((summary) => {
              if (summary.provider === provider) return { provider: provider, tax: provider.tax };
            })
          )
          .map((t) => [this.$amount(t.tax)]);

        return [this.$t('Transactions.tax'), ...summary];
      } else return [];
    },
    getInvoicesSummary(params) {
      const { columns, data } = params;
      if (params.data.length) {
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = this.$t('Transactions.summary');
            return;
          }
          const values = data.map((item) => Number(item[column.property]));
          sums[index] = this.$amount(
            values.reduce((prev, curr) => {
              return prev + curr;
            }, 0)
          );
        });
        return sums;
      }
      return [];
    },

    calculateSettlementSummary(details, driverStatus) {
      const {
        providerSettlementSummaries,
        fuelTransactionsAmount,
        taxOptimization,
        contractCost,
        settlementCost,
        settlementSchema,
        previousPeriodTransfer,
        payout,
      } = details;
      const settlementSummary = [];

      providerSettlementSummaries
        .filter((summary) => summary.provider !== 'STUART' && summary.provider !== 'BOLT_FOOD')
        .forEach((summary) => {
          const cashCollected = Math.abs(summary.cashCollected);
          settlementSummary.push(
            {
              description: summary.provider.toLowerCase() + '_income',
              value: summary.income + summary.bonus,
            },
            { description: summary.provider.toLowerCase() + '_cash_collected', value: cashCollected }
          );
          if ((summary.provider === 'UBER' || summary.provider === 'UBER_EATS') && this.subVariant === '1') {
            settlementSummary.push({
              description: summary.provider.toLowerCase() + '_feeTax',
              value: summary.feeTax,
            });
          }
          if (summary.provider === 'UBER' && this.subVariant === '1' && summary.fiscalFee > 0) {
            settlementSummary.push({
              description: 'fiscal_fee',
              value: summary.fiscalFee,
            });
          }
        });

      driverStatus.isCivil &&
        settlementSummary.push({ description: 'fuel_transactions_amount', value: fuelTransactionsAmount });

      settlementSchema.additionalCosts.forEach((cost) => {
        if (!cost.provider || providerExistsInProviderSettlementSummaries(providerSettlementSummaries, cost.provider)) {
          settlementSummary.push({
            description: cost.name,
            value: cost.amount,
            provider: cost.provider,
            noI18n: true,
          });
        }
      });

      if (this.details?.costTransactionSummaries) {
        this.details.costTransactionSummaries.forEach((transaction) => {
          settlementSummary.push({
            description: transaction.description,
            value: Math.abs(transaction.amount),
            noI18n: true,
          });
        });
      }

      const additionalCost = settlementSchema.additionalCosts.length
        ? settlementCost -
          settlementSchema.additionalCosts.map((cost) => cost.amount).reduce((prev, curr) => prev + curr)
        : 0;

      additionalCost
        ? settlementSummary.push({ description: 'additional_settlement_cost', value: additionalCost })
        : settlementSchema.additionalCosts.length === 0 &&
          settlementCost &&
          settlementSummary.push({ description: 'settlement_cost', value: settlementCost });

      contractCost && settlementSummary.push({ description: 'contract_cost', value: contractCost });

      taxOptimization < 0
        ? (settlementSummary.push({ description: 'tax_optimization', value: 0 }),
          settlementSummary.push({ description: 'tax_excess', value: -taxOptimization }))
        : settlementSummary.push({ description: 'tax_optimization', value: taxOptimization });

      previousPeriodTransfer &&
        settlementSummary.push({ description: 'previous_period_transfer', value: previousPeriodTransfer });
      settlementSchema.minTransferAmount > 0
        ? payout < settlementSchema.minTransferAmount &&
          settlementSummary.push({ description: 'next_period_transfer', value: payout })
        : payout < 0 && settlementSummary.push({ description: 'next_period_transfer', value: payout });
      return settlementSummary;
    },
  },
};

export default summaryMixin;
