import { getPartnerProfile } from '@/api/partnerProfileApi';

const state = {
  profileInfo: {},
};

const mutations = {
  LOAD_PARTNER_PROFILE: (state, profileInfo) => {
    state.profileInfo = profileInfo;
  },
  SET_LIMITS: (state, settlementsLimits) => {
    state.settlementsLimits = settlementsLimits;
  },
  RESET_PROFILE: (state) => {
    state.profileInfo = {};
    state.settlementsLimits = {};
  },
};

const getters = {
  profileInfo: () => state.profileInfo,
};

const actions = {
  fetchPartnerProfile: async ({ commit }) => {
    await Promise.all([
      getPartnerProfile().then(async (response) => {
        if (response.ok) {
          commit('LOAD_PARTNER_PROFILE', response.data);
        }
      }),
    ]);
  },
  resetProfile: ({ commit }) => {
    commit('LOAD_PARTNER_PROFILE', {});
    commit('SET_LIMITS', {});
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
