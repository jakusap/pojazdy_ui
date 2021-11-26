import { getPartnersList } from '@/api/partners';

const state = {
  partners: {
    data: [],
  },
};

const mutations = {
  FETCH_PARTNERS_LIST: (state, payload) => {
    state.partners = payload;
  },
};

const getters = {
  getPartnersList: () => state.partners.data,
};

const actions = {
  fetchPartnersList: async ({ commit }) => {
    const response = await getPartnersList();
    commit('FETCH_PARTNERS_LIST', response);
  },
  setOwnPartner: async ({ dispatch, rootGetters }, payload) => {
    const partnerInfo = rootGetters['driverAccount/getLoggedDriverInfo'];
    delete partnerInfo.email;
    delete partnerInfo.partnerUuid;
    const data = {
      ...partnerInfo,
      partnerUuid: payload,
    };
    dispatch('driverAccount/editLoggedDriverInfo', data, { root: true });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
