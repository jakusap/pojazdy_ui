<template>
  <DataWrapper>
    <template slot="table-header">
      <h1 class="upload-data__title">{{ $t('UploadData.upload_data_title') }}</h1>
    </template>
    <template slot="table-body">
      <div class="el-row">
        <Dragdrop
          :uploaded="uploaded"
          :multiple="true"
          :providers="['UBER_STATEMENTS', 'UBER_TRANSACTIONS']"
          class="dragdrop el-col-24 el-col-md-8 el-col-sm-12"
          @uploaded_files="(files) => addFiles(files)"
          @removed_files="(provider) => removeFile(provider)"
        />
        <Dragdrop
          :uploaded="uploaded"
          :providers="['BOLT']"
          class="dragdrop el-col-24 el-col-md-8 el-col-sm-12"
          @uploaded_files="(files) => addFiles(files)"
          @removed_files="(provider) => removeFile(provider)"
        />
        <Dragdrop
          :uploaded="uploaded"
          :providers="['ORLEN']"
          class="dragdrop el-col-24 el-col-md-8 el-col-sm-12"
          @uploaded_files="(files) => addFiles(files)"
          @removed_files="(providers) => removeFile(providers)"
        />
        <Dragdrop
          :uploaded="uploaded"
          :providers="['FLOTEX']"
          class="dragdrop el-col-24 el-col-md-8 el-col-sm-12"
          @uploaded_files="(files) => addFiles(files)"
          @removed_files="(providers) => removeFile(providers)"
        />
        <Dragdrop
          :uploaded="uploaded"
          :providers="['CIRCLEK']"
          class="dragdrop el-col-24 el-col-md-8 el-col-sm-12"
          @uploaded_files="(files) => addFiles(files)"
          @removed_files="(providers) => removeFile(providers)"
        />
        <Dragdrop
          :uploaded="uploaded"
          :multiple="true"
          :providers="['FREENOW_TRIPS', 'FREENOW_BONUS']"
          class="dragdrop el-col-24 el-col-md-8 el-col-sm-12"
          @uploaded_files="(files) => addFiles(files)"
          @removed_files="(providers) => removeFile(providers)"
          @set_transactions_date="(transactionsDate) => setFreeNowBonusDate(transactionsDate)"
        />
        <Dragdrop
          :uploaded="uploaded"
          :providers="['GLOVO']"
          class="dragdrop el-col-24 el-col-md-8 el-col-sm-12"
          @uploaded_files="(files) => addFiles(files)"
          @removed_files="(providers) => removeFile(providers)"
          @set_transactions_date="(transactionsDate) => setGlovoTransactionsDate(transactionsDate)"
        />
        <Dragdrop
          :uploaded="uploaded"
          :providers="['STUART']"
          class="dragdrop el-col-24 el-col-md-8 el-col-sm-12"
          @uploaded_files="(files) => addFiles(files)"
          @removed_files="(providers) => removeFile(providers)"
          @set_transactions_date="(transactionsDate) => setStuartTransactionsDate(transactionsDate)"
        />
        <Dragdrop
          :uploaded="uploaded"
          :providers="['BOLT_FOOD']"
          class="dragdrop el-col-24 el-col-md-8 el-col-sm-12"
          @uploaded_files="(files) => addFiles(files)"
          @removed_files="(providers) => removeFile(providers)"
          @set_transactions_date="(transactionsDate) => setBoltFoodTransactionsDate(transactionsDate)"
        />
        <Dragdrop
          :uploaded="uploaded"
          :providers="['WOLT']"
          class="dragdrop el-col-24 el-col-md-8 el-col-sm-12"
          @uploaded_files="(files) => addFiles(files)"
          @removed_files="(providers) => removeFile(providers)"
        />
      </div>

      <div v-loading="dataLoading" class="upload-data__actions">
        <div class="el-row">
          <el-checkbox v-model="autoMerge" border size="medium">
            {{ $t('UploadData.auto_merge') }}
            <el-tooltip placement="top">
              <div slot="content">
                {{ $t('UploadData.auto_merge_description') }}
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-checkbox>
          <el-checkbox v-model="allowDuplicatedFiles" border size="medium">
            {{ $t('UploadData.allow_duplicated_files') }}
            <el-tooltip placement="top">
              <div slot="content">
                {{ $t('UploadData.allow_duplicated_files_description') }}
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-checkbox>
          <el-select v-model="selectedCity" :placeholder="$t('UploadData.city')" filterable>
            <el-option v-for="(city, id) in cities" :key="id" :value="city.name"></el-option>
          </el-select>
        </div>

        <el-button :disabled="filesNotReady" type="success" @click="submitFiles()">
          {{ $t('UploadData.upload_all') }}
        </el-button>
      </div>
    </template>
  </DataWrapper>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { uploadFile } from '@/api/files.js';
