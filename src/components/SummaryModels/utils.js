export const providerExistsInProviderSettlementSummaries = (providerSettlementSummaries, provider) => {
  return providerSettlementSummaries.some((summary) => {
    return summary.provider == provider && summary.income;
  });
};
