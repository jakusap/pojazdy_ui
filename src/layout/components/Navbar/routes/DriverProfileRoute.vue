<template>
  <NavbarItem :routes="routes" :category-title="$t('routes.driverOwnProfile')" />
</template>

<script>
import { mapGetters } from 'vuex';

import NavbarItem from '../NavbarItem';
export default {
  components: {
    NavbarItem,
  },
  computed: {
    ...mapGetters('partnerProfile', ['getPartnerDocuments']),
    partnerHasFormDocuments() {
      return this.getPartnerDocuments.some((doc) => doc.isForm);
    },
    routes() {
      if (this.partnerHasFormDocuments) {
        return [
          {
            name: 'DriverProfile',
            params: {},
            meta: { title: this.$t('routes.driverProfile'), icon: 'user' },
          },
          {
            name: 'DriverDocuments',
            params: {},
            meta: { title: this.$t('routes.driverDocuments'), icon: 'skill' },
          },
        ];
      } else {
        return [
          {
            name: 'DriverProfile',
            params: {},
            meta: { title: this.$t('routes.driverProfile'), icon: 'user' },
          },
        ];
      }
    },
  },
};
</script>
