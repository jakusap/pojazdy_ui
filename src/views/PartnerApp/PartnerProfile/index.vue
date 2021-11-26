<template>
  <div v-loading="loading" class="profile">
    <div class="profile__info">
      <div class="profile__data">
        <el-form ref="form" :model="formModel" :rules="rules">
          <el-form-item :label="$t('PartnerProfile.name')">
            <el-input :placeholder="profileInfo.name" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('email_address')">
            <el-input :placeholder="profileInfo.email || '-'" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('iban')" prop="iban">
            <el-button
              v-if="!editMode"
              type="primary"
              class="card-edit"
              size="small"
              icon="el-icon-edit"
              circle
              @click="toggleEdit()"
            />
            <el-input v-model="formModel.iban" :placeholder="'-'" :disabled="!editMode"></el-input>
          </el-form-item>
          <el-form-item :label="$t('taxId')" prop="taxId">
            <el-input v-model="formModel.taxId" :placeholder="'-'" :disabled="!editMode"></el-input>
          </el-form-item>
          <el-checkbox v-model="formModel.driverCanDescribeInvoice" :disabled="!editMode">
            {{ $t('PartnerProfile.drivers_invoice_description') }}
          </el-checkbox>
          <el-form-item :label="$t('PartnerProfile.provision')" prop="provision">
            <el-input
              v-model="formModel.provision"
              :placeholder="'-'"
              :disabled="!(editMode && formModel.driverCanDescribeInvoice)"
            ></el-input>
          </el-form-item>
        </el-form>
        <div v-if="editMode" class="profile__save">
          <el-button type="primary" size="small" @click="submit()">{{ $t('save') }}</el-button>
          <el-button size="small" @click="toggleEdit()">{{ $t('cancel') }}</el-button>
        </div>
      </div>
      <div v-if="limit" class="profile__limit">
        <PlotlyChart
          :data="[
            {
              values: [limit],
              textposition: 'inside',
              textinfo: 'label+value',
              labels: [$t('PartnerProfile.available')],
              type: 'pie',
              marker: {
                colors: ['#eeba11'],
              },
            },
          ]"
          :height="350"
          :hovermode="false"
          :title="$t('PartnerProfile.settlements_status')"
        />
        <div class="profile__more">
          <el-button type="info" @click="goToLicenses()">{{ $t('PartnerProfile.buy_more') }}</el-button>
        </div>
      </div>
      <div v-else class="profile__limit profile__limit--used">
        <h2>{{ $t('PartnerProfile.no_settlements') }}</h2>
        <el-button type="danger" @click="goToLicenses()">{{ $t('PartnerProfile.buy_more') }}</el-button>
      </div>
      <div class="profile__acceptance">
        <span>
          <el-checkbox checked disabled />
          {{ $t('PartnerProfile.usage_permission') }}
          <a :href="`https://cabio.pl/pl/partner-terms/`" target="_blank" class="profile__license-link">
            {{ $t('license') }}
          </a>
        </span>
        <span>
          {{ $t('PartnerProfile.resign') }}
          <a href="mailto:" class="profile__license-link"> {{ $t('cabio_info_mail') }}</a>
        </span>
      </div>
    </div>
    <div class="profile__credentials">
      <h2>
        {{ $t('PartnerProfile.external_api_keys') }}
      </h2>
      <div class="credentials__list">
        <OrlenCredentials />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { putPartnerProfile } from '@/api/partnerProfileApi';
import PlotlyChart from '@/components/PlotlyChart';
import { checkIban, checkNip, validateNumber, validateValue } from '@/validators';

