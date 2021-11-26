import request from './request';

export const getPendingTransactions = (driverUUID, period) => {
  return request({
    url: `/api/transactions`,
    method: 'GET',
    params: { driverUUID: driverUUID, period: period },
  });
};

export const getSettlementTransactions = (settlementUUID) => {
  return request({
    url: `/api/settlements/${settlementUUID}/transactions`,
    method: 'GET',
  });
};

export const addTransaction = (driversUUIDs, transaction) => {
  return request({
    url: `/api/transactions`,
    method: 'POST',
    data: { driversUUIDs: driversUUIDs, transaction: transaction },
  });
};

export const deleteTransaction = (transactionUuid) => {
  return request({
    url: `/api/transactions/${transactionUuid}`,
    method: 'delete',
  });
};
