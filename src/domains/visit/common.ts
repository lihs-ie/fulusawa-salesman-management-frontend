import { List, Set } from 'immutable';
import { injectable } from 'inversify';

import { Address, PhoneNumber, UniversallyUniqueIdentifier } from 'domains/common';
import { UserIdentifier } from 'domains/user';

import { Criteria } from './criteria';

export class VisitIdentifier extends UniversallyUniqueIdentifier {
  public constructor(value: string) {
    super(value);
  }
}

export const Result = {
  CONTRACT: 'CONTRACT',
  NO_CONTRACT: 'NO_CONTRACT',
} as const;

export type Result = (typeof Result)[keyof typeof Result];

export const isResult = (value: unknown): value is Result => {
  const candidates = Set(Object.values(Result));

  return candidates.has(value as Result);
};

export const asResult = (value: unknown): Result => {
  if (isResult(value)) {
    return value;
  }

  throw new Error(`Result ${value} is not supported.`);
};

export class Visit {
  public static readonly MAX_NOTE_LENGTH = 1000;

  public constructor(
    public readonly identifier: VisitIdentifier,
    public readonly user: UserIdentifier,
    public readonly visitedAt: Date,
    public readonly address: Address,
    public readonly phone: PhoneNumber | null,
    public readonly hasGraveyard: boolean,
    public readonly note: string | null,
    public readonly result: Result
  ) {
    if (new Date() < visitedAt) {
      throw new Error('Visit date must be in the past');
    }

    if (result === Result.CONTRACT && phone === null) {
      throw new Error('Phone number must be set when the result is contract');
    }

    if (note !== null && (note === '' || Visit.MAX_NOTE_LENGTH < note.length)) {
      throw new Error(`Note must be 1 to ${Visit.MAX_NOTE_LENGTH} characters.`);
    }
  }
}

@injectable()
export abstract class Repository {
  public abstract add(visit: Visit): Promise<void>;

  public abstract update(visit: Visit): Promise<void>;

  public abstract find(identifier: VisitIdentifier): Promise<Visit>;

  public abstract list(criteria: Criteria): Promise<List<Visit>>;

  public abstract delete(identifier: VisitIdentifier): Promise<void>;
}
