import { v7 as uuid } from 'uuid';

import { EntryMedia, RawEntryMedia } from 'acl/fsm-backend/feedback/templates';
import { Feedback } from 'domains/feedback';
import { Builder, StringFactory } from 'tests/factories';
import { StatusFactory, TypeFactory } from 'tests/factories/domains/feedback';

import { Media } from '../../common';

export class FeedbackMedia extends Media<Partial<RawEntryMedia>, Feedback> {
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

  protected fillByModel(overrides: Feedback): RawEntryMedia {
    return {
      identifier: overrides.identifier.value,
      type: overrides.type,
      status: overrides.status,
      content: overrides.content,
      createdAt: overrides.createdAt.toISOString(),
      updatedAt: overrides.updatedAt.toISOString(),
    };
  }

  protected fill(overrides?: Partial<RawEntryMedia> | Feedback): RawEntryMedia {
    if (overrides instanceof Feedback) {
      return this.fillByModel(overrides);
    }

    return {
      identifier: uuid(),
      type: Builder.get(TypeFactory).build(),
      status: Builder.get(StatusFactory).build(),
      content: Builder.get(StringFactory(1, Feedback.MAX_CONTENT_LENGTH)).build(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides,
    };
  }
}

expect.extend({
  toBeExpectedFeedbackMedia(actual: EntryMedia, expected: RawEntryMedia) {
    try {
      expect(actual.identifier).toBe(expected.identifier);
      expect(actual.type).toBe(expected.type);
      expect(actual.status).toBe(expected.status);
      expect(actual.content).toBe(expected.content);
      expect(actual.createdAt.toISOString()).toBe(expected.createdAt);
      expect(actual.updatedAt.toISOString()).toBe(expected.updatedAt);

      return {
        message: () => 'OK',
        pass: true,
      };
    } catch (error) {
      return {
        message: () => (error as Error).message,
        pass: false,
      };
    }
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeExpectedFeedbackMedia(expected: RawEntryMedia): R;
    }
  }
}