import OrlenCredentials from './components/OrlenCredentials';
export default {
  components: {
    PlotlyChart,
    OrlenCredentials,
  },
  data() {
    return {
      loading: false,
      orlen: null,
      editMode: false,
      formModel: {
        iban: '',
        taxId: '',
        driverCanDescribeInvoice: false,
        provision: '',
      },
    };
  },
  computed: {
    ...mapGetters('partnerProfile', ['profileInfo', 'settlementsLimits']),
    ...mapGetters('app', ['storedLocale']),
    limit() {
      return this.settlementsLimits.limit - this.settlementsLimits.usage || 0;
    },
    rules() {
      return {
        iban: [{ validator: checkIban, trigger: 'blur' }],
        taxId: [{ required: this.formModel.driverCanDescribeInvoice, validator: checkNip, trigger: 'blur' }],
        provision: [
          { required: this.formModel.driverCanDescribeInvoice, validator: validateNumber, trigger: 'blur' },
          {
            validator: validateValue,
            maxValue: 999.99,
            minValue: 0,
            trigger: 'blur',
          },
        ],
      };
    },
  },
  async created() {
    this.loading = true;
    this.updateFormFields();
    this.loading = false;
  },
  methods: {
    async updateFormFields() {
      await this.$store.dispatch('partnerProfile/fetchPartnerProfile');
      this.formModel.iban = this.profileInfo.iban;
      this.formModel.taxId = this.profileInfo.taxId;
      this.formModel.driverCanDescribeInvoice = this.profileInfo.describeProvision.enable;
      this.formModel.provision = this.profileInfo.describeProvision.provision;
    },
    toggleEdit() {
      this.editMode = !this.editMode;
    },
    goToLicenses() {
      this.$router.push({ name: 'LicensesPurchase' });
    },
    submit() {
      const editedProfile = {
        ...this.profileInfo,
        iban: this.formModel.iban,
        taxId: this.formModel.taxId ? this.formModel.taxId : null,
        describeProvision: { enable: this.formModel.driverCanDescribeInvoice, provision: this.formModel.provision },
      };
      this.loading = true;
      this.$refs.form.validate((valid) => {
        if (valid) {
          putPartnerProfile(editedProfile)
            .then((response) => {
              if (response.ok) {
                this.$message({
                  message: this.$t('PartnerProfile.data_edit_success'),
                  type: 'success',
                  center: true,
                });
                this.toggleEdit();
                this.updateFormFields();
              } else {
                this.$message({
                  message: this.$t('PartnerProfile.data_edit_failed'),
                  type: 'failed',
                  center: true,
                });
              }
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          this.loading = false;
        }
      });
    },
  },
};
</script>
<style lang="scss">
.profile__acceptance {
  .el-checkbox {
    &__inner {
      background: $brand-yellow !important;
      border-color: $brand-yellow !important;
      margin-right: 4px;
      &:after {
        border-color: $brand-gray !important;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.profile {
  display: flex;
  flex-flow: column;
  padding: 8px;
  position: relative;
  &__info {
    flex: 1;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    min-height: 150px;
    border-bottom: 1px solid $menuText;
  }
  &__data {
    flex: 1;
    min-width: 300px;
  }

  &__save {
    display: flex;
    justify-content: center;
  }
  &__limit {
    flex: 1;
    &--used {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-flow: column;
      & > h2 {
        padding: 0 8px;
        text-align: center;
      }
    }
  }
  &__more {
    display: flex;
    justify-content: center;
  }
  &__name {
    background: $brand-yellow;
    padding: 16px;
    font-weight: bold;
  }
  &__credentials {
    min-height: 250px;
    & .credentials__list {
      display: grid;
      grid-template-columns: 1fr;
      grid-gap: 8px;
    }
  }
  &__acceptance {
    display: flex;
    justify-content: space-between;
    flex-flow: column;
    position: relative;
    width: 100%;
    margin-top: 16px;
    margin-bottom: 16px;
    margin-left: -16px;
    margin-right: -16px;
    padding: 16px;
    background: $brand-gray;
    color: white;
    & > span {
      margin: auto;
      & + span {
        margin-top: 8px;
      }
    }
  }
  &__license-link {
    font-weight: 700;
    transition: all 0.1s ease-in-out;
    color: $brand-yellow;
    &:hover {
      color: white;
    }
  }
}
@media screen and (min-width: 768px) {
  .profile {
    &__credentials {
      & .credentials__list {
        grid-template-columns: 1fr 1fr;
      }
    }
    &__acceptance {
      align-items: center;
      flex-flow: row;
      & > span {
        & + span {
          margin-top: 0px;
        }
      }
    }
  }
}
@media screen and (min-width: 768px) {
  .profile {
    padding: 16px;
  }
}
</style>
