<template>
  <section>
    <div v-if="verification">
      <el-form>
        <div class="invoice-description__small">
          <el-form-item prop="partnerFeedback">
            <el-input
              v-model="invoiceDescription.partnerFeedback"
              :placeholder="$t('SetInvoiceDescription.feedback')"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-alert
      v-else-if="invoiceDescription.partnerFeedback"
      :title="'Komentarz Partnera:'"
      :description="invoiceDescription.partnerFeedback"
      type="info"
      show-icon
      :closable="false"
    />
  </section>
</template>

<script>
export default {
  name: 'PartnerFeedback',
  props: {
    invoiceDescription: {
      type: Object,
    },
    verification: {
      type: Boolean,
    },
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        feedback: '',
      },
      formLabelWidth: '120px',
    };
  },
};
</script>
