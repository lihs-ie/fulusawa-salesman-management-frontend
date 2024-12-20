import { List, Range } from 'immutable';

import { RawEntriesMedia } from 'acl/fsm-backend/visit/templates';
import { Visit } from 'domains/visit';

import { Media } from '../../common';

import { VisitMedia } from './visit';

export class VisitsMedia extends Media<Partial<RawEntriesMedia>, List<Visit>> {
  public createSuccessfulContent(): string {
    return JSON.stringify(this._data);
  }

  public createFailureContent(): string {
    return JSON.stringify({
      errors: [
        {
          reason: 101,
          cause: 'unit',
          value: 'sku099',
        },
      ],
    });
  }

  protected fillByModel(overrides: List<Visit>): RawEntriesMedia {
    return {
      visits: overrides.map((override) => new VisitMedia(override).data()).toArray(),
    };
  }

  protected fill(overrides?: Partial<RawEntriesMedia> | List<Visit>): RawEntriesMedia {
    if (List.isList(overrides)) {
      return this.fillByModel(overrides);
    }

    const visits = Range(1, Math.floor(Math.random() * 10) + 1)
      .map(() => new VisitMedia().data())
      .toArray();

    return { visits };
  }
}
