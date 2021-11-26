<template>
  <div class="">
    <div v-if="purchaseStep === 1" class="licenses">
      <h1 class="licenses__title">
        {{ $t('Licenses.title') }}
      </h1>
      <div v-loading="loading" class="licenses__list">
        <LicenseVariant v-for="license in licenses" :key="license.externalId" :license="license" />
      </div>
      <LicenseCart v-if="licensesCart.length" :purchase-step="purchaseStep" @next-step="() => (purchaseStep = 2)" />
    </div>

    <div v-if="purchaseStep === 2" class="licenses">
      <div class="licenses__return">
        <el-button type="info" @click="purchaseStep = 1">
          {{ $t('Licenses.previous_step') }}
        </el-button>
      </div>
      <LicenseCart />
      <PaymentDetails />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { getAvailableLicenses } from '@/api/licensesApi';

import LicenseCart from '../components/LicenseCart';
import LicenseVariant from '../components/LicenseVariant';
import PaymentDetails from '../components/PaymentDetails';
import licensesStore from '../licensesStore';

export default {
  components: {
    LicenseVariant,
    LicenseCart,
    PaymentDetails,
  },
  data() {
    return {
      loading: false,
      licenses: [],
      purchaseStep: 1,
    };
  },
  computed: {
    ...mapGetters('licensesStore', ['licensesCart']),
  },
  watch: {
    licensesCart(cart) {
      cart.length === 0 && (this.purchaseStep = 1);
    },
  },
  beforeCreate() {
    this.$store.registerModule('licensesStore', licensesStore);
  },
  async created() {
    this.loading = true;
    await getAvailableLicenses().then((response) => {
      if (response.ok) {
        this.licenses = response.data;
      }
    });
    this.loading = false;
  },
  destroyed() {
    this.$store.commit('licensesStore/CLEAR_CART');
    this.$store.unregisterModule('licensesStore');
  },
};
</script>

<style lang="scss" scoped>
.licenses {
  padding: 16px;
  &__title {
    font-size: 24px;
  }
  &__list {
    display: flex;
    flex-flow: wrap;
    justify-content: space-between;
  }
  &__return {
    margin-bottom: 16px;
  }
}
</style>
