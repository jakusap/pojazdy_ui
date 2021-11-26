import request from './request';

export const getPendingSettlements = (driverUUID, period, settlementDetails) =>
  request({
    url: `/api/settlements/pending`,
    method: 'GET',
    params: { driverUUID: driverUUID, period: period, settlementDetails: settlementDetails },
  });

export const getSettledSettlements = (driverUUID) =>
  request({
    url: `/api/settlements/settled`,
    method: 'GET',
    params: { driverUUID: driverUUID },
  });

export const getSettlementDetails = (settlementUUID) =>
  request({
    url: `/api/settlements/${settlementUUID}`,
    method: 'GET',
  });

export const calculateSettlements = (drivers, period) =>
  request({
    url: `/api/settlements`,
    method: 'POST',
    data: { period: period, driversUUIDs: drivers },
  });

export const deleteDoneSettlement = (settlements) =>
  request({
    url: `/api/settlements`,
    method: 'DELETE',
    data: settlements,
  });

export const getPaidSettlements = (dateFrom, driverUUID) =>
  request({
    url: `/api/settlements/paid`,
    method: 'get',
    params: { dateFrom: dateFrom, driverUUID: driverUUID },
  });

export const putPaidStatus = (settlements, paidStatus) =>
  request({
    url: `/api/settlements/paid`,
    method: 'put',
    data: { settlementsUUIDs: settlements, markAsPaid: paidStatus },
  });

export const postGenerateFileTransfers = (
  settlements,
  fileExportStandard,
  transferDate,
  transferDetails,
  partnerIban
) =>
  request({
    url: `/api/settlements/paid/files`,
    method: 'post',
    data: {
      settlementsUUIDs: settlements,
      fileExportStandard: fileExportStandard,
      transferDate: transferDate,
      transferDetails: transferDetails,
      partnerIban: partnerIban,
    },
  });

export const getSettlementInvoice = (uuid) =>
  request({
    url: `/api/settlements/${uuid}/invoice-data`,
    method: 'get',
  });
