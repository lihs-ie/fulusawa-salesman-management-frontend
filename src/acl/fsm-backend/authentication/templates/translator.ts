import { injectable } from 'inversify';

import { TranslatorInterface } from 'acl/fsm-backend/common';
import { Authentication } from 'domains/authentication';

import { EntryMedia } from './media-types';

@injectable()
export abstract class Translator implements TranslatorInterface<EntryMedia, Authentication> {
  public abstract translate(media: EntryMedia): Authentication;
}
