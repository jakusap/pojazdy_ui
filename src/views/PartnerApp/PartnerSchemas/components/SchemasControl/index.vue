<template>
  <div v-if="disableActions" class="schemas__control">
    <div class="schemas__divider" />
    <el-button v-if="addMode" icon="el-icon-circle-plus-outline" type="success" @click="sendSchema()">
      {{ $t('Schemas.add_schema') }}
    </el-button>
    <el-button v-else icon="el-icon-circle-check" type="success" @click="modifySchema()">
      {{ $t('Schemas.confirm_changes') }}
    </el-button>
    <el-button icon="el-icon-circle-close" type="danger" @click="toggleEditedSchema()">
      {{ $t('Schemas.cancel') }}
    </el-button>
    <el-button v-if="!editedSchema.isDefault" icon="el-icon-collection-tag" type="info" @click="changeDefault()">
      {{ $t('Schemas.set_default') }}
    </el-button>
    <el-tooltip v-if="editedSchema.isDefault" placement="top" content="Ten schemat jest ustawiony jako domyślny">
      <span class="disabled-button">
        <el-button icon="el-icon-collection-tag" disabled>
          {{ $t('Schemas.set_default') }}
        </el-button>
      </span>
    </el-tooltip>
  </div>
</template>

<script>
import { createSchema, updateSchema } from '@/api/schemasApi';

import schemasActionsMixin from '../../mixins/schemasActionsMixin';

export default {
  mixins: [schemasActionsMixin],

  props: {
    form: {
      type: Object,
    },
    costList: {
      type: Object,
    },
    monthlyList: {
      type: Object,
    },
  },
  methods: {
    changeDefault() {
      this.editedSchema.isDefault = !this.editedSchema.isDefault;
    },

    validateFormList(formLists) {
      let listsValid = true;

      formLists.forEach((formlist) =>
        formlist.$children
          .filter((component) => component.$attrs.id && component.$attrs.id)
          .forEach((form) =>
            form.validate((valid) => {
              !valid && (listValid = false);
            })
          )
      );

      return listsValid;
    },

    sendSchema() {
      const listsValid = this.validateFormList([this.monthlyList, this.costList]);

      this.form.validate((valid) => {
        if (valid && listsValid) {
          this.$store.dispatch('app/toggleDataLoading', true);
          createSchema(this.parseSchemaToNumber(this.editedSchema)).then((response) => {
            response.ok ? (this.uploadSuccess(), this.resetView()) : this.requestFailed();
          });
        }
      });
    },
    modifySchema() {
      const listsValid = this.validateFormList([this.monthlyList, this.costList]);
      this.form.validate((valid) => {
        if (valid && listsValid) {
          this.$store.dispatch('app/toggleDataLoading', true);
          updateSchema(this.parseSchemaToNumber(this.editedSchema)).then((response) => {
            response.ok ? (this.editSuccess(), this.resetView()) : this.requestFailed();
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.schemas__control {
  & .schemas__divider {
    width: 100%;
    margin-left: 0px;
  }
  & .el-button {
    display: block;
    width: 100%;
    margin: 0;
    margin-top: 8px;
  }
}

@media screen and (min-width: 576px) {
  .schemas__control {
    .el-button {
      display: inline-block;
      width: auto;
      & + .el-button {
        margin-left: 10px;
      }
    }
  }
  .disabled-button {
    width: auto;
    margin-left: 10px;
  }
}
</style>
