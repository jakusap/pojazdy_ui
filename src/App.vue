<template>
  <div id="app">
    <ThemeProvider>
      <router-view />
    </ThemeProvider>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import ThemeProvider from '@/components/ThemeProvider';
import { POLISH_INSTANCE } from '@/utils/instance';
import { userIsPartner } from '@/utils/keycloak';

export default {
  name: 'App',
  components: { ThemeProvider },
  computed: {
    ...mapGetters('partnerProfile', ['profileInfo']),
    ...mapGetters('app', ['storedLocale']),
    ...mapGetters(['instance']),
  },
  mounted() {
    const lang = new URL(window.location.href).searchParams.get('lang');
    if (lang) {
      this.$root.$i18n.locale = lang;
    }
  },
  async created() {
    this.checkAppInstance();
    this.isLocaleSet();
    userIsPartner() && (await this.handlePartnerLogin());
  },

  methods: {
    ...mapGetters('partners', ['getPartnersList']),
    ...mapActions(['preloadPartnerData']),
    ...mapActions('partners', ['fetchPartnersList']),
    ...mapActions('app', ['changeLocale', 'setInstance', 'setCurrency']),
    isLocaleSet() {
      const defaultLang = this.$root.$i18n.locale;
      !this.storedLocale && this.changeLocale(defaultLang);
      this.$root.$i18n.locale = this.storedLocale;
    },
    checkAppInstance() {
      this.setInstance(POLISH_INSTANCE);
      this.setCurrency('PLN');
    },
    async handlePartnerLogin() {
      await this.preloadPartnerData();
    },
  },
};
</script>
