<template>
  <el-table
    :data="driversList"
    :height="mobile ? 'calc(100vh - 48px - 64px - 64px - 16px)' : 'calc(100vh - 48px - 64px - 64px - 64px)'"
  >
    <el-table-column :label="$t('table_actions')" align="center">
      <template slot-scope="scope">
        <ResponsiveRowButtons>
          <el-button-group>
            <el-button type="info" size="mini" @click="$emit('unblock-driver', scope.row.linkStatus)">
              {{ $t('DriversProfiles.unblock') }}
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
    <el-table-column :label="$t('email_address')" prop="email" align="center"></el-table-column>
  </el-table>
</template>

<script>
import ResponsiveRowButtons from '@/components/ResponsiveRowButtons';
export default {
  components: {
    ResponsiveRowButtons,
  },
  props: {
    driversList: {
      type: Array,
    },
  },
};
</script>

<style lang="scss" scoped></style>
