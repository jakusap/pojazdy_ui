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
          name: 'Cars',
          params: {},
          meta: { title: this.$t('routes.cars'), icon: 'car' },
        },
      ];
    },
  },
};
</script>
