import request from './request.js';

export const getServicePlansList = () =>
  request({
    url: '/api/service_plans',
    method: 'get',
  });

export const getPartnerServiceEventsList = () =>
  request({
    url: '/api/service_plans/partnerServiceEvents',
    method: 'get',
  });

export const getSpecificServicePlanDetails = (servicePlanId) =>
  request({
    url: `/api/service_plans/specificServicePlanDetails/${servicePlanId}`,
    method: 'get',
  });

export const getSpecificServicePlan = (carId) =>
  request({
    url: `/api/service_plans/specificServicePlan/${carId}`,
    method: 'get',
  });

export const addServicePlan = (servicePlan) =>
  request({
    url: `/api/service_plans/`,
    method: 'post',
    data: servicePlan,
  });

export const editServicePlan = (servicePlan) =>
  request({
    url: `/api/service_plans/update/${servicePlan.servicePlanId}`,
    method: 'put',
    data: servicePlan,
  });
