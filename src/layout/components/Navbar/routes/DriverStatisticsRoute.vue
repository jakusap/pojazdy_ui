<template>
  <NavbarItem :routes="routes" />
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
          name: 'DriverStats',
          params: {},
          meta: { title: this.$t('routes.driverStats'), icon: 'chart' },
        },
      ];
    },
  },
};
</script>
