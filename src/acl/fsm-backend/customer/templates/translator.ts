import { List } from 'immutable';
import { injectable } from 'inversify';

import { CommonDomainTranslator, EntriesMedia, TranslatorInterface } from 'acl/fsm-backend/common';
import { Customer } from 'domains/customer';

import { EntryMedia } from './media-types';

@injectable()
export abstract class Translator
  implements TranslatorInterface<EntriesMedia<EntryMedia>, List<Customer>>
{
  protected readonly commonTranslator: CommonDomainTranslator;

  public constructor() {
    this.commonTranslator = new CommonDomainTranslator();
  }

  public abstract translate(media: EntriesMedia<EntryMedia>): List<Customer>;

  public abstract translateEntry(media: EntryMedia): Customer;
}
