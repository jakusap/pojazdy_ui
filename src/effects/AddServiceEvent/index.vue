<template>
  <ModalGateway :large="!modalSize" :slight="modalSize" :title="$t('AddServiceEvent.add_serviceEvent')" :close="close">
    <el-form
      ref="addServiceEventForm"
      v-loading="dataLoading"
      class="add-car"
      :model="addServiceEventForm"
      :rules="rules"
      label-position="top"
    >
      <ServiceEventCommentField :add-service-event-form="addServiceEventForm" />
      <ServiceEventNumbersFields :add-service-event-form="addServiceEventForm" />
      <ServiceEventDatesFields :add-service-event-form="addServiceEventForm" />
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :disabled="dataLoading" @click="close = true">{{ $t('cancel') }}</el-button>
      <el-button :disabled="dataLoading" type="success" @click="submitNewServiceEvent">
        {{ $t('confirm') }}
      </el-button>
    </span>
  </ModalGateway>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { addServiceEvent } from '@/api/serviceEventsApi';
import ModalGateway from '@/modals/ModalGateway';

import ServiceEventCommentField from './components/ServiceEventCommentField';
import ServiceEventDatesFields from './components/ServiceEventDatesFields';
import ServiceEventNumbersFields from './components/ServiceEventNumbersFields';
export default {
  components: {
    ModalGateway,
    ServiceEventCommentField,
    ServiceEventDatesFields,
    ServiceEventNumbersFields,
  },
  props: {
    serviceEvent: {
      type: Object,
    },
  },
  data() {
    return {
      close: false,
      addServiceEventForm: {
        mileage: null,
        period: null,
        comments: null,
        mileageNotification: null,
        periodNotification: null,
      },
      rules: {
        mileage: [{ required: true, message: this.$t('validation.mileage_required') }],
        mileageNotification: [{ required: true, message: this.$t('validation.mileage_required') }],
        comments: [{ required: true, message: this.$t('validation.service_name_required') }],
      },
    };
  },
  computed: {
    ...mapGetters(['dataLoading']),
    modalSize() {
      return this.mobile === true;
    },
    servicePlanId() {
      return String(this.$route.params.servicePlanId);
    },
  },
  mounted() {
    if (this.serviceEvent) {
      const { mileage, period, comments, mileageNotification, periodNotification } = this.serviceEvent;
      this.addServiceEventForm = {
        ...this.addServiceEventForm,
        mileage,
        period,
        comments,
        mileageNotification,
        periodNotification,
      };
    }
  },
  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    ...mapActions('servicePlansDetailsStore', ['getServicePlanDetails', 'setViewLoading']),
    submitNewServiceEvent() {
      const newServiceEvent = { ...this.serviceEvent, ...this.addServiceEventForm };
      this.$refs.addServiceEventForm.validate((valid) => {
        if (valid) {
          this.toggleDataLoading(true);
          addServiceEvent(this.servicePlanId, newServiceEvent).then((response) => {
            if (response.ok) {
              this.addingServiceEventSuccess();
              this.getServicePlanDetails();
            } else {
              this.addingServiceEventFailed();
            }
          });
        }
      });
    },
    addingServiceEventSuccess() {
      this.$message({
        message: this.$t('AddServiceEvent.add_serviceEvent_success'),
        type: 'success',
        center: true,
      });
      this.toggleDataLoading(false);
      this.close = true;
    },
    addingServiceEventFailed() {
      this.$message({
        message: this.$t('AddServiceEvent.add_serviceEvent_failed'),
        type: 'error',
        center: true,
      });
      this.toggleDataLoading(false);
    },
  },
};
</script>

<style scoped></style>
