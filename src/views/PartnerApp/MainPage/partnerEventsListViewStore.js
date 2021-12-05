const state = {
  reloadPartnerEvents: false,
};
const getters = {
  reloadPartnerEvents: (state) => {
    return state.reloadPartnerEvents;
  },
};

const mutations = {
  RELOAD_PARTNER_EVENTS: (state, reload) => {
    state.reloadPartnerEvents = reload;
  },
};

const actions = {
  reloadPartnerEvents({ commit }) {
    commit('RELOAD_PARTNER_EVENTS', true);
  },
  reloadedPartnerEvents({ commit }) {
    commit('RELOAD_PARTNER_EVENTS', false);
  },
};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
