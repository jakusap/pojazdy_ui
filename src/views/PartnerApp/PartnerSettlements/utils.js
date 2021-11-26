// https://stackoverflow.com/questions/11526504/minimum-and-maximum-date
const MIN_DATE = new Date(-8640000000000000);
const MAX_DATE = new Date(8640000000000000);

export const filterTable = (dataUnfiltered, filters) => {
  let dataFiltered = dataUnfiltered || [];
  if (filters.driver) {
    const driver = filters.driver.toLowerCase();
    dataFiltered = dataFiltered.filter((settlement) => {
      const fullName = settlement.driver.lastName + ' ' + settlement.driver.firstName;
      if (fullName.toLowerCase().search(driver) >= 0) return settlement;
    });
  }
  if (filters.dateFrom) {
    const dateFrom = new Date(filters.dateFrom);
    dataFiltered = dataFiltered.filter((settlement) => {
      const settlementDate = settlement.systemEntryDate || settlement.lastSettlement || MAX_DATE;
      if (new Date(settlementDate) >= dateFrom) return settlement;
    });
  }
  if (filters.dateTo) {
    const dateTo = new Date(filters.dateTo);
    dateTo.setHours(23, 59, 59, 999);
    dataFiltered = dataFiltered.filter((settlement) => {
      const settlementDate = settlement.systemEntryDate || settlement.lastSettlement || MIN_DATE;
      if (new Date(settlementDate) <= dateTo) return settlement;
    });
  }
  if (filters.schemaNumbers?.length) {
    const schemaNumbers = filters.schemaNumbers;
    dataFiltered = dataFiltered.filter((settlement) => {
      if (schemaNumbers.includes(settlement.settlementSchema.schemaNumber)) return settlement;
    });
  }
  if (filters.transactionDateFrom) {
    const dateFrom = new Date(filters.transactionDateFrom);
    dataFiltered = dataFiltered.filter((transaction) => {
      if (new Date(transaction.transactionDate) >= dateFrom) return transaction;
    });
  }
  if (filters.transactionDateTo) {
    const dateTo = new Date(filters.transactionDateTo);
    dateTo.setHours(23, 59, 59, 999);
    dataFiltered = dataFiltered.filter((transaction) => {
      if (new Date(transaction.transactionDate) <= dateTo) return transaction;
    });
  }
  if (filters.provider) {
    dataFiltered = dataFiltered.filter((transaction) => {
      if (transaction.provider.toUpperCase() === filters.provider.toUpperCase()) return transaction;
    });
  }
  if (filters.type) {
    dataFiltered = dataFiltered.filter((transaction) => {
      if (transaction.type.toUpperCase() === filters.type.toUpperCase()) return transaction;
    });
  }
  if (filters.payout) {
    dataFiltered = dataFiltered.filter((transaction) => {
      if (transaction.payout > filters.payout) return transaction;
    });
  }
  if (filters.active) {
    dataFiltered = dataFiltered.filter((settlement) => {
      const driver = settlement.driver;
      const providerSettlementSummaries = settlement.providerSettlementSummaries;
      if (filters.active === 'ACTIVE' && driver.active) return settlement;
      if (filters.active === 'INCLUDE_INCOME' && incomeFormProviders(providerSettlementSummaries)) return settlement;
    });
  }
  return dataFiltered;
};

export const resetFilters = (filters) => {
  Object.keys(filters).forEach((attr) => (filters[attr] = null));
};

export const filtersOn = (filters) => {
  return Object.values(filters).some((f) => (Array.isArray(f) ? f.length : f));
};

const incomeFormProviders = (providerSummaries) => {
  return !providerSummaries.every((providerSummary) => {
    return (
      (providerSummary.income === 0) &
      (providerSummary.bonus === 0) &
      (providerSummary.providerFee === 0) &
      (providerSummary.cashCollected === 0)
    );
  });
};
