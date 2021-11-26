import Layout from '@/layout';

import { USER_ROLE_DRIVER } from '../utils/keycloak';

const driverRoutes = [
  {
    path: '/add-driver-account',
    name: 'AddDriverAccount',
    component: () => import(/* webpackChunkName: "driver" */ '@/views/DriverApp/AddDriverAccount'),
    meta: {
      title: 'routes.addDriverAccount',
      icon: 'excel',
      transitionName: 'fade-transform',
      permission: [USER_ROLE_DRIVER],
    },
  },

  {
    path: '/driver',
    component: Layout,
    redirect: '/driver/settlements',
    meta: {
      title: 'routes.driverSettlements',
      icon: 'dashboard',
      permission: [USER_ROLE_DRIVER],
    },
    children: [
      {
        path: 'settlements',
        name: 'DriverSettlements',
        component: () => import(/* webpackChunkName: "driver" */ '@/views/DriverApp/DriverSettlements'),
        meta: {
          title: 'routes.driverSettlements',
          icon: 'dashboard',
          transitionName: 'fade-transform',
          permission: [USER_ROLE_DRIVER],
        },
      },
    ],
  },

  {
    path: '/driver/profile',
    component: Layout,
    meta: {
      title: 'routes.driverProfile',
      icon: 'user',
      transitionName: 'fade-transform',
      permission: [USER_ROLE_DRIVER],
    },
    children: [
      {
        path: '',
        name: 'DriverProfile',
        component: () => import(/* webpackChunkName: "driver" */ '@/views/DriverApp/DriverProfile'),
        meta: {
          title: 'routes.driverProfile',
          icon: 'user',
          transitionName: 'fade-transform',
          permission: [USER_ROLE_DRIVER],
        },
      },
    ],
  },

  {
    path: '/driver/fill-documents',
    component: Layout,
    props: true,
    meta: {
      title: 'routes.DriverDocumentsWizard',
      icon: 'user',
      transitionName: 'fade-transform',
      permission: [USER_ROLE_DRIVER],
    },
    children: [
      {
        path: '',
        name: 'DriverDocumentsWizard',
        props: true,
        component: () => import(/* webpackChunkName: "driver" */ '@/views/DriverApp/DriverDocumentsWizard'),
        meta: {
          title: 'routes.driverDocumentsWizard',
          transitionName: 'fade-transform',
          permission: [USER_ROLE_DRIVER],
        },
      },
    ],
  },
  {
    path: '/driver/documents',
    component: Layout,
    meta: {
      title: 'routes.driverDocuments',
      icon: 'skill',
      transitionName: 'fade-transform',
      permission: [USER_ROLE_DRIVER],
    },
    children: [
      {
        path: '',
        name: 'DriverDocuments',
        component: () => import(/* webpackChunkName: "driver" */ '@/views/DriverApp/DriverDocuments'),
        meta: {
          title: 'routes.driverDocuments',
          icon: 'skill',
          transitionName: 'fade-transform',
          permission: [USER_ROLE_DRIVER],
        },
      },
    ],
  },
  {
    path: '/driver/partners-list',
    component: Layout,
    meta: {
      title: 'routes.driverPartnersList',
      icon: 'peoples',
      transitionName: 'fade-transform',
      permission: [USER_ROLE_DRIVER],
    },
    children: [
      {
        path: '',
        name: 'DriverPartnersList',
        component: () => import(/* webpackChunkName: "driver" */ '@/views/DriverApp/DriverPartnersList'),
        meta: {
          title: 'routes.driverPartnersList',
          icon: 'peoples',
          transitionName: 'fade-transform',
          permission: [USER_ROLE_DRIVER],
        },
      },
    ],
  },

  {
    path: '/driver/partner-profile',
    component: Layout,
    meta: {
      title: 'routes.driverPartnerProfile',
      icon: 'peoples',
      transitionName: 'fade-transform',
      permission: [USER_ROLE_DRIVER],
    },
    children: [
      {
        path: '',
        name: 'DriverPartnerProfile',
        component: () => import(/* webpackChunkName: "driver" */ '@/views/DriverApp/DriverPartnerProfile'),
        meta: {
          title: 'routes.driverPartnerProfile',
          icon: 'peoples',
          transitionName: 'fade-transform',
          permission: [USER_ROLE_DRIVER],
        },
      },
    ],
  },

  {
    path: '/driver/invoices',
    component: Layout,
    meta: {
      title: 'routes.driverInvoices',
      icon: 'peoples',
      transitionName: 'fade-transform',
      permission: [USER_ROLE_DRIVER],
    },
    children: [
      {
        path: '',
        name: 'DriverInvoices',
        component: () => import(/* webpackChunkName: "driver" */ '@/views/DriverApp/DriverInvoices'),
        meta: {
          title: 'routes.driverInvoices',
          icon: 'documentation',
          transitionName: 'fade-transform',
          permission: [USER_ROLE_DRIVER],
        },
      },
    ],
  },

  {
    path: '/driver/stats',
    component: Layout,
    meta: {
      title: 'routes.driverStats',
      icon: 'chart',
      transitionName: 'fade-transform',
      permission: [USER_ROLE_DRIVER],
    },
    children: [
      {
        path: '',
        name: 'DriverStats',
        component: () => import(/* webpackChunkName: "driver" */ '@/views/DriverApp/DriverStats'),
        meta: {
          title: 'routes.driverStats',
          icon: 'chart',
          transitionName: 'fade-transform',
          permission: [USER_ROLE_DRIVER],
        },
      },
    ],
  },
];

export default driverRoutes;
