import { Reader, Translator } from 'acl/fsm-backend/authentication/delegate';
import { Builder } from 'tests/factories';
import { AuthenticationFactory } from 'tests/factories/domains/authentication';
import { AuthenticationMedia } from 'tests/mock/upstreams/fcm-backend/media';

describe('Package translator', () => {
  describe('Class Translator', () => {
    describe('instantiate', () => {
      it('success', () => {
        const translator = new Translator();

        expect(translator).toBeInstanceOf(Translator);
      });
    });

    describe('translate', () => {
      it('successfully returns authentication.', () => {
        const expected = Builder.get(AuthenticationFactory).build();

        const media = new AuthenticationMedia(expected);

        const translator = new Translator();

        const reader = new Reader();

        const actual = translator.translate(reader.read(media.createSuccessfulContent()));

        expect(actual).toBeSameAuthentication(expected);
      });
    });
  });
});
