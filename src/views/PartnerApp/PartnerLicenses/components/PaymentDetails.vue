<template>
  <div class="payment-details">
    <el-form
      label-position="left"
      label-width="130px"
      class="payment-details__form"
      :model="nipFormModel"
      :rules="nipFormRules"
    >
      <h3>{{ $t('Licenses.buyers_nip') }}</h3>
      <el-form-item :label="$t('Licenses.nip')" prop="nip">
        <el-input v-model.number="nipFormModel.nip" show-word-limit maxlength="10"></el-input>
      </el-form-item>
    </el-form>

    <el-form
      v-loading="loading"
      label-position="left"
      label-width="130px"
      class="payment-details__form"
      :model="buyerFormModel"
    >
      <h3>{{ $t('Licenses.invoice_details') }}</h3>
      <el-form-item :label="$t('Licenses.buyer_name')">
        <el-input v-model="buyerFormModel.name" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('Licenses.nip')">
        <el-input v-model="buyerFormModel.nip" disabled></el-input>
      </el-form-item>
      <h3>{{ $t('Licenses.address') }}</h3>
      <div class="payment-details__address">
        <el-form-item class="payment-details__input--long" :label="$t('Licenses.street_name')">
          <el-input v-model="buyerFormModel.street" disabled></el-input>
        </el-form-item>
        <el-form-item class="payment-details__input--short" :label="$t('Licenses.apartment_number')">
          <el-input v-model="buyerFormModel.houseNumber" disabled></el-input>
        </el-form-item>
        <el-form-item class="payment-details__input--short" :label="$t('Licenses.house_number')">
          <el-input v-model="buyerFormModel.apartmentNumber" disabled></el-input>
        </el-form-item>
      </div>
      <div class="payment-details__address">
        <el-form-item :label="$t('Licenses.city')" class="payment-details__input--long">
          <el-input v-model="buyerFormModel.city" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('Licenses.postal_code')" class="payment-details__input--short">
          <el-input v-model="buyerFormModel.postalCode" disabled></el-input>
        </el-form-item>
      </div>
      <div class="payment-details__action">
        <el-button :disabled="!nipValid" type="primary" @click="startPayment(licensesCart)">
          <span>
            {{ $t('Licenses.pay_online') }}
            <svg-icon icon-class="przelewy24" />
          </span>
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { postBuyLicenses, validateNip } from '@/api/licensesApi';

const buyerFormShape = {
  name: '',
  nip: '',
  street: '',
  houseNumber: '',
  apartmentNumber: '',
  city: '',
  postalCode: '',
};

export default {
  data() {
    const checkNip = (rule, value, callback) => {
      if (typeof value === 'number' && String(value).length === 10) {
        this.loading = true;
        validateNip(value)
          .then((response) => {
            if (response.ok) {
              this.buyerFormModel = { ...response.data, apartmentNumber: response.data.apartmentNumber || '-' };
              this.nipValid = true;
              callback();
            } else {
              callback(this.$t('validation.nip_invalid'));
              this.buyerFormModel = { ...buyerFormShape };
              this.nipValid = false;
            }
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        callback(this.$t('validation.nip_required'));
        this.buyerFormModel = { ...buyerFormShape };
        this.nipValid = false;
      }
    };
    return {
      loading: false,
      nipValid: false,
      buyerFormModel: {},
      nipFormModel: {
        nip: '',
      },
      nipFormRules: {
        nip: [{ validator: checkNip, trigger: 'change' }],
      },
    };
  },
  computed: {
    ...mapGetters('licensesStore', ['licensesCart']),
  },
  methods: {
    startPayment(cart) {
      const priceListMap = {};

      cart.map((license) => {
        priceListMap[license.uuid] = license.orderedQuantity;
      });

      const buyLicensesRequest = {
        priceListMap,
        taxId: this.nipFormModel.nip,
      };

      postBuyLicenses(buyLicensesRequest).then((response) => {
        if (response.ok) {
          window.location.href = response.data.url;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.payment-details {
  margin: 16px;
  padding: 16px;
  box-shadow: 0px 4px 8px 2px rgba(#000000, 0.1);
  border-radius: 4px;
}
.payment-details__form {
  display: flex;
  flex-flow: column;
}
.payment-details__address {
  display: flex;
  flex-wrap: wrap;
}
.payment-details__input--long,
.payment-details__input--short {
  width: 100%;
}
.payment-details__action {
  margin: auto;
  & span {
    display: flex;
    align-items: center;
    font-weight: bold;
  }
}
.svg-icon {
  height: 25px;
  width: 90px;
}
@media screen and (min-width: 768px) {
  .payment-details__input--long {
    flex: 2;
    min-width: 450px;
    max-width: 600px;
    margin-right: 8px;
  }
  .payment-details__input--short {
    flex: 1.5;
    min-width: 250px;
    max-width: 350px;
    margin-right: 8px;
  }
}
</style>
