<template>
  <div :class="[{ 'block-overflow': hideHistoryOverflow && !showHistory }]">
    <el-button
      v-if="hideHistoryOverflow || smallMobile"
      :class="{ 'show-open': showHistory }"
      size="text"
      class="app-history__show"
      @click="openHistory()"
    >
      <i class="el-icon-bottom" />
    </el-button>
    <div ref="appHistory" :class="{ show: showHistory }" class="app-history">
      <div
        v-for="(route, id) in openTabs"
        :key="id"
        :class="{ active: route.name === $route.name }"
        class="app-history__element"
      >
        <router-link :to="route">
          <a class="app-history__link" @click="hideHistory()">
            {{ $t(route.meta.title) }}
          </a>
        </router-link>

        <i
          v-if="openTabs.length > 1"
          class="el-icon-close app-history__remove"
          @click="removeRoute(route.name, route.name === $route.name)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {
      appHistoryHeight: 0,
      showHistory: false,
      screenWidth: 0,
    };
  },
  computed: {
    ...mapGetters('tabs', ['openTabs', 'userName']),
    hideHistoryOverflow() {
      return this.appHistoryHeight > 50 ? true : false;
    },
    smallMobile() {
      return this.screenWidth < 576 ? true : false;
    },
  },

  watch: {
    $route: {
      handler(route) {
        const { meta, name, path, params, query, hash } = route;
        !meta.hidden && this.addTab({ meta, name, path, params, query, hash });
      },
      immediate: true,
    },
    openTabs() {
      this.appHistoryOverflowHandler();
    },
  },
  created() {
    this.setTabsKey(this.$keycloak.userName);
  },
  mounted() {
    this.screenWidth = window.innerWidth;
    this.appHistoryHeight = this.$refs.appHistory.offsetHeight;
    addEventListener('resize', this.appHistoryOverflowHandler);
  },
  destroyed() {
    removeEventListener('resize', this.appHistoryOverflowHandler);
  },
  methods: {
    ...mapActions('tabs', ['addTabsKey', 'addTab', 'removeTab', 'setTabsKey']),
    appHistoryOverflowHandler() {
      this.screenWidth = window.innerWidth;
      this.appHistoryHeight = this.$refs.appHistory.offsetHeight;
    },
    openHistory() {
      this.showHistory = !this.showHistory;
    },
    hideHistory() {
      if (this.showHistory) this.showHistory = false;
    },
    removeRoute(name, active) {
      if (active) {
        this.openTabs.find((storedRoute, idx) => {
          storedRoute?.name === name &&
            this.removeTab(idx) &&
            this.$router.push(this.openTabs[this.openTabs.length + 1 > idx ? (idx - 1 > 0 ? idx - 1 : 0) : 0]);
        });
      } else {
        this.openTabs.find((storedRoute, idx) => storedRoute.name === name && this.removeTab(idx));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.show-open {
  i {
    transform: rotateZ(180deg);
  }
}
.app-history {
  display: none;
  align-items: center;
  left: 48px;
  margin-right: 48px;
  background: var(--brand-gray-background);
  flex-wrap: wrap;
  top: 50px;
  height: 50px;
  position: absolute;
  &.show {
    display: flex;
  }
  &__show {
    font-weight: 700;
    position: absolute;
    left: 52px;
    font-size: 20px;
    border-radius: 0;
    height: 100%;
    & i {
      font-weight: bold;
      transition: transform 0.15s ease, color 0.15s ease, background 0.15s ease;
      border-radius: 50%;
      padding: 2px;
    }
    &:hover {
      & i {
        color: var(--brand-gray-color-hover);
        background: var(--brand-yellow-background-hover);
      }
    }
  }
  &__element {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--brand-gray-background);
    color: var(--brand-yellow-color);
    transition: all 0.2s ease-in-out;
    font-weight: bold;
    padding: 8px;
    width: 100%;
    &:hover,
    &.active {
      color: var(--brand-gray-color-active);
      background: var(--brand-yellow-background-active);
      & > .app-history__remove {
        color: var(--brand-gray-color-active);
      }
    }
  }
  &__link {
    display: block;
    height: 100%;
    line-height: calc(50px - 16px);
  }
  &__path {
    height: 50px;
  }
  &__remove {
    border-radius: 50%;
    padding: 2px;
    margin-left: 4px;
    font-size: 16px;
    color: var(--brand-yellow-color);
    transition: all 0.2s ease-in-out;
    font-weight: 700;
    cursor: pointer;
    &:hover {
      background: var(--brand-gray-background-hover);
      color: var(--brand-yellow-color-hover) !important;
    }
  }
}
@media screen and (min-width: 576px) {
  .app-history {
    display: flex;
    position: relative;
    top: 0;
    &__element {
      width: auto;
    }
  }
}
</style>
