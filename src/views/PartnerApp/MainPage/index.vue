<template>
  <div class="event-list">
    document<input id="invoice-upload" type="file" :accept="acceptedFiles" @input="(e) => previewDocument(e)" />
    <br />
    invoice<input id="invoice-upload" type="file" :accept="acceptedFiles" @input="(e) => previewInvoice(e)" />
    <div id="invoice-download" style="height: 200px; width: 200px">
      <el-button @click="downloadDocument(13)">Download document</el-button>
      <el-button @click="downloadInvoice('d9de203c-1e0a-4d73-b448-7d8733fdbcc6')">Download invoice</el-button>
    </div>
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

import { getDocumentPreview, uploadDocument, uploadInvoice,  getInvoicePreview } from '@/api/files';
import { getPartnerServiceEventsList, removeFromPartnerServiceEventsList } from '@/api/servicePlansApi';
import RemoveServiceEventDialogWindow from '@/effects/RemoveServiceEvent/RemoveServiceEventDialogWindow';

import partnerEventsListViewStore from './partnerEventsListViewStore';

export default {
  data() {
    return {
      serviceEventsList: [],
      document: {
        documentId: null,
        partnerUUID: null,
        typeCode: 'DRIVING_LICENCE',
        driverUUID: null,
        filename: 'licence.pdf',
        description: 'Prawo jazdy',
        systemEntryDate: new Date(),
      },
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
    downloadDocument(documentId) {
      getDocumentPreview(documentId).then((response) => {
        const fileName = response.headers.filename;
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${fileName}`); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
    },
    downloadInvoice(invoiceUUID) {
      getInvoicePreview(invoiceUUID).then((response) => {
        const fileName = response.headers.filename;
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${fileName}`); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
    },
    previewDocument(e) {
      const uploadedFile = e?.target?.files || e;
      const file = uploadedFile[0];
      const formData = new FormData();
      if (file.size <= 10 ** 6) {
        formData.append('file', file);
        formData.append('typeCode', 'MANDATE');
        formData.append('description', 'Mandat za prędkość');
        formData.append('driverUUID', 'faa07e14-0a0b-4f86-846b-090b66581cd1');
        uploadFile(formData).then((response) => {
          if (response.ok) {
            alert('Uploaded');
          }
        });
      }
    },
    previewInvoice(e) {
      const uploadedFile = e?.target?.files || e;
      const file = uploadedFile[0];
      const formData = new FormData();
      if (file.size <= 10 ** 6) {
        formData.append('file', file);
        formData.append('description', 'Faktura za paliwo');
        formData.append('driverUUID', 'faa07e14-0a0b-4f86-846b-090b66581cd1');
        uploadInvoice(formData).then((response) => {
          if (response.ok) {
            alert('Uploaded');
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
