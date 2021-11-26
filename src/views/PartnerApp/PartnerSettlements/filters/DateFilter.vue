<template>
  <span>
    <el-date-picker v-model="filters.dateFrom" :placeholder="$t('date_from')" class="filter-item" type="date" />
    <el-date-picker
      v-if="filters.dateFrom"
      v-model="filters.dateTo"
      :picker-options="datePickerOptions"
      :placeholder="$t('date_to')"
      type="date"
      class="filter-item"
    />
  </span>
</template>

<script>
import filterMixin from './filterMixin';
export default {
  mixins: [filterMixin],
  data() {
    return {
      datePickerOptions: {
        disabledDate: this.disabledFrom,
      },
    };
  },
  methods: {
    disabledFrom(date) {
      return date < new Date(this.filters.dateFrom);
    },
  },
};
</script>

<style lang="scss" scoped></style>
