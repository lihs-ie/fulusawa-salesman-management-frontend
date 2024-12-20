import { List } from 'immutable';
import { injectable } from 'inversify';

import { EntriesMedia, TranslatorInterface } from 'acl/fsm-backend/common';
import { TransactionHistory } from 'domains/transaction-history';

import { EntryMedia } from './media-types';

@injectable()
export abstract class Translator
  implements TranslatorInterface<EntriesMedia<EntryMedia>, List<TransactionHistory>>
{
  public abstract translate(media: EntriesMedia<EntryMedia>): List<TransactionHistory>;

  public abstract translateEntry(media: EntryMedia): TransactionHistory;
}
