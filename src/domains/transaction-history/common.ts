import { List, Set } from 'immutable';
import { injectable } from 'inversify';

import { UniversallyUniqueIdentifier } from 'domains/common';
import { CustomerIdentifier } from 'domains/customer';
import { UserIdentifier } from 'domains/user';

import { Criteria } from './criteria';

export class TransactionHistoryIdentifier extends UniversallyUniqueIdentifier {
  public constructor(value: string) {
    super(value);
  }
}

export const Type = {
  MAINTENANCE: 'MAINTENANCE',
  CLEANING: 'CLEANING',
  GRAVESTONE_INSTALLATION: 'GRAVESTONE_INSTALLATION',
  GRAVESTONE_REMOVAL: 'GRAVESTONE_REMOVAL',
  GRAVESTONE_REPLACEMENT: 'GRAVESTONE_REPLACEMENT',
  GRAVESTONE_REPAIR: 'GRAVESTONE_REPAIR',
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

export class TransactionHistory {
  public static readonly MAX_DESCRIPTION_LENGTH = 1000;

  public constructor(
    public readonly identifier: TransactionHistoryIdentifier,
    public readonly customer: CustomerIdentifier,
    public readonly user: UserIdentifier,
    public readonly type: Type,
    public readonly description: string | null,
    public readonly date: Date
  ) {
    if (
      description !== null &&
      (description === '' || TransactionHistory.MAX_DESCRIPTION_LENGTH < description.length)
    ) {
      throw new Error(
        `Description must be 1 to ${TransactionHistory.MAX_DESCRIPTION_LENGTH} characters.`
      );
    }
  }
}

@injectable()
export abstract class Repository {
  public abstract add(transactionHistory: TransactionHistory): Promise<void>;

  public abstract update(transactionHistory: TransactionHistory): Promise<void>;

  public abstract find(identifier: TransactionHistoryIdentifier): Promise<TransactionHistory>;

  public abstract list(criteria: Criteria): Promise<List<TransactionHistory>>;

  public abstract delete(identifier: TransactionHistoryIdentifier): Promise<void>;
}
