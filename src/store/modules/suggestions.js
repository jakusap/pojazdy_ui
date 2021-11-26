import { getSuggestionsCities, getSuggestionsDictionary } from '@/api/suggestions';

const state = {
  suggestions: {
    cities: {
      data: [],
    },
    dictionaries: {
      data: [],
    },
  },
};

const mutations = {
  FETCH_SUGGESTIONS_CITIES: (state, payload) => {
    state.suggestions.cities = payload;
  },
  FETCH_DICTIONARIES: (state, payload) => {
    state.suggestions.dictionaries = payload;
  },
};

const getters = {
  getSuggestionsCities: () => state.suggestions.cities.data,
  getDictionaries: () => state.suggestions.dictionaries.data,
};

const actions = {
  fetchSuggestionsCities: async ({ commit }, payload) => {
    const response = await getSuggestionsCities(payload);
    commit('FETCH_SUGGESTIONS_CITIES', response);
  },
  fetchDictionaries: async ({ commit }) => {
    const response = await getSuggestionsDictionary();
    commit('FETCH_DICTIONARIES', response);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
