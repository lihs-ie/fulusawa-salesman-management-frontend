import { List, OrderedMap } from 'immutable';

import { Address, MailAddress, PhoneNumber } from 'domains/common';
import { Password, Repository, Role, User, UserIdentifier } from 'domains/user';
import { Builder, EnumFactory, Factory, StringFactory } from 'tests/factories/common';

import { AddressFactory, UniversallyUniqueIdentifierFactory } from '../common';
import { MailAddressFactory, PhoneNumberFactory } from '../common/contact';

export class UserIdentifierFactory extends UniversallyUniqueIdentifierFactory(UserIdentifier) {}

export const RoleFactory = EnumFactory(Role);

type UserProperties = {
  identifier: UserIdentifier;
  firstName: string;
  lastName: string;
  address: Address;
  phone: PhoneNumber;
  email: MailAddress;
  password: Password | null;
  role: Role;
};

export class UserFactory extends Factory<User, UserProperties> {
  protected instantiate(properties: UserProperties): User {
    return new User(
      properties.identifier,
      properties.firstName,
      properties.lastName,
      properties.address,
      properties.phone,
      properties.email,
      properties.password,
      properties.role
    );
  }

  protected prepare(overrides: Partial<UserProperties>, seed: number): UserProperties {
    return {
      identifier: Builder.get(UserIdentifierFactory).buildWith(seed),
      firstName: Builder.get(StringFactory(1, User.MAX_FIRST_NAME_LENGTH)).buildWith(seed),
      lastName: Builder.get(StringFactory(1, User.MAX_LAST_NAME_LENGTH)).buildWith(seed),
      address: Builder.get(AddressFactory).buildWith(seed),
      phone: Builder.get(PhoneNumberFactory).buildWith(seed),
      email: Builder.get(MailAddressFactory).buildWith(seed),
      password: null,
      role: Builder.get(RoleFactory).build(),
      ...overrides,
    };
  }

  protected retrieve(instance: User): UserProperties {
    return {
      identifier: instance.identifier,
      firstName: instance.firstName,
      lastName: instance.lastName,
      address: instance.address,
      phone: instance.phone,
      email: instance.email,
      password: instance.password,
      role: instance.role,
    };
  }
}

export type RepositoryProperties = {
  instances: List<User>;
  onPersist?: (instance: User) => void;
  onRemove?: (instances: List<User>) => void;
};

export class RepositoryFactory extends Factory<Repository, RepositoryProperties> {
  protected instantiate(properties: RepositoryProperties): Repository {
    return new (class extends Repository {
      private instances: OrderedMap<UserIdentifier, User>;

      public constructor(
        instances: List<User>,
        private readonly onPersist?: (instance: User) => void,
        private readonly onRemove?: (instances: List<User>) => void
      ) {
        super();

        this.instances = instances.toOrderedMap().mapKeys((_, instance) => instance.identifier);
      }

      public async add(user: User): Promise<void> {
        if (this.instances.has(user.identifier)) {
          throw new Error('User already exists.');
        }

        this.instances = this.instances.set(user.identifier, user);

        this.onPersist?.(user);
      }

      public async update(user: User): Promise<void> {
        if (!this.instances.has(user.identifier)) {
          throw new Error('User not found.');
        }

        this.instances = this.instances.set(user.identifier, user);

        this.onPersist?.(user);
      }

      public async find(identifier: UserIdentifier): Promise<User> {
        const instance = this.instances.get(identifier);

        if (!instance) {
          throw new Error('User not found.');
        }

        return instance;
      }

      public async list(): Promise<List<User>> {
        return this.instances.toList();
      }

      public async delete(identifier: UserIdentifier): Promise<void> {
        if (!this.instances.has(identifier)) {
          throw new Error('User not found.');
        }

        this.instances = this.instances.remove(identifier);

        this.onRemove?.(this.instances.toList());
      }
    })(properties.instances, properties.onPersist, properties.onRemove);
  }

  protected prepare(overrides: Partial<RepositoryProperties>, seed: number): RepositoryProperties {
    return {
      instances: Builder.get(UserFactory).buildListWith(10, seed),
      ...overrides,
    };
  }

  protected retrieve(_: Repository): RepositoryProperties {
    throw new Error('Repository cannot be retrieved.');
  }
}

expect.extend({
  toBeSameUser(actual: User, expected: User) {
    try {
      expect(actual.identifier).toEqualValueObject(expected.identifier);
      expect(actual.firstName).toBe(expected.firstName);
      expect(actual.lastName).toBe(expected.lastName);
      expect(actual.address).toEqualValueObject(expected.address);
      expect(actual.phone).toEqualValueObject(expected.phone);
      expect(actual.email).toEqualValueObject(expected.email);
      expect(actual.password).toBeNullOr(expected.password, (expectedPassword, actualPassword) =>
        expect(actualPassword).toEqualValueObject(expectedPassword)
      );
      expect(actual.role).toBe(expected.role);

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
      toBeSameUser(expected: User): R;
    }
  }
}
