import request from './request.js';

export const getPartnerServiceEventsList = () =>
  request({
    url: '/api/service_events/partner',
    method: 'get',
  });

export const addServiceEvent = (servicePlanId, servicePlan) =>
  request({
    url: `/api/service_events/insertEvent/${servicePlanId}`,
    method: 'post',
    data: servicePlan,
  });

export const editServicePlan = (orderNumber, serviceEvent) =>
  request({
    url: `/api/service_events/update/${orderNumber}`,
    method: 'put',
    data: serviceEvent,
  });
