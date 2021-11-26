<template>
  <el-date-picker
    v-if="type === 'DAY'"
    :v-model="model"
    :value="value"
    :placeholder="$t('date')"
    value-format="yyyy-MM-dd"
    @input="updateDay($event)"
  />
  <el-input v-else :value="value" @input="updateText($event)" />
</template>

<script>
export default {
  name: 'ReportParameterInput',
  props: {
    type: String,
    value: String,
  },
  data() {
    return {
      model: '',
    };
  },
  methods: {
    updateDay(date) {
      this.$emit('input', date);
      this.$emit('change', date);
    },
    updateText(text) {
      this.$emit('input', text);
      this.$emit('change', text);
    },
  },
};
</script>
