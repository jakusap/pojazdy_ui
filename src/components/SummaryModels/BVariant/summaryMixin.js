import { providerExistsInProviderSettlementSummaries } from '../utils';
const summaryMixin = {
  data() {
    return {
      serviceCosts: [],
      providerSummaries: [],
      vatSummary: [],
      payoutSummary: [],
    };
  },
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
    costTransactionSummary() {
      if (this.details?.costTransactionSummaries) {
        return this.details.costTransactionSummaries.map((transaction) => {
          const { description, amount } = transaction;
          return { description: description, value: Math.abs(amount) };
        });
      }
    },
    weeklySummary() {
      const providers = this.details.weeklyIncomes[0].incomes.map((income) => income.provider);
      return this.details ? { summary: this.details.weeklyIncomes, providers: providers } : [];
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
        ];
      }
      return [];
    },
    filteredPeriods() {
      const lastIndex = this.settlementPeriods.findIndex((period) => period.dateFrom < this.details.settlementFrom);
      return this.settlementPeriods.slice(0, lastIndex);
    },
  },
  methods: {
    getSettlementSummary() {
      const payout = this.details.payout > 0 ? this.details.payout : 0;

      return [this.$t('TransactionsB.payout'), this.$amount(payout)];
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

        return [this.$t('TransactionsB.tax'), ...summary];
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

    calculateSettlementSummary(details) {
      const {
        settlementCost,
        settlementSchema,
        previousPeriodTransfer,
        providerSettlementSummaries,
        taxOptimization,
        payout,
        contractCost,
      } = details;
      const settlementSummary = [];

      this.serviceCosts = [];
      this.providerSummaries = [];
      this.payoutSummary = [];
      this.vatSummary = [];

      providerSettlementSummaries.map((summary) => {
        let transfer;
        let grossIncome;
        let totalTransfer;
        let rows;
        switch (summary.provider) {
          case 'FREENOW':
            transfer =
              summary.income -
                Math.abs(summary.cashCollected) -
                Math.abs(summary.providerFee) +
                Math.abs(summary.bonus) || 0;

            totalTransfer = transfer;
            grossIncome = transfer;
            break;

          default:
            transfer = summary.income - Math.abs(summary.cashCollected) + Math.abs(summary.bonus) || 0;
            grossIncome = summary.income + summary.providerFee;
            totalTransfer = transfer + summary.bonus;
            break;
        }
        if (!(summary.provider === 'STUART' || summary.provider === 'BOLT_FOOD')) {
          rows = [
            { description: 'income', value: summary.income },
            { description: 'cash_collected', value: Math.abs(summary.cashCollected) },
            { description: 'fee', value: summary.providerFee },
            { description: 'bonus', value: summary.bonus },
            { description: 'transfer', value: transfer },
          ];

          this.providerSummaries.push({
            provider: summary.provider,
            grossIncome: grossIncome,
            totalTransfer: transfer,
            rows: rows,
          });
        }
      });

      settlementSummary.push({
        description: 'gross_income',
        value: this.providerSummaries.reduce((prev, curr) => prev + curr.grossIncome, 0),
      });

      settlementSummary.push({
        description: 'total_transfer',
        value: this.providerSummaries.reduce((prev, curr) => prev + curr.totalTransfer, 0),
      });

      if (contractCost) {
        this.serviceCosts.push(
          ...settlementSchema.monthlyCosts.map((cost) => {
            return {
              description: cost.name,
              value: cost.amount,
            };
          })
        );
      }

      const additionalCosts = settlementSchema.additionalCosts.filter((cost) => {
        return (
          !cost.provider || providerExistsInProviderSettlementSummaries(providerSettlementSummaries, cost.provider)
        );
      });

      additionalCosts.forEach((cost) => {
        this.serviceCosts.push({
          description: cost.name,
          value: cost.amount,
          provider: cost.provider,
        });
      });

      const additionalCost = additionalCosts.length
        ? settlementCost - additionalCosts.map((cost) => cost.amount).reduce((prev, curr) => prev + curr)
        : 0;

      additionalCost
        ? this.serviceCosts.push({ description: 'additional_settlement_cost', value: additionalCost })
        : additionalCosts.length === 0 &&
          settlementCost &&
          this.serviceCosts.push({ description: 'settlement_cost', value: settlementCost });

      previousPeriodTransfer &&
        this.serviceCosts.push({ description: 'previous_period_transfer', value: previousPeriodTransfer });

      const minTransferAmount = settlementSchema.minTransferAmount;

      if (minTransferAmount > 0) {
        this.payoutSummary.push({ description: 'payout', value: payout < minTransferAmount ? 0 : payout });
        payout < minTransferAmount && this.payoutSummary.push({ description: 'next_period_transfer', value: payout });
      } else {
        this.payoutSummary.push({ description: 'payout', value: payout < 0 ? 0 : payout });
        payout < 0 && this.payoutSummary.push({ description: 'next_period_transfer', value: payout });
      }
      taxOptimization && this.vatSummary.push({ description: 'vat_amount_from_gross', value: taxOptimization });

      return settlementSummary;
    },
  },
};

export default summaryMixin;
