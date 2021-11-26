<template>
  <form ref="uploadForm" class="upload-form">
    <label
      v-for="(provider, index) in providers"
      :id="provider + '-' + index"
      :key="index"
      :class="[provider.split('_')[0].toLowerCase(), { multiple: multiple }]"
      class="drag-drop__zone"
      @dragover.prevent
      @drop.prevent="(e) => dropListener(e, index)"
    >
      <div v-if="files[index]" class="drag-drop__file">
        <span> {{ files[index].name }}</span>
        <div v-if="transactionsDatePickerAvalaible(index)">
          <el-date-picker
            v-model="transactionsDate"
            :placeholder="getDatePickerPlaceholder(index)"
            :picker-options="{
              disabledDate: disabledTo,
            }"
            class="el-dialog__input--large"
          />
        </div>
      </div>
      <div v-else>
        <ProviderBadge :large="true" :provider="provider === 'BOLT_FOOD' ? provider : provider.split('_')[0]" />
        <span v-if="providers.length > 1">{{ $t(providers[index]) }}</span>
      </div>
      <input type="file" @change="(e) => previewFile(e, index)" />
    </label>

    <div v-if="files.length" class="drag-drop__actions">
      <el-tooltip :content="$t('remove_files')" placement="bottom">
        <el-button size="mini" type="danger" @click="resetUpload()">
          <i class="el-icon-delete" />
        </el-button>
      </el-tooltip>
    </div>
  </form>
</template>

<script>
import ProviderBadge from '@/components/ProviderBadge';
export default {
  components: {
    ProviderBadge,
  },
  props: {
    providers: {
      type: Array,
    },
    uploaded: {
      type: Boolean,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      files: [],
      transactionsDate: null,
    };
  },
  watch: {
    uploaded() {
      this.resetUpload();
    },
    transactionsDate() {
      this.$emit('set_transactions_date', this.transactionsDate);
    },
  },
  methods: {
    dropListener(e, index) {
      this.previewFile(e.dataTransfer.files, index);
    },
    previewFile(filesEvent, index) {
      if (filesEvent.length > 0 || filesEvent?.target?.files) {
        const uploadedFile = filesEvent?.target?.files || filesEvent;
        const file = uploadedFile[0].name.toLowerCase().match(/.*\.(xlsx|xls|csv)/g) && uploadedFile[0];

        if (file) {
          this.files[index] && this.removeFile(index);
          this.$message({ type: 'success', message: this.$t('DragDrop.loaded_file_success'), center: true }),
            ((this.files[index] = file), this.$emit('uploaded_files', { provider: this.providers[index], file: file }));
        } else
          this.$message({
            type: 'error',
            message: this.$t('DragDrop.loaded_file_failed'),
            center: true,
          });
        return;
      }
    },
    removeFile(index) {
      this.$emit('removed_files', this.providers[index]);
    },
    resetUpload() {
      this.$refs.uploadForm.reset();
      this.$emit('removed_files', this.providers);
      this.files = [];
      this.transactionsDate = null;
    },
    transactionsDatePickerAvalaible(index) {
      return (
        (!this.files[0] && this.files[1] && this.providers[index] == 'FREENOW_BONUS') ||
        (this.files[0] && this.providers[index] == 'GLOVO') ||
        (this.files[0] && this.providers[index] == 'STUART') ||
        (this.files[0] && this.providers[index] === 'BOLT_FOOD')
      );
    },
    getDatePickerPlaceholder(index) {
      if (this.providers[index] == 'FREENOW_BONUS') {
        return this.$t('UploadData.bonus_date_picker_holder');
      } else {
        return this.$t('UploadData.transactions_date_picker_holder');
      }
    },
    disabledTo(date) {
      return date > new Date();
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-form {
  display: flex;
  position: relative;
  padding: 16px;
}
.drag-drop__zone {
  flex: 1;
  @include flex-center;
  min-height: 150px;
  text-align: center;
  background: white;
  flex-flow: column;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  border-radius: 16px;
  transition: background 0.1s linear;
  & input {
    display: none;
  }
  &.multiple {
    border-radius: 0;
    word-break: break-all;
    &:first-of-type {
      border-top-left-radius: 16px;
      border-bottom-left-radius: 16px;
    }
    &:last-of-type {
      border-top-right-radius: 16px;
      border-bottom-right-radius: 16px;
    }
  }
  &.uber {
    border: 3px solid black;
    &:hover {
      background: rgba(black, 0.3);
    }
  }
  &.bolt {
    border: 3px solid #34d186;
    &:hover {
      background: rgba(#34d186, 0.3);
    }
  }
  &.orlen {
    border: 3px solid red;
    &:hover {
      background: rgba(red, 0.3);
    }
  }
  &.flotex {
    border: 3px solid black;
    &:hover {
      background: rgba(black, 0.3);
    }
  }
  &.circlek {
    border: 3px solid orange;
    &:hover {
      background: rgba(orange, 0.3);
    }
  }
  &.freenow {
    border: 3px solid #005478;
    &:hover {
      background: rgba(#005478, 0.3);
    }
    color: #005478;
  }
  &.glovo {
    border: 3px solid #009f81;
    &:hover {
      background: rgba(#009f81, 0.3);
    }
  }
  &.stuart {
    border: 3px solid #00a5f5;
    &:hover {
      background: rgba(#00a5f5, 0.3);
    }
  }
  &.wolt {
    border: 3px solid #00d8f5;
    &:hover {
      background: rgba(#00d8f5, 0.3);
    }
  }
  & + .drag-drop__zone {
    border-radius: 0;

    &.uber,
    &.freenow {
      border-left: none;
    }
  }
}
.drag-drop__file {
  font-size: 16px;
}
.drag-drop__actions {
  top: calc(100% - 40px);
  right: calc(50% - 22px);
  position: absolute;
  z-index: 99999;
  .el-button {
    border-radius: 16px;
  }
}
</style>
