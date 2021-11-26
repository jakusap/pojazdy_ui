<template>
  <div v-loading="loading" class="driver-signed-contracts">
    <h3>{{ $t('DriverDocuments.signed_contracts') }}</h3>
    <SignedContractsList :documents="signedContracts" />
    <hr />
    <h3>{{ $t('DriverDocuments.fill_documents_btn_label') }}</h3>
    <DocumentWizardSelector class="driver-signed-contracts__wizard" />
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';

import DocumentWizardSelector from '@/components/DocumentWizardSelector';
import SignedContractsList from '@/components/SignedContractsList';

export default {
  name: 'DriverDocuments',
  components: { SignedContractsList, DocumentWizardSelector },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapGetters('driverAccount', ['signedContracts']),
  },
  async created() {
    this.loading = true;
    await this.fetchDriversSignedContracts();
    this.loading = false;
  },
  methods: {
    ...mapActions('driverAccount', ['fetchDriversSignedContracts']),
  },
};
</script>

<style lang="scss" scoped>
.driver-signed-contracts {
  width: 80%;
  margin: 16px;
  font-weight: 600;
  &__wizard {
    width: 70%;
  }
}
@media screen and (max-width: 650px) {
  .driver-signed-contracts {
    width: 90%;
    &__wizard {
      width: 90%;
    }
  }
}
</style>
