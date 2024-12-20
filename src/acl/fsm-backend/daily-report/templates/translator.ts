import { List } from 'immutable';
import { injectable } from 'inversify';

import { EntriesMedia, TranslatorInterface } from 'acl/fsm-backend/common';
import { DailyReport } from 'domains/daily-report';

import { EntryMedia } from './media-types';

@injectable()
export abstract class Translator
  implements TranslatorInterface<EntriesMedia<EntryMedia>, List<DailyReport>>
{
  public abstract translate(media: EntriesMedia<EntryMedia>): List<DailyReport>;

  public abstract translateEntry(media: EntryMedia): DailyReport;
}
