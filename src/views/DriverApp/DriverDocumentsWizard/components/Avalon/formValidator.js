import { validateNip } from '@/api/licensesApi';
import { validatePesel } from '@/api/partnerDocumentsApi';
import { i18n } from '@/locales/i18n';
import { checkIban, validateNumber, validatePostCode } from '@/validators';

export default {
  computed: {
    documentsRules() {
      const correspondenceAddress = this.documentsData.stepThree.taxInformation.correspondenceAddress;
      const retiredStatement = this.documentsData.stepThree.taxInformation.editableStatements.retired.checked;
      const disabilityStatement = this.documentsData.stepThree.taxInformation.editableStatements.disability.checked;
      const employmentStatement = this.documentsData.stepThree.taxInformation.editableStatements.employment.checked;
      const insuranceStatement = this.documentsData.stepThree.taxInformation.editableStatements.insurance.checked;
      const otherInsuranceStatement = this.documentsData.stepThree.taxInformation.editableStatements.otherInsurance
        .checked;

      const inputMaxLength = 50;

      return {
        stepOne: {
          personalInformation: {
            firstName: [
              { required: true, message: this.$t('DocumentsWizard.required_field'), trigger: 'blur' },
              { type: 'string', max: inputMaxLength, message: this.$t('validation.max') },
            ],
            lastName: [
              { required: true, message: this.$t('DocumentsWizard.required_field'), trigger: 'blur' },
              { type: 'string', max: inputMaxLength, message: this.$t('validation.max') },
            ],
            identityCardNumber: [
              { required: true, message: this.$t('DocumentsWizard.required_field'), trigger: 'blur' },
              { type: 'string', max: 9, message: this.$t('validation.max') },
            ],
            citizenship: [
              { required: true, message: this.$t('DocumentsWizard.required_field'), trigger: 'blur' },
              { type: 'string', max: 9, message: this.$t('validation.max') },
            ],
            birthDate: [{ required: true, message: this.$t('DocumentsWizard.required_field'), trigger: 'blur' }],
            birthPlace: [
              { required: true, message: this.$t('DocumentsWizard.required_field'), trigger: 'blur' },
              { type: 'string', max: inputMaxLength, message: this.$t('validation.max') },
            ],
            personalIdentityNumber: [{ required: true, validator: this.checkPesel, trigger: 'change' }],
            identityCardCity: [
              { required: true, message: this.$t('DocumentsWizard.required_field'), trigger: 'blur' },
              { type: 'string', max: inputMaxLength, message: this.$t('validation.max') },
            ],
          },
          companyInformation: {
            companyName: [{ required: true, message: this.$t('DocumentsWizard.required_field'), trigger: 'blur' }],
            taxIdentificationNumber: [{ required: true, validator: this.checkNip, trigger: 'change' }],
            regon: [
              { required: true, message: this.$t('DocumentsWizard.required_field'), trigger: 'blur' },
              { type: 'string', max: inputMaxLength, message: this.$t('validation.max') },
            ],
          },
        },
        stepTwo: {
          paymentIban: [
            { required: true, message: this.$t('DocumentsWizard.required_field'), trigger: 'blur' },
            {
              required: true,
              validator: checkIban,
              trigger: 'blur',
            },
          ],
          emailAddress: [{ required: true, type: 'email', message: this.$t('validation.wrong_email_format') }],
          phoneNumber: [
            { required: true, message: this.$t('DocumentsWizard.required_field'), trigger: 'change' },
            { type: 'string', max: inputMaxLength, message: this.$t('validation.wrong_phone_number_format') },
          ],
          address: {
            city: [
              { required: true, message: this.$t('DocumentsWizard.required_field'), trigger: 'blur' },
              { type: 'string', max: inputMaxLength, message: this.$t('validation.max') },
            ],
            street: [
              { required: true, message: this.$t('DocumentsWizard.required_field'), trigger: 'blur' },
              { type: 'string', max: inputMaxLength, message: this.$t('validation.max') },
            ],
            postCode: [
              { required: true, message: this.$t('DocumentsWizard.required_field'), trigger: 'blur' },
              {
                required: true,
                validator: validatePostCode,
                trigger: 'blur',
              },
            ],
          },
        },
        stepThree: {
          taxInformation: {
            nationalHealthFund: [
              { required: true, message: this.$t('DocumentsWizard.required_field'), trigger: 'blur' },
            ],
            taxOffice: [{ required: true, message: this.$t('DocumentsWizard.required_field'), trigger: 'blur' }],
            editableStatements: {
              retired: {
                categoryCode: [
                  {
                    required: retiredStatement,
                    message: this.$t('DocumentsWizard.required_field'),
                    trigger: 'blur',
                  },
                ],
                decisionNumber: [
                  {
                    required: retiredStatement,
                    message: this.$t('DocumentsWizard.required_field'),
                    trigger: 'blur',
                  },
                ],
                decisionDate: [
                  {
                    required: retiredStatement,
                    message: this.$t('DocumentsWizard.required_field'),
                    trigger: 'blur',
                  },
                ],
              },
              disability: {
                categoryCode: [
                  {
                    required: disabilityStatement,
                    message: this.$t('DocumentsWizard.required_field'),
                    trigger: 'blur',
                  },
                ],
                dateFrom: [
                  {
                    required: disabilityStatement,
                    message: this.$t('DocumentsWizard.required_field'),
                    trigger: 'blur',
                  },
                ],
                dateTo: [
                  {
                    required: disabilityStatement,
                    message: this.$t('DocumentsWizard.required_field'),
                    trigger: 'blur',
                  },
                ],
              },
              employment: {
                salary: [
                  {
                    required: employmentStatement,
                    message: this.$t('DocumentsWizard.required_field'),
                    trigger: 'blur',
                  },
                  { type: 'string', max: inputMaxLength, message: this.$t('validation.max') },
                ],
                dateFrom: [
                  {
                    required: employmentStatement,
                    message: this.$t('DocumentsWizard.required_field'),
                    trigger: 'blur',
                  },
                ],
                dateTo: [
                  {
                    required: employmentStatement,
                    message: this.$t('DocumentsWizard.required_field'),
                    trigger: 'blur',
                  },
                ],
              },
              insurance: {
                salary: [
                  {
                    required: insuranceStatement,
                    message: this.$t('DocumentsWizard.required_field'),
                    trigger: 'blur',
                  },
                  { type: 'string', max: inputMaxLength, message: this.$t('validation.max') },
                ],
                dateFrom: [
                  {
                    required: insuranceStatement,
                    message: this.$t('DocumentsWizard.required_field'),
                    trigger: 'blur',
                  },
                ],
                dateTo: [
                  {
                    required: insuranceStatement,
                    message: this.$t('DocumentsWizard.required_field'),
                    trigger: 'blur',
                  },
                ],
              },
              otherInsurance: {
                title: [
                  {
                    required: otherInsuranceStatement,
                    message: this.$t('DocumentsWizard.required_field'),
                    trigger: 'blur',
                  },
                  { type: 'string', max: inputMaxLength, message: this.$t('validation.max') },
                ],
              },
            },
          },
          correspondenceAddress: {
            city: [
              {
                required: !correspondenceAddress,
                message: this.$t('DocumentsWizard.required_field'),
                trigger: 'blur',
              },
              { type: 'string', max: inputMaxLength, message: this.$t('validation.max') },
            ],
            street: [
              {
                required: !correspondenceAddress,
                message: this.$t('DocumentsWizard.required_field'),
                trigger: 'blur',
              },
              { type: 'string', max: inputMaxLength, message: this.$t('validation.max') },
            ],
            postCode: [
              {
                required: !correspondenceAddress,
                message: this.$t('DocumentsWizard.required_field'),
                trigger: 'blur',
              },
              {
                required: true,
                validator: validatePostCode,
                trigger: 'blur',
              },
            ],
          },
        },
        vehicleStep: {
          mark: [
            { required: true, message: this.$t('DocumentsWizard.required_field'), trigger: 'blur' },
            { type: 'string', max: inputMaxLength, message: this.$t('validation.max') },
          ],
          model: [
            { required: true, message: this.$t('DocumentsWizard.required_field'), trigger: 'blur' },
            { type: 'string', max: inputMaxLength, message: this.$t('validation.max') },
          ],
          productionYear: [
            { required: true, message: this.$t('DocumentsWizard.required_field'), trigger: 'blur' },
            { type: 'string', max: 4, message: this.$t('validation.max') },
            { required: true, validator: validateNumber, trigger: 'blur' },
          ],
          registrationNumber: [
            { required: true, message: this.$t('DocumentsWizard.required_field'), trigger: 'blur' },
            { type: 'string', max: inputMaxLength, message: this.$t('validation.max') },
          ],
          frameNumber: [
            { required: true, message: this.$t('DocumentsWizard.required_field'), trigger: 'blur' },
            { type: 'string', max: inputMaxLength, message: this.$t('validation.max') },
          ],
        },
      };
    },
  },
  methods: {
    async checkNip(rule, value, callback) {
      if (rule.required && !value) {
        callback(new Error(i18n.t('validation.tax_id_cannot_be_empty')));
        this.documentsData.stepOne.companyInformation.companyName = '';
        this.documentsData.stepOne.companyInformation.regon = '';
      } else if (value && value.match(/^\b([0-9]{10})\b/)) {
        this.toggleDataLoading(true);
        await validateNip(value).then((response) => {
          if (response.ok) {
            this.documentsData.stepOne.companyInformation.companyName = response.data.name;
            this.documentsData.stepOne.companyInformation.regon = response.data.regon;
            this.toggleDataLoading(false);
            callback();
          } else {
            this.documentsData.stepOne.companyInformation.companyName = '';
            this.documentsData.stepOne.companyInformation.regon = '';
            if (response.status >= 400 && response.status < 500) {
              this.toggleDataLoading(false);
              callback(new Error(i18n.t('validation.tax_id_not_valid')));
            } else callback();
          }
        });
      } else if (!value || value.length === 0) {
        callback();
      } else {
        this.documentsData.stepOne.companyInformation.companyName = '';
        this.documentsData.stepOne.companyInformation.regon = '';
        callback(new Error(i18n.t('validation.tax_id_wrong_length')));
      }
    },
    async checkPesel(rule, value, callback) {
      if (rule.required && !value) {
        callback(new Error(i18n.t('validation.pesel_wrong_length')));
        this.documentsData.stepOne.personalInformation.birthDate = '';
      } else if (value && value.match(/^\b([0-9]{11})\b/)) {
        this.toggleDataLoading(true);
        await validatePesel(value).then((response) => {
          if (response.ok) {
            this.documentsData.stepOne.personalInformation.birthDate = response.data.birthDate;
            this.toggleDataLoading(false);
            callback();
          } else {
            if (response.status >= 400) {
              this.documentsData.stepOne.personalInformation.birthDate = '';
              this.toggleDataLoading(false);
              callback(new Error(i18n.t('validation.pesel_not_valid')));
            } else callback();
          }
        });
      } else if (!value || value.length === 0) {
        this.documentsData.stepOne.personalInformation.birthDate = '';
        callback();
      } else {
        callback(new Error(i18n.t('validation.pesel_wrong_length')));
        this.documentsData.stepOne.personalInformation.birthDate = '';
      }
    },
  },
};
