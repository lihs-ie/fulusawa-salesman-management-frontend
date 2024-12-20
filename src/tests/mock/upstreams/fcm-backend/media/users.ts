import { List, Range } from 'immutable';

import { RawEntriesMedia } from 'acl/fsm-backend/user/templates';
import { User } from 'domains/user';

import { Media } from '../../common';

import { UserMedia } from './user';

export class UsersMedia extends Media<Partial<RawEntriesMedia>, List<User>> {
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

  protected fillByModel(overrides: List<User>): RawEntriesMedia {
    return {
      users: overrides.map((override) => new UserMedia(override).data()).toArray(),
    };
  }

  protected fill(overrides?: Partial<RawEntriesMedia> | List<User>): RawEntriesMedia {
    if (List.isList(overrides)) {
      return this.fillByModel(overrides);
    }

    const users = Range(1, Math.floor(Math.random() * 10) + 1)
      .map(() => new UserMedia().data())
      .toArray();

    return { users };
  }
}
