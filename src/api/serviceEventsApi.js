import request from './request.js';

export const getPartnerServiceEventsList = () =>
  request({
    url: '/api/service_events/partner',
    method: 'get',
  });

// export const getSpecificServicePlan = (car) =>
//   request({
//     url: `/api/service_plans/specificServicePlan`,
//     method: 'get',
//     data: car,
//   });
//
// export const addServicePlan = (servicePlan) =>
//   request({
//     url: `/api/service_plans/`,
//     method: 'post',
//     data: servicePlan,
//   });
//
// export const editServicePlan = (servicePlanId, servicePlan) =>
//   request({
//     url: `/api/service_plans/update/${servicePlanId}`,
//     method: 'put',
//     data: servicePlan,
//   });
