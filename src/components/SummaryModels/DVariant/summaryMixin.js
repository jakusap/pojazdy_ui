const summaryMixin = {
  data() {
    return {
      providerSummaries: [],
      payoutSummary: [],
      serviceCosts: [],
      taxSummary: [],
      minuses: [],
      pluses: [],
      vatMultiplier: 0.08,
      netCommissionFreeNowMultiplier: 0.16,
      netIncomeFreeNowMultiplier: 0.84,
      grossCommissionMultiplier: 1.23,
      summaryPrefix: 'TransactionsD.',
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
  },
  methods: {
    driverAdditionalBonusTransactions() {
      if (this.details?.costTransactionSummaries) {
        return this.details.costTransactionSummaries
          .filter((transaction) => {
            if (transaction.amount < 0) return transaction;
          })
          .map((transaction) => {
            const { description, amount } = transaction;
            return { description: description, value: Math.abs(amount) };
          });
      } else return [];
    },
    driverAdditionalCostTransactions() {
      if (this.details?.costTransactionSummaries) {
        return this.details.costTransactionSummaries
          .filter((transaction) => {
            if (transaction.amount > 0) return transaction;
          })
          .map((transaction) => {
            const { description, amount } = transaction;
            return { description: description, value: -Math.abs(amount) };
          });
      } else return [];
    },

    calculateSettlementSummary(details) {
      const {
        settlementCost,
        settlementSchema,
        previousPeriodTransfer,
        providerSettlementSummaries,
        payout,
        contractCost,
      } = details;
      const settlementSummary = [];
      const minTransferAmount = settlementSchema.minTransferAmount;

      this.providerSummaries = [];
      this.payoutSummary = [];
      this.taxSummary = [];
      this.serviceCosts = [];
      this.pluses = [];
      this.minuses = [];

      providerSettlementSummaries
        .filter(
          (summary) => summary.provider === 'UBER' || summary.provider === 'BOLT' || summary.provider === 'FREENOW'
        )
        .map((summary) => {
          let netCommission;
          let grossCommission;
          let netIncome;
          let vatAmount;
          let rest;
          let payout_rate_amount;
          let rows;
          switch (summary.provider) {
            case 'FREENOW':
              netCommission = summary.income * this.netCommissionFreeNowMultiplier;
              netIncome = summary.income * this.netIncomeFreeNowMultiplier;
              grossCommission = summary.providerFee * this.grossCommissionMultiplier;
              break;
            default:
              netCommission = summary.providerFee;
              netIncome = summary.income - summary.providerFee;
              grossCommission = summary.providerFee * this.grossCommissionMultiplier;
              break;
          }
          vatAmount = summary.income * this.vatMultiplier;
          rest = summary.income - summary.providerFee - summary.tax;
          payout_rate_amount = rest * settlementSchema.payoutRate;
          rows = [
            { description: 'gross_income', value: summary.income },
            { description: 'net_commission', value: netCommission },
            { description: 'net_income', value: netIncome },
            { description: 'gross_commission', value: grossCommission },
            { description: 'sales_tax', value: vatAmount },
            { description: 'rest', value: rest },
            { description: 'payout_rate_amount', value: payout_rate_amount },
            { description: 'bonus', value: summary.bonus },
          ];
          if (summary.provider !== 'FREENOW') {
            rows.push({ description: 'tips', value: summary.tips });
          }
          rows.push({ description: 'cash_collected', value: Math.abs(summary.cashCollected) });

          this.providerSummaries.push({
            provider: summary.provider,
            bonus: summary.bonus,
            tips: summary.tips,
            payoutRateAmount: payout_rate_amount,
            cashCollected: summary.cashCollected,
            rows: rows,
          });
        });
      this.generatePlusesList();
      this.generateMinusesList([
        { value: -contractCost, description: this.summaryPrefix + 'contractCosts' },
        { value: -settlementCost, description: this.summaryPrefix + 'settlementCosts' },
      ]);
      settlementSummary.push({
        description: this.summaryPrefix + 'percent_summary',
        value: this.providerSummaries.reduce((prev, curr) => prev + curr.payoutRateAmount, 0),
      });
      settlementSummary.push({
        description: this.summaryPrefix + 'cash_collected',
        value: this.providerSummaries.reduce((prev, curr) => prev + curr.cashCollected, 0),
      });
      previousPeriodTransfer &&
        this.serviceCosts.push({ description: 'previous_period_transfer', value: previousPeriodTransfer });

      if (minTransferAmount > 0) {
        this.payoutSummary.push({ description: 'payout', value: payout < minTransferAmount ? 0 : payout });
        payout < minTransferAmount && this.payoutSummary.push({ description: 'next_period_transfer', value: payout });
      } else {
        this.payoutSummary.push({ description: 'payout', value: payout < 0 ? 0 : payout });
        payout < 0 && this.payoutSummary.push({ description: 'next_period_transfer', value: payout });
      }
      return settlementSummary;
    },
    generatePlusesList() {
      this.conditionalAddToList(
        this.pluses,
        this.providerSummaries.reduce((prev, curr) => prev + curr.bonus, 0) * 0.5,
        this.summaryPrefix + 'bonus'
      );
      this.conditionalAddToList(
        this.pluses,
        this.providerSummaries.reduce((prev, curr) => prev + curr.tips, 0) * 0.7,
        this.summaryPrefix + 'tips'
      );
      const additionalBonuses = this.driverAdditionalBonusTransactions();
      if (additionalBonuses.length > 0) {
        additionalBonuses.forEach((bonus) => {
          this.conditionalAddToList(this.pluses, bonus.value, bonus.description);
        });
      }
    },

    generateMinusesList(recurringCosts) {
      const allMinuses = this.driverAdditionalCostTransactions().concat(recurringCosts);
      if (allMinuses.length > 0) {
        allMinuses.forEach((minus) => {
          this.conditionalAddToList(this.minuses, minus.value, minus.description);
        });
      }
    },

    conditionalAddToList(list, value, description) {
      if (Math.abs(value) > 0) {
        list.push({
          description: description,
          value: value,
        });
      }
    },
  },
};

export default summaryMixin;
