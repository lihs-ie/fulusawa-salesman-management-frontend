import { Reader, Translator } from 'acl/fsm-backend/user/delegate';
import { Builder } from 'tests/factories';
import { UserFactory } from 'tests/factories/domains/user';
import { UsersMedia, UserMedia } from 'tests/mock/upstreams/fcm-backend/media';

describe('Package translator', () => {
  describe('Class Translator', () => {
    describe('instantiate', () => {
      it('success', () => {
        const translator = new Translator();

        expect(translator).toBeInstanceOf(Translator);
      });
    });

    describe('translate', () => {
      it('successfully returns users.', () => {
        const expecteds = Builder.get(UserFactory).buildList(Math.floor(Math.random() * 10) + 1);

        const media = new UsersMedia(expecteds);

        const translator = new Translator();

        const reader = new Reader();

        const actuals = translator.translate(reader.read(media.createSuccessfulContent()));

        expecteds.zip(actuals).forEach(([expected, actual]) => {
          expect(actual).toBeSameUser(expected);
        });
      });
    });

    describe('translateEntry', () => {
      it('successfully returns user.', () => {
        const expected = Builder.get(UserFactory).build();

        const media = new UserMedia(expected);

        const translator = new Translator();

        const reader = new Reader();

        const actual = translator.translateEntry(reader.readEntry(media.createSuccessfulContent()));

        expect(actual).toBeSameUser(expected);
      });
    });
  });
});
