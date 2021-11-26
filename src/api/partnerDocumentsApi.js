import request from './request';

export const getPartnerDocuments = () => {
  return request({
    url: `/api/partner-documents`,
    method: 'get',
  });
};

export const postDocumentsData = (documentsData) => {
  return request({
    url: `/api/partner-documents/fill`,
    method: 'post',
    data: documentsData,
    responseType: 'blob',
  });
};
export const getSignedDocumentsForDriver = (driverAccountUuid, driverUuid) => {
  return request({
    url: `/api/partner-documents/signed`,
    method: 'get',
    params: { driverAccountUuid: driverAccountUuid, driverUuid: driverUuid },
  });
};
export const getSignedDocumentForDriver = (driverAccountUuid, driverUuid, contractId, order) => {
  return request({
    url: `/api/partner-documents/signed/${contractId}/${order}`,
    responseType: 'blob',
    method: 'get',
    params: { driverAccountUuid: driverAccountUuid, driverUuid: driverUuid },
  });
};
export const validatePesel = (pesel) =>
  request({
    url: '/api/validate/pesel',
    method: 'get',
    params: { pesel: pesel },
  });

export const getContractData = () =>
  request({
    url: `/api/partner-documents/last-contract-data`,
    method: 'get',
  });
