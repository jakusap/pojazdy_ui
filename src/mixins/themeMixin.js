import { mapGetters } from 'vuex';

import { userIsDriver } from '@/utils/keycloak';

export default {
  data() {
    return {
      globalThemeClass: '',
      localThemeClass: '',
    };
  },
  computed: {
    ...mapGetters('driverAccount', ['getLoggedDriverInfo']),
    ...mapGetters('partners', ['getPartnersList']),
    ...mapGetters('driverAccount', ['referencedPartner']),
    isDriver() {
      return userIsDriver();
    },
    selectedPartnerCode() {
      return this.findSelectedParter();
    },
  },
  watch: {
    getLoggedDriverInfo: {
      handler: function() {
        this.setGlobalClass();
        this.setLocalClass();
      },
      deep: true,
    },
    getPartnersList: {
      handler: function() {
        this.setGlobalClass();
        this.setLocalClass();
      },
      deep: true,
    },
  },
  mounted() {
    this.setGlobalClass();
    this.setLocalClass();
  },
  methods: {
    findSelectedParter() {
      const partners = this.getPartnersList;
      const partnerUuid = this.getLoggedDriverInfo?.partnerUuid || this.referencedPartner?.uuid || null;

      if (!!partners.length && !!partnerUuid) {
        return partners.find((e) => e.uuid === partnerUuid).code;
      } else return null;
    },
    setGlobalClass() {
      const partnerCode = this.findSelectedParter();

      if (partnerCode) this.createGlobalThemeClass(partnerCode);
    },
    setLocalClass() {
      const partnerCode = this.findSelectedParter();

      if (partnerCode) this.createLocalThemeClass(partnerCode);
    },
    createGlobalThemeClass(code) {
      this.globalThemeClass = `${code}_THEME_GLOBAL_CLASS`;
    },
    createLocalThemeClass(code) {
      this.localThemeClass = `${code}_THEME_LOCAL_CLASS`;
    },
  },
};
