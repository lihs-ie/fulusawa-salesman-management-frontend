import { List } from 'immutable';
import { injectable } from 'inversify';

import { EntriesMedia } from 'acl/fsm-backend/common';
import { UserIdentifier } from 'domains/user';
import { asResult, Visit, VisitIdentifier } from 'domains/visit';

import { Translator as BaseTranslator, EntryMedia } from '../templates';

@injectable()
export class Translator extends BaseTranslator {
  public constructor() {
    super();
  }

  public translate(media: EntriesMedia<EntryMedia>): List<Visit> {
    return media.entries.map((entry) => this.translateEntry(entry));
  }

  public translateEntry(media: EntryMedia): Visit {
    return new Visit(
      new VisitIdentifier(media.identifier),
      new UserIdentifier(media.user),
      media.visitedAt,
      this.commonTranslator.translateAddress(media.address),
      media.phone ? this.commonTranslator.translatePhoneNumber(media.phone) : null,
      media.hasGraveyard,
      media.note,
      asResult(media.result)
    );
  }
}
