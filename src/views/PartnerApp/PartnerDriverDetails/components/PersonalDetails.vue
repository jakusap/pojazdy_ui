<template>
  <div class="personal-details card-wrapper">
    <el-button
      :type="editMode ? 'warning' : 'primary'"
      class="card-edit"
      size="small"
      icon="el-icon-edit"
      circle
      @click="toggleEdit()"
    />
    <el-form
      ref="personalDetailsForm"
      :model="personalDetails"
      :rules="rules"
      class="driver-form"
      @submit.native.prevent
    >
      <div class="driver-name">
        <h2 v-if="!editMode">{{ driver.firstName }} {{ driver.lastName }}</h2>
        <el-form-item v-if="editMode" prop="firstName">
          <el-input v-model="personalDetails.firstName"></el-input>
        </el-form-item>
        <el-form-item v-if="editMode" prop="lastName">
          <el-input v-model="personalDetails.lastName"></el-input>
        </el-form-item>
      </div>
      <div :class="[editMode && 'driver-contact__edit']" class="driver-contact">
        <div>
          <i class="el-icon-message" />
          <a v-if="!editMode" :href="`mailto:${driver.email}`" class="personal-details__field">
            {{ driver.email || $t('dash') }}
          </a>
          <el-form-item prop="email">
            <el-input v-if="editMode" v-model="personalDetails.email"></el-input>
          </el-form-item>
        </div>
        <div>
          <i class="el-icon-phone"></i>
          <a v-if="!editMode" :href="`tel:${driver.phoneNumber}`" class="personal-details__field">
            {{ driver.phoneNumber || $t('dash') }}</a
          >
          <el-form-item prop="phoneNumber">
            <el-input v-if="editMode" v-model="personalDetails.phoneNumber"></el-input>
          </el-form-item>
        </div>
<!--        <div>-->
<!--          <i v-if="!editMode" class="el-icon-open" />-->
<!--          <span v-if="driver.active && !editMode">{{ $t('Drivers.active_driver') }}</span>-->
<!--          <span v-if="!driver.active && !editMode">{{ $t('Drivers.inactive_driver') }}</span>-->
<!--          <el-form-item prop="active">-->
<!--            <el-switch-->
<!--              v-if="editMode"-->
<!--              v-model="personalDetails.active"-->
<!--              :active-text="$t('Drivers.active_driver')"-->
<!--              :inactive-text="$t('Drivers.inactive_driver')"-->
<!--            >-->
<!--            </el-switch>-->
<!--          </el-form-item>-->
<!--        </div>-->
      </div>
      <div v-if="editMode" class="form-buttons">
        <el-button type="primary" size="small" @click="submit()">{{ $t('save') }}</el-button>
        <el-button size="small" @click="toggleEdit()">{{ $t('cancel') }}</el-button>
      </div>
    </el-form>
<!--    <div v-if="!editMode" class="merge-button">-->
<!--      <el-button type="primary" @click="startDriversMerge()">{{ $t('merge_drivers') }}</el-button>-->
<!--    </div>-->
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { editDriver } from '@/api/driversApi';
import MergeDrivers from '@/effects/MergeDrivers';

export default {
  data() {
    return {
      editMode: false,
      personalDetails: {
        firstName: null,
        lastName: null,
        email: null,
        phoneNumber: null,
        active: null,
      },
      rules: {
        firstName: [{ required: true, message: this.$t('validation.first_name_cannot_be_empty') }],
        lastName: [{ required: true, message: this.$t('validation.last_name_cannot_be_empty') }],
        email: { type: 'email', message: this.$t('validation.wrong_email_format') },
        phoneNumber: { type: 'string', max: 50, message: this.$t('validation.wrong_phone_number_format') },
      },
    };
  },
  computed: {
    ...mapGetters('driverDetailsStore', ['driver']),
  },
  methods: {
    ...mapActions('driverDetailsStore', ['getDriverDetails', 'setViewLoading']),
    toggleEdit() {
      if (!this.editMode) {
        const { firstName, lastName, email, phoneNumber, active } = this.driver;
        this.personalDetails = { firstName, lastName, email, phoneNumber, active };
      }
      this.editMode = !this.editMode;
    },
    startDriversMerge() {
      this.$modalOn(MergeDrivers, { driver: this.driver });
    },

    submit() {
      const editedDriver = { ...this.driver, ...this.personalDetails };
      this.$refs.personalDetailsForm.validate((valid) => {
        if (valid) {
          this.setViewLoading(true);
          editDriver(editedDriver).then((response) => {
            if (response.ok) {
              this.$message({ message: this.$t('DriverDetails.edit_driver_success'), type: 'success', center: true });
              this.toggleEdit();
              this.getDriverDetails();
            } else {
              this.editFailed();
            }
          });
        }
      });
    },
    editFailed() {
      this.$message({
        message: this.$t('DriverDetails.edit_driver_failed'),
        type: 'error',
        center: true,
      });
      this.setViewLoading(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.driver-form {
  & >>> .el-input {
    margin-left: 8px;
  }
}
.driver-name {
  display: flex;
  align-items: center;
  justify-content: left;
  padding: 12px 0;
  & .el-form-item {
    width: 40%;
    & + .el-form-item {
      padding-left: 8px;
    }
  }
  & h2 {
    margin: 0;
  }
}
.merge-button {
  display: flex;
  justify-content: center;
}
.driver-contact {
  &__edit {
    & > div {
      display: flex;
      align-items: center;
      border-bottom: 0;
    }
  }
  & > div {
    padding: 12px 0;
    &:not(:last-child) {
      border-bottom: 1px solid $borderColor;
    }
  }
  & .el-form-item {
    width: 100%;
    margin: 0;
  }
  & i {
    margin-right: 8px;
  }
}
.form-buttons {
  text-align: center;
  margin-top: 16px;
}
</style>
