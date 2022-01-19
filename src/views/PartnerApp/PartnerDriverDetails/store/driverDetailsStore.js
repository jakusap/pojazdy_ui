import { getDriver } from '@/api/driversApi.js';

const state = {
  viewLoading: false,
  driver: { fetching: false, data: {} },
  driverUUID: null,
};

const getters = {
  viewLoading: (state) => state.viewLoading,
  driver: (state) => state.driver.data,
  driverUUID: (state) => state.driverUUID,
};

const mutations = {
  VIEW_LOADING(state, payload) {
    state.viewLoading = payload;
  },
  DRIVER_UUID(state, payload) {
    state.driverUUID = payload;
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
      }
    });
    commit('VIEW_LOADING', false);
  },
};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
