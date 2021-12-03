import { getCar } from '@/api/carsApi.js';

const state = {
  viewLoading: false,
  car: { fetching: false, data: {} },
  carId: null,
  reloadCarEvents: false,
};

const getters = {
  viewLoading: (state) => state.viewLoading,
  car: (state) => state.car.data,
  carId: (state) => state.carId,
  reloadCarEvents: (state) => {
    return state.reloadCarEvents;
  },
};

const mutations = {
  VIEW_LOADING(state, payload) {
    state.viewLoading = payload;
  },
  CAR(state, { action, payload }) {
    switch (action) {
      case 'FETCHING':
        state.car.fetching = payload;
        break;
      case 'LOAD':
        state.car.data = payload;
        break;
    }
  },
  CAR_ID(state, payload) {
    state.carId = payload;
  },
  RELOAD_CAR_EVENTS: (state, reload) => {
    state.reloadCarEvents = reload;
  },
};

const actions = {
  setViewLoading({ commit }) {
    commit('VIEW_LOADING', true);
  },
  setCarId({ commit }, carId) {
    commit('CAR_ID', carId);
  },
  async getViewInfo({ commit, dispatch }, carId) {
    commit('VIEW_LOADING', true);
    await getCar(carId).then(async (response) => {
      if (response.ok) {
        commit('CAR', { action: 'LOAD', payload: response.data });
        commit('VIEW_LOADING', false);
      }
    });
  },
  async getCarDetails({ commit, getters }) {
    commit('VIEW_LOADING', true);
    await getCar(getters.car.carId).then(async (response) => {
      if (response.ok) {
        commit('CAR', { action: 'LOAD', payload: response.data });
      }
    });
    commit('VIEW_LOADING', false);
  },
  reloadCarEvents({ commit }) {
    commit('RELOAD_CAR_EVENTS', true);
  },
  reloadedCarEvents({ commit }) {
    commit('RELOAD_CAR_EVENTS', false);
  },
};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
