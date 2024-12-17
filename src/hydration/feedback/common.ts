import { z } from 'zod';

import { Feedback, FeedbackIdentifier, Status, Type } from 'domains/feedback/common';
import { asPayload, DateHydrator, Hydrator } from 'hydration/common';
import {
  UniversallyUniqueIdentifierHydrator,
  universallyUniqueIdentifierSchema,
} from 'hydration/common/identifier';

export const feedbackIdentifierSchema =
  universallyUniqueIdentifierSchema.brand('FeedbackIdentifier');

export type FeedbackIdentifierPayload = z.infer<typeof feedbackIdentifierSchema>;

export const FeedbackIdentifierHydrator = UniversallyUniqueIdentifierHydrator<
  FeedbackIdentifier,
  FeedbackIdentifierPayload
>(FeedbackIdentifier);

export const typeSchema = z.nativeEnum(Type).brand('TypeSchema');

export type TypePayload = z.infer<typeof typeSchema>;

export const statusSchema = z.nativeEnum(Status).brand('StatusSchema');

export type StatusPayload = z.infer<typeof statusSchema>;

export const feedbackSchema = z
  .object({
    identifier: feedbackIdentifierSchema,
    type: typeSchema,
    status: statusSchema,
    content: z.string().min(1).max(Feedback.MAX_CONTENT_LENGTH),
    createdAt: z.string().date(),
    updatedAt: z.string().date(),
  })
  .brand('FeedbackSchema');

export type FeedbackPayload = z.infer<typeof feedbackSchema>;

export const FeedbackHydrator: Hydrator<Feedback, FeedbackPayload> = {
  hydrate: (value) =>
    new Feedback(
      FeedbackIdentifierHydrator.hydrate(value.identifier),
      value.type,
      value.status,
      value.content,
      DateHydrator.hydrate(value.createdAt),
      DateHydrator.hydrate(value.updatedAt)
    ),

  dehydrate: (value) =>
    ({
      identifier: FeedbackIdentifierHydrator.dehydrate(value.identifier),
      type: value.type,
      status: value.status,
      content: value.content,
      createdAt: DateHydrator.dehydrate(value.createdAt),
      updatedAt: DateHydrator.dehydrate(value.updatedAt),
    }) as FeedbackPayload,

  asPayload: (value) => asPayload(value, feedbackSchema),
};
