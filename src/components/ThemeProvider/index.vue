<template>
  <div :class="['themeProvider', globalThemeClass]">
    <template v-if="isDriver && (getLoggedDriverInfo === null || !getPartnersList.length)" />
    <slot v-else />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import themeMixin from '@/mixins/themeMixin';

export default {
  name: 'ThemeProvider',
  mixins: [themeMixin],
};
</script>

<style lang="scss">
.themeProvider {
  height: 100%;
}
</style>
