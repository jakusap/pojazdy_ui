<template>
  <div class="partner-documents">
    <ul class="partner-documents__list">
      <li v-for="(file, idx) in partnerDocuments" :key="idx">
        <div class="partner-documents__title">
          <i class="el-icon-document"></i>{{ file.name ? file.name : file.fileName }}
        </div>
        <el-button type="primary" size="mini" icon="el-icon-download" @click="downloadFile(file.order)">
          {{ $t('PartnerDocuments.download') }}
        </el-button>
      </li>
    </ul>
    <div class="partner-documents__action">
      <el-button
        type="info"
        icon="el-icon-download"
        :disabled="!partnerDocuments.length"
        @click="downloadPartnerFiles()"
      >
        {{ $t('PartnerDocuments.download_all') }}
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    partnerDocuments: {
      type: Array,
    },
  },

  methods: {
    downloadFile(id) {
      const link = document.createElement('a');
      link.href = `/api/partner-documents/${id}`;
      link.target = '_blank';
      link.click();
      link.remove();
    },
    downloadPartnerFiles() {
      const link = document.createElement('a');
      link.href = '/api/partner-documents/all';
      link.target = '_blank';
      link.click();
      link.remove();
    },
  },
};
</script>

<style lang="scss" scoped>
.partner-documents__list {
  list-style: none;
  margin: 8px 0;
  padding: 0;
  & > li {
    background: var(--smoke-white-background);
    border: 1px solid var(--light-blue-border);
    padding: 8px 16px;
    margin: 4px 0;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.partner-documents__title {
  padding-right: 16px;
  i {
    margin-right: 16px;
  }
}

.partner-documents__action {
  & > button {
    width: 100%;
  }
}
</style>
