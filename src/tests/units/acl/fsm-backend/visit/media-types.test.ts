import { List } from 'immutable';

import { Reader, Writer } from 'acl/fsm-backend/visit/delegate';
import { Builder } from 'tests/factories';
import { VisitFactory } from 'tests/factories/domains/visit';
import { VisitsMedia, VisitMedia } from 'tests/mock/upstreams/fcm-backend/media';

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
        const media = new VisitsMedia();

        const expecteds = media.data();

        const reader = new Reader();

        const actuals = reader.read(media.createSuccessfulContent());

        List(expecteds.visits)
          .zip(actuals.entries)
          .forEach(([expected, actual]) => {
            expect(actual).toBeExpectedVisitMedia(expected);
          });
      });
    });

    describe('readEntry', () => {
      it('successfully returns entry media.', () => {
        const media = new VisitMedia();

        const expected = media.data();

        const reader = new Reader();

        const actual = reader.readEntry(media.createSuccessfulContent());

        expect(actual).toBeExpectedVisitMedia(expected);
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
      it('successfully returns serialized visit.', () => {
        const visit = Builder.get(VisitFactory).build();

        const expected = JSON.stringify({
          identifier: visit.identifier.value,
          user: visit.user.value,
          visitedAt: visit.visitedAt.toISOString(),
          address: {
            prefecture: visit.address.prefecture,
            postalCode: {
              first: visit.address.postalCode.first,
              second: visit.address.postalCode.second,
            },
            city: visit.address.city,
            street: visit.address.street,
            building: visit.address.building,
          },
          phone: visit.phone
            ? {
                areaCode: visit.phone.areaCode,
                localCode: visit.phone.localCode,
                subscriberNumber: visit.phone.subscriberNumber,
              }
            : null,
          hasGraveyard: visit.hasGraveyard,
          note: visit.note,
          result: visit.result,
        });

        const writer = new Writer();

        const actual = writer.write(visit);

        expect(actual).toBe(expected);
      });
    });
  });
});
