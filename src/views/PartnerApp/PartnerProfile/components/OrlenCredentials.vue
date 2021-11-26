<template>
  <div v-loading="loading" class="api-credentials">
    <div class="api-credentials__provider">
      <ProviderBadge :large="true" provider="ORLEN" />
    </div>
    <div v-if="!loading" class="api-credentials__info">
      <div v-if="noCredentials">
        <el-button v-if="!editMode" class="api-credentials__add" circle type="primary" @click="toggleEdit()">
          <i class="el-icon-plus"> </i>
        </el-button>
        <div v-if="editMode">
          <el-form
            :model="credentialsForm"
            :rules="rules"
            :label-position="mobile ? 'top' : 'left'"
            size="small"
            label-width="180px"
          >
            <el-form-item :label="$t('ApiCredentials.orlen_name')" prop="login">
              <el-input v-model="credentialsForm.login"></el-input>
            </el-form-item>
            <el-form-item :label="$t('ApiCredentials.orlen_password')" prop="password">
              <el-input v-model="credentialsForm.password"></el-input>
            </el-form-item>
            <el-form-item :label="$t('ApiCredentials.orlen_fleet_id')" prop="fleetId">
              <el-input v-model="credentialsForm.fleetId"></el-input>
            </el-form-item>
          </el-form>
          <div v-if="editMode" class="api-credentials__save">
            <el-button type="primary" size="small" @click="sendOrlenCredentials()">{{ $t('save') }}</el-button>
            <el-button size="small" @click="toggleEdit()">{{ $t('cancel') }}</el-button>
          </div>
        </div>
      </div>
      <div v-else class="api-credentials__info">
        <el-form class="" size="small" label-width="180px" label-position="left">
          <el-form-item :label="$t('ApiCredentials.orlen_name')">
            <el-input :placeholder="credentials.login" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('ApiCredentials.orlen_password')">
            <el-input disabled placeholder="********"></el-input>
          </el-form-item>
          <el-form-item :label="$t('ApiCredentials.orlen_fleet_id')">
            <el-input :placeholder="credentials.fleetId" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-button v-if="!noCredentials" type="info" size="small" @click="confirmRemoval()">
        {{ $t('ApiCredentials.remove') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { deleteOrlenApi, getOrlenApi, postOrlenApi } from '@/api/apiCredentials';
import ProviderBadge from '@/components/ProviderBadge';
import { validateNumber } from '@/validators';
export default {
  components: {
    ProviderBadge,
  },
  data() {
    return {
      loading: false,
      noCredentials: false,
      credentials: {},
      editMode: false,
      credentialsForm: {
        login: '',
        password: '',
        fleetId: '',
      },
      rules: {
        login: [{ required: true, message: this.$t('ApiCredentials.login_required'), trigger: 'blur' }],
        password: [{ required: true, message: this.$t('ApiCredentials.password_required'), trigger: 'blur' }],
        fleetId: [{ required: true, validator: validateNumber, trigger: 'blur' }],
      },
    };
  },
  async created() {
    await this.fetchOrlenApi();
  },
  methods: {
    toggleEdit() {
      this.editMode = !this.editMode;
    },
    async fetchOrlenApi() {
      this.loading = true;
      await getOrlenApi()
        .then((response) => {
          if (response.ok) {
            this.noCredentials = false;
            this.credentials = response.data;
          } else {
            if (response.status === 404) {
              this.noCredentials = true;
            }
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    sendOrlenCredentials() {
      this.loading = true;
      postOrlenApi(this.credentialsForm).then((response) => {
        if (response.ok) {
          this.$message({
            message: this.$t('ApiCredentials.success'),
            type: 'failed',
            center: true,
          });
          this.editMode = false;
          this.fetchOrlenApi();
        } else {
          this.$message({
            message: this.$t('ApiCredentials.failed'),
            type: 'failed',
            center: true,
          });
          this.loading = false;
        }
      });
    },
    confirmRemoval() {
      this.$confirm(this.$t('ApiCredentials.confirm_delete_orlen'), this.$t('ApiCredentials.delete'), {
        confirmButtonText: this.$t('ApiCredentials.confirm'),
        cancelButtonText: this.$t('ApiCredentials.cancel'),
        type: 'warning',
      })
        .then(() => {
          this.removeOrlenCredentials();
        })
        .catch(() => {});
    },

    removeOrlenCredentials() {
      this.loading = true;
      deleteOrlenApi().then((response) => {
        if (response.ok) {
          this.$message({
            message: this.$t('ApiCredentials.delete_success'),
            type: 'failed',
            center: true,
          });
          this.editMode = false;
          this.fetchOrlenApi();
        } else {
          this.$message({
            message: this.$t('ApiCredentials.delete_failed'),
            type: 'failed',
            center: true,
          });
          this.loading = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
i {
  font-weight: 700;
}
.api-credentials {
  flex: 1;
  display: flex;
  align-items: center;
  flex-flow: column;
  justify-content: space-evenly;
  border: 1px solid $brand-gray;
  background: whitesmoke;
  border-radius: 4px;
  padding: 8px;
  min-height: 200px;
  &__provider {
    margin-right: 4px;
  }
  &__info {
    display: flex;
    flex-flow: column wrap;
    word-break: break-all;
    margin-top: 8px;
  }

  &__save {
    margin-top: 8px;
    display: flex;
    justify-content: center;
  }
}
</style>
