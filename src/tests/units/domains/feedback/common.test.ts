import { Feedback, FeedbackIdentifier } from 'domains/feedback';
import { Builder, StringFactory } from 'tests/factories';
import {
  FeedbackIdentifierFactory,
  StatusFactory,
  TypeFactory,
} from 'tests/factories/domains/feedback';

import { UniversallyUniqueIdentifierTest } from '../common/identifier';

describe('Package common', () => {
  describe('Class FeedbackIdentifier', () => {
    UniversallyUniqueIdentifierTest(FeedbackIdentifier);
  });

  describe('Class Feedback', () => {
    type Properties = ConstructorParameters<typeof Feedback>;

    const generator = (): Properties => [
      Builder.get(FeedbackIdentifierFactory).build(),
      Builder.get(TypeFactory).build(),
      Builder.get(StatusFactory).build(),
      Builder.get(StringFactory(1, Feedback.MAX_CONTENT_LENGTH)).build(),
      new Date(),
      new Date(),
    ];

    describe('instantiate', () => {
      it('success.', () => {
        const props = generator();

        const instance = new Feedback(...props);

        expect(instance).toBeInstanceOf(Feedback);
        expect(props[0].equals(instance.identifier)).toBeTruthy();
        expect(props[1]).toBe(instance.type);
        expect(props[2]).toBe(instance.status);
        expect(props[3]).toBe(instance.content);
        expect(props[4]).toBe(instance.createdAt);
        expect(props[5]).toBe(instance.updatedAt);
      });

      it.each([{ content: '' }, { content: 'a'.padEnd(Feedback.MAX_CONTENT_LENGTH + 1, 'a') }])(
        'fails with invalid value %s',
        (invalid) => {
          const valids = generator();

          const values = {
            identifier: valids[0],
            type: valids[1],
            status: valids[2],
            createdAt: valids[4],
            updatedAt: valids[5],
            ...invalid,
          };

          expect(
            () =>
              new Feedback(
                values.identifier,
                values.type,
                values.status,
                values.content,
                values.createdAt,
                values.updatedAt
              )
          ).toThrow();
        }
      );
    });
  });
});
