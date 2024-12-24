import HttpError from 'http-errors';
import fetchMock from 'jest-fetch-mock';

import { Adaptor, Reader, Translator, Writer } from 'acl/fsm-backend/schedule/delegate';
import { HttpMethod } from 'aspects/http';
import { Builder } from 'tests/factories';
import {
  ScheduleFactory,
  ScheduleIdentifierFactory,
  CriteriaFactory,
} from 'tests/factories/domains/schedule';
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
      it('successfully persist schedule.', async () => {
        const adaptor = createAdaptor();

        const schedule = Builder.get(ScheduleFactory).build();

        prepare(endpoint, (upstream) =>
          upstream.addSchedulePersist(Type.OK, HttpMethod.POST, schedule)
        );

        await adaptor.add(schedule);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const schedule = Builder.get(ScheduleFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().add(schedule),
          (type, overrides) =>
            prepare(endpoint, (upstream) =>
              upstream.addSchedulePersist(type, HttpMethod.POST, overrides)
            ),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.CONFLICT, HttpError.Conflict],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          schedule
        );
      });
    });

    describe('update', () => {
      it('successfully update schedule.', async () => {
        const adaptor = createAdaptor();

        const schedule = Builder.get(ScheduleFactory).build();

        prepare(endpoint, (upstream) =>
          upstream.addSchedulePersist(Type.OK, HttpMethod.PUT, schedule)
        );

        await adaptor.update(schedule);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const schedule = Builder.get(ScheduleFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().update(schedule),
          (type, overrides) =>
            prepare(endpoint, (upstream) =>
              upstream.addSchedulePersist(type, HttpMethod.PUT, overrides)
            ),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.NOT_FOUND, HttpError.NotFound],
            [Type.CONFLICT, HttpError.Conflict],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          schedule
        );
      });
    });

    describe('find', () => {
      it('successfully returns schedule.', async () => {
        const adaptor = createAdaptor();

        const schedule = Builder.get(ScheduleFactory).build();

        prepare(endpoint, (upstream) => upstream.addScheduleFind(Type.OK, schedule));

        const actual = await adaptor.find(schedule.identifier);

        expect(actual).toBeSameSchedule(schedule);
      });

      describe('unsuccessfully', () => {
        const schedule = Builder.get(ScheduleFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().find(schedule.identifier),
          (type, overrides) =>
            prepare(endpoint, (upstream) => upstream.addScheduleFind(type, overrides)),
          [
            [Type.UNAUTHORIZED, HttpError.Unauthorized],
            [Type.FORBIDDEN, HttpError.Forbidden],
            [Type.NOT_FOUND, HttpError.NotFound],
            [Type.INTERNAL_SERVER_ERROR, HttpError.InternalServerError],
          ],
          schedule
        );
      });
    });

    describe('list', () => {
      it.each([
        Builder.get(CriteriaFactory).build(),
        Builder.get(CriteriaFactory).build({ fulfilled: true }),
      ])('successfully returns cemeteries.', async (criteria) => {
        const adaptor = createAdaptor();

        const expecteds = Builder.get(ScheduleFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        prepare(endpoint, (upstream) =>
          upstream.addScheduleList(Type.OK, { model: expecteds, identifier: criteria })
        );

        const actuals = await adaptor.list(criteria);

        expecteds.zip(actuals).forEach(([expected, actual]) => {
          expect(actual).toBeSameSchedule(expected);
        });
      });

      describe('unsuccessfully', () => {
        const criteria = Builder.get(CriteriaFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().list(criteria),
          (type, overrides) =>
            prepare(endpoint, (upstream) =>
              upstream.addScheduleList(type, { identifier: overrides })
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
      it('successfully remove schedule.', async () => {
        const adaptor = createAdaptor();

        const identifier = Builder.get(ScheduleIdentifierFactory).build();

        prepare(endpoint, (upstream) => upstream.addScheduleDelete(Type.OK, identifier));

        await adaptor.delete(identifier);

        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      describe('unsuccessfully', () => {
        const identifier = Builder.get(ScheduleIdentifierFactory).build();

        AdaptorFailureTest(
          () => createAdaptor().delete(identifier),
          (type, overrides) =>
            prepare(endpoint, (upstream) => upstream.addScheduleDelete(type, overrides)),
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
