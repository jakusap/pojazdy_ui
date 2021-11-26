<template>
  <div class="identifiers card-wrapper">
    <el-button
      :type="editMode ? 'warning' : 'primary'"
      class="card-edit"
      size="small"
      icon="el-icon-edit"
      circle
      @click="toggleEdit()"
    />
    <el-row :gutter="8" class="identifiers__providers">
      <el-col v-for="(identifier, idx) in formIdentifiers" :key="idx" :span="24">
        <el-form :ref="`identifiersForm${idx}`" :rules="providerRule" :model="identifier" status-icon>
          <ProviderIdentifier
            :idx="idx"
            :edit-mode="editMode"
            :identifier="identifier"
            @remove-identifier="(e) => formIdentifiers.splice(e.idx, 1)"
          />
        </el-form>
      </el-col>
      <el-button v-if="editMode" class="identifiers__add-provider" type="info" size="small" @click="addIdentifier()">
        <i class="el-icon-plus" />
      </el-button>

      <el-col v-for="(identifier, idx) in ibanIdentifiers" :key="identifier.provider" :span="24">
        <el-form :ref="`ibansForm${idx}`" :rules="ibanRule" :model="identifier" status-icon>
          <IbanIdentifier :edit-mode="editMode" :identifier="identifier" />
        </el-form>
      </el-col>

      <el-col v-if="renderContractNumber" :span="24">
        <el-form :model="contractData" status-icon>
          <ContractIdentifier :edit-mode="editMode" :contract-data="contractData" />
        </el-form>
      </el-col>
    </el-row>

    <div v-if="editMode" class="form-buttons">
      <el-button type="primary" size="small" @click="submit()">{{ $t('save') }}</el-button>
      <el-button size="small" @click="toggleEdit()">{{ $t('cancel') }}</el-button>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';

import { editDriver } from '@/api/driversApi';
import { AVALONCARS, AVALONLOGISTICS, QUICKAPPS } from '@/utils/referenced-partners';
import { checkIban } from '@/validators';

import ContractIdentifier from './components/ContractIdentifier';
import IbanIdentifier from './components/IbanIdentifier';
import ProviderIdentifier from './components/ProviderIdentifier';

export default {
  components: {
    ProviderIdentifier,
    IbanIdentifier,
    ContractIdentifier,
  },
  data() {
    return {
      editMode: false,
      formIdentifiers: [],
      ibanIdentifiers: [],
      contractData: null,
      providerRule: {
        id: [
          {
            type: 'string',
            required: true,
            message: this.$t('validation.provider_id_not_empty'),
          },
        ],
      },
      ibanRule: {
        id: [{ validator: checkIban, trigger: 'blur' }],
      },
    };
  },
  computed: {
    ...mapGetters('driverDetailsStore', ['driver']),
    ...mapGetters('partnerProfile', ['profileInfo']),
    renderContractNumber() {
      return (
        this.profileInfo.code === AVALONLOGISTICS ||
        this.profileInfo.code === AVALONCARS ||
        this.profileInfo.code === QUICKAPPS
      );
    },
  },
  created() {
    this.setIdentifiers();
  },
  methods: {
    ...mapActions('driverDetailsStore', ['getDriverDetails', 'setViewLoading']),
    setIdentifiers() {
      this.formIdentifiers = [...this.driver.identifiers.sort((prev, curr) => curr.provider > prev.provider && -1)];
      this.ibanIdentifiers = [
        { provider: 'IBAN', id: this.driver.iban },
        { provider: 'IBAN_LEASE', id: this.driver.leaseContractIban },
      ];
      if (this.driver.contractInfo) {
        this.contractData = {
          numberProvider: 'CONTRACT_NUMBER',
          contractNumber: this.driver.contractInfo.contractNumber,
          bailiffSeizureProvider: 'BAILIFF_SEIZURE',
          bailiffSeizure: this.driver.contractInfo.bailiffSeizure,
        };
      }
    },
    toggleEdit() {
      this.editMode = !this.editMode;
      if (!this.editMode) {
        this.setIdentifiers();
      }
    },
    addIdentifier() {
      const identifier = { provider: null, id: null, new: true };
      this.formIdentifiers = [identifier, ...this.formIdentifiers];
    },
    submit() {
      const identifiers = this.formIdentifiers;
      const editedDriver = {
        ...this.driver,
        identifiers,
        iban: this.ibanIdentifiers[0].id,
        leaseContractIban: this.ibanIdentifiers[1].id,
        contractInfo: {
          contractNumber: this.contractData?.contractNumber,
          bailiffSeizure: this.contractData?.bailiffSeizure,
        },
      };
      let validated = true;

      this.formIdentifiers.forEach((identifier, idx) => {
        this.$refs[`identifiersForm${idx}`].length &&
          this.$refs[`identifiersForm${idx}`][0].validate((valid) => {
            validated && (validated = valid);
          });
      });

      this.ibanIdentifiers.forEach((identifier, idx) => {
        this.$refs[`ibansForm${idx}`].length &&
          this.$refs[`ibansForm${idx}`][0].validate((valid) => {
            validated && (validated = valid);
          });
      });

      if (validated) {
        const successMessage = this.$t('DriverDetails.edit_driver_success');
        const failedMessage = this.$t('DriverDetails.edit_driver_failed');

        this.setViewLoading(true);
        editDriver(editedDriver).then((response) => {
          if (response.ok) {
            this.$message({ message: successMessage, type: 'success', center: true });
            this.toggleEdit();
            this.getDriverDetails();
          } else {
            this.$message({
              message: failedMessage,
              type: 'error',
              center: true,
            });
            this.setViewLoading(false);
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item {
  width: 70%;
  margin: 0;
}
.identifiers {
  &__providers {
    margin-top: 48px;
  }
  &__add-provider {
    width: 100%;
    display: block;
    margin: auto;
    margin-bottom: 8px;
    i {
      font-size: 20px;
    }
  }
}
.driver-identifier {
  display: flex;
  align-items: center;
  padding-right: 36px;
  &:not(:last-child) {
    border-bottom: 1px solid $borderColor;
  }

  > div:first-of-type {
    width: 100px;
    height: 56px;
  }

  &__empty > div:first-of-type {
    opacity: 0.3;
  }
  &__edit {
    border-bottom: 0;
  }
  i {
    margin-left: 8px;
  }
}

.form-buttons {
  text-align: center;
  margin-top: 16px;
}
</style>
