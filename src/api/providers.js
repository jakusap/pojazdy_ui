import request from './request.js';

export const getAllProviders = (hasDriverApp) =>
  request({
    url: `/api/providers`,
    method: 'get',
    params: { hasDriverApp: hasDriverApp },
  });
