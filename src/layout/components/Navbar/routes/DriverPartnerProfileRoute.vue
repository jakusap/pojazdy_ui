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
          name: 'DriverPartnerProfile',
          params: {},
          meta: { title: this.$t('routes.driverPartnerProfile'), icon: 'peoples' },
        },
      ];
    },
  },
};
</script>
