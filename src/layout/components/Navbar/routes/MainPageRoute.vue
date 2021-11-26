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
          name: 'PartnerHomePage',
          params: {},
          meta: { title: this.$t('routes.mainPage'), icon: 'international' },
        },
      ];
    },
  },
};
</script>
