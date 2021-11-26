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
          name: 'ServicePlans',
          params: {},
          meta: { title: this.$t('routes.servicePlans'), icon: 'clipboard' },
        },
      ];
    },
  },
};
</script>
