export default {
  computed: {
    mobile() {
      return this.$store.state.app.device === 'mobile';
    },
  },
};
