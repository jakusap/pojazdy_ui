<template>
  <ModalGateway :title="$t('DriversProfiles.drivers_documents')" :close="close">
    <SignedContracts :driver="driver" :documents="documents" />
  </ModalGateway>
</template>

<script>
import SignedContracts from '@/components/SignedContractsList';
import ModalGateway from '@/modals/ModalGateway';

export default {
  components: {
    SignedContracts,
    ModalGateway,
  },
  props: {
    driver: {
      type: Object,
    },
    documents: {
      type: Array,
    },
  },
  data() {
    return {
      close: false,
    };
  },
};
</script>

<style scoped></style>
