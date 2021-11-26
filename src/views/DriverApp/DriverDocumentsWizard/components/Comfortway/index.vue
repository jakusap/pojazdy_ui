<template>
  <div class="mainContent">
    <WizardStepper :form-reference="formReference" :steps="steps" />
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
        <StepThree v-if="currentStep === 'STEP_THREE'" :model="documentsData.stepThree" />
        <button
          v-if="currentStep === 'STEP_THREE'"
          class="el-button el-button--primary save-documents-btn"
          @click="fillDocumentsData('documents-form')"
        >
          <i class="el-icon-check" />
          <span>{{ $t('DocumentsWizard.save_documents') }}</span>
        </button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { checkIban } from '@/validators';

import WizardStepper from '../WizardStepper';
import StepOne from './StepOne';
import StepThree from './StepThree';
import StepTwo from './StepTwo';
export default {
  name: 'ComfortwayWizard',
  components: { StepOne, StepTwo, StepThree, WizardStepper },
  data() {
    return {
      steps: [
        {
          label: 'DocumentsWizard.stepper.stepOne',
          stepName: 'STEP_ONE',
        },
        {
          label: 'DocumentsWizard.stepper.stepTwo',
          stepName: 'STEP_TWO',
        },
        {
          label: 'DocumentsWizard.stepper.stepThree',
          stepName: 'STEP_THREE',
        },
      ],
      formReference: {},
      documentsData: {
        stepOne: {
          personalInformation: {
            firstName: '',
            lastName: '',
            secondName: '',
            motherName: '',
            fatherName: '',
            birthPlace: '',
            birthDate: '',
            personalIdentityNumber: '',
            identityCardNumber: '',
          },
          address: {
            city: '',
            street: '',
            postCode: '',
            houseNumber: '',
            apartmentNumber: '',
            extendedInfo: {
              voivodeship: '',
              county: '',
              district: '',
              commune: '',
            },
          },
        },
        stepTwo: {
          paymentIban: '',
          refundIban: '',
          settlementFrequency: '',
          partnerCode: '',
          vehicleInformation: {
            mark: '',
            model: '',
            registrationNumber: '',
            productionYear: '',
            identificationNumber: '',
            rentalIban: '',
          },
        },
        stepThree: {
          taxInformation: {
            nationalHealthFund: '',
            taxOffice: '',
            taxIdentificationNumber: '',
            regon: '',
            correspondenceAddress: true,
            statements: {
              retiredType: [],
              disability: [],
              status: [],
            },
          },
          correspondenceAddress: {
            city: '',
            street: '',
            postCode: '',
            houseNumber: '',
            apartmentNumber: '',
            extendedInfo: {
              voivodeship: '',
              county: '',
              district: '',
              commune: '',
            },
          },
        },
      },
      documentsRules: {
        stepTwo: {
          paymentIban: [
            {
              validator: checkIban,
              trigger: 'blur',
            },
          ],
          refundIban: [
            {
              validator: checkIban,
              trigger: 'blur',
            },
          ],
          settlementFrequency: [
            {
              required: false,
              message: this.$t('DocumentsWizard.formLabels.settlementFrequency_error_required'),
              trigger: 'blur',
            },
          ],
          vehicleInformation: {
            rentalIban: [
              {
                validator: checkIban,
                trigger: 'blur',
              },
            ],
          },
        },
      },
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
  },
  async created() {
    await this.fetchDictionaries();
    if (!this.getPartnersList().length) await this.fetchPartnersList();
    if (!this.getPartnerDocuments().length) await this.fetchPartnerDocuments();
    await this.setPartnerData();
    this.setFormReference();
  },
  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    ...mapActions('suggestions', ['fetchDictionaries']),
    ...mapActions('partners', ['fetchPartnersList']),
    ...mapActions('partnerProfile', ['fetchPartnerDocuments', 'postPartnerDocumentsFill']),
    ...mapGetters(['dataLoading']),
    ...mapGetters('documentsWizard', ['getCurrentStep']),
    ...mapGetters('driverAccount', ['getLoggedDriverInfo']),
    ...mapGetters('partners', ['getPartnersList']),
    ...mapGetters('partnerProfile', ['getPartnerDocuments', 'getPartnerDocumentsResponse']),
    ...mapGetters('suggestions', ['getDictionaries']),
    ...mapGetters('documentsWizard', ['getStatementsRequiredValues']),
    ...mapGetters('documentsWizard', ['getCooperationType']),
    setFormReference() {
      this.formReference = this.$refs['documents-form'];
    },
    checkOptionalValues() {
      const statementsRequiredValues = this.getStatementsRequiredValues();
      const statements = this.documentsData.stepThree.taxInformation.statements.status;
      return statements
        .map((e) => statementsRequiredValues[e] && statementsRequiredValues[e] !== '')
        .some((e) => e !== true);
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
    prepareStatements() {
      const { statements } = this.documentsData.stepThree.taxInformation;
      const statementsRequiredValues = this.getStatementsRequiredValues();
      const status = this.dictionaries
        .filter((e) => statements.status.includes(e.categoryCode))
        .map((e) => ({ ...e, value: statementsRequiredValues[e.categoryCode] }));

      const retiredType = this.dictionaries.find((e) => e.categoryCode === statements.retiredType);
      const disability = this.dictionaries.find((e) => e.categoryCode === statements.disability);

      return [...status, retiredType, disability].filter((e) => e);
    },
    async downloadResponseFile() {
      const response = await this.getPartnerDocumentsResponse();
      const url = window.URL.createObjectURL(new Blob([response], { type: 'application/zip' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${this.$t('DocumentsWizard.downloaded_file_name')}.zip`);
      document.body.appendChild(link);
      link.click();
    },
    prepareDataForSave() {
      const { stepOne, stepTwo, stepThree } = this.documentsData;
      return {
        personalInformation: stepOne.personalInformation,
        taxInformation: {
          ...stepThree.taxInformation,
          correspondenceAddress: stepThree.taxInformation.correspondenceAddress
            ? stepOne.address
            : stepThree.correspondenceAddress,
          nationalHealthFund: this.findNameInDictionaries(stepThree.taxInformation.nationalHealthFund),
          taxOffice: this.findNameInDictionaries(stepThree.taxInformation.taxOffice),
          statements: this.prepareStatements(),
        },
        vehicleInformation: stepTwo.vehicleInformation,
        address: stepOne.address,
        paymentIban: stepTwo.paymentIban,
        refundIban: stepTwo.refundIban,
        settlementFrequency: this.findNameInDictionaries(stepTwo.settlementFrequency),
        cooperationType: this.getCooperationType(),
      };
    },
    async fillDocumentsData(ref) {
      this.toggleDataLoading(true);
      const preparedData = this.prepareDataForSave();

      this.$refs[ref].validate(async (valid) => {
        if (valid && this.checkOptionalValues()) {
          await this.postPartnerDocumentsFill(preparedData);
          await this.downloadResponseFile();
          this.toggleDataLoading(false);
          this.$message({
            type: 'success',
            message: this.$t('DocumentsWizard.success_fill_documents_label'),
            center: true,
          });
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

      .save-documents-btn {
        font-weight: 600;
        font-size: 18px;
        margin-left: 11px;
      }
    }
  }
}
</style>
