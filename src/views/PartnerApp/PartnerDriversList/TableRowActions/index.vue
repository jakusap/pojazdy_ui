<template>
  <el-table-column :label="$t('table_actions')" :min-width="mobile ? '50px' : '100px'" align="center">
    <template slot-scope="scope">
      <ResponsiveRowButtons>
        <el-button-group>
          <button class="el-button el-button--primary el-button--mini" @click="showDriverDetails(scope.row)">
            {{ $t('details') }}
          </button>
        </el-button-group>
      </ResponsiveRowButtons>
    </template>
  </el-table-column>
</template>

<script>
import ResponsiveRowButtons from '@/components/ResponsiveRowButtons';

export default {
  components: {
    ResponsiveRowButtons,
  },
  methods: {
    showDriverDetails(driver) {
      this.$router.push({ name: 'DriverDetails', params: driver });
    },
  },
};
</script>

<style lang="scss" scoped></style>
