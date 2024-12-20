import { List, Range } from 'immutable';

import { RawEntriesMedia } from 'acl/fsm-backend/transaction-history/templates';
import { TransactionHistory } from 'domains/transaction-history';

import { Media } from '../../common';

import { TransactionHistoryMedia } from './transaction-history';

export class TransactionHistoriesMedia extends Media<
  Partial<RawEntriesMedia>,
  List<TransactionHistory>
> {
  public createSuccessfulContent(): string {
    return JSON.stringify(this._data);
  }

  public createFailureContent(): string {
    return JSON.stringify({
      errors: [
        {
          reason: 101,
          cause: 'unit',
          value: 'sku099',
        },
      ],
    });
  }

  protected fillByModel(overrides: List<TransactionHistory>): RawEntriesMedia {
    return {
      transactionHistories: overrides
        .map((override) => new TransactionHistoryMedia(override).data())
        .toArray(),
    };
  }

  protected fill(overrides?: Partial<RawEntriesMedia> | List<TransactionHistory>): RawEntriesMedia {
    if (List.isList(overrides)) {
      return this.fillByModel(overrides);
    }

    const transactionHistories = Range(1, Math.floor(Math.random() * 10) + 1)
      .map(() => new TransactionHistoryMedia().data())
      .toArray();

    return { transactionHistories };
  }
}
