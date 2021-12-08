<template>
  <div class="event-list">
    <input id="invoice-upload" type="file" :accept="acceptedFiles" @input="(e) => previewFile(e)" />
    <ul id="">
      <li v-for="events in serviceEventsList" :key="events.carId">
        {{ events.carMake }} {{ events.carModel }} {{ events.registrationNumber }}
        <ul>
          <li v-for="event in events.serviceEvents" :key="event.orderNumber">
            {{ event.comments }} | powiadom przy: {{ event.mileageNotification }} km | przebieg graniczny
            {{ event.mileage }} km
            <el-button @click="removeEvent(event)">
              Zrealizuj
            </el-button>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { uploadFile } from '@/api/files';
import { getPartnerServiceEventsList, removeFromPartnerServiceEventsList } from '@/api/servicePlansApi';
import RemoveServiceEventDialogWindow from '@/effects/RemoveServiceEvent/RemoveServiceEventDialogWindow';

import partnerEventsListViewStore from './partnerEventsListViewStore';

export default {
  data() {
    return {
      serviceEventsList: [],
    };
  },
  computed: {
    ...mapGetters(['dataLoading']),
    ...mapGetters('partnerEventsListViewStore', ['reloadPartnerEvents']),
    acceptedFiles() {
      return '.pdf,.png,.jpeg';
    },
  },
  watch: {
    async reloadPartnerEvents(reload) {
      if (reload === true) {
        await this.loadServiceEventList();
        this.reloadedPartnerEvents();
      }
    },
  },
  beforeCreate() {
    this.$store.registerModule('partnerEventsListViewStore', partnerEventsListViewStore);
  },
  destroyed() {
    this.$store.unregisterModule('partnerEventsListViewStore');
  },
  async created() {
    await this.loadServiceEventList();
  },
  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    ...mapActions('partnerEventsListViewStore', ['reloadedPartnerEvents']),
    removeEvent(event) {
      this.$modalOn(RemoveServiceEventDialogWindow, {
        dialogVisible: true,
        planId: event.planId,
        orderNumber: event.orderNumber,
      });
    },
    previewFile(e) {
      const uploadedFile = e?.target?.files || e;
      const file = uploadedFile[0];
      const formData = new FormData();
      if (file.size <= 10 ** 6) {
        formData.append('file', file);
        uploadFile(formData).then((response) => {
          if (response.ok) {
            console.log(response.data);
          } else {
            console.log(response.data);
          }
        });
      }
    },
    async loadServiceEventList() {
      this.toggleDataLoading(true);
      getPartnerServiceEventsList()
        .then((response) => {
          response.ok ? (this.serviceEventsList = response.data) : this.loadingFailed();
        })
        .finally(() => {
          this.toggleDataLoading(false);
        });
    },
  },
};
</script>

<style scoped>
.event-list {
  margin-top: 5px;
  margin-left: 5px;
  min-height: 400px;
  /*border: solid 1px black;*/
}
</style>
