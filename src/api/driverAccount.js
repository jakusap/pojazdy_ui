import request from './request.js';

export const getDriverInfo = () =>
  request({
    url: `/api/driver-accounts`,
    method: 'get',
  });

export const addDriverAccount = (driverAccountData) =>
  request({
    url: `/api/driver-accounts`,
    method: 'post',
    data: driverAccountData,
  });

export const editDriverInfo = (driverInfo) =>
  request({
    url: `/api/driver-accounts`,
    method: 'put',
    data: driverInfo,
  });

export const removeDriverAccount = () =>
  request({
    url: `/api/driver-accounts`,
    method: 'delete',
  });

export const invitePartner = (uuid, consentToSendContactDetails) =>
  request({
    url: `/api/driver-accounts/partners/invites`,
    method: 'post',
    data: {
      partnerUuid: uuid,
      consentToSendContactDetails: consentToSendContactDetails,
    },
  });

export const getDriverSettlements = (from = '') =>
  request({
    url: `/api/driver-accounts/settlements${from ? `?from=${from}` : ''}`,
    method: 'get',
  });
