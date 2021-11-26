const state = {
  userName: null,
  openTabs: [],
};

const getters = {
  userName: (state) => state.userName,
  openTabs: (state) => state.openTabs,
};

const mutations = {
  SET_TABS_KEY: (state, userName) => {
    if (state.userName !== userName) {
      state.userName = null;
      state.openTabs = [];
    }
    state.userName = userName;
  },
  ADD_TAB: (state, tab) => {
    const index = state.openTabs.findIndex((openTab) => openTab.name === tab.name);
    index >= 0 ? state.openTabs.splice(index, 1, tab) : state.openTabs.push(tab);
  },
  REMOVE_TAB: (state, idx) => {
    state.openTabs.splice(idx, 1);
  },
  REMOVE_PARTNERS_LIST_TABS: (state) => {
    state.openTabs.find((tab, idx) => tab.name === 'DriverPartnersListChildren' && state.openTabs.splice(idx, 1));
  },
  REMOVE_TRANSACTION_TABS: (state) => {
    state.openTabs.find((tab, idx) => tab.name === 'TransactionsSummary' && state.openTabs.splice(idx, 1));
    state.openTabs.find((tab, idx) => tab.name === 'TransactionsDetails' && state.openTabs.splice(idx, 1));
  },
  CLEAR_TABS: (state) => {
    state.openTabs = [];
  },
};

const actions = {
  setTabsKey({ commit }, userName) {
    commit('SET_TABS_KEY', userName);
  },
  addTab({ commit }, tab) {
    commit('ADD_TAB', tab);
  },
  removeTab({ commit }, idx) {
    commit('REMOVE_TAB', idx);
  },
  removeTransactionTabs({ commit }) {
    commit('REMOVE_TRANSACTION_TABS');
  },
  clearTabs({ commit }) {
    commit('CLEAR_TABS');
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
