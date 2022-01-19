export default {
  data() {
    return {
      globalThemeClass: '',
      localThemeClass: '',
    };
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
    findSelectedPartner() {
      const partners = this.getPartnersList;
      const partnerUuid = this.getLoggedDriverInfo?.partnerUuid || this.referencedPartner?.uuid || null;

      if (!!partners.length && !!partnerUuid) {
        return partners.find((e) => e.uuid === partnerUuid).code;
      } else return null;
    },
    setGlobalClass() {
      const partnerCode = this.findSelectedPartner();

      if (partnerCode) this.createGlobalThemeClass(partnerCode);
    },
    setLocalClass() {
      const partnerCode = this.findSelectedPartner();

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
