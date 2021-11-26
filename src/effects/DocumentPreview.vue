<template>
  <ModalGateway :document="true" :close="close">
    <div id="pdf" v-loading="loading" class="inline-pdf" />
  </ModalGateway>
</template>

<script>
import PDFObject from 'pdfobject';

import { getSignedDocumentForDriver } from '@/api/partnerDocumentsApi';
import ModalGateway from '@/modals/ModalGateway';

export default {
  components: { ModalGateway },
  props: {
    driver: {
      type: Object,
    },
    contractId: {
      type: Number,
    },
    order: {
      type: Number,
    },
  },
  data() {
    return {
      close: false,
      loading: false,
    };
  },
  async mounted() {
    this.loading = true;
    await getSignedDocumentForDriver(
      this.$props.driver?.driverAccountUUID,
      this.$props.driver?.driverUUID,
      this.$props.contractId,
      this.$props.order
    )
      .then((e) => {
        const pdfData = e.data;
        return URL.createObjectURL(pdfData);
      })
      .then((url) => {
        PDFObject.embed(url, '#pdf');
      });

    this.loading = false;
  },
  methods: {
    toggleMobilePDF() {
      document.getElementById('pdf').classList.toggle('mobile');
      this.mobilePdf = !this.mobilePdf;
    },
  },
};
</script>

<style lang="scss">
.inline-pdf {
  display: grid;
  height: 100%;
  width: 90%;
  &.mobile {
    z-index: 9999;
    display: initial;
  }
  @media screen and (min-width: 768px) {
    display: initial;
    height: 100%;
    width: 50%;
  }
}
</style>
