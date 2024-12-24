import { List } from 'immutable';

import { Reader, Writer } from 'acl/fsm-backend/customer/delegate';
import { Builder } from 'tests/factories';
import { CustomerFactory } from 'tests/factories/domains/customer';
import { CustomersMedia, CustomerMedia } from 'tests/mock/upstreams/fcm-backend/media';

describe('Package media-types', () => {
  describe('Class Reader', () => {
    describe('instantiate', () => {
      it('success', () => {
        const reader = new Reader();

        expect(reader).toBeInstanceOf(Reader);
      });
    });

    describe('read', () => {
      it('successfully returns entries media.', () => {
        const media = new CustomersMedia();

        const expecteds = media.data();

        const reader = new Reader();

        const actuals = reader.read(media.createSuccessfulContent());

        List(expecteds.customers)
          .zip(actuals.entries)
          .forEach(([expected, actual]) => {
            expect(actual).toBeExpectedCustomerMedia(expected);
          });
      });
    });

    describe('readEntry', () => {
      it('successfully returns entry media.', () => {
        const media = new CustomerMedia();

        const expected = media.data();

        const reader = new Reader();

        const actual = reader.readEntry(media.createSuccessfulContent());

        expect(actual).toBeExpectedCustomerMedia(expected);
      });
    });
  });

  describe('Class Writer', () => {
    describe('instantiate', () => {
      it('success', () => {
        const writer = new Writer();

        expect(writer).toBeInstanceOf(Writer);
      });
    });

    describe('write', () => {
      it('successfully returns serialized customer.', () => {
        const customer = Builder.get(CustomerFactory).build();

        const expected = JSON.stringify({
          identifier: customer.identifier.value,
          name: {
            first: customer.firstName,
            last: customer.lastName,
          },
          address: {
            prefecture: customer.address.prefecture,
            postalCode: {
              first: customer.address.postalCode.first,
              second: customer.address.postalCode.second,
            },
            city: customer.address.city,
            street: customer.address.street,
            building: customer.address.building,
          },
          phone: {
            areaCode: customer.phone.areaCode,
            localCode: customer.phone.localCode,
            subscriberNumber: customer.phone.subscriberNumber,
          },
          cemeteries: customer.cemeteries.map((cemetery) => cemetery.value).toArray(),
          transactionHistories: customer.transactionHistories
            .map((history) => history.value)
            .toArray(),
        });

        const writer = new Writer();

        const actual = writer.write(customer);

        expect(actual).toBe(expected);
      });
    });
  });
});
