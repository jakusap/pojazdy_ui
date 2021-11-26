import { getSettlementPeriods } from '@/api/suggestionsApi';

const state = {
  settlementPeriods: [],
  selectedSettlementPeriodCode: null,
};

const mutations = {
  SET_PERIODS: (state, periods) => {
    !state.selectedSettlementPeriodCode && (state.selectedSettlementPeriodCode = periods[1].code);
    state.settlementPeriods = periods;
  },
  SELECT_PERIOD: (state, period) => {
    state.selectedSettlementPeriodCode = period;
  },
  RESET_PERIODS: (state) => {
    state.selectedSettlementPeriodCode = null;
    state.settlementPeriods = [];
  },
};

const actions = {
  selectPeriod({ commit }, period) {
    commit('SELECT_PERIOD', period);
  },
  loadPeriods: async ({ commit }) => {
    return new Promise((resolve) => {
      getSettlementPeriods().then((response) => {
        if (!response.ok && response.response.status !== 401) {
          resolve();
          return;
        }
        commit('SET_PERIODS', response.data);
        resolve();
      });
    });
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
