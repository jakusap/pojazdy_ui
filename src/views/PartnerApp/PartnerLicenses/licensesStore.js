const state = {
  licensesCart: [],
};

const getters = {
  licensesCart: (state) => {
    return state.licensesCart;
  },
};

const mutations = {
  ADD_LICENSE_TO_CART: (state, license) => {
    const licenseCartIndex = state.licensesCart.findIndex((cartLicense) => cartLicense.uuid === license.uuid);

    if (license.orderedQuantity < license.minimumQuantity) {
      state.licensesCart.splice(licenseCartIndex, 1);
    } else {
      licenseCartIndex + 1
        ? state.licensesCart.splice(licenseCartIndex, 1, license)
        : (state.licensesCart = [license, ...state.licensesCart]);
    }
  },
  REMOVE_LICENSE_FROM_CART: (state, license) => {
    const licenseCartIndex = state.licensesCart.findIndex((cartLicense) => cartLicense.uuid === license.uuid);

    state.licensesCart.splice(licenseCartIndex, 1);
  },
  CLEAR_CART: (state) => {
    state.licensesCart = [];
  },
};

const actions = {
  addLicenseToCart({ commit }, license) {
    commit('ADD_LICENSE_TO_CART', license);
  },
  removeLicenseFromCart({ commit }, license) {
    commit('REMOVE_LICENSE_FROM_CART', license);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
