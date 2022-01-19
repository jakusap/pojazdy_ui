import 'normalize.css/normalize.css'; // A modern alternative to CSS resets
import 'element-ui/lib/theme-chalk/index.css';
import './styles/element-variables.scss';
import '@/styles/index.scss'; // global css
import '@/icons';

import VueKeyCloak from '@dsb-norge/vue-keycloak-js';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/pl'; // lang i18n
import Vue from 'vue';
import VueCookies from 'vue-cookies';
import VueSignature from 'vue-signature-pad';

import { i18n } from '@/locales/i18n';
import MobileMixin from '@/mixins/mobileMixin';
import ModalGateway from '@/plugins/modalGateway';

import App from './App';
import router from './router';
import store from './store';
Vue.use(ElementUI, { locale });
Vue.component('el-table-subcolumn', ElementUI.TableColumn); //register alias

Vue.mixin(MobileMixin);

Vue.use(ModalGateway);

Vue.config.productionTip = false;

Vue.use(VueKeyCloak, {
  init: {
    // Use 'login-required' to always require authentication
    // If using 'login-required', there is no need for the router guards in router.js
    onLoad: 'check-sso',
  },
  config: {
    realm: 'pojazdy',
    url: '/auth',
    clientId: 'pojazdy-client',
  },
  onReady: () => {
    new Vue({
      el: '#app',
      router,
      store,
      i18n,
      render: (h) => h(App),
    });
  },
});

Vue.use(VueCookies);
Vue.use(VueSignature);
