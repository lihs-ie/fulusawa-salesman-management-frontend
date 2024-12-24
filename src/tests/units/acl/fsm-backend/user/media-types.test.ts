import { List } from 'immutable';

import { Reader, Writer } from 'acl/fsm-backend/user/delegate';
import { Builder } from 'tests/factories';
import { UserFactory } from 'tests/factories/domains/user';
import { UsersMedia, UserMedia } from 'tests/mock/upstreams/fcm-backend/media';

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
        const media = new UsersMedia();

        const expecteds = media.data();

        const reader = new Reader();

        const actuals = reader.read(media.createSuccessfulContent());

        List(expecteds.users)
          .zip(actuals.entries)
          .forEach(([expected, actual]) => {
            expect(actual).toBeExpectedUserMedia(expected);
          });
      });
    });

    describe('readEntry', () => {
      it('successfully returns entry media.', () => {
        const media = new UserMedia();

        const expected = media.data();

        const reader = new Reader();

        const actual = reader.readEntry(media.createSuccessfulContent());

        expect(actual).toBeExpectedUserMedia(expected);
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
      it('successfully returns serialized user.', () => {
        const user = Builder.get(UserFactory).build();

        const expected = JSON.stringify({
          identifier: user.identifier.value,
          name: {
            first: user.firstName,
            last: user.lastName,
          },
          address: {
            prefecture: user.address.prefecture,
            postalCode: {
              first: user.address.postalCode.first,
              second: user.address.postalCode.second,
            },
            city: user.address.city,
            street: user.address.street,
            building: user.address.building,
          },
          phone: {
            areaCode: user.phone.areaCode,
            localCode: user.phone.localCode,
            subscriberNumber: user.phone.subscriberNumber,
          },
          email: user.email.toString(),
          role: user.role,
        });

        const writer = new Writer();

        const actual = writer.write(user);

        expect(actual).toBe(expected);
      });
    });
  });
});
