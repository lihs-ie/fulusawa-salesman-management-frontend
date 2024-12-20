import { List } from 'immutable';

import { Reader, Writer } from 'acl/fsm-backend/cemetery/delegate';
import { Builder } from 'tests/factories';
import { CemeteryFactory } from 'tests/factories/domains/cemetery';
import { CemeteriesMedia, CemeteryMedia } from 'tests/mock/upstreams/fcm-backend/media';

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
        const media = new CemeteriesMedia();

        const expecteds = media.data();

        const reader = new Reader();

        const actuals = reader.read(media.createSuccessfulContent());

        List(expecteds.cemeteries)
          .zip(actuals.entries)
          .forEach(([expected, actual]) => {
            expect(actual).toBeExpectedCemeteryMedia(expected);
          });
      });
    });

    describe('readEntry', () => {
      it('successfully returns entry media.', () => {
        const media = new CemeteryMedia();

        const expected = media.data();

        const reader = new Reader();

        const actual = reader.readEntry(media.createSuccessfulContent());

        expect(actual).toBeExpectedCemeteryMedia(expected);
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
      it('successfully returns serialized cemetery.', () => {
        const cemetery = Builder.get(CemeteryFactory).build();

        const expected = JSON.stringify({
          identifier: cemetery.identifier.value,
          customer: cemetery.customer.value,
          name: cemetery.name,
          type: cemetery.type,
          construction: cemetery.construction.toISOString(),
          inHouse: cemetery.inHouse,
        });

        const writer = new Writer();

        const actual = writer.write(cemetery);

        expect(actual).toBe(expected);
      });
    });
  });
});
