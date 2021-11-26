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
          name: 'DriverPartnersList',
          params: {},
          meta: { title: this.$t('routes.driverPartnersList'), icon: 'peoples' },
        },
      ];
    },
  },
};
</script>
