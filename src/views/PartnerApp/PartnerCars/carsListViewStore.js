const state = {
  reloadCars: false,
};
const getters = {
  reloadCars: (state) => {
    return state.reloadCars;
  },
};

const mutations = {
  RELOAD_CARS: (state, reload) => {
    state.reloadCars = reload;
  },
};

const actions = {
  reloadCars({ commit }) {
    commit('RELOAD_CARS', true);
  },
  reloadedCars({ commit }) {
    commit('RELOAD_CARS', false);
  },
};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
