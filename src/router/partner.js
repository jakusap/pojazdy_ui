import Layout from '@/layout';

import { USER_ROLE_PARTNER } from '../utils/keycloak';

const partnerRoutes = [
  {
    path: '/drivers',
    component: Layout,
    meta: { transitionName: 'fade-transform', permission: [USER_ROLE_PARTNER] },
    children: [
      {
        path: '',
        name: 'DriversList',
        component: () => import(/* webpackChunkName: "partner" */ '@/views/PartnerApp/PartnerDriversList'),
        meta: {
          title: 'routes.my_drivers',
          icon: 'peoples',
          transitionName: 'fade-transform',
          permission: [USER_ROLE_PARTNER],
        },
      },
      {
        path: '/drivers/:driverUUID',
        name: 'DriverDetails',
        component: () => import(/* webpackChunkName: "partner" */ '@/views/PartnerApp/PartnerDriverDetails'),
        props: true,
        meta: { title: 'routes.driver_details', transitionName: 'fade-transform', permission: [USER_ROLE_PARTNER] },
      },
    ],
  },
  {
    path: '/cars',
    component: Layout,
    redirect: '/cars',
    meta: {
      title: 'routes.cars',
      icon: 'car',
      transitionName: 'fade-transform',
      permission: [USER_ROLE_PARTNER],
    },
    children: [
      {
        path: '',
        name: 'Cars',
        component: () => import(/* webpackChunkName: "partner" */ '@/views/PartnerApp/PartnerCars'),
        meta: {
          title: 'routes.cars',
          icon: 'car',
          transitionName: 'fade-transform',
          permission: [USER_ROLE_PARTNER],
        },
      },
      {
        path: '/cars/:carId',
        name: 'CarsDetails',
        component: () => import(/* webpackChunkName: "partner" */ '@/views/PartnerApp/PartnerCarsDetails'),
        props: true,
        meta: { title: 'routes.cars_details', transitionName: 'fade-transform', permission: [USER_ROLE_PARTNER] },
      },
    ],
  },
  {
    path: '/mainPage',
    name: 'PartnerHomePage',
    component: Layout,
    redirect: '/mainPage',
    meta: {
      title: 'routes.mainPage',
      transitionName: 'fade-transform',
      permission: [USER_ROLE_PARTNER],
    },
    children: [
      {
        path: '',
        name: 'MainPage',
        component: () => import(/* webpackChunkName: "partner" */ '@/views/PartnerApp/MainPage'),
        meta: {
          title: 'routes.mainPage',
          transitionName: 'fade-transform',
          permission: [USER_ROLE_PARTNER],
        },
      },
    ],
  },
  {
    path: '/service_plans',
    component: Layout,
    redirect: '/service_plans',
    meta: {
      title: 'routes.servicePlans',
      icon: 'car',
      transitionName: 'fade-transform',
      permission: [USER_ROLE_PARTNER],
    },
    children: [
      {
        path: '',
        name: 'ServicePlans',
        component: () => import(/* webpackChunkName: "partner" */ '@/views/PartnerApp/PartnerServicePlans'),
        meta: {
          title: 'routes.servicePlans',
          icon: 'clipboard',
          transitionName: 'fade-transform',
          permission: [USER_ROLE_PARTNER],
        },
      },
      {
        path: '/service_plans/:servicePlanId',
        name: 'ServicePlansDetails',
        component: () => import(/* webpackChunkName: "partner" */ '@/views/PartnerApp/PartnerServicePlansDetails'),
        props: true,
        meta: {
          title: 'routes.servicePlansDetails',
          transitionName: 'fade-transform',
          permission: [USER_ROLE_PARTNER],
        },
      },
    ],
  },
];

export default partnerRoutes;
