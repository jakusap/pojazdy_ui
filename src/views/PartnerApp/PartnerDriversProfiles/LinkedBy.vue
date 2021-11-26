<template>
  <el-table
    :data="driversList"
    :height="mobile ? 'calc(100vh - 48px - 64px - 64px - 16px)' : 'calc(100vh - 48px - 64px - 64px - 32px)'"
  >
    <template slot="empty">
      <div v-if="linkType === 'EMAIL'" class="">
        {{ $t('DriversProfiles.email_not_found') }}
      </div>
      <div v-if="linkType === 'UUID'" class="">
        {{ $t('DriversProfiles.uuid_not_selected') }}
      </div>
    </template>
    <el-table-column :label="$t('table_actions')" align="center">
      <template slot-scope="scope">
        <ResponsiveRowButtons>
          <el-button-group>
            <el-button v-if="linkType === 'EMAIL'" type="primary" size="mini" @click="$emit('link-driver', scope.row)">
              {{ $t('DriversProfiles.link') }}
            </el-button>
            <el-button v-if="linkType === 'UUID'" type="info" size="mini" @click="$emit('add-driver', scope.row)">
              {{ $t('DriversProfiles.add_driver') }}
            </el-button>
            <el-button type="danger" size="mini" @click="$emit('block-driver', scope.row)">
              {{ $t('DriversProfiles.block') }}
            </el-button>
          </el-button-group>
        </ResponsiveRowButtons>
      </template>
    </el-table-column>
    <el-table-column :label="$t('driver')" align="center">
      <template slot-scope="scope">
        {{ scope.row.lastName }}
        {{ scope.row.firstName }}
      </template>
    </el-table-column>
    <el-table-column :label="$t('email_address')" align="center" prop="email"></el-table-column>
    <el-table-column :label="$t('DriversProfiles.drivers_documents')" align="center" prop="documents">
      <template slot-scope="scope">
        <ResponsiveRowButtons>
          <el-button-group>
            <el-button
              type="info"
              :disabled="scope.row.signedContractsCount === 0"
              size="mini"
              @click="$emit('show-documents-list', scope.row)"
              >{{ $t('DriverDocuments.documents_list') }}</el-button
            >
            <el-button
              type="primary"
              :disabled="scope.row.signedContractsCount === 0"
              size="mini"
              @click="$emit('download-all', scope.row)"
              >{{ $t('DriverDocuments.download_all') }}</el-button
            >
          </el-button-group>
        </ResponsiveRowButtons>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import ResponsiveRowButtons from '@/components/ResponsiveRowButtons';
export default {
  components: {
    ResponsiveRowButtons,
  },
  props: {
    linkType: {
      type: String,
    },
    driversList: {
      type: Array,
    },
  },
};
</script>

<style lang="scss" scoped></style>
