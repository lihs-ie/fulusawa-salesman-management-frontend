import HttpError from 'http-errors';
import fetchMock from 'jest-fetch-mock';

import { Adaptor, Reader, Translator, Writer } from 'acl/fsm-backend/customer/delegate';
import { HttpMethod } from 'aspects/http';
import { Builder } from 'tests/factories';
import {
  CustomerFactory,
  CustomerIdentifierFactory,
  CriteriaFactory,
} from 'tests/factories/domains/customer';
import { Type } from 'tests/mock/upstreams/common';
import { prepare } from 'tests/mock/upstreams/fcm-backend';

import { AdaptorFailureTest } from '../../common';

const endpoint = 'http://localhost/api';

const createAdaptor = () => new Adaptor(endpoint, new Writer(), new Reader(), new Translator());

describe('Package adaptor', () => {
  describe('Class Adaptor', () => {
    beforeEach(() => {
      fetchMock.enableMocks();
    });

    afterEach(() => {
      fetchMock.resetMocks();
      fetchMock.disableMocks();
    });

    describe('instantiate', () => {
      it('success', () => {
        const adaptor = new Adaptor(endpoint, new Writer(), new Reader(), new Translator());

        expect(adaptor).toBeInstanceOf(Adaptor);
      });
    });

    describe('add', () => {
      it('successfully persist customer.', async () => {
        const adaptor = createAdaptor();

        const customer = Builder.get(CustomerFactory).build();

        prepare(endpoint, (upstream) =>
          upstream.addCustomerPersist(Type.OK, HttpMethod.POST, customer)
        );

        await adaptor.add(customer);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const customer = Builder.get(CustomerFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().add(customer),
          (type, overrides) =>
            prepare(endpoint, (upstream) =>
              upstream.addCustomerPersist(type, HttpMethod.POST, overrides)
            ),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.CONFLICT, HttpError.Conflict],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          customer
        );
      });
    });

    describe('update', () => {
      it('successfully update customer.', async () => {
        const adaptor = createAdaptor();

        const customer = Builder.get(CustomerFactory).build();

        prepare(endpoint, (upstream) =>
          upstream.addCustomerPersist(Type.OK, HttpMethod.PUT, customer)
        );

        await adaptor.update(customer);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const customer = Builder.get(CustomerFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().update(customer),
          (type, overrides) =>
            prepare(endpoint, (upstream) =>
              upstream.addCustomerPersist(type, HttpMethod.PUT, overrides)
            ),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.NOT_FOUND, HttpError.NotFound],
            [Type.CONFLICT, HttpError.Conflict],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          customer
        );
      });
    });

    describe('find', () => {
      it('successfully returns customer.', async () => {
        const adaptor = createAdaptor();

        const customer = Builder.get(CustomerFactory).build();

        prepare(endpoint, (upstream) => upstream.addCustomerFind(Type.OK, customer));

        const actual = await adaptor.find(customer.identifier);

        expect(actual).toBeSameCustomer(customer);
      });

      describe('unsuccessfully', () => {
        const customer = Builder.get(CustomerFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().find(customer.identifier),
          (type, overrides) =>
            prepare(endpoint, (upstream) => upstream.addCustomerFind(type, overrides)),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.NOT_FOUND, HttpError.NotFound],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          customer
        );
      });
    });

    describe('list', () => {
      it.each([
        Builder.get(CriteriaFactory).build(),
        Builder.get(CriteriaFactory).build({ fulfilled: true }),
      ])('successfully returns cemeteries.', async (criteria) => {
        const adaptor = createAdaptor();

        const expecteds = Builder.get(CustomerFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        prepare(endpoint, (upstream) =>
          upstream.addCustomerList(Type.OK, { model: expecteds, identifier: criteria })
        );

        const actuals = await adaptor.list(criteria);

        expecteds.zip(actuals).forEach(([expected, actual]) => {
          expect(actual).toBeSameCustomer(expected);
        });
      });

      describe('unsuccessfully', () => {
        const criteria = Builder.get(CriteriaFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().list(criteria),
          (type, overrides) =>
            prepare(endpoint, (upstream) =>
              upstream.addCustomerList(type, { identifier: overrides })
            ),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          criteria
        );
      });
    });

    describe('remove', () => {
      it('successfully remove customer.', async () => {
        const adaptor = createAdaptor();

        const identifier = Builder.get(CustomerIdentifierFactory).build();

        prepare(endpoint, (upstream) => upstream.addCustomerDelete(Type.OK, identifier));

        await adaptor.delete(identifier);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const identifier = Builder.get(CustomerIdentifierFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().delete(identifier),
          (type, overrides) =>
            prepare(endpoint, (upstream) => upstream.addCustomerDelete(type, overrides)),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.NOT_FOUND, HttpError.NotFound],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          identifier
        );
      });
    });
  });
});
