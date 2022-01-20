export default {
  data() {
    return {
      globalThemeClass: '',
      localThemeClass: '',
    };
  },
  methods: {
    createGlobalThemeClass(code) {
      this.globalThemeClass = `${code}_THEME_GLOBAL_CLASS`;
    },
    createLocalThemeClass(code) {
      this.localThemeClass = `${code}_THEME_LOCAL_CLASS`;
    },
  },
};
