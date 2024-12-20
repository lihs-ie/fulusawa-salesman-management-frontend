import { Reader, Translator } from 'acl/fsm-backend/transaction-history/delegate';
import { Builder } from 'tests/factories';
import { TransactionHistoryFactory } from 'tests/factories/domains/transaction-history';
import {
  TransactionHistoriesMedia,
  TransactionHistoryMedia,
} from 'tests/mock/upstreams/fcm-backend/media';

describe('Package translator', () => {
  describe('Class Translator', () => {
    describe('instantiate', () => {
      it('success', () => {
        const translator = new Translator();

        expect(translator).toBeInstanceOf(Translator);
      });
    });

    describe('translate', () => {
      it('successfully returns transaction-historys.', () => {
        const expecteds = Builder.get(TransactionHistoryFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const media = new TransactionHistoriesMedia(expecteds);

        const translator = new Translator();

        const reader = new Reader();

        const actuals = translator.translate(reader.read(media.createSuccessfulContent()));

        expecteds.zip(actuals).forEach(([expected, actual]) => {
          expect(actual).toBeSameTransactionHistory(expected);
        });
      });
    });

    describe('translateEntry', () => {
      it('successfully returns transaction-history.', () => {
        const expected = Builder.get(TransactionHistoryFactory).build();

        const media = new TransactionHistoryMedia(expected);

        const translator = new Translator();

        const reader = new Reader();

        const actual = translator.translateEntry(reader.readEntry(media.createSuccessfulContent()));

        expect(actual).toBeSameTransactionHistory(expected);
      });
    });
  });
});
