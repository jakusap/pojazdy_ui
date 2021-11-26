import { deleteTransaction, getPendingTransactions, getSettlementTransactions } from '@/api/transactions.js';

const state = {
  transactionsDetails: null,
  settlementUUID: null,
  driverUUID: null,
  transactionTypes: null,
  providerNames: null,
  transactionsLoading: true,
};

const getters = {
  transactionsDetails: (state) => state.transactionsDetails,
  settlementUUID: (state) => state.settlementUUID,
  driverUUID: (state) => state.driverUUID,
  transactionTypes: (state) => state.transactionTypes,
  providerNames: (state) => state.providerNames,
  transactionsLoading: (state) => state.transactionsLoading,
};

const mutations = {
  LOAD_SETTLEMENT_UUID(state, settlementUUID) {
    state.settlementUUID = settlementUUID;
  },
  LOAD_DRIVER_UUID(state, driverUUID) {
    state.driverUUID = driverUUID;
  },
  LOAD_TRANSACTIONS_DETAILS(state, transactions) {
    state.transactionsDetails = transactions;
  },
  LOAD_TRANSACTION_TYPES(state, transactionTypes) {
    state.transactionTypes = transactionTypes;
  },
  LOAD_PROVIDER_NAMES(state, providerNames) {
    state.providerNames = providerNames;
  },
};

const actions = {
  loadConfig({ commit }, { settlementUUID: settlementUUID, driverUUID: driverUUID }) {
    commit('LOAD_SETTLEMENT_UUID', settlementUUID);
    commit('LOAD_DRIVER_UUID', driverUUID);
  },
  loadTransactionsDetails({ commit, dispatch, getters, rootGetters }) {
    dispatch('app/toggleDataLoading', true, { root: true });
    let transactionsRequest = null;

    const periodCode = rootGetters.selectedSettlementPeriodCode;

    getters.settlementUUID
      ? (transactionsRequest = getSettlementTransactions(getters.settlementUUID))
      : (transactionsRequest = getPendingTransactions(getters.driverUUID, periodCode));

    transactionsRequest.then((response) => {
      const sortedTransactions = response.data.sort((curr, next) => {
        return new Date(curr.transactionDate) > new Date(next.transactionDate) ? -1 : 0;
      });
      const transactionTypes = new Set(response.data.map((transactions) => transactions.type));
      const providerNames = new Set(response.data.map((transactions) => transactions.provider));

      commit('LOAD_TRANSACTIONS_DETAILS', sortedTransactions);
      commit('LOAD_TRANSACTION_TYPES', transactionTypes);
      commit('LOAD_PROVIDER_NAMES', providerNames);
      dispatch('app/toggleDataLoading', false, { root: true });
    });
  },
  async removeTransaction({ dispatch }, transactionUUID) {
    dispatch('app/toggleDataLoading', true, { root: true });
    return await deleteTransaction(transactionUUID).then((response) => {
      dispatch('loadTransactionsDetails');
      return response;
    });
  },
};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
