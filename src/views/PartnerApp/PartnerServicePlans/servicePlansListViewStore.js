const state = {
  reloadServicePlans: false,
};
const getters = {
  reloadServicePlans: (state) => {
    return state.reloadServicePlans;
  },
};

const mutations = {
  RELOAD_SERVICE_PLANS: (state, reload) => {
    state.reloadServicePlans = reload;
  },
};

const actions = {
  reloadServicePlans({ commit }) {
    commit('RELOAD_SERVICE_PLANS', true);
  },
  reloadedServicePlans({ commit }) {
    commit('RELOAD_SERVICE_PLANS', false);
  },
};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
