const state = {
  currentStep: 'STEP_ONE',
  cooperationType: '',
  statementsRequiredValues: {
    EMPLOYED: '',
    INSURANCE: '',
  },
};

const mutations = {
  SET_CURRENT_STEP: (state, payload) => {
    state.currentStep = payload;
  },
  SET_COOPERATION_TYPE: (state, payload) => {
    state.cooperationType = payload;
  },
  UPDATE_STATEMENT_VALUE: (state, payload) => {
    state.statementsRequiredValues[payload.code] = payload.value;
  },
};

const getters = {
  getCurrentStep: () => state.currentStep,
  getStatementsRequiredValues: () => state.statementsRequiredValues,
  getCooperationType: () => state.cooperationType,
};

const actions = {
  updateStatementsRequiredValue: ({ commit }, payload) => {
    commit('UPDATE_STATEMENT_VALUE', payload);
  },
  setCurrentStep: ({ commit }, step) => {
    commit('SET_CURRENT_STEP', step);
  },
  resetSteps: ({ commit }) => {
    commit('SET_CURRENT_STEP', 'STEP_ONE');
  },
  setCooperationType: ({ commit }, payload) => {
    commit('SET_COOPERATION_TYPE', payload);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
