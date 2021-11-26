import request from './request';

export const getAvailableLicenses = () =>
  request({
    url: '/api/licenses',
    method: 'get',
  });

export const getPuchasedLicenses = () =>
  request({
    url: '/api/licenses/bought',
    method: 'get',
  });

export const getPaymentInvoice = (paymentId) =>
  request({
    url: `/api/online-payments/${paymentId}/invoice`,
    method: 'get',
  });

export const postBuyLicenses = (buyLicensesRequest) =>
  request({
    url: '/api/licenses',
    method: 'post',
    data: buyLicensesRequest,
  });

export const getPaymentStatus = (paymentId) =>
  request({
    url: `/api/online-payments/${paymentId}`,
    method: 'get',
  });

export const validateNip = (nip) =>
  request({
    url: '/api/companies',
    method: 'get',
    params: { nip: nip },
  });
