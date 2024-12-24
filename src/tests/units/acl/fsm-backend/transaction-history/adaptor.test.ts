import HttpError from 'http-errors';
import fetchMock from 'jest-fetch-mock';

import { Adaptor, Reader, Translator, Writer } from 'acl/fsm-backend/transaction-history/delegate';
import { HttpMethod } from 'aspects/http';
import { Builder } from 'tests/factories';
import {
  TransactionHistoryFactory,
  TransactionHistoryIdentifierFactory,
  CriteriaFactory,
} from 'tests/factories/domains/transaction-history';
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
      it('successfully persist transaction-history.', async () => {
        const adaptor = createAdaptor();

        const dailyReport = Builder.get(TransactionHistoryFactory).build();

        prepare(endpoint, (upstream) =>
          upstream.addTransactionHistoryPersist(Type.OK, HttpMethod.POST, dailyReport)
        );

        await adaptor.add(dailyReport);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const dailyReport = Builder.get(TransactionHistoryFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().add(dailyReport),
          (type, overrides) =>
            prepare(endpoint, (upstream) =>
              upstream.addTransactionHistoryPersist(type, HttpMethod.POST, overrides)
            ),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.CONFLICT, HttpError.Conflict],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          dailyReport
        );
      });
    });

    describe('update', () => {
      it('successfully update transaction-history.', async () => {
        const adaptor = createAdaptor();

        const dailyReport = Builder.get(TransactionHistoryFactory).build();

        prepare(endpoint, (upstream) =>
          upstream.addTransactionHistoryPersist(Type.OK, HttpMethod.PUT, dailyReport)
        );

        await adaptor.update(dailyReport);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const dailyReport = Builder.get(TransactionHistoryFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().update(dailyReport),
          (type, overrides) =>
            prepare(endpoint, (upstream) =>
              upstream.addTransactionHistoryPersist(type, HttpMethod.PUT, overrides)
            ),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.NOT_FOUND, HttpError.NotFound],
            [Type.CONFLICT, HttpError.Conflict],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          dailyReport
        );
      });
    });

    describe('find', () => {
      it('successfully returns transaction-history.', async () => {
        const adaptor = createAdaptor();

        const dailyReport = Builder.get(TransactionHistoryFactory).build();

        prepare(endpoint, (upstream) => upstream.addTransactionHistoryFind(Type.OK, dailyReport));

        const actual = await adaptor.find(dailyReport.identifier);

        expect(actual).toBeSameTransactionHistory(dailyReport);
      });

      describe('unsuccessfully', () => {
        const dailyReport = Builder.get(TransactionHistoryFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().find(dailyReport.identifier),
          (type, overrides) =>
            prepare(endpoint, (upstream) => upstream.addTransactionHistoryFind(type, overrides)),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.NOT_FOUND, HttpError.NotFound],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          dailyReport
        );
      });
    });

    describe('list', () => {
      it.each([
        Builder.get(CriteriaFactory).build(),
        Builder.get(CriteriaFactory).build({ fulfilled: true }),
      ])('successfully returns transaction-histories.', async (criteria) => {
        const adaptor = createAdaptor();

        const expecteds = Builder.get(TransactionHistoryFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        prepare(endpoint, (upstream) =>
          upstream.addTransactionHistoryList(Type.OK, { model: expecteds, identifier: criteria })
        );

        const actuals = await adaptor.list(criteria);

        expecteds.zip(actuals).forEach(([expected, actual]) => {
          expect(actual).toBeSameTransactionHistory(expected);
        });
      });

      describe('unsuccessfully', () => {
        const criteria = Builder.get(CriteriaFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().list(criteria),
          (type, overrides) =>
            prepare(endpoint, (upstream) =>
              upstream.addTransactionHistoryList(type, { identifier: overrides })
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
      it('successfully remove transaction-history.', async () => {
        const adaptor = createAdaptor();

        const identifier = Builder.get(TransactionHistoryIdentifierFactory).build();

        prepare(endpoint, (upstream) => upstream.addTransactionHistoryDelete(Type.OK, identifier));

        await adaptor.delete(identifier);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const identifier = Builder.get(TransactionHistoryIdentifierFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().delete(identifier),
          (type, overrides) =>
            prepare(endpoint, (upstream) => upstream.addTransactionHistoryDelete(type, overrides)),
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
