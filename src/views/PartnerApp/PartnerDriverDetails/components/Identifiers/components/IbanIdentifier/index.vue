<template>
  <div class="provider-identifier__wrapper">
    <div class="provider-identifier">
      <div>
        {{ $t(identifier.provider) }}
      </div>

      <code v-if="!editMode" class="provider-identifier__id">{{ identifier.id || '-' }}</code>
      <el-form-item v-else prop="id">
        <el-input
          v-model="identifier.id"
          :placeholder="$t('DriverDetails.info_iban')"
          class="provider-identifier__id"
          @blur="formatIban"
        />
      </el-form-item>
    </div>

    <div v-loading="loading" :class="{ 'provider-identifier__iban': ibanInfo || editMode }">
      <div v-if="ibanInfo">
        {{ ibanInfo.bankName + ', ' + ibanInfo.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { validateIban } from '@/api/ibanApi';
export default {
  props: {
    identifier: {
      type: Object,
    },
    editMode: {
      type: Boolean,
    },
  },
  data() {
    return {
      loading: false,
      ibanInfo: null,
    };
  },
  computed: {
    hasPolishIban() {
      return (
        this.identifier.id?.length === 26 || (this.identifier.id?.startsWith('PL') && this.identifier.id?.length === 28)
      );
    },
  },
  watch: {
    identifier: {
      async handler(value) {
        if (this.hasPolishIban) {
          this.loading = true;
          const ibanInfo = await validateIban(value.id);
          ibanInfo.ok ? (this.ibanInfo = ibanInfo.data) : (this.ibanInfo = null);
          this.loading = false;
        } else if (!value.id || this.hasPolishIban) {
          this.ibanInfo = null;
        }
      },
      deep: true,
    },
  },
  async created() {
    if (this.hasPolishIban) {
      this.loading = true;
      const ibanInfo = await validateIban(this.identifier.id);
      ibanInfo.ok ? (this.ibanInfo = ibanInfo.data) : (this.ibanInfo = null);
      this.loading = false;
    }
  },
  methods: {
    formatIban() {
      const iban = this.$props.identifier.id;
      this.$props.identifier.id = iban.replace(/ /g, '').replace(/-/g, '');
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item {
  flex: 3;
  margin-right: 8px;
  margin-bottom: 0px;
}
.provider-identifier__wrapper {
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid $brand-gray;
  background: whitesmoke;
  border-radius: 4px;
  position: relative;
}
.provider-identifier {
  display: flex;
  align-items: center;

  &__id {
    margin-left: 8px;
  }
  &__iban {
    min-height: 18px;
    margin-top: 16px;
  }
}
</style>
