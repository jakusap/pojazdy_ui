<template>
  <div class="payment-service">
    <div v-if="paymentStarted" class="payment-service__started">
      <h2>{{ $t('Licenses.payment_started') }} {{ `#` }}{{ paymentId.slice(0, 7) }}</h2>
      <div v-loading="paymentStarted" class="payment-service__loading"></div>
    </div>

    <div v-else class="">
      <div v-if="paymentSuccessful" class="payment-service__status">
        <i class="el-icon-success icon-success"></i>
        <div class="payment-service__info">
          <h2>{{ $t('Licenses.payment_success') }}</h2>
          <p>
            {{ $t('Licenses.payment_success_text') }}
          </p>
          <a
            type="primary"
            class="el-button el-button--primary"
            :href="`/api/online-payments/${paymentId}/invoice`"
            target="blank"
          >
            {{ $t('Licenses.payment_invoice') }}
          </a>
          <el-button type="info" @click="goToLicensesHistory()">{{ $t('routes.licenses_history') }}</el-button>
        </div>
      </div>
      <div v-else class="payment-service__status">
        <i class="el-icon-error icon-warning" />
        <div class="payment-service__info">
          <h2>
            {{ $t('Licenses.payment_failed') }}
          </h2>
          <p>
            {{ $t('Licenses.payment_failed_text') }}
          </p>
          <el-button type="primary" @click="goToLicensesPurchase()">{{ $t('Licenses.payment_retry') }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { getPaymentInvoice, getPaymentStatus } from '@/api/licensesApi';

export default {
  data() {
    return {
      paymentStarted: false,
      paymentSuccessful: false,
      intervalFunctionRef: null,
    };
  },
  computed: {
    ...mapGetters('tabs', ['openTabs']),
    paymentId() {
      return this.$route.params.id;
    },
  },
  created() {
    this.paymentStarted = true;
    this.intervalFunctionRef = setInterval(() => {
      getPaymentStatus(this.paymentId).then((response) => {
        if (response.ok) {
          const { status } = response.data;
          status === 'FINISHED' && ((this.paymentSuccessful = true), this.resetInterval());
          status === 'ERROR' && ((this.paymentSuccessful = false), this.resetInterval());
        }
      });
    }, 2000);
  },
  destroyed() {
    this.resetInterval();
  },
  methods: {
    ...mapActions('tabs', ['removeTab']),
    resetInterval() {
      clearInterval(this.intervalFunctionRef);
      this.paymentStarted = false;
      this.intervalFunctionRef = null;
    },
    goToLicensesPurchase() {
      this.openTabs.find((storedRoute, idx) => storedRoute.name === 'PaymentService' && this.removeTab(idx));
      this.$router.replace({ name: 'LicensesPurchase' });
    },
    goToLicensesHistory() {
      this.openTabs.find((storedRoute, idx) => storedRoute.name === 'PaymentService' && this.removeTab(idx));
      this.$router.replace({ name: 'LicensesHistory' });
    },
  },
};
</script>

<style lang="scss" scoped>
.payment-service {
  max-width: 750px;
  margin: 32px auto;
  padding: 32px;
  box-shadow: 0px 4px 8px 2px rgba(#000000, 0.1);
  border-radius: 4px;
  &__started {
    h2 {
      text-align: center;
    }
  }
  &__loading {
    height: 100px;
  }
  &__status {
    display: flex;
    flex-wrap: wrap;
  }
  & i {
    padding: 16px;
    font-size: 64px;
    flex: 1;
    margin: auto;
    text-align: center;
  }
  &__info {
    flex: 2;
    min-width: 350px;
  }
}
</style>
