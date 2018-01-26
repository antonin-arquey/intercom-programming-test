import { assert } from 'chai';
import isSorted from 'is-sorted';

import { compareCustomersById,
         calculateDistanceFromOffice,
         getArrayInvitedCustomers,
         checkCustomerData } from '../src/customersInvitation.js';


describe('Customers invitations functions', function() {
  describe('checkCustomerData', function() {
    it('should not throw an error if the data is valid', function() {
      const customerData = [
        {
          user_id: 587,
          longitude: '89.66534',
          latitude: '-15.22563',
          name: 'Foo Bar',
        }, {
          user_id: 784,
          longitude: '89.66534',
          latitude: '-15.22563',
          name: 'Foo Bar',
        }
      ];
      assert.doesNotThrow(() => checkCustomerData(customerData), Error);
      assert.strictEqual(checkCustomerData(customerData), true);
    });

    it('should throw an error if data is not defined', function() {
      assert.throws(() => checkCustomerData(undefinedData), Error);
    });

    it('should throw an error if data is not an array', function() {
      const customerData = {
        user_id: 587,
        longitude: '89.66534',
        latitude: '-15.22563',
        name: 'Foo Bar',
      };
      assert.throws(() => checkCustomerData(customerData), Error);
    });

    it('should throw an error if user id is not a number', function() {
      const customerData = [{
        user_id: [ 234, 654, 654],
        longitude: '89.66534',
        latitude: '-15.22563',
        name: 'Foo Bar',
      }];
      assert.throws(() => checkCustomerData(customerData), Error);
    });

    it('should throw an error if latitude is not a number', function() {
      const customerData = {
        user_id: 587,
        longitude: '89.66534',
        latitude: 'this is not a valid number',
        name: 'Foo Bar',
      };
      assert.throws(() => checkCustomerData(customerData), Error);
    });

    it('should throw an error if longitude is not a number', function() {
      const customerData = [{
        user_id: 587,
        longitude: { test: false },
        latitude: '-15.22563',
        name: 'Foo Bar',
      }];
      assert.throws(() => checkCustomerData(customerData), Error);
    });

    it('should throw an error if longitude is not in the longitude range', function() {
      const customerData = [{
        user_id: 587,
        longitude: '5874',
        latitude: '-15.22563',
        name: 'Foo Bar',
      }];
      assert.throws(() => checkCustomerData(customerData), Error);
      customerData[0].longitude = '-785421';
      assert.throws(() => checkCustomerData(customerData), Error);
    });

    it('should throw an error if latitude is not in the latitude range', function() {
      const customerData = [{
        user_id: 587,
        longitude: '-78.54792',
        latitude: '90.5541',
        name: 'Foo Bar',
      }];
      assert.throws(() => checkCustomerData(customerData), Error);
      customerData[0].latitude = '-91.547';
      assert.throws(() => checkCustomerData(customerData), Error);
    });
  });

  describe('compareCustomersById', function() {
    it('should return a negative number if customer2 is superior to customer1', function() {
      const c1 = { user_id: 87 };
      const c2 = { user_id: 1765 };
      assert.isAtMost(compareCustomersById(c1, c2), -1);
    });

    it('should return a positive number if customer2 is superior to customer1', function() {
      const c1 = { user_id: 23 };
      const c2 = { user_id: 1 };
      assert.isAtLeast(compareCustomersById(c1, c2), 1);
    });

    it('should return 0 if customer2 is equal to customer1', function() {
      const c1 = { user_id: 10987 };
      const c2 = { user_id: 10987 };
      assert.strictEqual(compareCustomersById(c1, c2), 0);
    });
  });

  describe('calculateDistanceFromOffice', function() {
    const office = { latitude: 53.339428, longitude: -6.257664 };

    it('should be valid when distance is high', function() {
      const c1 = { latitude: '42.990967' , longitude: '-71.463767'};
      assert.strictEqual(Math.round(calculateDistanceFromOffice(c1, office)), 4793);
    });

    it('should be valid when distance is close', function() {
      const c1 = { latitude: '53.432825' , longitude: '-6.475720'};
      assert.strictEqual(Math.round(calculateDistanceFromOffice(c1, office)), 18);
    });

    it('should be valid with a customer on the equator', function() {
      const c1 = { latitude: '0' , longitude: '0'};
      assert.strictEqual(Math.round(calculateDistanceFromOffice(c1, office)), 5959);
    });

    it('should be valid with very close customer', function() {
      const c1 = { latitude: '53.366444' , longitude: '-6.257664'};
      assert.strictEqual(Math.round(calculateDistanceFromOffice(c1, office)), 3);
    });
  });

  describe('getArrayInvitedCustomers', function() {
    const c1 = {
      user_id: 34,
      latitude: '53.432825',
      longitude: '-6.475720',
      name: 'Foobar',
    };
    const c2  = {
      user_id: 875,
      latitude: '53.366444',
      longitude: '-6.475720',
      name: 'Foobar',
    };

    const c3 = {
      user_id: 81097,
      latitude: '78.366444',
      longitude: '-65.475720',
      name: 'Foobar',
    };
    const customerData = [c1, c2, c3];

    it('should return an array', function() {
      assert.typeOf(getArrayInvitedCustomers(customerData, 100), 'array');
    });

    it('should return an array in ascending order', function() {
      const retArray = getArrayInvitedCustomers(customerData, 100);
      assert.typeOf(retArray, 'array');
      assert.strictEqual(isSorted(retArray, compareCustomersById), true);
    });

    it('should only return the right customers', function() {
      const retArray = getArrayInvitedCustomers(customerData, 100);
      assert.deepInclude(retArray, c1);
      assert.deepInclude(retArray, c2);
      assert.notDeepInclude(retArray, c3);
    });

    it('should throw an error if data is not valid', function() {
      assert.throws(() => getArrayInvitedCustomers(undefinedData, 100), Error);
    });
  });
});
