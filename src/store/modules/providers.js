import { getAllProviders } from '@/api/providers';

const state = {
  providers: {
    data: [],
  },
};

const mutations = {
  FETCH_ALL_PROVIDERS: (state, payload) => {
    state.providers = payload;
  },
};

const getters = {
  getAvailableProviders: () => state.providers.data,
  getSelectedProviders: (state, getters) => (codes) => {
    return getters.getAvailableProviders.filter((ele) => codes.includes(ele.providerCode));
  },
};

const actions = {
  fetchAllProviders: async ({ commit }, hasDriverApp) => {
    const response = await getAllProviders(hasDriverApp);
    commit('FETCH_ALL_PROVIDERS', response);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
