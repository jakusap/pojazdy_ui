const state = {
  settlements: null,
  settlementsSchemas: [],
  selectedSettlements: [],
  settlementPeriods: null,
  reloadSettlements: false,
  filters: {
    driver: null,
    payout: null,
    dateFrom: null,
    dateTo: null,
    schemaNumbers: null,
    active: null,
  },
  radio: 'pendingSettlements',
};
const getters = {
  settlements: (state) => {
    return state.settlements;
  },
  filters: (state) => {
    return state.filters;
  },
  selectedSettlements: (state) => {
    return state.selectedSettlements;
  },
  radio: (state) => {
    return state.radio;
  },
  reloadSettlements: (state) => {
    return state.reloadSettlements;
  },
  settlementsSchemas: (state) => {
    return state.settlementsSchemas;
  },
};

const mutations = {
  LOAD_SETTLEMENTS: (state, settlements) => {
    state.settlements = settlements;
  },
  SET_FILTERS: (state, filters) => {
    state.filters = filters;
  },
  SELECT_SETTLEMENTS: (state, selectedSettlements) => {
    state.selectedSettlements = selectedSettlements;
  },
  LOAD_DRIVER: (state, driver) => {
    state.driver = driver;
  },
  CHANGE_VIEW: (state, view) => {
    state.radio = view;
  },
  RELOAD_SETTLEMENTS: (state, reload) => {
    state.reloadSettlements = reload;
  },
};

const actions = {
  loadSettlements({ commit }, settlements) {
    commit('LOAD_SETTLEMENTS', settlements);
  },
  reloadSettlements({ commit }) {
    commit('RELOAD_SETTLEMENTS', true);
  },
  reloadedSettlements({ commit }) {
    commit('RELOAD_SETTLEMENTS', false);
  },
  setFilters({ commit }, filters) {
    commit('SET_FILTERS', filters);
  },
  selectSettlements({ commit }, selectedSettlements) {
    commit('SELECT_SETTLEMENTS', selectedSettlements);
  },
  loadDriver({ commit }, driver) {
    commit('LOAD_DRIVER', driver);
  },
  changeView({ commit }, view) {
    commit('CHANGE_VIEW', view);
  },
};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
