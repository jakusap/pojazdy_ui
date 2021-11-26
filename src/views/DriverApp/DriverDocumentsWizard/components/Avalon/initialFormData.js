import { i18n } from '@/locales/i18n';

export default {
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
      citizenship: i18n.t('DocumentsWizard.formValues.polish_citizenship'),
      identityCardCity: '',
    },
    companyInformation: {
      companyName: '',
      taxIdentificationNumber: '',
      regon: '',
    },
  },
  stepTwo: {
    paymentIban: '',
    address: {
      city: '',
      street: '',
      postCode: '',
      houseNumber: '',
      apartmentNumber: '',
      borough: '',
    },
    phoneNumber: '',
    emailAddress: '',
  },
  stepThree: {
    taxInformation: {
      nationalHealthFund: '',
      taxOffice: '',
      taxIdentificationNumber: '',
      regon: '',
      correspondenceAddress: true,
      editableStatements: {
        retired: {
          retiredType: '',
          decisionNumber: '',
          decisionDate: '',
          categoryCode: '',
          checked: false,
        },
        disability: {
          level: '',
          dateFrom: '',
          dateTo: '',
          categoryCode: '',
          checked: false,
        },
        employment: {
          salary: '',
          dateFrom: '',
          dateTo: '',
          checked: false,
        },
        insurance: {
          salary: '',
          dateFrom: '',
          dateTo: '',
          checked: false,
        },
        otherInsurance: {
          title: '',
          checked: false,
        },
      },
      statements: [],
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
  signStep: {
    signFile: '',
    signatureDate: '',
  },
  vehicleStep: {
    mark: '',
    model: '',
    productionYear: '',
    registrationNumber: '',
    frameNumber: '',
  },
};
