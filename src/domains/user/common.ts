import { List, Set } from 'immutable';

import { Address, MailAddress, PhoneNumber, UniversallyUniqueIdentifier } from 'domains/common';

import { Password } from './credential';

export class UserIdentifier extends UniversallyUniqueIdentifier {
  constructor(value: string) {
    super(value);
  }
}

export const Role = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};

export type Role = (typeof Role)[keyof typeof Role];

export const isRole = (value: unknown): value is Role => {
  const candidates = Set(Object.values(Role));

  return candidates.has(value as Role);
};

export const asRole = (value: unknown): Role => {
  if (isRole(value)) {
    return value;
  }

  throw new Error(`Role ${value} is not supported.`);
};

export class User {
  public static readonly MAX_FIRST_NAME_LENGTH = 50;

  public static readonly MAX_LAST_NAME_LENGTH = 50;

  public constructor(
    public readonly identifier: UserIdentifier,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly address: Address,
    public readonly phone: PhoneNumber,
    public readonly email: MailAddress,
    public readonly password: Password | null,
    public readonly role: Role
  ) {
    if (firstName === '' || User.MAX_FIRST_NAME_LENGTH < firstName.length) {
      throw new Error(`First name must be 1 to ${User.MAX_FIRST_NAME_LENGTH} characters.`);
    }

    if (lastName === '' || User.MAX_LAST_NAME_LENGTH < lastName.length) {
      throw new Error(`Last name must be 1 to ${User.MAX_LAST_NAME_LENGTH} characters.`);
    }
  }
}

export abstract class Repository {
  public abstract add(user: User): Promise<void>;

  public abstract update(user: User): Promise<void>;

  public abstract find(identifier: UserIdentifier): Promise<User>;

  public abstract list(): Promise<List<User>>;

  public abstract delete(identifier: UserIdentifier): Promise<void>;
}
