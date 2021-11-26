<template>
  <ModalGateway :large="true" :title="$t('AddDriver.add_driver')" :close="close">
    <el-form
      ref="addDriverForm"
      v-loading="dataLoading"
      class="add-driver"
      :model="addDriverForm"
      :rules="rules"
      label-position="top"
    >
      <NameFormFields :add-driver-form="addDriverForm" />
      <PhoneEmailFormFields :add-driver-form="addDriverForm" />
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :disabled="dataLoading" @click="close = true">{{ $t('cancel') }}</el-button>
      <el-button :disabled="dataLoading" type="success" @click="submitNewDriver">
        {{ $t('confirm') }}
      </el-button>
    </span>
  </ModalGateway>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { postDriverLink } from '@/api/driverLinksApi';
import { addDriver } from '@/api/driversApi';
import { validateIban } from '@/api/ibanApi';
import eventBus from '@/eventBus';
import ModalGateway from '@/modals/ModalGateway';
import { checkIban } from '@/validators';

import BoltFormField from './components/BoltFormField';
import IbanFormField from './components/IbanFormField';
import NameFormFields from './components/NameFormFields';
import OrlenFormField from './components/OrlenFormField';
import PhoneEmailFormFields from './components/PhoneEmailFormFields';
import SchemaFormSelect from './components/SchemaFormSelect';
import UberFormField from './components/UberFormField';

export default {
  components: {
    ModalGateway,
    NameFormFields,
    PhoneEmailFormFields,
  },
  props: {
    driver: {
      type: Object,
    },
  },
  data() {
    return {
      close: false,
      ibanInfo: {},
      addDriverForm: {
        firstName: null,
        lastName: null,
        email: null,
        phoneNumber: null,
        iban: null,
        orlenId: null,
        uberId: null,
        boltId: null,
      },
      selectedSchema: { number: 0 },

      rules: {
        firstName: [
          { required: true, message: this.$t('validation.first_name_cannot_be_empty') },
          { max: 100, message: this.$t('validation.first_name_max') },
        ],
        lastName: [
          { required: true, message: this.$t('validation.last_name_cannot_be_empty') },
          { max: 100, message: this.$t('validation.last_name_max') },
        ],
        email: { type: 'email', message: this.$t('validation.wrong_email_format') },
        phoneNumber: { type: 'string', max: 50, message: this.$t('validation.wrong_phone_number_format') },
        iban: [{ validator: checkIban, trigger: 'blur' }],
        orlenId: [{ max: 50, message: this.$t('validation.provider_max') }],
        uberId: [{ max: 50, message: this.$t('validation.provider_max') }],
        boltId: [{ max: 50, message: this.$t('validation.provider_max') }],
      },
    };
  },
  computed: {
    ...mapGetters(['settlementsSchemas', 'dataLoading']),
    iban() {
      return this.addDriverForm.iban;
    },
  },
  watch: {
    async iban(value) {
      if (value && (value.match(/^\b([0-9]{26})\b/) || value.match(/^\b(PL[0-9]{26})\b/))) {
        const ibanInfo = await validateIban(value);
        ibanInfo.ok ? (this.ibanInfo = ibanInfo.data) : (this.ibanInfo = {});
      } else {
        this.ibanInfo = {};
      }
    },
  },
  mounted() {
    if (this.driver) {
      const { firstName, lastName, email, phoneNumber, iban } = this.driver;
      this.addDriverForm = {
        ...this.addDriverForm,
        firstName,
        lastName,
        email,
        phoneNumber,
        iban,
      };
    }
    this.selectedSchema.number = this.settlementsSchemas[0].schemaNumber;
  },
  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    ...mapActions('driversListViewStore', ['reloadDrivers']),
    submitNewDriver() {
      const identifiers = [];
      this.addDriverForm.orlenId && identifiers.push({ id: this.orlenId, provider: 'ORLEN' });
      this.addDriverForm.uberId && identifiers.push({ id: this.uberId, provider: 'UBER' });
      this.addDriverForm.boltId && identifiers.push({ id: this.boltId, provider: 'BOLT' });

      const settlementSchema = this.settlementsSchemas.find(
        (schema) => (schema.schemaNumber = this.selectedSchema.number)
      );

      const newDriver = { ...this.driver, ...this.addDriverForm, settlementSchema };

      this.$refs.addDriverForm.validate((valid) => {
        if (valid) {
          this.toggleDataLoading(true);

          if (this.driver) {
            postDriverLink({
              ...newDriver,
              driverAccountUUID: this.driver.driverAccountUUID,
              linkStatus: { blocked: false },
            }).then((response) => {
              if (response.ok) {
                eventBus.$emit('added-linked-driver');
                this.addingDriverSuccess();
              } else {
                this.addingDriverFailed();
              }
            });
          } else {
            addDriver(newDriver).then((response) => {
              if (response.ok) {
                this.reloadDrivers();
                this.addingDriverSuccess();
              } else {
                this.addingDriverFailed();
              }
            });
          }
        }
      });
    },
    addingDriverSuccess() {
      this.$message({
        message: this.$t('AddDriver.add_driver_success'),
        type: 'success',
        center: true,
      });
      this.toggleDataLoading(false);
      this.close = true;
    },
    addingDriverFailed() {
      this.$message({
        message: this.$t('AddDriver.add_driver_failed'),
        type: 'error',
        center: true,
      });
      this.toggleDataLoading(false);
    },
  },
};
</script>
<style lang="scss" scoped>
.schema-label {
  margin-right: 16px;
}
.bank-branch {
  font-weight: bold;
}
</style>
