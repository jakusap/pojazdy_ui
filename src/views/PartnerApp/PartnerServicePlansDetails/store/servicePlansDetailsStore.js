import { getServicePlanCarsList } from '@/api/carsApi.js';
import { getSpecificServicePlanDetails } from '@/api/servicePlansApi.js';

const state = {
  viewLoading: false,
  servicePlan: { fetching: false, data: {} },
  servicePlanId: null,
  servicePlanCars: { fetching: false, data: [] },
  reloadServicePlanCars: false,
};

const getters = {
  viewLoading: (state) => state.viewLoading,
  servicePlan: (state) => state.servicePlan.data,
  servicePlanCars: (state) => state.servicePlanCars.data,
  servicePlanId: (state) => state.servicePlanId,
  reloadServicePlanCars: (state) => {
    return state.reloadServicePlanCars;
  },
};

const mutations = {
  VIEW_LOADING(state, payload) {
    state.viewLoading = payload;
  },
  SERVICE_PLAN(state, { action, payload }) {
    switch (action) {
      case 'FETCHING':
        state.servicePlan.fetching = payload;
        break;
      case 'LOAD':
        state.servicePlan.data = payload;
        break;
    }
  },
  SERVICE_PLAN_CARS(state, { action, payload }) {
    switch (action) {
      case 'FETCHING':
        state.servicePlanCars.fetching = payload;
        break;
      case 'LOAD':
        state.servicePlanCars.data = payload;
        break;
    }
  },
  SERVICE_PLAN_ID(state, payload) {
    state.servicePlanId = payload;
  },
  RELOAD_SERVICE_PLAN_CARS: (state, reload) => {
    state.reloadServicePlanCars = reload;
  },
};

const actions = {
  setViewLoading({ commit }) {
    commit('VIEW_LOADING', true);
  },
  setServicePlanId({ commit }, servicePlanId) {
    commit('SERVICE_PLAN_ID', servicePlanId);
  },
  async getViewInfo({ commit, dispatch }, servicePlanId) {
    commit('VIEW_LOADING', true);
    await getSpecificServicePlanDetails(servicePlanId).then(async (response) => {
      if (response.ok) {
        commit('SERVICE_PLAN', { action: 'LOAD', payload: response.data });
        commit('VIEW_LOADING', false);
      }
    });
  },
  async getServicePlanDetails({ commit, getters }) {
    commit('VIEW_LOADING', true);
    await getSpecificServicePlanDetails(getters.servicePlan.servicePlanId).then(async (response) => {
      if (response.ok) {
        commit('SERVICE_PLAN', { action: 'LOAD', payload: response.data });
      }
    });
    commit('VIEW_LOADING', false);
  },
  async getServicePlanCars({ commit, getters }) {
    commit('VIEW_LOADING', true);
    await getServicePlanCarsList(getters.servicePlan.servicePlanId).then(async (response) => {
      if (response.ok) {
        commit('SERVICE_PLAN_CARS', { action: 'LOAD', payload: response.data });
      }
    });
    commit('VIEW_LOADING', false);
  },
  reloadServicePlanCars({ commit }) {
    commit('RELOAD_SERVICE_PLAN_CARS', true);
  },
  reloadedServicePlanCars({ commit }) {
    commit('RELOAD_SERVICE_PLAN_CARS', false);
  },
};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
