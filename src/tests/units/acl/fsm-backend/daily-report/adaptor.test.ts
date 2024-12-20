import HttpError from 'http-errors';
import fetchMock from 'jest-fetch-mock';

import { Adaptor, Reader, Translator, Writer } from 'acl/fsm-backend/daily-report/delegate';
import { HttpMethod } from 'aspects/http';
import { Builder } from 'tests/factories';
import {
  DailyReportFactory,
  DailyReportIdentifierFactory,
  CriteriaFactory,
} from 'tests/factories/domains/daily-report';
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
      it('successfully persist daily-report.', async () => {
        const adaptor = createAdaptor();

        const dailyReport = Builder.get(DailyReportFactory).build();

        prepare(endpoint, (upstream) =>
          upstream.addDailyReportPersist(Type.OK, HttpMethod.POST, dailyReport)
        );

        await adaptor.add(dailyReport);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const dailyReport = Builder.get(DailyReportFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().add(dailyReport),
          (type, overrides) =>
            prepare(endpoint, (upstream) =>
              upstream.addDailyReportPersist(type, HttpMethod.POST, overrides)
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
      it('successfully update daily-report.', async () => {
        const adaptor = createAdaptor();

        const dailyReport = Builder.get(DailyReportFactory).build();

        prepare(endpoint, (upstream) =>
          upstream.addDailyReportPersist(Type.OK, HttpMethod.PUT, dailyReport)
        );

        await adaptor.update(dailyReport);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const dailyReport = Builder.get(DailyReportFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().update(dailyReport),
          (type, overrides) =>
            prepare(endpoint, (upstream) =>
              upstream.addDailyReportPersist(type, HttpMethod.PUT, overrides)
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
      it('successfully returns daily-report.', async () => {
        const adaptor = createAdaptor();

        const dailyReport = Builder.get(DailyReportFactory).build();

        prepare(endpoint, (upstream) => upstream.addDailyReportFind(Type.OK, dailyReport));

        const actual = await adaptor.find(dailyReport.identifier);

        expect(actual).toBeSameDailyReport(dailyReport);
      });

      describe('unsuccessfully', () => {
        const dailyReport = Builder.get(DailyReportFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().find(dailyReport.identifier),
          (type, overrides) =>
            prepare(endpoint, (upstream) => upstream.addDailyReportFind(type, overrides)),
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
      ])('successfully returns daily-reports.', async (criteria) => {
        const adaptor = createAdaptor();

        const expecteds = Builder.get(DailyReportFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        prepare(endpoint, (upstream) =>
          upstream.addDailyReportList(Type.OK, { model: expecteds, identifier: criteria })
        );

        const actuals = await adaptor.list(criteria);

        expecteds.zip(actuals).forEach(([expected, actual]) => {
          expect(actual).toBeSameDailyReport(expected);
        });
      });

      describe('unsuccessfully', () => {
        const criteria = Builder.get(CriteriaFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().list(criteria),
          (type, overrides) =>
            prepare(endpoint, (upstream) =>
              upstream.addDailyReportList(type, { identifier: overrides })
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
      it('successfully remove daily-report.', async () => {
        const adaptor = createAdaptor();

        const identifier = Builder.get(DailyReportIdentifierFactory).build();

        prepare(endpoint, (upstream) => upstream.addDailyReportDelete(Type.OK, identifier));

        await adaptor.delete(identifier);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const identifier = Builder.get(DailyReportIdentifierFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().delete(identifier),
          (type, overrides) =>
            prepare(endpoint, (upstream) => upstream.addDailyReportDelete(type, overrides)),
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
