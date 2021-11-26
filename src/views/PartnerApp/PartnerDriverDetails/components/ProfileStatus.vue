<template>
  <div class="card-wrapper">
    <div class="">
      <h3 class="profile-status__title">
        <span>
          {{ $t('Drivers.link_status') }}
        </span>

        <span v-if="!linkAvailable && !linked">
          <i class="el-icon-warning icon-warning" />
        </span>

        <span v-if="!linked && linkAvailable">
          <el-tooltip placement="top">
            <span slot="content">
              {{ $t('Drivers.link_available') }}
            </span>
            <i class="el-icon-info icon-info" />
          </el-tooltip>
        </span>

        <span v-else-if="linked && !driver.linkStatus.blocked">
          <el-tooltip placement="top">
            <span slot="content">
              {{ $t('Drivers.driver_has_profile') }}
            </span>
            <i class="el-icon-success icon-success" />
          </el-tooltip>
        </span>

        <span v-if="linked && driver.linkStatus.blocked">
          <el-tooltip placement="top">
            <span slot="content">
              {{ $t('Drivers.blocked') }}
            </span>
            <i class="el-icon-error icon-warning" />
          </el-tooltip>
        </span>
      </h3>

      <div v-if="linkAvailable || linked" class="profile-status__actions">
        <div v-if="!driver.linkStatus" class="">
          <el-button type="primary" @click="linkDriver(driverProfile)">{{ $t('Drivers.verify_driver') }}</el-button>
          <el-button type="warning" @click="blockDriver(driverProfile)">{{ $t('Drivers.block_driver') }}</el-button>
        </div>
        <div v-else>
          <el-button
            v-if="driver.linkStatus.blocked"
            type="primary"
            @click="changeLinkStatusDriver(driver.linkStatus, false)"
          >
            {{ $t('Drivers.unblock_driver') }}
          </el-button>

          <el-button v-else type="warning" @click="changeLinkStatusDriver(driver.linkStatus, true)">
            {{ $t('Drivers.block_driver') }}
          </el-button>

          <el-button type="info" @click="unlinkDriver(driver.linkStatus)">
            {{ $t('Drivers.unlink_driver') }}
          </el-button>
        </div>
      </div>
      <div v-else class="">
        <div v-if="driver.email" class="">
          {{ $t('Drivers.link_not_available') + driver.email }}
        </div>
        <div v-else class="">
          {{ $t('Drivers.no_email') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { deleteDriverLink, postDriverLink, putDriverLink } from '@/api/driverLinksApi';

export default {
  computed: {
    ...mapGetters('driverDetailsStore', ['driver', 'driverProfile']),
    linkAvailable() {
      return !!this.driverProfile;
    },
    linked() {
      return !!this.driver?.linkStatus;
    },
  },
  methods: {
    ...mapActions('driverDetailsStore', ['getDriverDetails', 'setViewLoading']),
    async linkDriver(driver) {
      this.setViewLoading(true);

      postDriverLink({
        ...driver,
        driverAccountUUID: driver.driverAccountUUID,
        linkStatus: { blocked: false },
      }).then((response) => {
        response.ok ? this.getDriverDetails() : this.editFailed();
      });
    },
    async changeLinkStatusDriver(linkStatus, blocked) {
      this.setViewLoading(true);
      putDriverLink({ ...linkStatus, blocked: blocked }).then((response) => {
        response.ok ? this.getDriverDetails() : this.editFailed();
      });
    },
    async unlinkDriver(linkStatus) {
      this.setViewLoading(true);
      deleteDriverLink(linkStatus.id).then((response) => {
        response.ok ? this.getDriverDetails() : this.editFailed();
      });
    },

    async blockDriver(driver) {
      this.setViewLoading(true);

      postDriverLink({
        ...driver,
        driverAccountUUID: driver.driverAccountUUID,
        linkStatus: { blocked: true },
      }).then((response) => {
        response.ok ? this.getDriverDetails() : this.editFailed();
      });
    },
    editFailed() {
      this.setViewLoading(false);
      this.$message({
        message: this.$t('DriverDetails.edit_driver_failed'),
        type: 'error',
        center: true,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.profile-status {
  min-height: 100px;
  &__title {
    display: flex;
    & > span {
      display: flex;
      align-items: center;
      flex: 1;
      &:nth-of-type(2) {
        justify-content: flex-end;
        font-size: 24px;
      }
    }
  }
  &__actions {
    display: flex;
    justify-content: center;
  }
}
</style>
