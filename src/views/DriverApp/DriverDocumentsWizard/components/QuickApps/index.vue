<template>
  <div class="mainContent">
    <WizardStepper v-if="!mobile" :form-reference="formReference" :steps="stepList" />
    <div class="stepWrapper">
      <el-form
        ref="documents-form"
        v-loading="isFetching"
        :model="documentsData"
        :rules="documentsRules"
        class="driver-info-form"
        auto-complete="on"
        label-position="left"
        @submit.native.prevent
      >
        <StepOne v-if="currentStep === 'STEP_ONE'" :model="documentsData.stepOne" />
        <StepTwo v-if="currentStep === 'STEP_TWO'" :model="documentsData.stepTwo" />
        <SignStep
          v-if="currentStep === 'SIGN_STEP'"
          :model="documentsData.signStep"
          :driver-info="documentsData.stepOne.personalInformation"
        />
        <WizardNavigator
          :form-reference="formReference"
          :steps="stepList"
          @submit="fillDocumentsData('documents-form')"
        />
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { getContractData } from '@/api/partnerDocumentsApi';
import mobileMixin from '@/mixins/mobileMixin';

import WizardNavigator from '../WizardNavigator';
import WizardStepper from '../WizardStepper';
import formValidator from './formValidator';
import initialFormData from './initialFormData';
import SignStep from './SignStep';
import StepOne from './StepOne';
import { civilContractSteps } from './steps';
import StepTwo from './StepTwo';

export default {
  name: 'QuickAppsWizard',
  components: { StepTwo, StepOne, SignStep, WizardNavigator, WizardStepper },
  mixins: [formValidator, mobileMixin],
  data() {
    return {
      formData: '',
      formReference: {},
      documentsData: initialFormData,
    };
  },
  computed: {
    isFetching() {
      return this.dataLoading();
    },
    currentStep() {
      return this.getCurrentStep();
    },
    partnerInfo() {
      const partnerUuid = this.getLoggedDriverInfo() && this.getLoggedDriverInfo().partnerUuid;
      return this.getPartnersList().find((ele) => ele.uuid == partnerUuid);
    },
    dictionaries() {
      return this.getDictionaries().filter((e) => e.isActive);
    },
    stepList() {
      return civilContractSteps;
    },
  },
  mounted() {
    if (this.getCooperationType() === '') {
      this.$router.push({ name: 'DriverDocuments' });
    }
  },
  async created() {
    await this.fetchDictionaries();
    if (!this.getPartnersList().length) await this.fetchPartnersList();
    if (!this.getPartnerDocuments().length) await this.fetchPartnerDocuments();
    await this.setPartnerData();
    this.setFormReference();
    await this.setInitialData();
  },
  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    ...mapActions('suggestions', ['fetchDictionaries']),
    ...mapActions('partners', ['fetchPartnersList']),
    ...mapActions('partnerProfile', ['fetchPartnerDocuments', 'postPartnerDocumentsFill']),
    ...mapGetters(['dataLoading']),
    ...mapGetters('documentsWizard', ['getCurrentStep', 'getStatementsRequiredValues', 'getCooperationType']),
    ...mapGetters('driverAccount', ['getLoggedDriverInfo']),
    ...mapGetters('partners', ['getPartnersList']),
    ...mapGetters('partnerProfile', ['getPartnerDocuments', 'getPartnerDocumentsResponse']),
    ...mapGetters('suggestions', ['getDictionaries']),
    ...mapActions('documentsWizard', ['resetSteps']),
    setFormReference() {
      this.formReference = this.$refs['documents-form'];
    },

    setPartnerData() {
      const { name, code } = this.partnerInfo;
      this.documentsData.stepTwo = {
        ...this.documentsData.stepTwo,
        name: name,
        partnerCode: code,
      };
    },
    findNameInDictionaries(categoryCode) {
      return this.dictionaries.find((e) => e.categoryCode === categoryCode)?.content || '';
    },
    async downloadResponseFile() {
      const response = await this.getPartnerDocumentsResponse();
      if (response.ok) {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${this.$t('DocumentsWizard.downloaded_file_name_avalon')}.pdf`);
        document.body.appendChild(link);
        link.click();
        this.$message({
          type: 'success',
          message: this.$t('DocumentsWizard.success_fill_documents_label'),
          center: true,
        });
        await this.$router.push({ name: 'DriverDocuments' });
        this.resetSteps();
      } else {
        this.$message({
          type: 'error',
          message: this.$t('DocumentsWizard.failure_fill_documents_label'),
          center: true,
        });
      }
    },
    prepareDataForSave() {
      const { stepOne, stepTwo, signStep } = this.documentsData;
      return {
        personalInformation: stepOne.personalInformation,
        address: stepTwo.address,
        paymentIban: stepOne.paymentIban,
        cooperationType: this.getCooperationType(),
        phoneNumber: stepOne.phoneNumber,
        emailAddress: stepOne.emailAddress,
        signatureDataURI: signStep.signFile,
        signatureDate: signStep.signatureDate,
      };
    },
    validateSignature() {
      return !!this.documentsData.signStep.signFile;
    },
    async fillDocumentsData(ref) {
      this.toggleDataLoading(true);
      this.toggleDataLoading(true);
      const preparedData = this.prepareDataForSave();
      if (!this.validateSignature()) {
        this.$message({
          type: 'error',
          message: this.$t('DocumentsWizard.failure_sign_documents_label'),
          center: true,
        });
        this.toggleDataLoading(false);
        return false;
      }
      this.$refs[ref].validate(async (valid) => {
        if (valid) {
          await this.postPartnerDocumentsFill(preparedData);
          await this.downloadResponseFile();
          this.toggleDataLoading(false);
        } else {
          this.toggleDataLoading(false);
          this.$message({
            type: 'error',
            message: this.$t('DocumentsWizard.failure_fill_documents_label'),
            center: true,
          });
          return false;
        }
      });
    },
    async setInitialData() {
      this.toggleDataLoading(true);
      const { firstName, lastName, phoneNumber, email } = this.getLoggedDriverInfo();
      const { stepOne } = this.documentsData;
      stepOne.personalInformation.firstName = firstName || '';
      stepOne.personalInformation.lastName = lastName || '';
      stepOne.phoneNumber = phoneNumber || '';
      stepOne.emailAddress = email || '';

      await getContractData().then((response) => {
        if (response.ok) {
          const contractData = response.data;
          const { stepOne } = this.documentsData;
          stepOne.paymentIban = contractData.paymentIban;
          stepOne.phoneNumber = phoneNumber || contractData.phoneNumber;
        }
      });
      this.toggleDataLoading(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.documentsWizardSection {
  padding: 32px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);

  .description {
    margin-bottom: 32px;
  }

  .mainContent {
    display: flex;
    flex: 1;
    overflow-y: auto;

    .stepWrapper {
      padding: 0 32px;
      flex: 1;
    }
  }
}

@media screen and (max-width: 768px) {
  .documentsWizardSection {
    .mainContent {
      .stepWrapper {
        padding: 0;
      }
    }
  }
}
</style>
