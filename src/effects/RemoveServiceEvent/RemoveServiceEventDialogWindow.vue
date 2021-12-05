<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" width="30%" center>
      <span>{{ $t('ServicePlans.confirm_delete') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('no') }}</el-button>
        <el-button type="primary" @click="removeEventFromServiceEvents">{{ $t('yes') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import { removeFromPartnerServiceEventsList } from '@/api/servicePlansApi';

export default {
  props: {
    dialogVisible: {
      Boolean,
    },
    planId: {
      Number,
    },
    orderNumber: {
      Number,
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
  methods: {
    ...mapActions('partnerEventsListViewStore', ['reloadPartnerEvents', 'reloadedPartnerEvents']),
    removeEventFromServiceEvents() {
      this.dialogVisible = false;
      removeFromPartnerServiceEventsList(this.planId, this.orderNumber);
      this.reloadPartnerEvents();
    },
  },
};
</script>

<style scoped></style>
