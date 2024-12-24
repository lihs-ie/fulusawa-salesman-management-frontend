import { List } from 'immutable';
import { injectable } from 'inversify';

import { EntriesMedia, TranslatorInterface } from 'acl/fsm-backend/common';
import { Feedback } from 'domains/feedback';

import { EntryMedia } from './media-types';

@injectable()
export abstract class Translator
  implements TranslatorInterface<EntriesMedia<EntryMedia>, List<Feedback>>
{
  public abstract translate(media: EntriesMedia<EntryMedia>): List<Feedback>;

  public abstract translateEntry(media: EntryMedia): Feedback;
}
