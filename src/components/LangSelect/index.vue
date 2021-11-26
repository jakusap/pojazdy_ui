<template>
  <div class="wrapper">
    <div :class="{ open }" class="lang-select">
      <button @click="toggleOpen()">
        {{ storedLocale }}
        <i class="el-icon-arrow-down" />
      </button>
      <ul>
        <li v-for="lang in locales.filter((l) => l != storedLocale)" :key="lang">
          <button @click="setLocale(lang)">{{ lang }}</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      open: false,
      selectedLocale: null,
    };
  },
  computed: {
    ...mapGetters('app', ['storedLocale']),
    locales() {
      return this.$root.$i18n.availableLocales.map((locale) => {
        return locale;
      });
    },
  },
  mounted() {
    this.selectedLocale = this.storedLocale;
  },
  methods: {
    ...mapActions('app', ['changeLocale']),
    setLocale(locale) {
      this.$root.$i18n.locale = locale;
      this.toggleOpen();
      this.changeLocale(locale);
    },
    toggleOpen() {
      this.open = !this.open;
    },
  },
};
</script>

<style lang="scss" scoped>
.lang-select {
  position: relative;
  & button {
    display: flex;
    height: 50px;
    background: none;
    border: none;
    outline: none;
    text-transform: uppercase;
    color: var(--white-color);
    font-weight: 700;
    width: 100%;
    padding: 16px;
    cursor: pointer;
    transition: background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);
    &:hover {
      background: var(--brand-yellow-background-hover);
    }
  }
  & i {
    transition: transform 0.15s ease, padding 0.15s ease;
    padding-left: 8px;
  }
  & ul {
    background: var(--brand-gray-background);
    visibility: hidden;
    list-style: none;
    position: absolute;
    padding: 0;
    width: 100%;
  }
}

.open {
  & i {
    padding-left: 0;
    padding-right: 8px;
    transform: rotateZ(180deg);
  }
  & ul {
    visibility: visible;
    margin: 0;
  }
}

@media screen and (max-width: 768px) {
  .lang-select {
    font-size: 12px;
    & button {
      padding: 8px;
    }
    & i {
      display: none;
    }
  }
}

@media screen and (min-width: 769px) and (max-width: 1200px) {
  .lang-select {
    font-size: 12px;
  }
}
</style>
