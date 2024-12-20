import { Reader, Translator } from 'acl/fsm-backend/visit/delegate';
import { Builder } from 'tests/factories';
import { VisitFactory } from 'tests/factories/domains/visit';
import { VisitsMedia, VisitMedia } from 'tests/mock/upstreams/fcm-backend/media';

describe('Package translator', () => {
  describe('Class Translator', () => {
    describe('instantiate', () => {
      it('success', () => {
        const translator = new Translator();

        expect(translator).toBeInstanceOf(Translator);
      });
    });

    describe('translate', () => {
      it('successfully returns visits.', () => {
        const expecteds = Builder.get(VisitFactory).buildList(Math.floor(Math.random() * 10) + 1);

        const media = new VisitsMedia(expecteds);

        const translator = new Translator();

        const reader = new Reader();

        const actuals = translator.translate(reader.read(media.createSuccessfulContent()));

        expecteds.zip(actuals).forEach(([expected, actual]) => {
          expect(actual).toBeSameVisit(expected);
        });
      });
    });

    describe('translateEntry', () => {
      it('successfully returns visit.', () => {
        const expected = Builder.get(VisitFactory).build();

        const media = new VisitMedia(expected);

        const translator = new Translator();

        const reader = new Reader();

        const actual = translator.translateEntry(reader.readEntry(media.createSuccessfulContent()));

        expect(actual).toBeSameVisit(expected);
      });
    });
  });
});
