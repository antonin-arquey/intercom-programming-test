/**
* File : main.js
* Description : bootstrap the application and display the result on the HTML page
* */

import { getArrayInvitedCustomers } from './customersInvitation';
import { appendToCustomersTable, printErrorMessage } from './customerTableView';
import customersData from './json/customers.json';

// Max distance to invite customers
const MAX_DISTANCE = 100;

// Application start
let customersToInvite = [];

try {
  customersToInvite = getArrayInvitedCustomers(customersData, MAX_DISTANCE);
} catch (err) {
  printErrorMessage('An unexpected error happened ! Please try again later');
}

// Wait DOM loading before filling the table
document.addEventListener('DOMContentLoaded', () => {
  customersToInvite.forEach(appendToCustomersTable);
});
