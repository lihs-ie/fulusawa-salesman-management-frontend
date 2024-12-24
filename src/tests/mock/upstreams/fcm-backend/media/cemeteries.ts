import { List, Range } from 'immutable';

import { RawEntriesMedia } from 'acl/fsm-backend/cemetery/templates';
import { Cemetery } from 'domains/cemetery';

import { Media } from '../../common';

import { CemeteryMedia } from './cemetery';

export class CemeteriesMedia extends Media<Partial<RawEntriesMedia>, List<Cemetery>> {
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

  protected fillByModel(overrides: List<Cemetery>): RawEntriesMedia {
    return {
      cemeteries: overrides.map((cemetery) => new CemeteryMedia(cemetery).data()).toArray(),
    };
  }

  protected fill(overrides?: Partial<RawEntriesMedia> | List<Cemetery>): RawEntriesMedia {
    if (List.isList(overrides)) {
      return this.fillByModel(overrides);
    }

    return {
      cemeteries: Range(1, Math.floor(Math.random() * 10))
        .map(() => new CemeteryMedia().data())
        .toArray(),
      ...overrides,
    };
  }
}
