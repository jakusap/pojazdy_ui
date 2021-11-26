<template>
  <div class="box-card__wrapper">
    <div class="box-card">
      <div class="box-card__svg">
        <SvgIcon :class-name="'box-card__icon'" icon-class="documentation" @click="generate" />
      </div>
      <div class="box-card__element">
        <h1 class="box-card__title">{{ $t('Stats.payout_report') }}</h1>
        <div class="box-card__date">
          <span> {{ $t('Stats.transfer_from') }}</span>
          <el-date-picker v-model="dateFrom" name="dates.from" type="date" :placeholder="$t('Stats.date_from')" />
        </div>
        <div class="box-card__date">
          <span> {{ $t('Stats.transfer_to') }}</span>
          <el-date-picker v-model="dateTo" name="dates.to" type="date" :placeholder="$t('Stats.date_to')">
          </el-date-picker>
        </div>
        <el-button type="primary" @click="generate"> {{ $t('Stats.generate_report') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getPayoutReport } from '@/api/reportsApi';
import SvgIcon from '@/components/SvgIcon';
import { saveFile } from '@/utils/file-saver';
export default {
  name: 'ReportCard',
  components: {
    SvgIcon,
  },
  data() {
    return {
      dateFrom: null,
      dateTo: null,
    };
  },
  computed: {},
  methods: {
    generate() {
      if (this.dateTo && this.dateFrom) {
        getPayoutReport(this.dateFrom, this.dateTo).then((response) => {
          if (response.ok) {
            const fileName = response.headers[['content-disposition']].split("''")[1];
            saveFile(new Blob([response.data], { type: 'application/csv' }), fileName);
          } else if (response.status === 404) {
            this.$message({
              type: 'error',
              message: this.$t('Stats.no_reports_found'),
              center: true,
            });
          }
        });
      } else {
        this.$message({
          type: 'error',
          message: this.$t('Stats.no_dates_defined'),
          center: true,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.box-card__wrapper {
  padding: 16px;
}
.box-card__icon {
  font-size: 48px;
}
.box-card {
  @include flex-center;
  background: white;
  box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  height: 200px;
  &__element {
    @include flex-center;
    flex-flow: column;
    flex: 0.8;
    height: 100%;
    border-left: 1px solid $borderColor;
    text-align: center;
  }
  &__date {
    @include flex-center;
    flex-flow: row;
    justify-content: space-between;
    text-align: center;
    margin: 5px;
    .el-date-picker {
      margin: 5px;
    }
    span {
      margin-right: 5px;
    }
  }
  &__title {
    display: inline;
    font-size: 16px;
    margin: 5px;
    justify-content: left;
  }
  &__generate {
    @include flex-center;
    flex-flow: row;
    text-align: center;
    color: #1890ff;
  }
  &__svg {
    @include flex-center;
    flex: 0.2;
    flex-flow: column;
    height: 100%;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    background: whitesmoke;
    transition: all 0.3s linear;
    color: #1890ff;
  }
  &:hover {
    .box-card {
      &__svg {
        color: white;
        background: #1890ff;
      }
    }
  }
}
</style>
