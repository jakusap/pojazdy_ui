import { Message } from 'element-ui';

import { getSchemas } from '@/api/schemasApi';

const loadingSchemasFailedMessage = () => {
  Message({
    type: 'error',
    message: this.$t('errors.loading_schemas_error'),
    center: true,
  });
};

const state = {
  schemas: [],
};

const mutations = {
  LOAD_SCHEMAS: (state, schemas) => {
    state.schemas = schemas;
  },
  RESET_SCHEMAS: (state) => {
    state.schemas = [];
  },
};

const actions = {
  loadSchemas: ({ commit, dispatch }) => {
    dispatch('app/toggleDataLoading', true, { root: true });
    return new Promise((resolve) => {
      getSchemas()
        .then((response) => {
          if (!response.ok && response.response.status !== 401) {
            loadingSchemasFailedMessage();
            resolve();
            return;
          }
          response.data.sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            if (aName > bName) return 1;
            if (aName < bName) return -1;
            return 0;
          });

          commit('LOAD_SCHEMAS', response.data);
          resolve();
        })
        .then(() => dispatch('app/toggleDataLoading', false, { root: true }));
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