import DataWrapper from '@/components/DataWrapper';
import ImportInformations from '@/effects/ImportInformations';
import { POLISH_INSTANCE } from '@/utils/instance';

import Dragdrop from './components/Dragdrop';

export default {
  name: 'Upload',
  components: {
    Dragdrop,
    DataWrapper,
  },
  data() {
    return {
      uploaded: false,
      files: [],
      selectedCity: null,
      autoMerge: false,
      freeNowBonusDate: null,
      glovoTransactionsDate: null,
      stuartTransactionsDate: null,
      boltFoodTransactionDate: null,
      allowDuplicatedFiles: false,
      cities: [
        { name: 'Katowice' },
        { name: 'Wrocław' },
        { name: 'Kraków' },
        { name: 'Warszawa' },
        { name: 'Poznań' },
        { name: 'Łódź' },
        { name: 'Gdańsk' },
        { name: 'Lublin' },
      ],
    };
  },
  computed: {
    ...mapGetters(['dataLoading', 'instance']),
    filesNotReady() {
      const glovoUpload = this.files.find((file) => file.provider.split('_')[0] === 'GLOVO');
      if (glovoUpload && !this.glovoTransactionsDate) {
        return true;
      }
      const stuartUpload = this.files.find((file) => file.provider.split('_')[0] === 'STUART');
      if (stuartUpload && !this.stuartTransactionsDate) {
        return true;
      }
      const boltFoodUpload = this.files.find((file) => file.provider === 'BOLT_FOOD');
      if (boltFoodUpload && !this.boltFoodTransactionDate) {
        return true;
      }
      const uberUpload = this.files.find((file) => file.provider.split('_')[0] === 'UBER');
      if (uberUpload) {
        const uberTransactions = this.files.find((file) => file.provider === 'UBER_TRANSACTIONS');
        const uberStatements = this.files.find((file) => file.provider === 'UBER_STATEMENTS');
        const allFilesRequired = this.instance === POLISH_INSTANCE;
        if (allFilesRequired) {
          return !(uberTransactions && uberStatements);
        } else {
          return !(uberTransactions || uberStatements);
        }
      } else {
        return !this.files.length;
      }
    },
  },
  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    setFreeNowBonusDate(freeNowBonusDate) {
      this.freeNowBonusDate = freeNowBonusDate;
    },
    setGlovoTransactionsDate(glovoTransactionsDate) {
      this.glovoTransactionsDate = glovoTransactionsDate;
    },
    setStuartTransactionsDate(stuartTransactionsDate) {
      this.stuartTransactionsDate = stuartTransactionsDate;
    },
    setBoltFoodTransactionsDate(boltFoodTransactionDate) {
      this.boltFoodTransactionDate = boltFoodTransactionDate;
    },
    addFiles(file) {
      this.files.push(file);
    },
    removeFile(providers) {
      if (typeof providers === 'string') {
        this.files.find((file, idx) => file.provider === providers && this.files.splice(idx, 1));
      } else {
        this.files.find(
          (file, idx) =>
            providers.find((provider) => file.provider === provider) && this.files.splice(idx, providers.length)
        );
      }
    },
    showImportInformationsModal(informations) {
      this.$modalOn(ImportInformations, { informations: informations });
    },
    getFileType(provider) {
      switch (provider) {
        case 'BOLT':
          return 'boltFile';
        case 'ORLEN':
          return 'orlenFile';
        case 'UBER_STATEMENTS':
          return 'uberStatementsFile';
        case 'UBER_TRANSACTIONS':
          return 'uberTransactionsFile';
        case 'FLOTEX':
          return 'flotexFile';
        case 'CIRCLEK':
          return 'circlekFile';
        case 'FREENOW_TRIPS':
          return 'freeNowFile';
        case 'FREENOW_BONUS':
          return 'freeNowBonusFile';
        case 'GLOVO':
          return 'glovoFile';
        case 'STUART':
          return 'stuartFile';
        case 'BOLT_FOOD':
          return 'boltFoodFile';
        case 'WOLT':
          return 'woltFile';
      }
      return null;
    },
    submitFiles() {
      this.toggleDataLoading(true);
      if (this.files.length) {
        const formData = new FormData();

        this.files.map((file) => {
          const provider = file.provider;
          formData.append(this.getFileType(provider), file.file);
        });
        formData.append('city', this.selectedCity);
        formData.append('autoMerge', this.autoMerge);
        formData.append('allowDuplicatedFiles', this.allowDuplicatedFiles);
        this.freeNowBonusDate && formData.append('freeNowBonusDate', this.freeNowBonusDate);
        this.glovoTransactionsDate && formData.append('glovoTransactionsDate', this.glovoTransactionsDate);
        this.stuartTransactionsDate && formData.append('stuartTransactionsDate', this.stuartTransactionsDate);
        this.boltFoodTransactionDate && formData.append('boltFoodTransactionDate', this.boltFoodTransactionDate);

        uploadFile(formData)
          .then((response) => {
            if (response.ok) {
              this.uploadSuccess();
              this.showImportInformationsModal(response.data);
            } else if (response.status == 409) {
              this.uploadConflict(response.data);
            } else {
              this.uploadFailed();
            }
          })
          .finally(() => {
            this.toggleDataLoading(false);
          });
      }
    },
    uploadSuccess() {
      this.$message({
        type: 'success',
        message: this.$t('DragDrop.upload_success'),
        center: true,
        duration: 2000,
      });
      this.uploaded = !this.uploaded;
    },
    uploadConflict(data) {
      const h = this.$createElement;
      const p1 = h('p', null, this.$t('UploadData.duplicated_files_import_canceled'));
      const files = data.map((f) => [h('b', null, f.name + ' '), h('i', null, f.importDate), h('br')]);
      const p2 = h('p', null, this.$t('UploadData.duplicated_files_allow_option'));
      const message = h('div', { class: 'conflict-message' }, [p1, files, p2]);
      this.$alert(message, this.$t('UploadData.duplicated_files'), {
        confirmButtonText: 'OK',
      });
    },
    uploadFailed() {
      this.$message({
        type: 'error',
        message: this.$t('DragDrop.upload_failed'),
        center: true,
        duration: 2000,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-data {
  &__title {
    margin: 0;
    font-size: 20px;
    color: black;
    border-bottom: 1px solid $borderColor;
    padding: 16px 0;
  }

  &__actions {
    @include flex-center;
    flex-flow: column;
    margin-top: 16px;

    .el-row {
      @include flex-center;
      flex-flow: column;
      .el-checkbox,
      .el-select {
        margin-bottom: 16px;
      }
      .el-checkbox {
        @include flex-center;
        height: 40px;
      }
      margin-bottom: 16px;

      @media screen and (min-width: 768px) {
        flex-flow: row;
        .el-select {
          margin-left: 40px;
        }
      }
    }
  }
}

.conflict-message {
  p {
    line-height: normal;
    margin: 8px 0;
  }
}
</style>
