import has from 'lodash.has';
import isNaN from 'lodash.isnan';

import officeLocation from './officeConfig';

/**
* Check if the customers data is valid.
* @param {array} customerData - An array of customers objects
* @throws Will throw an Error if the data provided is not valid
* @return True if data is valid
* */
function checkCustomerData(customerData) {
  if (!customerData && !Array.isArray(customerData)) {
    throw Error('Parameter error : customer data is not defined or not an array');
  }
  customerData.forEach((customer) => {
    const customerObjectValid = has(customer, 'user_id') &&
                                has(customer, 'name') &&
                                has(customer, 'longitude') &&
                                has(customer, 'latitude');

    const customerMemberValid = !(isNaN(Number(customer.user_id)) ||
                                  isNaN(Number(customer.longitude)) ||
                                  isNaN(Number(customer.latitude)));
    const geoCoordValid = Number(customer.longitude) >= -180 &&
                          Number(customer.longitude) <= 180 &&
                          Number(customer.latitude) >= -90 &&
                          Number(customer.latitude) <= 90;

    if (!(customerObjectValid && customerMemberValid && geoCoordValid)) {
      throw Error('Parameter Error : customer data is not a valid format');
    }
  });
  return true;
}

/**
* Compares two customers object based on their user id (assuming user_id is always positive)
* @param customer1 - a customer object
* @param customer2 - another customer object
* @return {number} - 0 if id are equal,
*                  - a negative number if customer2 is superior to customer1
*                  - a positive number of customer1 is superior to customer2
* */
function compareCustomersById(customer1, customer2) {
  return Number(customer1.user_id) - Number(customer2.user_id);
}

/**
* Calculates the distance between the Intercom office and the customer office
* Location of the Intercom office can be changed in officeConfig.js
* @param customer  - The customer object
* @param office - The location of the office (format : {longitude: 5.765, latitude: 9.097});
* @return {number} - The distance between the Intercom office and the customer office (in kilometers)
* */
function calculateDistanceFromOffice(customer, office) {
  const customerLatitude = Number(customer.latitude) * (Math.PI / 180);
  const officeLatitude = office.latitude * (Math.PI / 180);
  const longitudeDelta = Math.abs(Number(customer.longitude) - office.longitude) * (Math.PI / 180);
  const latitudeDelta = Math.abs(Number(customer.latitude) - office.latitude) * (Math.PI / 180);

  // See Haversine formula on https://en.wikipedia.org/wiki/Great-circle_distance
  const alpha = (Math.sin(latitudeDelta / 2) ** 2) +
               (Math.cos(customerLatitude) *
               Math.cos(officeLatitude) *
               (Math.sin(longitudeDelta / 2) ** 2));

  const centralAngle = 2 * Math.asin(Math.sqrt(alpha));
  return centralAngle * 6371; // 6371 is the mean earth radius
}

/**
* Return the array of customers which need to be invited to the Intercom office
* @param customersData - An array of customers object
* @param maxDistance   - The maximum distance between the Intercom office and the customer office (in kilometers)
* @return {array}      - An array which contains all customers which we want to invite
* @throws              - Will throw an Error if the customers data provided is not valid
* */
function getArrayInvitedCustomers(customersData, maxDistance) {
  try { // Check the data
    checkCustomerData(customersData);
  } catch (err) {
    throw err;
  }
  return customersData.filter(customer =>
    calculateDistanceFromOffice(customer, officeLocation) <= maxDistance)
    .sort(compareCustomersById);
}

// Exports everything for testing
export {
  compareCustomersById,
  calculateDistanceFromOffice,
  getArrayInvitedCustomers,
  checkCustomerData,
};
