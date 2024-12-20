import { List, Range } from 'immutable';

import { RawEntriesMedia } from 'acl/fsm-backend/feedback/templates';
import { Feedback } from 'domains/feedback';

import { Media } from '../../common';

import { FeedbackMedia } from './feedback';

export class FeedbacksMedia extends Media<Partial<RawEntriesMedia>, List<Feedback>> {
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

  protected fillByModel(overrides: List<Feedback>): RawEntriesMedia {
    return {
      feedbacks: overrides.map((override) => new FeedbackMedia(override).data()).toArray(),
    };
  }

  protected fill(overrides?: Partial<RawEntriesMedia> | List<Feedback>): RawEntriesMedia {
    if (List.isList(overrides)) {
      return this.fillByModel(overrides);
    }

    const feedbacks = Range(1, Math.floor(Math.random() * 10) + 1)
      .map(() => new FeedbackMedia().data())
      .toArray();

    return { feedbacks };
  }
}
