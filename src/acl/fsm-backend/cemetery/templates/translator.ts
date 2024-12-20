import { List } from 'immutable';
import { injectable } from 'inversify';

import { EntriesMedia, TranslatorInterface } from 'acl/fsm-backend/common';
import { Cemetery } from 'domains/cemetery';

import { EntryMedia } from './media-types';

@injectable()
export abstract class Translator
  implements TranslatorInterface<EntriesMedia<EntryMedia>, List<Cemetery>>
{
  public abstract translate(media: EntriesMedia<EntryMedia>): List<Cemetery>;

  public abstract translateEntry(media: EntryMedia): Cemetery;
}
