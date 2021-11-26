import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import Vue from 'vue';

import store from '@/store';

const cacheURLs = ['/api/settlements/periods', '/api/partners'];

const checkIfCachedURL = (request) => {
  return cacheURLs.includes(request.url) ? false : true;
};

const cache = setupCache({
  maxAge: 60 * 60 * 1000,
  exclude: {
    filter: checkIfCachedURL,
  },
});

const axiosCache = axios.create({
  adapter: cache.adapter,
});

const request = async ({ url, method, params, data, headers, body, responseType }) => {
  const config = {
    url: url,
    method: method,
    params: params,
    responseType: responseType,
    data: data,
    headers: headers,
    body: body,
  };

  const response = await axiosCache(config).then((result) => {
    const response = result.response || result;
    return {
      ok: response.status >= 200 && response.status < 400,
      status: response.status,
      ...response,
    };
  });
  return response;
};

axiosCache.interceptors.request.use((config) => {
  if (!Vue.prototype.$keycloak.authenticated) return config;
  if (!config.headers) config.headers = {};
  config.headers.Authorization = `Bearer ${Vue.prototype.$keycloak.token}`;
  return config;
});

axiosCache.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    store.dispatch('app/toggleDataLoading', false);
    return error;
  }
);

export default request;
