<template>
  <div class="event-list">
    <el-table :data="tableData" :empty-text="$t('ServiceEvents.no_serviceEvents_placeholder')">
      <el-table-column :label="$t('DocumentsWizard.formLabels.servicePlan_name')" min-width="60px" align="center">
        <template slot-scope="scope">{{ scope.row.comments }}</template>
      </el-table-column>
      <el-table-column :label="$t('DocumentsWizard.formLabels.notify_mileage')" min-width="60px" align="center">
        <template slot-scope="scope">{{ scope.row.mileageNotification }}</template>
      </el-table-column>
      <el-table-column :label="$t('DocumentsWizard.formLabels.mileage')" min-width="60px" align="center">
        <template slot-scope="scope">{{ scope.row.mileage }}</template>
      </el-table-column>
      <el-table-column :label="$t('DocumentsWizard.formLabels.notify_period')" min-width="60px" align="center">
        <template slot-scope="scope">{{ scope.row.periodNotification }}</template>
      </el-table-column>
      <el-table-column :label="$t('DocumentsWizard.formLabels.period')" min-width="60px" align="center">
        <template slot-scope="scope">{{ scope.row.period }}</template>
      </el-table-column>
      <el-table-column :label="$t('ServiceEvents.edit_serviceEvent')" min-width="40px" align="center">
        <el-button
          :type="editMode ? 'warning' : 'primary'"
          class="card-edit"
          size="small"
          icon="el-icon-edit"
          circle
          @click="toggleEdit()"
        />
      </el-table-column>
    </el-table>

    <div class="buttons">
      <el-button-group>
        <el-button type="primary" class="cars__action" @click="showAddServiceEventModal()">
          {{ $t('AddServiceEvent.add_serviceEvent') }}
        </el-button>
      </el-button-group>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import AddServiceEvent from '@/effects/AddServiceEvent';

export default {
  data() {
    return {
      editMode: false,
      servicePlanDetails: {
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
    ...mapGetters('servicePlansDetailsStore', ['servicePlan']),
    tableData() {
      return this.servicePlan.serviceEvents;
    },
  },
  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    ...mapActions('servicePlansDetailsStore', ['getServicePlanDetails', 'setViewLoading']),
    toggleEdit(row) {
      alert(row);
    },
    showAddServiceEventModal() {
      this.$modalOn(AddServiceEvent);
    },
  },
};
</script>

<style scoped></style>
