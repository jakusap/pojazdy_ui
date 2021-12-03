import request from './request.js';

export const getCarsList = () =>
  request({
    url: '/api/cars',
    method: 'get',
  });

export const getCar = (carId) =>
  request({
    url: `/api/cars/${carId}`,
    method: 'get',
    params: { carId: carId },
  });

export const getServicePlanCarsList = (servicePlanId) =>
  request({
    url: `/api/cars/servicePlanCars/${servicePlanId}`,
    method: 'get',
  });

export const getServicePlansCarsList = (servicePlan) =>
  request({
    url: '/api/cars/servicePlanCars',
    method: 'post',
    data: servicePlan,
  });

export const removeCarFromServicePlanCarsList = (carId) =>
  request({
    url: `/api/cars/removeServicePlanCars/${carId}`,
    method: 'get',
  });

export const addCarForServicePlanCarsList = (carId, servicePlanId) =>
  request({
    url: `/api/cars/addCarForServicePlan/${carId}/${servicePlanId}`,
    method: 'get',
  });

export const getCarMake = () =>
  request({
    url: `/api/cars/carMake`,
    method: 'get',
  });

export const getCarModel = (carMake) =>
  request({
    url: `/api/cars/carModel/${carMake}`,
    method: 'get',
    params: { carMake: carMake },
  });

export const addCar = (car) =>
  request({
    url: `/api/cars/`,
    method: 'post',
    data: car,
  });

export const putAddCarUser = (carId, driverUUID, editedCarUser) =>
  request({
    url: `/api/cars/${carId}/add/${driverUUID}`,
    method: 'put',
    data: editedCarUser,
  });

export const editCar = (car) =>
  request({
    url: `/api/cars/${car.carId}`,
    method: 'put',
    data: car,
  });

export const editCarUser = (carUser) =>
  request({
    url: `/api/cars/${carUser.carId}/editCarUser`,
    method: 'put',
    data: carUser,
  });
