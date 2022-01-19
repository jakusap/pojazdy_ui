<template>
  <NavbarItem :routes="routes" :category-title="$t('routes.drivers')" />
</template>

<script>
import NavbarItem from '../NavbarItem';
export default {
  components: {
    NavbarItem,
  },
  computed: {
    routes() {
      return [
        {
          name: 'DriversList',
          params: {},
          meta: { title: this.$t('routes.my_drivers'), icon: 'peoples' },
        },
      ];
    },
  },
};
</script>
