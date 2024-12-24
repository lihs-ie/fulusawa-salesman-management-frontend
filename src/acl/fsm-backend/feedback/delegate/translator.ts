import { List } from 'immutable';
import { injectable } from 'inversify';

import { EntriesMedia } from 'acl/fsm-backend/common';
import { asStatus, asType, Feedback, FeedbackIdentifier } from 'domains/feedback';

import { Translator as BaseTranslator, EntryMedia } from '../templates';

@injectable()
export class Translator extends BaseTranslator {
  public constructor() {
    super();
  }

  public translate(media: EntriesMedia<EntryMedia>): List<Feedback> {
    return media.entries.map((entry) => this.translateEntry(entry));
  }

  public translateEntry(media: EntryMedia): Feedback {
    return new Feedback(
      new FeedbackIdentifier(media.identifier),
      asType(media.type),
      asStatus(media.status),
      media.content,
      media.createdAt,
      media.updatedAt
    );
  }
}
