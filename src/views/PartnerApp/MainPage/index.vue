<template>
  <div class="event-list">
    <el-row :gutter="16">
      <el-col :sm="14">
        <ul class="hidden-list">
          <li v-for="events in serviceEventsList" :key="events.carId" class="car-event_list">
            <span class="car-event_name">
              <SvgIcon :class-name="'box-card__icon'" icon-class="car" />
              {{ events.carMake }} {{ events.carModel }} {{ events.registrationNumber }}</span
            >
            <ul class="hidden-list">
              <li v-for="event in events.serviceEvents" :key="event.orderNumber" class="car-event_list-item">
                {{ event.comments }} | za: {{ event.mileageNotification }} km | do: {{ event.periodNotification }}
                <el-button class="car-event_list-button" type="primary" @click="removeEvent(event)">
                  Zrealizuj
                </el-button>
              </li>
            </ul>
          </li>
        </ul>
      </el-col>
      <el-col :sm="10">
        <div class="files-container">
          <div class="files-documents">
            <h1>{{ $t('DocumentsWizard.formLabels.documents') }}</h1>
            <ul class="hidden-list">
              <li v-for="doc in documentsList" :key="doc.documentId" class="car-event_list">
                <span class="car-event_name"> {{ doc.typeCode }} {{ $t('dash') }} {{ doc.filename }} </span>
                <span style="float: right;">
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-link"
                    circle
                    @click="downloadDocument(doc.documentId)"
                  />
                </span>
              </li>
            </ul>
            <h1>{{ $t('DocumentsWizard.formLabels.invoices') }}</h1>
            <ul class="hidden-list">
              <li v-for="inv in invoicesList" :key="inv.uuid" class="car-event_list">
                <span class="car-event_name"> {{ inv.filename }}</span>
                <span style="float: right;">
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-link"
                    circle
                    @click="downloadInvoice(inv.uuid)"
                  />
                </span>
              </li>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import {
  getDocumentPreview,
  getInvoicePreview,
  getPartnerDocuments,
  getPartnerInvoices,
  uploadDocument,
  uploadInvoice,
} from '@/api/files';
import { getPartnerServiceEventsList, removeFromPartnerServiceEventsList } from '@/api/servicePlansApi';
import SvgIcon from '@/components/SvgIcon';
import RemoveServiceEventDialogWindow from '@/effects/RemoveServiceEvent/RemoveServiceEventDialogWindow';

import partnerEventsListViewStore from './partnerEventsListViewStore';

export default {
  components: {
    SvgIcon,
  },
  data() {
    return {
      serviceEventsList: [],
      documentsList: [],
      invoicesList: [],
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
    this.getFiles();
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
    getFiles() {
      this.toggleDataLoading(true);
      getPartnerDocuments().then((response) => {
        this.documentsList = response.data;
      });
      getPartnerInvoices().then((response) => {
        this.invoicesList = response.data;
      });
      this.toggleDataLoading(false);
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
        uploadDocument(formData).then((response) => {
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
.hidden-list {
  list-style-type: none;
}
.car-event_list {
  border: 1px black solid;
  margin-bottom: 10px;
  padding: 14px;
  border-radius: 15px;
  box-shadow: 2px 2px;
}
.files-container {
  border: 1px black solid;
  padding: 10px;
  border-radius: 15px;
  box-shadow: 2px 2px;
  margin-right: 10px;
}

.car-event_list-item {
  text-align: center;
  border: 1px blue solid;
  margin-top: 5px;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 15px;
}
.car-event_list-button {
  margin-left: 50px;
}
.event-list {
  margin-top: 5px;
  margin-left: 5px;
  min-height: 400px;
  /*border: solid 1px black;*/
}
</style>
