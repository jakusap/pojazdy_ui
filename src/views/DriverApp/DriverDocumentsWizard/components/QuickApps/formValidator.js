import { checkIban, validatePostCode } from '@/validators';

export default {
  computed: {
    documentsRules() {
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
          },
          emailAddress: [{ required: true, type: 'email', message: this.$t('validation.wrong_email_format') }],
          phoneNumber: [
            { required: true, message: this.$t('DocumentsWizard.required_field'), trigger: 'change' },
            { type: 'string', max: inputMaxLength, message: this.$t('validation.wrong_phone_number_format') },
          ],
          paymentIban: [
            { required: true, message: this.$t('DocumentsWizard.required_field'), trigger: 'blur' },
            {
              required: true,
              validator: checkIban,
              trigger: 'blur',
            },
          ],
        },
        stepTwo: {
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
              { type: 'string', max: inputMaxLength, message: this.$t('validation.max') },
            ],
          },
        },
      };
    },
  },
};
