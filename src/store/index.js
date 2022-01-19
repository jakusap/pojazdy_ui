import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import getters from './getters';
import app from './modules/app';
import documentsWizard from './modules/documentsWizard';
import partnerProfile from './modules/partnerProfile';
import tabs from './modules/tabs';

Vue.use(Vuex);

const actions = {
  preloadPartnerData: async ({ dispatch }) => {
    await Promise.all([dispatch('partnerProfile/fetchPartnerProfile')]);
  },
  handleLogout: ({ commit, dispatch }) => {
    dispatch('partnerProfile/resetProfile');
    commit('tabs/CLEAR_TABS');
  },
};

const store = new Vuex.Store({
  modules: {
    documentsWizard,
    app,
    partnerProfile,
    tabs,
  },
  plugins: [
    createPersistedState({
      key: 'pojazdy-ui',
      paths: ['tabs', 'app.locale'],
    }),
  ],
  getters,
  actions,
});

export default store;
