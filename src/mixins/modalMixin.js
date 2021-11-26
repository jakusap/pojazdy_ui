const modalMixin = {
  data() {
    return {
      dialogVisible: true,
    };
  },
  watch: {
    close(value) {
      value && (this.dialogVisible = false);
    },
    dialogVisible(value) {
      !value &&
        this.$nextTick(() => {
          this.$modalOff();
          this.$destroy();
        });
    },
  },
};

export default modalMixin;
