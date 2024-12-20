import { List } from 'immutable';
import { injectable } from 'inversify';

import { EntriesMedia } from 'acl/fsm-backend/common';
import { Cemetery, CemeteryIdentifier, CemeteryType } from 'domains/cemetery';
import { CustomerIdentifier } from 'domains/customer';

import { Translator as BaseTranslator, EntryMedia } from '../templates';

@injectable()
export class Translator extends BaseTranslator {
  public translate(media: EntriesMedia<EntryMedia>): List<Cemetery> {
    return media.entries.map((entry) => this.translateEntry(entry));
  }

  public translateEntry(media: EntryMedia): Cemetery {
    return new Cemetery(
      new CemeteryIdentifier(media.identifier),
      new CustomerIdentifier(media.customer),
      media.name,
      this.translateType(media.type),
      media.construction,
      media.inHouse
    );
  }

  private translateType(type: string): CemeteryType {
    switch (type) {
      case CemeteryType.COMMUNITY:
        return CemeteryType.COMMUNITY;

      case CemeteryType.FAMILY:
        return CemeteryType.FAMILY;

      case CemeteryType.INDIVIDUAL:
        return CemeteryType.INDIVIDUAL;

      case CemeteryType.OTHER:
        return CemeteryType.OTHER;

      default:
        throw new Error(`Unknown cemetery type: ${type}`);
    }
  }
}
