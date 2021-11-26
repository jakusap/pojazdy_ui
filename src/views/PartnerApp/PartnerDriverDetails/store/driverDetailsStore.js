import { getLinkedByEmail } from '@/api/driverLinksApi';
import { getDriver, getMessagesInfo } from '@/api/driversApi.js';
import { getSignedDocumentsForDriver } from '@/api/partnerDocumentsApi';
import { getPaidSettlements, getPendingSettlements, getSettledSettlements } from '@/api/settlementsApi';

const state = {
  viewLoading: false,
  driver: { fetching: false, data: {} },
  messages: { fetching: false, data: [] },
  driverProfile: { fetching: false, data: null },
  settlements: { fetching: false, data: { pending: [], settled: [], paid: [] } },
  signedContracts: { fetching: false, data: [] },
  driverUUID: null,
};

const getters = {
  viewLoading: (state) => state.viewLoading,
  driver: (state) => state.driver.data,
  messages: (state) => state.messages.data,
  messagesFetching: (state) => state.messages.fetching,
  driverProfile: (state) => state.driverProfile.data,
  settlements: (state) => state.settlements.data,
  signedContracts: (state) => state.signedContracts.data,
  driverUUID: (state) => state.driverUUID,
};

const mutations = {
  VIEW_LOADING(state, payload) {
    state.viewLoading = payload;
  },
  DRIVER_UUID(state, payload) {
    state.driverUUID = payload;
  },
  SETTLEMENTS(state, { action, payload }) {
    switch (action) {
      case 'FETCHING':
        state.settlements.fetching = payload;
        break;
      case 'PENDING':
        state.settlements.data.pending = payload;
        break;
      case 'SETTLED':
        state.settlements.data.settled = payload;
        break;
      case 'PAID':
        state.settlements.data.paid = payload;
        break;
    }
  },
  DRIVER(state, { action, payload }) {
    switch (action) {
      case 'FETCHING':
        state.driver.fetching = payload;
        break;
      case 'LOAD':
        state.driver.data = payload;
        break;
    }
  },
  MESSAGES(state, { action, payload }) {
    switch (action) {
      case 'FETCHING':
        state.messages.fetching = payload;
        break;
      case 'LOAD':
        state.messages.data = payload;
        break;
    }
  },
  DRIVER_PROFILE(state, { action, payload }) {
    switch (action) {
      case 'FETCHING':
        state.driverProfile.fetching = payload;
        break;
      case 'LOAD':
        state.driverProfile.data = payload;
        break;
    }
  },

  SIGNED_CONTRACTS(state, { action, payload }) {
    switch (action) {
      case 'FETCHING':
        state.signedContracts.fetching = payload;
        break;
      case 'LOAD':
        state.signedContracts.data = payload;
        break;
    }
  },
};

const actions = {
  setViewLoading({ commit }) {
    commit('VIEW_LOADING', true);
  },
  setDriverUUID({ commit }, driverUUID) {
    commit('DRIVER_UUID', driverUUID);
  },
  async getViewInfo({ commit, dispatch }, driverUUID) {
    commit('VIEW_LOADING', true);
    await getDriver(driverUUID).then(async (response) => {
      if (response.ok) {
        commit('DRIVER', { action: 'LOAD', payload: response.data });
        await dispatch('fetchPendingSettlements');

        const driverEmail = response.data.email;

        if (driverEmail) {
          await Promise.all([
            await getMessagesInfo(driverUUID).then((response) => {
              if (response.ok) {
                const sortedResponse = response.data.sort((prev, curr) => prev.id > curr.id && -1);
                commit('MESSAGES', { action: 'LOAD', payload: sortedResponse });
              }
            }),
            await getLinkedByEmail(driverEmail).then((response) => {
              if (response.ok && response.data.length) {
                commit('DRIVER_PROFILE', { action: 'LOAD', payload: response.data[0] });
              }
            }),
          ]);
        }
        await getSignedDocumentsForDriver(null, driverUUID).then((response) => {
          if (response.ok && response.data.length) {
            commit('SIGNED_CONTRACTS', { action: 'LOAD', payload: response.data });
          }
        });
        commit('VIEW_LOADING', false);
      }
    });
  },

  async getDriverDetails({ commit, getters, dispatch }) {
    commit('VIEW_LOADING', true);
    await getDriver(getters.driver.driverUUID).then(async (response) => {
      if (response.ok) {
        commit('DRIVER', { action: 'LOAD', payload: response.data });
        await dispatch('fetchPendingSettlements');

        const driverEmail = response.data.email;

        if (driverEmail) {
          await getLinkedByEmail(getters.driver.email).then((response) => {
            if (response.ok && response.data.length) {
              commit('DRIVER_PROFILE', { action: 'LOAD', payload: response.data[0] });
            }
          });
        }
      }
    }),
      commit('VIEW_LOADING', false);
  },

  async getDriverMessagesInfo({ commit, getters }) {
    commit('MESSAGES', { action: 'FETCHING', payload: true });
    await getMessagesInfo(getters.driver.driverUUID).then((response) => {
      if (response.ok) {
        if (response.ok) {
          const sortedResponse = response.data.sort((prev, curr) => prev.id > curr.id && -1);
          commit('MESSAGES', { action: 'LOAD', payload: sortedResponse });
        }
      }
    });
    commit('MESSAGES', { action: 'FETCHING', payload: false });
  },

  async fetchPendingSettlements({ commit, getters, dispatch, rootGetters }) {
    dispatch('app/toggleDataLoading', true, { root: true });

    const selectedSettlementPeriodCode = rootGetters.selectedSettlementPeriodCode;
    const driverUUID = getters.driverUUID;
    await Promise.all([
      getPendingSettlements(driverUUID, selectedSettlementPeriodCode, null).then((response) => {
        if (response.ok) {
          commit('SETTLEMENTS', { action: 'PENDING', payload: response.data });
        }
      }),
    ]);

    dispatch('app/toggleDataLoading', false, { root: true });
  },
  async fetchSettledSettlements({ commit, getters, dispatch, rootGetters }) {
    dispatch('app/toggleDataLoading', true, { root: true });

    const driverUUID = getters.driverUUID;
    await Promise.all([
      getSettledSettlements(driverUUID).then((response) => {
        if (response.ok) {
          const filteredResponse = response.data.filter((settlement) => settlement.driver.driverUUID === driverUUID);
          commit('SETTLEMENTS', {
            action: 'SETTLED',
            payload: filteredResponse,
          });
        }
      }),
    ]);

    dispatch('app/toggleDataLoading', false, { root: true });
  },

  async fetchPaidSettlements({ commit, getters, dispatch, rootGetters }) {
    dispatch('app/toggleDataLoading', true, { root: true });
    const driverUUID = getters.driverUUID;
    await Promise.all([
      getPaidSettlements(null, driverUUID).then((response) => {
        if (response.ok) {
          const filteredResponse = response.data.filter((settlement) => settlement.driver.driverUUID === driverUUID);
          commit('SETTLEMENTS', {
            action: 'PAID',
            payload: filteredResponse,
          });
        }
      }),
    ]);

    dispatch('app/toggleDataLoading', false, { root: true });
  },
};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
