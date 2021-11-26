import Vue from 'vue';
import Router from 'vue-router';

import RoleRedirect from '@/views/shared/RoleRedirect';

import driverRoutes from './driver';
import partnerRoutes from './partner';

Vue.use(Router);

export const constantRoutes = [
  {
    path: '/forbidden',
    name: '403',
    component: () => import(/* webpackChunkName: "shared" */ '@/views/shared/Errors/403'),
    hidden: true,
    meta: { public: true },
  },

  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "shared" */ '@/views/shared/Errors/404'),
    hidden: true,
    meta: { public: true },
  },

  {
    path: '/',
    name: 'RoleRedirect',
    component: RoleRedirect,
  },

  {
    path: '/driver-summary/:tokenUUID',
    name: 'DriverSummary',
    component: () => import(/* webpackChunkName: "common" */ '@/views/common/DriverSummary'),
    hidden: true,
    meta: { transitionName: 'fade-transform', public: true },
    props: changeSummaryProps,
  },

  { path: '*', redirect: '/404' },
];

export function changeSummaryProps(route) {
  return {
    tokenUUID: route.params.tokenUUID,
    driverUUID: route.params.driverUUID,
  };
}

const createRouter = () =>
  new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior: () => ({ y: 0 }),
    routes: [...constantRoutes, ...driverRoutes, ...partnerRoutes],
  });

const router = createRouter();

router.beforeEach((to, from, next) => {
  if (to.meta.public) {
    next();
    return;
  }

  if (router.app.$keycloak.authenticated) {
    hasUserPermission(to, from, next);
  } else {
    const loginUrl = router.app.$keycloak.createLoginUrl();
    window.location.replace(loginUrl);
  }
});

const hasUserPermission = (to, from, next) => {
  const { permission = [] } = to.meta;

  if (!permission.length) {
    next();
    return;
  }

  const canAccess = permission.some((permissionRole) => isKeycloakRealmRole(permissionRole));
  if (canAccess) next();
  else {
    next({ name: 'RoleRedirect' });
  }
};

const isKeycloakRealmRole = (roleName) => {
  const { roles } = Vue.prototype.$keycloak.realmAccess;
  return roles.includes(roleName);
};

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
