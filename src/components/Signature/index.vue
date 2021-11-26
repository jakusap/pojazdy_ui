<template>
  <div class="signature">
    <VueSignaturePad ref="signaturePad" class="signature__pad" re :options="options" />
    <el-button type="info" @click="clear">{{ $t('clean_signature_pad') }}</el-button>
  </div>
</template>

<script>
export default {
  name: 'Signature',
  data() {
    return {
      options: {
        penColor: '#000000',
        onEnd: this.save,
      },
    };
  },
  methods: {
    clear() {
      this.$refs.signaturePad.clearSignature();
      this.save();
    },
    save() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      this.$emit('signature-update', {
        data: data,
        isEmpty: isEmpty,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.signature {
  &__pad {
    border: solid 1px #888888;
    border-radius: 5px;
  }
  .el-button {
    margin-top: 5px;
  }
  margin-bottom: 15px;
}
</style>
