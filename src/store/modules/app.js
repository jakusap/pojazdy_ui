import getSymbolFromCurrency from 'currency-symbol-map';

const state = {
  device: 'desktop',
  dataLoading: false,
  locale: null,
  instance: null,
  currency: null,
  currencySymbol: null,
};

const getters = {
  storedLocale: (state) => state.locale,
  currency: (state) => state.currency,
  currencySymbol: (state) => state.currencySymbol,
};

const mutations = {
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
  TOGGLE_DATA_LOADING: (state, value) => {
    state.dataLoading = value;
  },
  CHANGE_LOCALE: (state, locale) => {
    state.locale = locale;
  },
  SET_INSTANCE: (state, instance) => {
    state.instance = instance;
  },
  SET_CURRENCY: (state, currency) => {
    state.currency = currency;
  },
  SET_CURRENCY_SYMBOL: (state, currencySymbol) => {
    state.currencySymbol = currencySymbol;
  },
};

const actions = {
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device);
  },
  toggleDataLoading({ commit }, value) {
    commit('TOGGLE_DATA_LOADING', value);
  },
  changeLocale({ commit }, locale) {
    commit('CHANGE_LOCALE', locale);
  },
  setInstance({ commit }, instance) {
    commit('SET_INSTANCE', instance);
  },
  setCurrency({ commit }, currency) {
    commit('SET_CURRENCY', currency);
    commit('SET_CURRENCY_SYMBOL', getSymbolFromCurrency(currency));
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
