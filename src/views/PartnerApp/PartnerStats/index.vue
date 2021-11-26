<template>
  <div>
    <div v-loading="loading" class="stats">
      <StatsCard
        :title="$t('Stats.drivers')"
        :count="statsData.numberOfDrivers"
        icon="peoples"
        icon-color="secondary"
      />
      <StatsCard
        :title="$tc('Stats.settlements', 2)"
        :count="statsData.numberOfSettlements"
        icon="excel"
        icon-color="primary"
      />
      <StatsCard
        :title="$t('Stats.pending')"
        :count="statsData.pendingSettlementsAmount.toFixed(2)"
        :currency="true"
        icon="money"
        icon-color="warning"
      />
      <StatsCard
        :title="$t('Stats.settled')"
        :count="statsData.settledSettlementsAmount.toFixed(2)"
        :currency="true"
        icon="money"
        icon-color="success"
      />
      <StatsCard
        :title="$t('Stats.paid')"
        :count="statsData.paidSettlementsAmount.toFixed(2)"
        :currency="true"
        icon="money"
        icon-color="primary"
      />
    </div>
    <div class="reports">
      <ReportCard v-if="renderPayoutReports"> </ReportCard>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { getGeneralStats } from '@/api/statsApi';
import { AVALONCARS, AVALONLOGISTICS, QUICKAPPS } from '@/utils/referenced-partners';
import ReportCard from '@/views/PartnerApp/PartnerStats/components/ReportCard';

import StatsCard from './components/StatsCard';
export default {
  components: {
    ReportCard,
    StatsCard,
  },
  data() {
    return {
      loading: false,
      statsData: {
        numberOfDrivers: 0,
        numberOfSettlements: 0,
        paidSettlementsAmount: 0,
        pendingSettlementsAmount: 0,
        settledSettlementsAmount: 0,
      },
    };
  },
  computed: {
    ...mapGetters('partnerProfile', ['profileInfo']),

    renderPayoutReports() {
      return (
        this.profileInfo.code === AVALONLOGISTICS ||
        this.profileInfo.code === AVALONCARS ||
        this.profileInfo.code === QUICKAPPS
      );
    },
  },
  async created() {
    this.loading = true;
    await this.fetchStats();
    this.loading = false;
  },
  methods: {
    async fetchStats() {
      await getGeneralStats().then((response) => {
        if (response.ok) {
          this.statsData = response.data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.stats {
  display: grid;
  grid-template-columns: 1fr;
}
.reports {
  display: grid;
  grid-template-columns: 1fr;
}
.svg-icon {
  height: 48px;
}
@media screen and (min-width: 576px) {
  .stats {
    grid-template-columns: 1fr 1fr;
  }
}
@media screen and (min-width: 768px) {
  .stats {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
@media screen and (min-width: 992px) {
  .stats {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  .reports {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
