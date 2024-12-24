import { List, Set } from 'immutable';
import { injectable } from 'inversify';

import { UniversallyUniqueIdentifier } from 'domains/common';

import { Criteria } from './criteria';

export class FeedbackIdentifier extends UniversallyUniqueIdentifier {
  public constructor(value: string) {
    super(value);
  }
}

export const Type = {
  IMPROVEMENT: 'IMPROVEMENT',
  PROBLEM: 'PROBLEM',
  QUESTION: 'QUESTION',
  OTHER: 'OTHER',
} as const;

export type Type = (typeof Type)[keyof typeof Type];

export const isType = (value: unknown): value is Type => {
  const candidates = Set(Object.values(Type));

  return candidates.has(value as Type);
};

export const asType = (value: unknown): Type => {
  if (isType(value)) {
    return value;
  }

  throw new Error(`Type ${value} is not supported.`);
};

export const Status = {
  WAITING: 'WAITING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  NOT_NECESSARY: 'NOT_NECESSARY',
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export const isStatus = (value: unknown): value is Status => {
  const candidates = Set(Object.values(Status));

  return candidates.has(value as Status);
};

export const asStatus = (value: unknown): Status => {
  if (isStatus(value)) {
    return value;
  }

  throw new Error(`Status ${value} is not supported.`);
};

export class Feedback {
  public static readonly MAX_CONTENT_LENGTH = 1000;

  public constructor(
    public readonly identifier: FeedbackIdentifier,
    public readonly type: Type,
    public readonly status: Status,
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    if (content === '' || Feedback.MAX_CONTENT_LENGTH < content.length) {
      throw new Error(`Content must be 1 to ${Feedback.MAX_CONTENT_LENGTH} characters.`);
    }

    if (createdAt > updatedAt) {
      throw new Error('Updated at must be greater than created at.');
    }
  }
}

@injectable()
export abstract class Repository {
  public abstract add(feedback: Feedback): Promise<void>;

  public abstract update(feedback: Feedback): Promise<void>;

  public abstract find(identifier: FeedbackIdentifier): Promise<Feedback>;

  public abstract list(criteria: Criteria): Promise<List<Feedback>>;

  public abstract delete(identifier: FeedbackIdentifier): Promise<void>;
}
