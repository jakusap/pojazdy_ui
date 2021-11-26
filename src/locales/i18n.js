import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

export const i18n = new VueI18n({
  locale: 'pl',
  fallbackLocale: 'en',
  messages: {
    pl: require('@/locales/pl/pl.json'),
    en: require('@/locales/en/en.json'),
    de: require('@/locales/de/de.json'),
    ua: require('@/locales/ua/ua.json'),
  },
});
