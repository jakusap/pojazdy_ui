<template>
  <section class="redirect-section">
    <div class="spinner">
      <div class="bounce1"></div>
      <div class="bounce2"></div>
      <div class="bounce3"></div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { userIsDriver, userIsPartner } from '@/utils/keycloak';

export default {
  name: 'RoleRedirect',
  mounted: function() {
    this.redirectUser();
  },
  methods: {
    ...mapGetters('driverAccount', ['getLoggedDriverInfo']),
    ...mapActions('driverAccount', ['fetchLoggedDriverInfo']),
    redirectUser: async function() {
      if (userIsPartner()) {
        this.$router.replace({ name: 'PartnerHomePage' });
      } else if (userIsDriver()) {
        await this.fetchLoggedDriverInfo();
        this.getLoggedDriverInfo() && this.$router.replace({ name: 'DriverSettlements' });
      } else {
        this.$router.push({ name: '403' });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$bg: rgb(44, 45, 53);

.redirect-section {
  width: 100%;
  height: 100%;
  background: $bg;
  display: flex;
  align-items: center;
  justify-content: center;

  .spinner {
    width: auto;
    text-align: center;
  }

  .spinner > div {
    width: 22px;
    height: 22px;
    background: $brand-yellow;

    border-radius: 100%;
    display: inline-block;
    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  }

  .spinner .bounce1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }

  .spinner .bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }

  @-webkit-keyframes sk-bouncedelay {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
    }
  }

  @keyframes sk-bouncedelay {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
}
</style>
