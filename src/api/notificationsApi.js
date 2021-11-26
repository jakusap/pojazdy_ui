import request from './request';

export const sendSettlementBilling = (drivers, period) => {
  return request({
    url: `/api/settlement-notifications`,
    method: 'POST',
    data: { period: period, driversUUIDs: drivers },
  });
};
export const resendSettlementBilling = (settlementUUID) => {
  return request({
    url: `/api/settlement-notifications/${settlementUUID}/resend`,
    method: 'POST',
  });
};
export const getDriverSummary = (tokenUUID) => {
  return request({
    url: `/api/settlement-notifications/${tokenUUID}`,
    method: 'GET',
  });
};
