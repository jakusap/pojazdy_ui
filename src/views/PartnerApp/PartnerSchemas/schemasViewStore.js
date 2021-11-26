const state = {
  addMode: false,
  editMode: false,
  additionalCosts: [],
  monthlyCosts: [],
  editedSchema: {},
  selectedNumber: 0,
  driversList: [],
};
const getters = {
  addMode: (state) => state.addMode,
  editMode: (state) => state.editMode,
  additionalCosts: (state) => state.additionalCosts,
  monthlyCosts: (state) => state.monthlyCosts,
  editedSchema: (state) => state.editedSchema,
  selectedNumber: (state) => state.selectedNumber,
  driversList: (state) => state.driversList,
};

const mutations = {
  SET_ADD_MODE(state, addModeState) {
    state.addMode = addModeState;
  },
  SET_EDIT_MODE(state, editModeState) {
    state.editMode = editModeState;
  },
  SET_ADDITIONAL_COSTS(state, additionalCosts) {
    state.additionalCosts = additionalCosts;
  },
  SET_MONTHLY_COSTS(state, monthlyCosts) {
    state.monthlyCosts = monthlyCosts;
  },
  SET_EDITED_SCHEMA(state, schema) {
    state.editedSchema = schema;
  },
  SET_SELECTED_NUMBER(state, selectedNumber) {
    state.selectedNumber = selectedNumber;
  },
  LOAD_DRIVERS_LIST(state, driversList) {
    state.driversList = driversList;
  },
};

const actions = {
  setAddMode({ commit }, addModeState) {
    commit('SET_ADD_MODE', addModeState);
  },
  setEditMode({ commit }, editModeState) {
    commit('SET_EDIT_MODE', editModeState);
  },
  setAdditionalCosts({ commit }, additionalCosts) {
    commit('SET_ADDITIONAL_COSTS', additionalCosts);
  },
  setMonthlyCosts({ commit }, monthlyCosts) {
    commit('SET_MONTHLY_COSTS', monthlyCosts);
  },
  setEditedSchema({ commit }, schema) {
    commit('SET_EDITED_SCHEMA', schema);
    commit('SET_SELECTED_NUMBER', schema.schemaNumber);
  },
  resetSchemaNumber({ commit }) {
    commit('SET_SELECTED_NUMBER', 0);
  },
  loadDriversList({ commit }, driversList) {
    commit('LOAD_DRIVERS_LIST', driversList);
  },
};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
