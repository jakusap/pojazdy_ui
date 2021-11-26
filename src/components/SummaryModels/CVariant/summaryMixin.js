import { formatDate } from 'element-ui/src/utils/date-util';

import { formatDateLong } from '@/filters';

import { providerExistsInProviderSettlementSummaries } from '../utils';
const summaryMixin = {
  data() {
    return {
      providerSummaries: [],
      invoiceVat: [],
      payoutSummary: [],
      negativeCostTransactions: [],
      positiveCostTransactions: [],
      monthlyCosts: [],
      additionalSettlementCosts: [],
      finalSettlementCost: [],
      previousPeriodBalance: [],
      extrasBalance: [],
      charges: [],
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
    weeklySummary() {
      const providers = this.details.weeklyIncomes[0].incomes.map((income) => income.provider);
      return this.details ? { summary: this.details.weeklyIncomes, providers: providers } : [];
    },

    filteredPeriods() {
      const lastIndex = this.settlementPeriods.findIndex((period) => period.dateFrom < this.details.settlementFrom);
      return this.settlementPeriods.slice(0, lastIndex);
    },
    payoutRate() {
      return this.details.settlementSchema.payoutRate !== 1 && this.details.payout > 0;
    },
    fuelSummary() {
      return this.details.fuelTransactions.map((fuelTransaction) => {
        return {
          description: 'fuel',
          provider: fuelTransaction.provider,
          value: fuelTransaction.grossAmount,
          date: formatDate(fuelTransaction.transactionDate),
        };
      });
    },
  },
  methods: {
    getNegativeCostTransactions() {
      if (this.details?.costTransactionSummaries) {
        return this.details.costTransactionSummaries.filter((transaction) => {
          const { amount } = transaction;
          if (transaction.amount < 0) return amount;
        });
      } else return [];
    },
    getPositiveCostTransactions() {
      if (this.details?.costTransactionSummaries) {
        return this.details.costTransactionSummaries.filter((transaction) => {
          const { amount } = transaction;
          if (transaction.amount > 0) return amount;
        });
      } else return [];
    },
    getMonthlyCosts() {
      if (this.details?.settlementSchema?.monthlyCosts) {
        return this.details.settlementSchema.monthlyCosts.map((cost) => {
          return { description: cost.name, value: -cost.amount };
        });
      } else return [];
    },
    getProviderTaxSummary() {
      if (this.details?.providerSettlementSummaries) {
        return this.details?.providerSettlementSummaries
          .map((s) => {
            return s.tax;
          })
          .reduce((prev, curr) => prev + curr, 0);
      }
    },
    amountVariantC(amount) {
      const parsedAmount = parseFloat(amount);
      const symbol = this.$store.state.app.currencySymbol;

      if (isNaN(parsedAmount)) return `${amount || parseFloat('0').toFixed(2)} ${symbol}`;

      return `${parsedAmount.toFixed(2)} ${symbol}`;
    },
    calculateSettlementSummary(details) {
      const {
        settlementCost,
        settlementSchema,
        previousPeriodTransfer,
        providerSettlementSummaries,
        taxOptimization,
        contractCost,
        payout,
      } = details;
      const settlementSummary = [];
      let providersSummaryBalance;

      this.providerSummaries = [];
      this.payoutSummary = [];
      this.negativeCostTransactions = [];
      this.monthlyCosts = [];
      this.invoiceVat = [];
      this.finalSettlementCost = [];
      this.previousPeriodBalance = [];
      this.extrasBalance = [];
      this.charges = [];
      this.taxCharges = [];
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
              (Math.abs(summary.bonus) || 0) -
              Math.abs(summary.tax);

            totalTransfer = transfer;
            grossIncome = transfer;
            break;

          case 'GLOVO':
            transfer =
              summary.income - Math.abs(summary.cashCollected) - Math.abs(summary.providerFee) - Math.abs(summary.tax);
            totalTransfer = transfer;
            grossIncome = transfer;
            break;

          default:
            transfer =
              summary.income - Math.abs(summary.cashCollected) + (Math.abs(summary.bonus) || 0) - Math.abs(summary.tax);
            grossIncome = summary.income + summary.providerFee;
            totalTransfer = transfer;
            break;
        }

        switch (summary.provider) {
          case 'GLOVO':
            rows = [
              {
                description: 'glovo_income',
                value: summary.income - summary.tips - summary.bankable - summary.adjustment,
              },
              { description: 'bankable_card', value: summary.bankable },
              { description: 'tip', value: summary.tips },
              { description: 'cash_collected', value: -Math.abs(summary.cashCollected) },
              { description: 'glovo_fee', value: summary.providerFee },
              { description: 'adjustment', value: summary.adjustment },
              { description: 'transfer', value: transfer },
            ];
            break;
          case 'STUART':
            rows = [{ description: 'income', value: summary.income }];
            break;
          case 'BOLT_FOOD':
            rows = [{ description: 'income', value: summary.income }];
            break;
          case 'BOLT':
          case 'UBER':
            rows = [
              { description: 'income', value: summary.income },
              { description: 'cash_collected', value: -Math.abs(summary.cashCollected) },
              { description: 'bonus_tips', value: summary.bonus },
              { description: 'tax', value: -Math.abs(summary.tax) },
              { description: 'transfer', value: transfer },
            ];
            break;
          case 'WOLT':
            rows = [
              { description: 'income', value: summary.income },
              { description: 'tip', value: summary.bonus },
            ];
            break;
          default:
            rows = [
              { description: 'income', value: summary.income },
              { description: 'cash_collected', value: -Math.abs(summary.cashCollected) },
              { description: 'fee', value: -Math.abs(summary.providerFee) },
              { description: 'bonus_tips', value: summary.bonus },
              { description: 'tax', value: -Math.abs(summary.tax) },
              { description: 'transfer', value: transfer },
            ];
        }

        this.providerSummaries.push({
          provider: summary.provider,
          grossIncome: grossIncome,
          totalTransfer: transfer,
          rows: rows,
        });
      });

      providersSummaryBalance = this.providerSummaries.reduce((prev, curr) => prev + curr.totalTransfer, 0);
      if (previousPeriodTransfer) {
        this.previousPeriodBalance.push({
          description: 'previous_settlements_balance',
          value: previousPeriodTransfer,
        });
        providersSummaryBalance += previousPeriodTransfer;
      }
      this.previousPeriodBalance.push({
        description: 'balance',
        value: providersSummaryBalance,
      });

      if (this.getNegativeCostTransactions().length) {
        this.negativeCostTransactions = this.getNegativeCostTransactions().map((t) => {
          return { description: t.description, value: Math.abs(t.amount) };
        });
      }

      const invoiceVat = Math.round(this.getProviderTaxSummary() - Math.max(taxOptimization, 0));
      if (invoiceVat !== 0) {
        this.invoiceVat.push({
          description: 'invoice_vat',
          value: invoiceVat,
        });
      }
      const extrasSum = invoiceVat + this.negativeCostTransactions.reduce((prev, curr) => prev + curr.value, 0);
      if (extrasSum > 0) {
        providersSummaryBalance += extrasSum;
        this.extrasBalance.push({
          description: 'balance',
          value: providersSummaryBalance,
        });
      }
      if (contractCost) {
        this.monthlyCosts = this.getMonthlyCosts();
      }
      if (this.getPositiveCostTransactions().length) {
        this.positiveCostTransactions = this.getPositiveCostTransactions().map((t) => {
          return { description: t.description, value: -Math.abs(t.amount) };
        });
      }
      const additionalCosts = settlementSchema.additionalCosts.filter((cost) => {
        return (
          !cost.provider || providerExistsInProviderSettlementSummaries(providerSettlementSummaries, cost.provider)
        );
      });

      this.additionalSettlementCosts = additionalCosts.map((cost) => {
        return { description: cost.name, value: -cost.amount };
      });
      this.charges = this.monthlyCosts.concat(this.positiveCostTransactions).concat(this.additionalSettlementCosts);
      const chargesBalance =
        this.monthlyCosts.reduce((prev, curr) => prev + curr.value, 0) +
        this.positiveCostTransactions.reduce((prev, curr) => prev + curr.value, 0) +
        this.additionalSettlementCosts.reduce((prev, curr) => prev + curr.value, 0);

      const additionalCost = additionalCosts.length
        ? settlementCost - additionalCosts.map((cost) => cost.amount).reduce((prev, curr) => prev + curr)
        : 0;
      const tax = -(providersSummaryBalance - (payout - chargesBalance));
      if (this.payoutRate && payout > 0) {
        this.taxCharges.push({
          description: 'payout_rate_tax',
          value: tax,
        });
      }
      const finalSettlementCost =
        settlementCost -
        (additionalCosts.length ? additionalCosts.map((cost) => cost.amount).reduce((prev, curr) => prev + curr) : 0);
      if (finalSettlementCost !== 0) {
        this.finalSettlementCost.push({
          description: 'settlement_cost',
          value: -finalSettlementCost,
        });
      }
      const minTransferAmount = settlementSchema.minTransferAmount;
      if (minTransferAmount > 0) {
        this.payoutSummary.push({ description: 'payout_balance', value: payout < minTransferAmount ? 0 : payout });
        payout < minTransferAmount && this.payoutSummary.push({ description: 'next_period_transfer', value: payout });
      } else {
        this.payoutSummary.push({ description: 'payout_balance', value: payout < 0 ? 0 : payout });
        payout < 0 && this.payoutSummary.push({ description: 'next_period_transfer', value: payout });
      }
      return settlementSummary;
    },
  },
};

export default summaryMixin;
