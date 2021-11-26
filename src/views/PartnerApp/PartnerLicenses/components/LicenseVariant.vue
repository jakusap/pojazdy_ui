<template>
  <div class="license-variant">
    <h2>{{ license.description }}</h2>
    <table class="license-variant__table">
      <tr>
        <td>{{ $t('Licenses.minimum_quantity') }}</td>
        <td>{{ license.minimumQuantity }} {{ $t('pieces') }}</td>
      </tr>
      <tr>
        <td>{{ $t('Licenses.maximum_quantity') }}</td>
        <td>{{ license.maximumQuantity }} {{ $t('pieces') }}</td>
      </tr>
      <tr>
        <td>{{ $t('Licenses.netPrice') }}</td>
        <td>{{ $amount(license.netAmount) }}</td>
      </tr>
      <tr>
        <td>{{ $t('Licenses.vatRate') }}</td>
        <td>{{ license.vatRate.toFixed(2) * 100 }}{{ `%` }}</td>
      </tr>
    </table>

    <el-button
      v-if="orderedQuantity < license.minimumQuantity"
      type="primary"
      class="license-variant__action"
      @click="(orderedQuantity = license.minimumQuantity), handleAddingLicense(orderedQuantity)"
    >
      {{ $t('Licenses.select') }}
    </el-button>
    <div v-else class="license-variant__summary">
      <div class="license-variant__total-price">
        <table class="license-variant__table">
          <tr>
            <td>{{ $t('Licenses.total_amount') }}</td>
            <td>
              <el-input-number
                v-model="orderedQuantity"
                :min="0"
                :max="license.maximumQuantity"
                controls-position="right"
                @change="handleAddingLicense(orderedQuantity)"
              ></el-input-number>
              {{ $t('pieces') }}
            </td>
          </tr>
          <tr>
            <td>{{ $t('Licenses.total_net') }}</td>
            <td>{{ $amount(totalNetPrice) }}</td>
          </tr>
          <tr>
            <td>{{ $t('Licenses.total_gross') }}</td>
            <td>{{ $amount(totalGrossPrice) }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  props: {
    license: {
      type: Object,
    },
  },
  data() {
    return {
      orderedQuantity: 0,
    };
  },
  computed: {
    ...mapGetters('licensesStore', ['licensesCart']),

    licenseStoreQuantity() {
      const license = this.licensesCart.find((license) => {
        return license.uuid === this.license.uuid;
      });

      return license ? license.orderedQuantity : 0;
    },

    totalNetPrice() {
      return (this.orderedQuantity * this.license.netAmount).toFixed(2);
    },
    totalGrossPrice() {
      return (this.totalNetPrice * 1.23).toFixed(2);
    },
  },
  watch: {
    licenseStoreQuantity(quantity) {
      this.orderedQuantity = quantity;
    },
  },
  methods: {
    ...mapActions('licensesStore', ['addLicenseToCart']),
    handleAddingLicense(orderedQuantity) {
      this.addLicenseToCart({ ...this.license, orderedQuantity: orderedQuantity });
    },
  },
};
</script>

<style lang="scss" scoped>
.license-variant {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  min-width: 450px;
  box-shadow: 0px 4px 8px 2px rgba(#000000, 0.1);
  margin: 16px;
  border-radius: 4px;
  & > h2 {
    margin: 8px 0;
    text-align: left;
  }
  &__action {
    margin: 8px;
  }
  &__table {
    width: 100%;
    border-spacing: 1px;
    & tr {
      &:nth-of-type(2n + 1) {
        background: $subMenuActiveText;
      }
    }
    & td {
      text-align: center;
      padding: 4px 0;
    }
    border-bottom: 1px solid $borderColor;
  }
  &__summary {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  &__total-price {
    width: 100%;
  }
}
</style>
