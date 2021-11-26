<template>
  <router-view v-if="driver" :driver="driver" />
</template>

<script>
import { getDriver } from '@/api/driversApi';

import transactionsViewStore from './store/transactionsViewStore';
export default {
  props: {
    driverUUID: {
      type: String,
    },
    settlementUUID: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      driver: null,
    };
  },

  beforeCreate() {
    this.$store.registerModule('transactionsViewStore', transactionsViewStore);
  },
  destroyed() {
    this.$store.unregisterModule('transactionsViewStore');
  },
  created() {
    getDriver(this.driverUUID).then((response) => {
      if (response.ok) {
        this.driver = response.data;
      }
    });
  },
};
</script>
