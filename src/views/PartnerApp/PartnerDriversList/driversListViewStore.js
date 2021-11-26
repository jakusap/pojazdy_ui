const state = {
  reloadDrivers: false,
};
const getters = {
  reloadDrivers: (state) => {
    return state.reloadDrivers;
  },
};

const mutations = {
  RELOAD_DRIVERS: (state, reload) => {
    state.reloadDrivers = reload;
  },
};

const actions = {
  reloadDrivers({ commit }) {
    commit('RELOAD_DRIVERS', true);
  },
  reloadedDrivers({ commit }) {
    commit('RELOAD_DRIVERS', false);
  },
};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
