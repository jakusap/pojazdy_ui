import { getPartnerDocuments, postDocumentsData } from '@/api/partnerDocumentsApi';
import { getPartnerProfile, getSettlementsLimits } from '@/api/partnerProfileApi';

const state = {
  profileInfo: {},
  settlementsLimits: {},
  partnerDocuments: {
    data: [],
  },
  setPartnerDocumentsData: {},
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
  FETCH_PARTNER_DOCUMENTS: (state, partnerDocuments) => {
    state.partnerDocuments = partnerDocuments;
  },
  POST_PARTNER_DOCUMENTS_FILL: (state, response) => {
    state.setPartnerDocumentsData = response;
  },
};

const getters = {
  profileInfo: () => state.profileInfo,
  settlementsLimits: () => state.settlementsLimits,
  getPartnerDocuments: () => state.partnerDocuments.data,
  getPartnerDocumentsResponse: () => state.setPartnerDocumentsData,
};

const actions = {
  fetchPartnerProfile: async ({ commit }) => {
    await Promise.all([
      getPartnerProfile().then(async (response) => {
        if (response.ok) {
          commit('LOAD_PARTNER_PROFILE', response.data);
        }
      }),
      getSettlementsLimits().then((response) => {
        if (response.ok) {
          commit('SET_LIMITS', response.data);
        }
      }),
    ]);
  },
  fetchPartnerDocuments: async ({ commit }) => {
    const response = await getPartnerDocuments();
    commit('FETCH_PARTNER_DOCUMENTS', response);
  },
  postPartnerDocumentsFill: async ({ commit }, documentsData) => {
    const response = await postDocumentsData(documentsData);
    commit('POST_PARTNER_DOCUMENTS_FILL', response);
  },
  updateSettlementsLimits: async ({ commit }) => {
    await getSettlementsLimits().then((response) => {
      if (response.ok) {
        commit('SET_LIMITS', response.data);
      }
    });
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
