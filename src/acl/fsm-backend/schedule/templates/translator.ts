import { List } from 'immutable';
import { injectable } from 'inversify';

import { EntriesMedia, TranslatorInterface } from 'acl/fsm-backend/common';
import { Schedule } from 'domains/schedule';

import { EntryMedia } from './media-types';

@injectable()
export abstract class Translator
  implements TranslatorInterface<EntriesMedia<EntryMedia>, List<Schedule>>
{
  public abstract translate(media: EntriesMedia<EntryMedia>): List<Schedule>;

  public abstract translateEntry(media: EntryMedia): Schedule;
}
