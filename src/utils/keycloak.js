import Vue from 'vue';

export const USER_ROLE_PARTNER = 'partner';
export const USER_ROLE_DRIVER = 'driver';

export const hasUserPermission = (permission = []) => {
  return permission.some((permissionRole) => isKeycloakRealmRole(permissionRole));
};

export const userIsDriver = () => Vue.prototype.$keycloak.authenticated && isKeycloakRealmRole(USER_ROLE_DRIVER);
export const userIsPartner = () => Vue.prototype.$keycloak.authenticated && isKeycloakRealmRole(USER_ROLE_PARTNER);

const isKeycloakRealmRole = (roleName) => {
  const { roles } = Vue.prototype.$keycloak.realmAccess;
  return roles.includes(roleName);
};
