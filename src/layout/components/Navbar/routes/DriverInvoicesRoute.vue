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
          name: 'DriverInvoices',
          params: {},
          meta: { title: this.$t('routes.driverInvoices'), icon: 'documentation' },
        },
      ];
    },
  },
};
</script>
