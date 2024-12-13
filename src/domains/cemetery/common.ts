import { List } from 'immutable';

import { UniversallyUniqueIdentifier } from 'domains/common';
import { CustomerIdentifier } from 'domains/customer';

import { Criteria } from './criteria';

export class CemeteryIdentifier extends UniversallyUniqueIdentifier {
  public constructor(value: string) {
    super(value);
  }
}

export const CemeteryType = {
  INDIVIDUAL: 'INDIVIDUAL',
  FAMILY: 'FAMILY',
  COMMUNITY: 'COMMUNITY',
  OTHER: 'OTHER',
} as const;

export type CemeteryType = (typeof CemeteryType)[keyof typeof CemeteryType];

export class Cemetery {
  public static readonly MAX_NAME_LENGTH = 255;

  public constructor(
    public readonly identifier: CemeteryIdentifier,
    public readonly customer: CustomerIdentifier,
    public readonly name: string,
    public readonly type: CemeteryType,
    public readonly construction: Date,
    public readonly inHouse: boolean
  ) {
    if (name === '' || Cemetery.MAX_NAME_LENGTH < name.length) {
      throw new Error(`Name must be 1 to ${Cemetery.MAX_NAME_LENGTH} characters.`);
    }
  }
}

export abstract class Repository {
  public abstract add(cemetery: Cemetery): Promise<void>;

  public abstract update(cemetery: Cemetery): Promise<void>;

  public abstract find(identifier: CemeteryIdentifier): Promise<Cemetery>;

  public abstract list(criteria: Criteria): Promise<List<Cemetery>>;

  public abstract delete(identifier: CemeteryIdentifier): Promise<void>;
}
