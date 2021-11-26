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
          name: 'DriverSettlements',
          params: {},
          meta: { title: this.$t('routes.driverSettlements'), icon: 'dashboard' },
        },
      ];
    },
  },
};
</script>
