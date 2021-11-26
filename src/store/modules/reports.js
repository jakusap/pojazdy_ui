import { getReportsForPartner } from '@/api/reportsApi';

const state = {
  reports: {
    data: [],
  },
};

const mutations = {
  FETCH_REPORTS_FOR_PARTNER: (state, payload) => {
    state.reports = payload;
  },
};

const getters = {
  reportsForPartner: () => state.reports.data,
  hasDedicatedReports: (state, getters) => !!getters.reportsForPartner.length,
};

const actions = {
  fetchReportsForPartner: async ({ commit }) => {
    const response = await getReportsForPartner();
    commit('FETCH_REPORTS_FOR_PARTNER', response);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
