<template>
  <h1 class="schemas__title">
    {{ $t('Schemas.schemas_title') }}
    <el-button v-if="mobile && !disableActions" size="mini" type="info" @click="showSettings()">
      <i class="el-icon-setting" />
    </el-button>
  </h1>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('schemasViewStore', ['addMode', 'editMode']),
    disableActions() {
      return this.addMode || this.editMode;
    },
  },
  methods: {
    showSettings() {
      document.getElementById('actions').classList.toggle('active');
    },
  },
};
</script>

<style lang="scss" scoped></style>
