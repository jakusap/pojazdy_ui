<template>
  <fieldset class="fieldset">
    <hr class="divider" />
    <span> {{ dateFormat | formatDateLong }} {{ driverInfo.firstName }} {{ driverInfo.lastName }}</span>
    <p class="section-title">{{ $t('DocumentsWizard.signature') }}</p>
    <div class="from-row">
      <Signature @signature-update="handleSignature" />
    </div>
  </fieldset>
</template>

<script>
import Signature from '@/components/Signature';

export default {
  name: 'SignStep',
  components: { Signature },
  props: {
    model: Object,
    driverInfo: Object,
  },
  computed: {
    dateFormat() {
      return new Date(this.model.signatureDate).toISOString();
    },
  },
  created() {
    this.model.signatureDate = Date.now();
  },
  methods: {
    handleSignature(data) {
      this.model.signFile = data.data;
    },
  },
};
</script>

<style lang="scss" scoped>
.fieldset {
  border: none;
  padding: 0;
  max-width: 800px;

  .form-row {
    display: flex;

    &.half-width {
      width: 50%;
    }
  }

  .divider {
    width: 100%;
    border: none;
    border-bottom: 1px solid #eee;
  }

  .section-title {
    font-size: 18px;
  }
}
</style>
