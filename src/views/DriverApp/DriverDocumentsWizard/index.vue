<template>
  <section class="documentsWizardSection">
    <h2 class="description">{{ $t('DocumentsWizard.description') }}</h2>
    <div class="mainContent">
      <component :is="wizardComponent"> </component>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

import { AVALONLOGISTICS } from '@/utils/referenced-partners';

import { QUICKAPPS } from '../../../utils/referenced-partners';
import AvalonWizard from './components/Avalon/index';
import ComfortwayWizard from './components/Comfortway/index';
import QuickAppsWizard from './components/QuickApps/index';

export default {
  name: 'DriverDocumentsWizard',
  components: { ComfortwayWizard, AvalonWizard },
  computed: {
    ...mapGetters(['partnerCode']),
    wizardComponent() {
      switch (this.partnerCode) {
        case AVALONLOGISTICS:
          return AvalonWizard;
        case QUICKAPPS:
          return QuickAppsWizard;
        default:
          return ComfortwayWizard;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.documentsWizardSection {
  padding: 32px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);

  .description {
    margin-bottom: 32px;
  }

  .mainContent {
    display: flex;
    flex: 1;
    overflow-y: auto;

    .stepWrapper {
      padding: 0 32px;
      flex: 1;

      .save-documents-btn {
        font-weight: 600;
        font-size: 18px;
        margin-left: 11px;
      }
    }
  }
}
</style>
