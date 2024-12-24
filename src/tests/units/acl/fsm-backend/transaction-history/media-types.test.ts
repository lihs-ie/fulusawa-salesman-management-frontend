import { List } from 'immutable';

import { Reader, Writer } from 'acl/fsm-backend/transaction-history/delegate';
import { Builder } from 'tests/factories';
import { TransactionHistoryFactory } from 'tests/factories/domains/transaction-history';
import {
  TransactionHistoriesMedia,
  TransactionHistoryMedia,
} from 'tests/mock/upstreams/fcm-backend/media';

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
        const media = new TransactionHistoriesMedia();

        const expecteds = media.data();

        const reader = new Reader();

        const actuals = reader.read(media.createSuccessfulContent());

        List(expecteds.transactionHistories)
          .zip(actuals.entries)
          .forEach(([expected, actual]) => {
            expect(actual).toBeExpectedTransactionHistoryMedia(expected);
          });
      });
    });

    describe('readEntry', () => {
      it('successfully returns entry media.', () => {
        const media = new TransactionHistoryMedia();

        const expected = media.data();

        const reader = new Reader();

        const actual = reader.readEntry(media.createSuccessfulContent());

        expect(actual).toBeExpectedTransactionHistoryMedia(expected);
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
      it('successfully returns serialized dailyReport.', () => {
        const dailyReport = Builder.get(TransactionHistoryFactory).build();

        const expected = JSON.stringify({
          identifier: dailyReport.identifier.value,
          customer: dailyReport.customer.value,
          user: dailyReport.user.value,
          type: dailyReport.type,
          description: dailyReport.description,
          date: dailyReport.date.toISOString(),
        });

        const writer = new Writer();

        const actual = writer.write(dailyReport);

        expect(actual).toBe(expected);
      });
    });
  });
});
