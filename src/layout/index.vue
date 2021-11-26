<template>
  <div class="app-wrapper">
    <div class="main-container">
      <Navbar />
      <AppMain />
    </div>
  </div>
</template>

<script>
import { AppMain } from './components';
import Navbar from './components/Navbar';
import ResizeMixin from './mixin/ResizeHandler';

export default {
  name: 'Layout',
  components: {
    Navbar,
    AppMain,
  },
  mixins: [ResizeMixin],
  computed: {
    device() {
      return this.$store.state.app.device;
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
.drawer-bg {
  background: var(--black-background);
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  transition: width 0.28s;
}

.mobile .fixed-header {
  width: 100%;
}
</style>
