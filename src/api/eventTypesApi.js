import request from './request.js';

export const getEventTypes = () =>
  request({
    url: `/api/event_types/`,
    method: 'get',
  });
