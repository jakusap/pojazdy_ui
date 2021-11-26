import request from './request.js';

export const getDriversList = (provider, identifier) =>
  request({
    url: '/api/drivers',
    method: 'get',
    params: { provider: provider, identifier: identifier },
  });

export const getDriver = (driverUUID) =>
  request({
    url: `/api/drivers/${driverUUID}`,
    method: 'get',
  });

export const addDriver = (driver) =>
  request({
    url: `/api/drivers/`,
    method: 'post',
    data: driver,
  });

export const getMessagesInfo = (driverUUID) =>
  request({
    url: `/api/settlement-notifications`,
    method: 'get',
    params: { driverUuid: driverUUID },
  });

export const editDriver = (driver) =>
  request({
    url: `/api/drivers/${driver.driverUUID}`,
    method: 'put',
    data: driver,
  });

export const putMergeDrivers = (correctDriverUUID, wrongDriverUUID) =>
  request({
    url: `/api/drivers/${correctDriverUUID}/merge/${wrongDriverUUID}`,
    method: 'put',
  });
