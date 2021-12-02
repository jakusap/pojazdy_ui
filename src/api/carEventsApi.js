import request from './request.js';

export const getCarEventsForPartnerCarList = (carId) =>
  request({
    url: `/api/car_events/carList/${carId}`,
    method: 'get',
  });

export const addCarEvent = (carEvent) =>
  request({
    url: `/api/car_events`,
    method: 'post',
    data: carEvent,
  });

export const editServicePlan = (orderNumber, serviceEvent) =>
  request({
    url: `/api/service_events/update/${orderNumber}`,
    method: 'put',
    data: serviceEvent,
  });
