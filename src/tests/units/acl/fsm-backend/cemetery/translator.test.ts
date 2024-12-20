import { Reader, Translator } from 'acl/fsm-backend/cemetery/delegate';
import { Builder } from 'tests/factories';
import { CemeteryFactory } from 'tests/factories/domains/cemetery';
import { CemeteriesMedia, CemeteryMedia } from 'tests/mock/upstreams/fcm-backend/media';

describe('Package translator', () => {
  describe('Class Translator', () => {
    describe('instantiate', () => {
      it('success', () => {
        const translator = new Translator();

        expect(translator).toBeInstanceOf(Translator);
      });
    });

    describe('translate', () => {
      it('successfully returns cemeteries.', () => {
        const expecteds = Builder.get(CemeteryFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const media = new CemeteriesMedia(expecteds);

        const translator = new Translator();

        const reader = new Reader();

        const actuals = translator.translate(reader.read(media.createSuccessfulContent()));

        expecteds.zip(actuals).forEach(([expected, actual]) => {
          expect(actual).toBeSameCemetery(expected);
        });
      });
    });

    describe('translateEntry', () => {
      it('successfully returns cemetery.', () => {
        const expected = Builder.get(CemeteryFactory).build();

        const media = new CemeteryMedia(expected);

        const translator = new Translator();

        const reader = new Reader();

        const actual = translator.translateEntry(reader.readEntry(media.createSuccessfulContent()));

        expect(actual).toBeSameCemetery(expected);
      });
    });
  });
});
