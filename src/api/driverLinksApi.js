import request from './request.js';

export const getLinkedByEmail = (email) =>
  request({
    url: '/api/drivers/linked/by-email',
    method: 'get',
    params: { email: email },
  });

export const getLinkedByUuid = () =>
  request({
    url: '/api/drivers/linked/by-partner-uuid',
    method: 'get',
  });

export const getBlocked = () =>
  request({
    url: '/api/drivers/linked/blocked',
    method: 'get',
  });

export const postDriverLink = (linkedDriver) =>
  request({
    url: '/api/drivers/linked',
    method: 'post',
    data: linkedDriver,
  });

export const putDriverLink = (linkStatus) =>
  request({
    url: `/api/drivers/linked/${linkStatus.id}`,
    method: 'put',
    params: { blocked: linkStatus.blocked },
  });

export const deleteDriverLink = (driverUUID) =>
  request({
    url: `/api/drivers/linked/${driverUUID}`,
    method: 'delete',
  });
