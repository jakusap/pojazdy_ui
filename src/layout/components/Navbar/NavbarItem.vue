<template>
  <div :class="[localThemeClass]">
    <div v-if="showCategoryTitle">
      <input :id="categoryTitle" type="checkbox" class="navbar-item__dropdown" />
      <label :for="categoryTitle" class="navbar-item__link">
        <svg-icon class="link-icon" icon-class="list" />
        {{ categoryTitle }}
        <i class="el-icon-arrow-down" />
      </label>
      <div class="navbar-item__multi" @click="toggleNav()">
        <router-link
          v-for="route in routes"
          :key="route.path"
          :class="[{ active: route.name === $route.name }, 'nested-route']"
          :to="{ name: route.name, params: route.params }"
          class="navbar-item__link"
        >
          <svg-icon v-if="!route.meta.iconSrc" :icon-class="route.meta.icon" />
          <img v-if="!!route.meta.iconSrc" class="link-icon" :src="route.meta.iconSrc" :alt="route.meta.title" />
          <span>{{ route.meta.title }}</span>
        </router-link>
      </div>
    </div>
    <span v-else @click="toggleNav()">
      <router-link
        :class="{ active: routes[0].name === $route.name }"
        :to="{ name: routes[0].name, params: routes[0].params }"
        class="navbar-item__link"
      >
        <svg-icon v-if="!routes[0].meta.iconSrc" :icon-class="routes[0].meta.icon" />
        <img
          v-if="!!routes[0].meta.iconSrc"
          class="link-icon"
          :src="routes[0].meta.iconSrc"
          :alt="routes[0].meta.title"
        />
        {{ routes[0].meta.title }}
      </router-link>
    </span>
  </div>
</template>

<script>
import themeMixin from '@/mixins/themeMixin';

export default {
  name: 'NavbarItem',
  mixins: [themeMixin],
  props: {
    routes: {
      type: Array,
    },
    categoryTitle: {
      type: String,
    },
    alwaysShowCategoryTitle: {
      type: Boolean,
    },
  },
  computed: {
    showCategoryTitle() {
      return this.alwaysShowCategoryTitle || this.routes.length > 1;
    },
  },
  methods: {
    toggleNav() {
      document.getElementById('burger').classList.remove('burger-open');
      document.getElementById('menu').classList.remove('active');
      document.body.classList.remove('block-overflow');
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes fly-in-left {
  from {
    opacity: 0;
    height: 50%;
  }
  to {
    opacity: 1;
    margin-top: 8px;
    height: auto;
  }
}
.navbar-item__dropdown {
  display: none;
  & ~ div {
    opacity: 0;
    height: 0;
    pointer-events: none;
  }
  & ~ label {
    cursor: pointer;
    i {
      transition: transform 0.15s ease, padding 0.15s ease;
      transform-origin: 50% 45%;
      padding-left: 8px;
    }
  }
  &:checked {
    ~ label {
      & i {
        padding-left: 0;
        padding-right: 8px;
        transform: rotateZ(180deg);
      }
    }
  }
  &:checked {
    & ~ div {
      display: block;
      animation: fly-in-left 0.1s ease forwards;
      pointer-events: all !important;
    }
  }
}
.navbar-item__multi {
  margin-left: 16px;
}
.svg-icon {
  margin-right: 8px;
}
.navbar-item {
  padding: 8px 16px;
  &__link {
    display: flex;
    color: var(--smoke-white-color);
    font-weight: bold;
    transition: all 0.2s ease-in-out;
    max-width: 100%;
    padding: 24px 16px;
    &.active {
      background: var(--light-white-background-active);
      color: var(--brand-yellow-color-active);
    }
    &:hover {
      color: var(--brand-yellow-color-hover);
      background: var(--light-white-background-hover);
    }
  }
}
</style>
