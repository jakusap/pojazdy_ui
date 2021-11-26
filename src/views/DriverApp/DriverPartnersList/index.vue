<template>
  <section class="driver-partners-section">
    <h1 class="driver-partners-title">{{ $t('DriverPartners.partners_title') }}</h1>
    <div class="driver-partners-content">
      <el-collapse accordion>
        <el-collapse-item
          ref="sticky-header"
          :class="['accordion-header', { sticky: stickyHeader }]"
          name="default"
          disabled
        >
          <template slot="title">
            <div class="partner-info-row">
              <span>{{ $t('DriverPartners.partners_accordion_column_name_label') }}</span>
              <span>{{ $t('DriverPartners.partners_accordion_column_phone_label') }}</span>
              <span>{{ $t('DriverPartners.partners_accordion_column_email_label') }}</span>
              <span>{{ $t('DriverPartners.partners_accordion_column_www_label') }}</span>
            </div>
            <el-button class="select-partner-btn hidden">{{
              $t('DriverPartners.partners_accordion_column_select_partner_btn_label')
            }}</el-button>
          </template>
        </el-collapse-item>
        <el-collapse-item
          v-for="partner in partners"
          :key="partner.uuid"
          :name="partner.name"
          :disabled="disableCollapse(partner)"
        >
          <template slot="title">
            <div class="partner-info-row">
              <span>{{ partner.name }}</span>
              <span>{{ partner.phoneNumber || '-' }}</span>
              <span>{{ partner.email || '-' }}</span>
              <span>{{ partner.website || '-' }}</span>
            </div>
            <div class="partner-info-row mobile">
              <div class="info-wrapper">
                <span class="label">{{ $t('DriverPartners.partners_accordion_column_name_label') + ':' }}</span>
                <span class="value">{{ partner.name }}</span>
              </div>
              <div class="info-wrapper">
                <span class="label">{{ $t('DriverPartners.partners_accordion_column_phone_label') + ':' }}</span>
                <span class="value">{{ partner.phoneNumber }}</span>
              </div>
              <div class="info-wrapper">
                <span class="label">{{ $t('DriverPartners.partners_accordion_column_email_label') + ':' }}</span>
                <span class="value">{{ partner.email || '-' }}</span>
              </div>
              <div class="info-wrapper">
                <span class="label">{{ $t('DriverPartners.partners_accordion_column_www_label') + ':' }}</span>
                <span class="value">{{ partner.website || '-' }}</span>
              </div>
            </div>
            <el-button class="select-partner-btn" @click.stop="openDialog(partner.uuid)">{{
              $t('DriverPartners.partners_accordion_column_select_partner_btn_label')
            }}</el-button>
          </template>
          <div v-if="partner.services.length" class="accordion-content">
            <div class="dropdown-content-wrapper">
              <span class="content-title">{{ $t('DriverPartners.partners_accordion_content_services_label') }}</span>
              <ul>
                <li v-for="service in partner.services" :key="service.uuid">{{ service.name }}</li>
              </ul>
            </div>
            <div class="dropdown-content-wrapper">
              <span class="content-title">{{ $t('DriverPartners.partners_accordion_content_cities_label') }}</span>
              <ul>
                <li v-for="(city, idx) in partner.cities" :key="idx">{{ city }}</li>
              </ul>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :modal="false"
      :title="$t('DriverPartners.partners_dialog_title')"
      width="30%"
      custom-class="select-partner-dialog"
    >
      <span>{{ $t('DriverPartners.partners_dialog_description') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">{{ $t('DriverPartners.partners_dialog_cancel_btn_label') }}</el-button>
        <el-button type="primary" @click="selectPartner()">{{
          $t('DriverPartners.partners_dialog_save_btn_label')
        }}</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'DriverPartnersList',
  data() {
    return {
      dialogVisible: false,
      selectedPartnerUuid: '',
      stickyHeader: false,
    };
  },
  computed: {
    partners() {
      return this.getPartnersList();
    },
  },
  created: async function() {
    if (!this.getPartnersList().length) await this.fetchPartnersList();
    window.addEventListener('scroll', this.handleWindowScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleWindowScroll);
  },
  methods: {
    ...mapActions('partners', ['fetchPartnersList', 'setOwnPartner']),
    ...mapActions('tabs', ['removeTab']),
    ...mapActions('driverAccount', ['fetchLoggedDriverInfo']),
    ...mapGetters('partners', ['getPartnersList']),
    ...mapGetters('driverAccount', ['isLoggedDriverStatusSuccess']),
    ...mapGetters('tabs', ['openTabs']),
    async selectPartner() {
      this.setOwnPartner(this.selectedPartnerUuid);
      if (this.isLoggedDriverStatusSuccess()) {
        this.removeTab(this.openTabs().findIndex((tab) => tab.name === 'DriverPartnersList'));
        this.$router.replace({ name: 'DriverPartnerProfile' });
      }
    },
    findIndexOfPartnersListTab() {
      const tabs = this.openTabs();
      return tabs.findIndex((ele) => ele.name == 'DriverPartnersListChildren');
    },
    openDialog(partnerUuid) {
      this.selectedPartnerUuid = partnerUuid;
      this.dialogVisible = true;
    },
    closeDialog() {
      this.selectedPartnerUuid = '';
      this.dialogVisible = false;
    },
    disableCollapse(partner) {
      return Boolean(!partner.services.length || !partner.cities.length);
    },
    handleWindowScroll() {
      const stickyHeader = this.$refs['sticky-header'];
      return stickyHeader.$el.offsetTop <= window.scrollY ? (this.stickyHeader = true) : (this.stickyHeader = false);
    },
  },
};
</script>

<style lang="scss">
.driver-partners-section {
  padding: 32px;
  .driver-partners-title {
    margin: 0 0 32px 0;
  }
  .driver-partners-content {
    .el-collapse-item {
      &.accordion-header {
        .el-collapse-item__header {
          cursor: default;
          color: var(--brand-gray-color);
          font-weight: bold;
          > i {
            opacity: 0;
          }
        }
        &.sticky {
          position: fixed;
          top: 50px;
          left: 0;
          right: 0;
          padding: 0 32px;
        }
      }
      &.is-disabled {
        .el-collapse-item__header {
          color: var(--brand-gray-color);
          cursor: default;
          .el-collapse-item__arrow {
            opacity: 0;
          }
        }
      }
    }
    .partner-info-row {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      &.mobile {
        display: none;
      }
      > span {
        padding: 0px 16px;
        margin: 8px;
        flex: 1;
      }
    }
    .select-partner-btn {
      margin: 0 16px;
      background: var(--brand-yellow-background);
      color: var(--brand-gray-color);
      font-weight: bold;
      border: none;
      &.hidden {
        opacity: 0;
        height: 0;
        &:hover {
          cursor: default;
        }
      }
    }
    .el-collapse-item__content {
      padding: 16px 24px;
      .accordion-content {
        display: flex;
        flex-wrap: wrap;
        .dropdown-content-wrapper {
          min-width: 50%;
          padding-right: 16px;
          box-sizing: border-box;
          .content-title {
            font-weight: bold;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .driver-partners-section {
    .driver-partners-content {
      .el-collapse-item {
        &.accordion-header {
          display: none;
        }
        .el-collapse-item__header {
          height: auto;
          min-height: 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
      }
      .partner-info-row {
        display: none;
      }
      .partner-info-row.mobile {
        display: flex;
        flex-wrap: wrap;
        .info-wrapper {
          flex: 1 1 auto;
          min-width: 50%;
          .label {
            font-weight: bold;
            white-space: nowrap;
            margin-right: 8px;
            width: 125px;
            display: inline-block;
          }
          .value {
            white-space: nowrap;
          }
        }
      }
      .select-partner-btn {
        margin-top: 16px;
        margin-bottom: 16px;
      }
      .el-collapse-item__arrow {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        transform: rotate(90deg);

        &.is-active {
          transform: rotate(-90deg);
        }
      }
      .el-collapse-item__content {
        padding: 16px 0;
        border-top: 1px solid var(--light-gray-border);
      }
    }
  }
}

@media screen and (max-width: 650px) {
  .driver-partners-section {
    .driver-partners-content {
      .partner-info-row.mobile {
        .info-wrapper {
          flex: 1 1 100%;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.select-partner-dialog {
  min-width: 280px;
  .el-dialog__body {
    word-break: break-word;
  }
}
</style>
