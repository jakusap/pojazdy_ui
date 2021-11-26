import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import getters from './getters';
import app from './modules/app';
import documentsWizard from './modules/documentsWizard';
import driverAccount from './modules/driverAccount';
import partnerProfile from './modules/partnerProfile';
import partners from './modules/partners';
import periods from './modules/periods';
import providers from './modules/providers';
import reports from './modules/reports';
import schemas from './modules/schemas';
import settings from './modules/settings';
import suggestions from './modules/suggestions';
import tabs from './modules/tabs';

Vue.use(Vuex);

const actions = {
  preloadPartnerData: async ({ dispatch }) => {
    await Promise.all([
      dispatch('periods/loadPeriods'),
      dispatch('schemas/loadSchemas'),
      dispatch('partnerProfile/fetchPartnerProfile'),
      dispatch('reports/fetchReportsForPartner'),
    ]);
  },
  handleLogout: ({ commit, dispatch }) => {
    dispatch('partnerProfile/resetProfile');
    commit('periods/RESET_PERIODS');
    commit('schemas/RESET_SCHEMAS');
    commit('tabs/CLEAR_TABS');
  },
};

const store = new Vuex.Store({
  modules: {
    documentsWizard,
    app,
    driverAccount,
    settings,
    partners,
    providers,
    periods,
    partnerProfile,
    reports,
    suggestions,
    schemas,
    tabs,
  },
  plugins: [
    createPersistedState({
      key: 'taksowki-ui',
      paths: ['tabs', 'app.locale'],
    }),
  ],
  getters,
  actions,
});

export default store;
