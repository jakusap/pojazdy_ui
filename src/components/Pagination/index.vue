<template>
  <div>
    <el-select :value="pagination.limit" @change="changePaginationLimit">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
    </el-select>
    <el-button
      :disabled="pagination.currentPage === 1"
      type="info"
      size="small"
      @click="changePage(pagination.currentPage - 1)"
      ><i class="el-icon-d-arrow-left"></i>
    </el-button>
    <span class="pagination__current"> {{ pagination.currentPage }} {{ `/` }} {{ maxPage }} </span>
    <el-button
      :disabled="pagination.currentPage >= maxPage"
      size="small"
      type="info"
      @click="changePage(pagination.currentPage + 1)"
    >
      <i class="el-icon-d-arrow-right" />
    </el-button>
  </div>
</template>

<script>
export default {
  props: {
    pagination: {
      type: Object,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      value: '',
      options: [
        {
          value: 25,
          label: '25',
        },
        {
          value: 50,
          label: '50',
        },
        {
          value: 75,
          label: '75',
        },
      ],
    };
  },
  computed: {
    maxPage() {
      return Math.ceil(this.length / this.pagination.limit);
    },
  },
  watch: {
    maxPage: {
      handler(value) {
        if (value) {
          if (this.$route.hash) {
            this.$emit('change-page', {
              page: Number(this.$route.hash.split('#')[1]) > value ? value : Number(this.$route.hash.split('#')[1]),
            });
            window.location.hash = value;
          } else {
            this.$emit('change-page', { page: 1 });
          }
        }
      },
      immediate: true,
    },
  },

  methods: {
    changePage(changedPage) {
      this.$emit('change-page', { page: changedPage });
      window.location.hash = changedPage;
    },
    changePaginationLimit(value) {
      this.$emit('change-pagination-limit', value);
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination__current {
  margin: 0 4px;
  font-weight: 700;
}
.el-select {
  margin: 4px;
  width: 65px;
}
</style>
