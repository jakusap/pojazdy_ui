import {
  addDriverAccount,
  editDriverInfo,
  getDriverInfo,
  getDriverSettlements,
  invitePartner,
} from '@/api/driverAccount';
import { getPartnerInvoiceProvision } from '@/api/invoicesApi';
import { getSignedDocumentsForDriver } from '@/api/partnerDocumentsApi';

const state = {
  loggedDriverInfo: {
    data: null,
  },
  updateDriverInfo: {},
  referencedPartner: null,
  saveDriverInfo: {},
  inviteDriverPartner: {},
  driverSettlements: {
    data: [],
  },
  partnerInvoiceProvision: null,
  signedContracts: [],
};

const mutations = {
  FETCH_LOGGED_DRIVER_INFO: (state, payload) => {
    state.loggedDriverInfo = payload;
  },
  FETCH_DRIVER_UPDATE_INFO: (state, payload) => {
    state.updateDriverInfo = payload;
  },
  SAVE_DRIVER_INFO: (state, payload) => {
    state.saveDriverInfo = payload;
  },
  INVITE_DRIVER_PARTNER: (state, payload) => {
    state.inviteDriverPartner = payload;
  },
  FETCH_DRIVER_SETTLEMENTS: (state, payload) => {
    state.driverSettlements = payload;
  },
  SET_DRIVER_REFERENCED_PARTNER: (state, payload) => {
    state.referencedPartner = payload;
  },
  FETCH_INVOICE_PROVISION: (state, payload) => {
    state.partnerInvoiceProvision = payload;
  },
  FETCH_SIGNED_CONTRACTS: (state, payload) => {
    state.signedContracts = payload;
  },
};

const getters = {
  getLoggedDriverInfo: () => state.loggedDriverInfo.data,
  isLoggedDriverStatusSuccess: () => state.loggedDriverInfo.status == 200,
  isUpdateDriverStatusSuccess: () => state.updateDriverInfo.status == 200,
  getSaveDriverInfo: () => state.saveDriverInfo,
  getInviteDriverPartner: () => state.inviteDriverPartner,
  getDriverSettlements: () => state.driverSettlements.data,
  referencedPartner: () => state.referencedPartner,
  partnerInvoiceProvision: () => state.partnerInvoiceProvision,
  signedContracts: () => state.signedContracts,
};

const actions = {
  saveDriverInfo: async ({ commit }, payload) => {
    const response = await addDriverAccount(payload);
    commit('SAVE_DRIVER_INFO', response);
  },
  fetchLoggedDriverInfo: async ({ commit }) => {
    const response = await getDriverInfo();
    commit('FETCH_LOGGED_DRIVER_INFO', response);
  },
  editLoggedDriverInfo: async ({ commit, dispatch }, payload) => {
    const response = await editDriverInfo(payload);
    commit('FETCH_DRIVER_UPDATE_INFO', response);
    dispatch('fetchLoggedDriverInfo');
  },
  inviteDriverPartner: async ({ commit }, { uuid, consentToSendContactDetails }) => {
    const response = await invitePartner(uuid, consentToSendContactDetails);
    commit('INVITE_DRIVER_PARTNER', response);
  },
  fetchDriverSettlements: async ({ commit }, payload) => {
    const response = await getDriverSettlements(payload);
    commit('FETCH_DRIVER_SETTLEMENTS', response);
  },
  setReferencedPartner: ({ commit }, payload) => {
    commit('SET_DRIVER_REFERENCED_PARTNER', payload);
  },
  fetchPartnerInvoiceProvision: async ({ commit }) => {
    const response = await getPartnerInvoiceProvision();
    commit('FETCH_INVOICE_PROVISION', response);
  },
  fetchDriversSignedContracts: async ({ commit }) => {
    await getSignedDocumentsForDriver(null, null).then((response) => {
      if (response.ok) {
        commit('FETCH_SIGNED_CONTRACTS', response.data);
      }
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
