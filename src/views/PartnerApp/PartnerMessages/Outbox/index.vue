<template>
  <div v-loading="loading">
    <DataWrapper>
      <template slot="table-header">
        <h1>
          {{ $t('Outbox.table_title') }}
        </h1>
      </template>
      <template slot="table-body">
        <el-table
          :data="sentMessages"
          :row-style="{ cursor: 'pointer' }"
          height="calc(100vh - 64px - 32px - 32px - 16px)"
          @row-click="(e) => showMessageDetails(e)"
        >
          <el-table-column :label="$t('Outbox.recipents')" align="center">
            <template slot-scope="scope">
              <span v-for="(driver, idx) in scope.row.recipientsNames.slice(0, 4)" :key="idx">
                {{ driver }}{{ idx !== scope.row.recipientsNames.length - 1 && idx !== 3 ? `,` : `` }}
              </span>
              {{ scope.row.recipientsNames.length > 4 ? `...` : `` }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('Outbox.content')">
            <template slot-scope="scope">
              <span>{{ scope.row.content.slice(0, 50) }}{{ scope.row.content.length > 50 ? `...` : `` }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('Outbox.sent_date')" prop="commissionedDate" sortable>
            <template slot-scope="scope">
              <span>{{ scope.row.commissionedDate | formatDateLong }}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </DataWrapper>
  </div>
</template>

<script>
import { getMessages } from '@/api/messagesApi';
import DataWrapper from '@/components/DataWrapper';

export default {
  components: {
    DataWrapper,
  },
  data() {
    return {
      sentMessages: [],
      loading: false,
    };
  },
  async created() {
    await this.fetchMessages();
  },
  methods: {
    async fetchMessages() {
      this.loading = true;
      await getMessages()
        .then((response) => {
          if (response.ok) {
            this.sentMessages = response.data;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    showMessageDetails(message) {
      this.$router.push({ name: 'MessageDetails', params: { messageId: message.id } });
    },
  },
};
</script>

<style lang="scss">
.click {
  cursor: pointer;
}
</style>
