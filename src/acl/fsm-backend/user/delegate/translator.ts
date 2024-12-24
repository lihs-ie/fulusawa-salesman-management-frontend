import { List } from 'immutable';
import { injectable } from 'inversify';

import { EntriesMedia } from 'acl/fsm-backend/common';
import { MailAddress } from 'domains/common';
import { asRole, User, UserIdentifier } from 'domains/user';

import { Translator as BaseTranslator, EntryMedia } from '../templates';

@injectable()
export class Translator extends BaseTranslator {
  public constructor() {
    super();
  }

  public translate(media: EntriesMedia<EntryMedia>): List<User> {
    return media.entries.map((entry) => this.translateEntry(entry));
  }

  public translateEntry(media: EntryMedia): User {
    return new User(
      new UserIdentifier(media.identifier),
      media.name.first,
      media.name.last,
      this.commonTranslator.translateAddress(media.address),
      this.commonTranslator.translatePhoneNumber(media.phone),
      this.translateMailAddress(media.email),
      null,
      asRole(media.role)
    );
  }

  private translateMailAddress(media: EntryMedia['email']): MailAddress {
    const [local, domain] = media.split('@');

    return new MailAddress(local, domain);
  }
}
