<template>
  <section v-loading="!driverProfileInfo" class="driver-profile-section">
    <h1 class="title">{{ $t('DriverProfile.title') }}</h1>
    <div class="driver-data-wrapper">
      <DriverInfoForm
        :disabled="!editable"
        reference="driverProfileInfo"
        :show-company-tax-id="showCompanyTaxId"
        @formUpdate="formUpdate"
      />
      <div class="buttons-wrapper">
        <el-button v-if="!editable" class="button" type="primary" @click="editForm">
          {{ $t('DriverProfile.edit_btn') }}
        </el-button>
        <el-button v-if="editable" class="button" type="info" @click="saveDriverInfo">
          {{ $t('DriverProfile.save_btn') }}
        </el-button>
      </div>
    </div>
    <div class="driver-profile__acceptance">
      <span>
        <el-checkbox checked disabled />
        {{ $t('DriverProfile.usage_permission') }}
        <a :href="`https://cabio.pl/pl/terms/`" target="_blank" class="driver-profile__license-link">
          {{ $t('license') }}
        </a>
      </span>
      <span>
        {{ $t('DriverProfile.resign') }}
        <el-button class="button remove" size="small" type="danger" @click="openDialog">
          {{ $t('DriverProfile.remove_btn') }}
        </el-button>
      </span>
    </div>
    <el-dialog :visible.sync="dialogVisible" :modal="false" :title="$t('DriverProfile.dialog_title')" width="30%">
      <span>{{ $t('DriverProfile.dialog_description') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">{{ $t('DriverProfile.dialog_cancel_btn_label') }}</el-button>
        <el-button type="primary" @click="removeAccount">{{ $t('DriverProfile.dialog_confirm_btn_label') }}</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { removeDriverAccount } from '@/api/driverAccount';
import DriverInfoForm from '@/components/DriverInfoForm';

export default {
  name: 'DriverProfile',
  components: { DriverInfoForm },
  data: function() {
    return {
      driverProfileInfo: null,
      editable: false,
      dialogVisible: false,
    };
  },
  computed: {
    ...mapGetters('providers', ['getSelectedProviders']),
    ...mapGetters('driverAccount', ['getLoggedDriverInfo', 'signedContracts']),
    showCompanyTaxId() {
      return this.getLoggedDriverInfo?.isLinked;
    },
  },
  created() {
    this.fetchDriversSignedContracts();
  },
  methods: {
    ...mapActions('driverAccount', ['fetchLoggedDriverInfo', 'editLoggedDriverInfo', 'fetchDriversSignedContracts']),
    ...mapGetters('driverAccount', ['isUpdateDriverStatusSuccess', 'referencedPartner']),
    formUpdate: function(data) {
      this.driverProfileInfo = data;
    },
    editForm: function() {
      this.editable = true;
    },
    saveDriverInfo: async function() {
      if (this.driverProfileInfo.valid) {
        this.editable = false;
        await this.editLoggedDriverInfo(this.prepareDriverInfoData());
        if (this.isUpdateDriverStatusSuccess()) {
          this.$message({ type: 'success', message: this.$t('DriverProfile.edit_success'), center: true });
        } else {
          this.$message({ type: 'error', message: this.$t('DriverProfile.edit_error'), center: true });
        }
      } else {
        this.$message({ type: 'info', message: this.$t('DriverProfile.not_edited'), center: true });
        this.editable = true;
      }
    },
    openDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    removeAccount: async function() {
      this.closeDialog();
      await removeDriverAccount();
      this.$keycloak.logoutFn();
    },
    prepareDriverInfoData: function() {
      const { carData, activityData, citiesData, contactData } = this.driverProfileInfo.data;
      const { showActivitySection, showVehicleSection } = this.driverProfileInfo.sections;
      const { INITIAL_ACTIVITY_STATE, INITIAL_CAR_STATE } = this.driverProfileInfo.initialState;
      const regex = new RegExp(`[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}`);
      const isUUID = regex.test(activityData.partner);
      const carDataPrepared = showVehicleSection ? carData : INITIAL_CAR_STATE;
      const activityDataPrepared = showActivitySection ? activityData : INITIAL_ACTIVITY_STATE;
      const selectedProviders = this.getSelectedProviders(activityData.providers);
      const referenceId = this.referencedPartner()?.uuid;
      return {
        ...carDataPrepared,
        ...activityDataPrepared,
        ...citiesData,
        ...contactData,
        providers: selectedProviders,
        partnerUuid: isUUID ? activityData.partner : '',
        partnerDescription: !isUUID ? activityData.partner : '',
        referenceId: referenceId,
      };
    },
  },
};
</script>

<style lang="scss">
.driver-profile__acceptance {
  .el-checkbox {
    &__inner {
      background: var(--brand-yellow-background) !important;
      border-color: var(--brand-yellow-border) !important;
      margin-right: 4px;
      &:after {
        border-color: var(--brand-gray-border) !important;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.driver-profile-section {
  padding: 32px 32px 0 32px;
  .title {
    margin: 0 0 32px;
    color: var(--brand-gray-color);
  }
  .driver-data-wrapper {
    .buttons-wrapper {
      display: inline-flex;
      .button {
        margin: 0 16px;
        border-radius: 8px;
        padding: 12px 20px;
        cursor: pointer;
        font-weight: bold;
      }
    }
  }
  .driver-profile__acceptance {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-flow: row;
    position: relative;
    width: calc(100% + 32px);
    margin-top: 16px;
    margin-left: -32px;
    padding: 16px;
    background: var(--brand-gray-background-active);
    color: var(--white-color-active);
    .el-button {
      margin-left: 4px;
    }
    & > span {
      color: var(--white-color);
      font-weight: 400;
      & + span {
        margin-top: 0px;
      }
    }
  }
  .driver-profile__license-link {
    font-weight: 700;
    transition: all 0.1s ease-in-out;
    color: var(--brand-yellow-color-active);
    &:hover {
      color: var(--white-color-hover);
    }
  }
}

@media screen and (max-width: 650px) {
  .driver-profile-section {
    padding: 32px 32px 0 32px;
    .title {
      margin: 0 0 32px;
      color: var(--brand-gray-color);
    }
    .driver-data-wrapper {
      .buttons-wrapper {
        width: 100%;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .button {
          margin-bottom: 16px;
        }
      }
    }
    .driver-profile__acceptance {
      align-items: center;
      flex-flow: column;
      & > span {
        margin: auto;
        & + span {
          margin-top: 12px;
        }
      }
    }
  }
}
</style>
