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

import { addDriver } from '@/api/driversApi';
import ModalGateway from '@/modals/ModalGateway';

import NameFormFields from './components/NameFormFields';
import PhoneEmailFormFields from './components/PhoneEmailFormFields';

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
      addDriverForm: {
        firstName: null,
        lastName: null,
        email: null,
        phoneNumber: null,
      },
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
      },
    };
  },
  computed: {
    ...mapGetters(['dataLoading']),
  },
  mounted() {
    if (this.driver) {
      const { firstName, lastName, email, phoneNumber } = this.driver;
      this.addDriverForm = {
        ...this.addDriverForm,
        firstName,
        lastName,
        email,
        phoneNumber,
      };
    }
  },
  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    ...mapActions('driversListViewStore', ['reloadDrivers']),
    submitNewDriver() {

      const newDriver = { ...this.driver, ...this.addDriverForm};

      this.$refs.addDriverForm.validate((valid) => {
        if (valid) {
          this.toggleDataLoading(true);
          addDriver(newDriver).then((response) => {
            if (response.ok) {
              this.reloadDrivers();
              this.addingDriverSuccess();
            } else {
              this.addingDriverFailed();
            }
          });
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
