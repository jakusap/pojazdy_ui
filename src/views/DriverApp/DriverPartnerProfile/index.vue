<template>
  <section class="driver-partners-profile-section">
    <h2 class="driver-partners-profile-title">{{ $t('DriverPartners.partner_profile_title') }}</h2>
    <div v-if="partnerInfo" class="partner-info-wrapper table-style">
      <div class="partner-info-row name">
        <span>{{ $t('DriverPartners.partner_name') }}</span>
        <span>{{ partnerInfo.name || '-' }}</span>
      </div>
      <div class="partner-info-row">
        <span>{{ $t('DriverPartners.partner_phone') }}</span>
        <span>{{ partnerInfo.phoneNumber || '-' }}</span>
      </div>
      <div class="partner-info-row">
        <span>{{ $t('DriverPartners.partner_email') }}</span>
        <span>{{ partnerInfo.email || '-' }}</span>
      </div>
      <div class="partner-info-row">
        <span>{{ $t('DriverPartners.partner_www') }}</span>
        <span>{{ partnerInfo.website || '-' }}</span>
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-if="partnerInfo.description" class="partner-info-row" v-html="compiledMarkdown"></div>
      <div v-if="showFillDocumentsBtn" class="fill-documents">
        <DocumentWizardSelector />
      </div>
      <div v-if="partnerDocuments.length">
        <PartnerDocuments :partner-documents="partnerDocuments" />
      </div>
    </div>
    <div v-if="showPartnerInvitation" class="partner-info-wrapper">
      <p class="partner-invite-description">{{ $t('DriverPartners.partner_invitation_description') }}</p>
      <el-form ref="consentToSendContactDetails" :model="consentForm" class="consent-form" @submit.native.prevent>
        <InputCustomCheckbox
          v-model="consentForm.consentToSendContactDetails"
          :label="$t('DriverPartners.partner_invitation_leave_contact_data')"
          border
        />
        <el-button type="primary" class="partner-invite-btn" @click="invitePartner">{{
          $t('DriverPartners.partner_invitation_btn')
        }}</el-button>
      </el-form>
    </div>
    <div v-if="partnerInfo" class="partner-info-wrapper flex-wrapper">
      <div v-if="partnerInfo.cities.length" class="partner-info-row">
        <span>{{ $t('DriverPartners.partner_cities') }}</span>
        <div class="elements-wrapper">
          <span v-for="(city, idx) in partnerInfo.cities" :key="idx">{{ city }}</span>
        </div>
      </div>
      <div v-if="partnerInfo.services.length" class="partner-info-row">
        <span>{{ $t('DriverPartners.partner_services') }}</span>
        <div class="elements-wrapper">
          <span v-for="(service, idx) in partnerInfo.services" :key="idx">{{ service.name }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import marked from 'marked';
import { mapActions, mapGetters } from 'vuex';

import { getPartnerDocuments } from '@/api/partnerDocumentsApi';
import DocumentWizardSelector from '@/components/DocumentWizardSelector';
import InputCustomCheckbox from '@/components/InputCustomCheckbox';

import PartnerDocuments from './components/PartnerDocuments';

export default {
  name: 'DriverPartnerProfile',
  components: { InputCustomCheckbox, PartnerDocuments, DocumentWizardSelector },
  data() {
    return {
      selectedCooperationType: 'CIVIL_CONTRACT',
      consentForm: {
        consentToSendContactDetails: false,
      },
      cooperationTypes: [
        { label: this.$t('DriverPartners.civil_contract_radio_label'), value: 'CIVIL_CONTRACT' },
        { label: this.$t('DriverPartners.b2b_contract_radio_label'), value: 'B2B' },
      ],
    };
  },
  computed: {
    partnerInfo() {
      return this.getPartnerInfo();
    },
    showPartnerInvitation() {
      if (this.getPartnerInfo()) {
        const { active, email } = this.getPartnerInfo();
        return email && !active;
      } else {
        return false;
      }
    },
    showFillDocumentsBtn() {
      return ['NUBISOFT', 'NUBICABTEST', 'AVALONLOGISTICS', 'QUICKAPPS'].includes(this.partnerInfo.code);
    },
    compiledMarkdown() {
      return marked(this.partnerInfo.description);
    },
    partnerDocuments() {
      return this.getPartnerDocuments();
    },
  },
  async created() {
    await this.fetchPartnerDocuments();
    if (!this.getPartnersList().length) await this.fetchPartnersList();
  },
  methods: {
    ...mapGetters('driverAccount', ['getLoggedDriverInfo', 'getInviteDriverPartner']),
    ...mapActions('driverAccount', ['inviteDriverPartner']),
    ...mapActions('partners', ['fetchPartnersList']),
    ...mapGetters('partners', ['getPartnersList']),
    ...mapActions('partnerProfile', ['fetchPartnerDocuments']),
    ...mapGetters('partnerProfile', ['getPartnerDocuments']),
    ...mapActions('documentsWizard', ['setCooperationType']),
    getPartnerInfo() {
      const partnerUuid = this.getLoggedDriverInfo() && this.getLoggedDriverInfo().partnerUuid;
      return this.getPartnersList().find((ele) => ele.uuid == partnerUuid);
    },

    goFillDocumentsData() {
      this.setCooperationType(this.selectedCooperationType);
      this.$router.push({ name: 'DriverDocumentsWizard' });
    },

    async invitePartner() {
      const uuid = this.getPartnerInfo().uuid;
      const { consentToSendContactDetails } = this.consentForm;
      await this.inviteDriverPartner({ uuid, consentToSendContactDetails });
      const invite = this.getInviteDriverPartner();
      if (invite.ok || invite.response.status == 409) {
        this.$message({
          type: 'success',
          message: this.$t('DriverPartners.partner_invitation_message_success'),
          center: true,
        });
      } else {
        this.$message({
          type: 'error',
          message: this.$t('DriverPartners.partner_invitation_message_error'),
          center: true,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.driver-partners-profile-section {
  padding: 32px;
  .driver-partners-profile-title {
    margin: 0;
  }
  .partner-info-wrapper {
    margin-top: 16px;
    width: fit-content;
    &.table-style {
      .partner-info-row {
        span {
          font-size: 20px;
          display: inline-block;
          &:first-child {
            min-width: 170px;
          }
          &:last-child {
            font-weight: bold;
          }
        }
        &.name {
          span {
            font-size: 20px;
          }
        }
      }
    }
    &.flex-wrapper {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      .partner-info-row {
        margin-bottom: 16px;
        &:first-child {
          margin-right: 64px;
        }
      }
    }
    .partner-info-row {
      padding: 12px 8px;
      border-bottom: 1px solid var(--light-gray-border);
      span {
        font-size: 20px;
      }
      .elements-wrapper {
        margin-top: 16px;
        display: flex;
        flex-direction: column;
        span {
          margin-left: 16px;
          margin-bottom: 4px;
          font-weight: bold;
          &::before {
            content: '- ';
          }
          &:nth-child(even) {
            color: var(--brand-gray-color);
          }
          &:last-child {
            border: none;
          }
        }
      }
    }
    .fill-documents {
      margin: 16px 0;
      font-weight: 600;
      width: 100%;
    }
    .consent-form {
      display: inline-flex;
      align-items: flex-start;
    }
    .partner-invite-description {
      font-size: 16px;
    }
    .partner-invite-btn {
      font-weight: bold;
      font-size: 20px;
      color: var(--brand-gray-color);
      border: 1px solid var(--brand-yellow-border);
      height: 50px;
    }
  }
}

@media screen and (max-width: 650px) {
  .driver-partners-profile-section {
    padding-left: 16px;
    padding-right: 16px;
    .partner-info-wrapper {
      .consent-form {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  }
}
</style>
