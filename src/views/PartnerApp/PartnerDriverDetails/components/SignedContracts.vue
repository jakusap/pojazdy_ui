<template>
  <div>
    <h3 class="title">{{ $t('DriverDocuments.title') }}</h3>
    <SignedContractsList :driver="driver" :documents="signedContracts" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import SignedContractsList from '@/components/SignedContractsList';

export default {
  name: 'SignedContracts',
  components: { SignedContractsList },
  data() {
    return {};
  },
  computed: {
    ...mapGetters('driverDetailsStore', ['signedContracts', 'driver']),
  },
};
</script>

<style lang="scss" scoped>
.title {
  margin: 0 0 8px 10px;
  font-size: 20px;
  padding: 8px 0;
  width: 100%;
}
</style>
