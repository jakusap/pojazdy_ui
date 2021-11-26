<template>
  <div class="license-cart">
    <table>
      <tr>
        <th>{{ `#` }}</th>
        <th>{{ $t('Licenses.description') }}</th>
        <th>{{ $t('Licenses.total_amount') }}</th>
        <th>{{ $t('Licenses.total_net') }}</th>
        <th>{{ $t('Licenses.total_gross') }}</th>
        <th></th>
      </tr>
      <tr v-for="(license, idx) in licensesCart" :key="license.uuid">
        <td>{{ idx + 1 }}</td>
        <td>{{ license.description }}</td>
        <td>
          <el-button
            type="info"
            size="mini"
            :disabled="license.orderedQuantity === license.minimumQuantity"
            @click="addLicenseToCart({ ...license, orderedQuantity: license.orderedQuantity - 1 })"
          >
            <i class="el-icon-minus" />
          </el-button>

          <span class="license-cart__amount"> {{ license.orderedQuantity }} {{ $t('pieces') }}</span>

          <el-button
            type="primary"
            size="mini"
            :disabled="license.orderedQuantity === license.maximumQuantity"
            @click="addLicenseToCart({ ...license, orderedQuantity: license.orderedQuantity + 1 })"
          >
            <i class="el-icon-plus" />
          </el-button>
        </td>
        <td>{{ $amount(license.netAmount * license.orderedQuantity) }}</td>
        <td>
          {{ $amount(license.netAmount * (1 + license.vatRate) * license.orderedQuantity) }}
        </td>
        <td>
          <el-button type="danger" size="mini" @click="removeLicenseFromCart(license)">
            <i class="el-icon-close"></i>
          </el-button>
        </td>
      </tr>
    </table>

    <div class="license-cart__total-sum">
      <el-button v-if="purchaseStep === 1" type="info" @click="$emit('next-step')">
        {{ $t('Licenses.next_step') }}
      </el-button>
      <span> {{ $t('Licenses.pay_sum') }} {{ $amount(totalSum) }} </span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  props: {
    purchaseStep: {
      type: Number,
    },
  },
  computed: {
    ...mapGetters('licensesStore', ['licensesCart']),
    totalSum() {
      return this.licensesCart.reduce(
        (acc, curr) => (acc += curr.netAmount * curr.orderedQuantity * (1 + curr.vatRate)),
        0
      );
    },
  },
  methods: {
    ...mapActions('licensesStore', ['addLicenseToCart', 'removeLicenseFromCart']),
  },
};
</script>

<style lang="scss" scoped>
.license-cart {
  padding: 16px 0;
  margin: 16px;
  box-shadow: 0px 4px 8px 2px rgba(#000000, 0.1);
  border-radius: 4px;
  & table {
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
  }

  & i {
    font-weight: bold;
    font-size: 12px;
  }
  &__amount {
    padding: 0 4px;
  }
  &__total-sum {
    border-top: 1px solid $borderColor;
    display: flex;
    align-items: center;
    flex-flow: row-reverse;
    padding: 32px 16px;
    font-size: 18px;
    & > span {
      margin-right: 16px;
    }
  }
}
</style>
