<template>
  <nav id="navbar" :class="['navbar', localThemeClass]">
    <div id="burger" class="navbar__burger" @click="toggleNav()">
      <div class="navbar__burger-box"></div>
    </div>
    <div id="menu" class="navbar__menu">
      <NavbarRoutes />
    </div>
    <AppHistory />
    <div class="user-menu">
      <div class="right-menu">
        <div>
          <input id="user" type="checkbox" class="navbar-item__dropdown" />
          <label for="user" class="navbar-item__link">
            <span class="dropdown__username">{{ userName }}</span>
            <i class="el-icon-arrow-down" />
          </label>
          <div class="dropdown-buttons">
            <button disabled class="action-btn action-btn--username">
              {{ userName }}
            </button>
            <button class="action-btn" @click="logout()">{{ $t('logout') }}</button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import themeMixin from '@/mixins/themeMixin';
import { hasUserPermission, userIsPartner } from '@/utils/keycloak';

import AppHistory from './AppHistory';
import NavbarRoutes from './NavbarRoutes';

export default {
  components: {
    NavbarRoutes,
    AppHistory,
  },
  mixins: [themeMixin],
  computed: {
    ...mapGetters(['instance']),
    routes() {
      return this.$router.options.routes
        .map((route) => {
          if (!route.meta) return null;
          const { permission = [] } = route.meta;
          if (hasUserPermission(permission)) return route;
        })
        .filter((el) => el);
    },
    userName() {
      return this.$keycloak.userName;
    },
    hasPartner() {
      const driverInfo = this.getLoggedDriverInfo;
      if (!driverInfo) return false;
      const { partnerUuid, partnerDescription } = driverInfo;
      return Boolean(partnerUuid || partnerDescription);
    },
  },
  created() {
    document.addEventListener('click', this.clickDocument);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.clickDocument);
  },
  methods: {
    ...mapActions(['handleLogout']),
    userIsPartner: userIsPartner,
    toggleNav() {
      document.getElementById('burger').classList.toggle('burger-open');
      document.getElementById('menu').classList.toggle('active');
      document.body.classList.toggle('block-overflow');
    },

    clickDocument(e) {
      if (!document.getElementById('navbar').contains(e.target)) {
        document.getElementById('burger').classList.contains('burger-open') && this.toggleNav();
      }
    },
    logout() {
      this.handleLogout();
      this.$keycloak.logoutFn();
    },
  },
};
</script>

<style lang="scss">
.block-overflow {
  overflow: hidden;
}
</style>

<style lang="scss" scoped>
@keyframes fly-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
    margin-top: 16px;
    height: auto;
  }
}
.el-dropdown-menu {
  margin-right: -24px;
}
.navbar {
  display: flex;
  justify-content: space-between;
  z-index: 999;
  height: 50px;
  top: 0;
  position: sticky;
  background: var(--brand-gray-background);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  &__burger {
    display: inline-block;
    position: relative;
    left: 12px;
    top: 12px;
    height: 24px;
    cursor: pointer;
    & .navbar__burger-box {
      content: '';
      display: block;
      width: 33px;
      height: 3px;
      position: relative;
      background: var(--white-background-active);
      z-index: 1;
      transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);
      border-radius: 8px;
      &:before {
        top: 10px;
        content: '';
        position: absolute;
        display: block;
        width: 33px;
        height: 3px;
        background: var(--white-background-active);
        z-index: 1;
        transition: all 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);
        border-radius: 8px;
      }
      &:after {
        top: 20px;
        bottom: -10px;
        content: '';
        position: absolute;
        display: block;
        width: 33px;
        height: 3px;
        background: var(--white-background-active);
        z-index: 1;
        transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);
        border-radius: 8px;
      }
    }
    &.burger-open {
      & .navbar__burger-box {
        transform: translate3d(0, 10px, 0) rotate(45deg);
        &:before {
          transform: rotate(-45deg) translate3d(-6px, -6px, 0);
          opacity: 0;
        }
        &:after {
          transform: translate3d(0, -20px, 0) rotate(-90deg);
        }
      }
    }
  }
  &__menu {
    overflow: auto;
    height: calc(100% - 50px);
    z-index: 9999;
    background: var(--brand-gray-background);
    position: fixed;
    transition: 0.35s all ease-in-out;
    width: 100%;
    margin-top: 50px;
    transform: translateX(-100%);
    &.active {
      transform: none;
    }
    @media screen and (min-width: 768px) {
      max-width: 350px;
    }
  }
  .dropdown__username {
    display: none;
    color: var(--brand-gray-color-active);
    @media screen and (min-width: 576px) {
      display: block;
    }
    ~ i {
      color: var(--brand-gray-color-active);
    }
  }
  .user-menu {
    display: flex;
  }
  .right-menu {
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--brand-yellow-background-active);
    height: 100%;
    padding-left: 16px;
    padding-right: 16px;
    position: relative;
    .navbar-item__dropdown {
      display: none;
      & ~ .dropdown-buttons {
        opacity: 0;
        height: 0;
        pointer-events: none;
        position: absolute;
        right: 0;
        text-align: center;
        min-width: 100%;
        background: var(--brand-gray-background);
        color: var(--brand-yellow-color);
        transition: all 0.15s ease;
        font-weight: 700;
        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 50px;
          background: var(--brand-gray-background);
          border: none;
          color: var(--white-color-active);
          font-weight: bold;
          cursor: pointer;
          border-top: 1px solid var(--brand-yellow-border);
          &:hover {
            background: var(--brand-yellow-background-hover);
            color: var(--brand-gray-color-hover);
          }
          &:first-of-type {
            border-top: 1px solid var(--brand-gray-border);
          }
          &--username {
            pointer-events: none;
            background: var(--brand-yellow-background-active);
            color: var(--brand-gray-color-active);
            @media screen and (min-width: 576px) {
              display: none;
            }
          }
        }
      }
      & ~ label {
        display: flex;
        cursor: pointer;
        i {
          font-weight: 700;
          transition: transform 0.15s ease, padding 0.15s ease;
          transform-origin: 50% 45%;
          @media screen and (min-width: 576px) {
            padding-left: 8px;
          }
        }
      }
      &:checked {
        ~ label {
          & i {
            transform: rotateZ(180deg);
            @media screen and (min-width: 576px) {
              padding-left: 0;
              padding-right: 8px;
            }
          }
        }
      }
      &:checked {
        & ~ div {
          display: block;
          animation: fly-in 0.1s ease forwards;
          pointer-events: all !important;
        }
      }
    }
  }
}

.identification {
  display: block;
  max-width: 80%;
  margin: 24px auto 0 auto;
}
</style>
