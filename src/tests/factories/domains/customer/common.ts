import { List, Map } from 'immutable';

import { CemeteryIdentifier } from 'domains/cemetery';
import { Address, PhoneNumber } from 'domains/common';
import { Criteria, Customer, CustomerIdentifier, Repository } from 'domains/customer';
import { TransactionHistoryIdentifier } from 'domains/transaction-history';
import { Builder, Factory, StringFactory } from 'tests/factories/common';

import { AddressFactory, UniversallyUniqueIdentifierFactory } from '../common';
import { PhoneNumberFactory } from '../common/contact';

export class CustomerIdentifierFactory extends UniversallyUniqueIdentifierFactory(
  CustomerIdentifier
) {}

type CustomerProperties = {
  identifier: CustomerIdentifier;
  lastName: string;
  firstName: string | null;
  address: Address;
  phone: PhoneNumber;
  cemeteries: List<CemeteryIdentifier>;
  transactionHistories: List<TransactionHistoryIdentifier>;
};

export class CustomerFactory extends Factory<Customer, CustomerProperties> {
  protected instantiate(properties: CustomerProperties) {
    return new Customer(
      properties.identifier,
      properties.lastName,
      properties.firstName,
      properties.address,
      properties.phone,
      properties.cemeteries,
      properties.transactionHistories
    );
  }

  protected prepare(overrides: Partial<CustomerProperties>, seed: number): CustomerProperties {
    return {
      identifier: Builder.get(CustomerIdentifierFactory).buildWith(seed),
      lastName: Builder.get(StringFactory(1, Customer.MAX_LAST_NAME_LENGTH)).buildWith(seed),
      firstName: null,
      address: Builder.get(AddressFactory).buildWith(seed),
      phone: Builder.get(PhoneNumberFactory).buildWith(seed),
      cemeteries: List(),
      transactionHistories: List(),
      ...overrides,
    };
  }

  protected retrieve(instance: Customer): CustomerProperties {
    return {
      identifier: instance.identifier,
      lastName: instance.lastName,
      firstName: instance.firstName,
      address: instance.address,
      phone: instance.phone,
      cemeteries: instance.cemeteries,
      transactionHistories: instance.transactionHistories,
    };
  }
}

type RepositoryProperties = {
  instances: List<Customer>;
};

export class RepositoryFactory extends Factory<Repository, RepositoryProperties> {
  protected instantiate(properties: RepositoryProperties): Repository {
    return new (class extends Repository {
      private instances: Map<CustomerIdentifier, Customer>;

      public constructor(instances: List<Customer>) {
        super();
        this.instances = instances.toMap().mapKeys((_, instance) => instance.identifier);
      }

      public async add(customer: Customer): Promise<void> {
        if (this.instances.has(customer.identifier)) {
          throw new Error('Customer already exists.');
        }

        this.instances = this.instances.set(customer.identifier, customer);

        return Promise.resolve();
      }

      public async update(customer: Customer): Promise<void> {
        if (!this.instances.has(customer.identifier)) {
          throw new Error('Customer does not exist.');
        }

        this.instances = this.instances.set(customer.identifier, customer);

        return Promise.resolve();
      }

      public async find(identifier: CustomerIdentifier): Promise<Customer> {
        const instance = this.instances.get(identifier);

        if (!instance) {
          throw new Error('Customer not found.');
        }

        return instance;
      }

      public async list(criteria: Criteria): Promise<List<Customer>> {
        return this.instances
          .filter((instance) => {
            const name = criteria.name;
            const postalCode = criteria.postalCode;
            const phone = criteria.phone;

            if (name && !instance.lastName.includes(name) && !instance.firstName?.includes(name)) {
              return false;
            }

            if (postalCode && postalCode.equals(instance.address.postalCode)) {
              return false;
            }

            if (phone && !phone.equals(instance.phone)) {
              return false;
            }

            return true;
          })
          .toList();
      }

      public async delete(identifier: CustomerIdentifier): Promise<void> {
        if (!this.instances.has(identifier)) {
          throw new Error('Customer does not exist.');
        }

        this.instances = this.instances.remove(identifier);

        return Promise.resolve();
      }
    })(properties.instances);
  }

  protected prepare(overrides: Partial<RepositoryProperties>, seed: number): RepositoryProperties {
    return {
      instances: Builder.get(CustomerFactory).buildListWith(seed, 10),
      ...overrides,
    };
  }

  protected retrieve(_: Repository): RepositoryProperties {
    throw new Error('Repository cannot be retrieved.');
  }
}

expect.extend({
  toBeSameCustomer(actual: Customer, expected: Customer) {
    try {
      expect(expected.identifier.equals(actual.identifier)).toBeTruthy();
      expect(expected.lastName).toBe(actual.lastName);
      expect(expected.firstName).toBe(actual.firstName);
      expect(expected.address.equals(actual.address)).toBeTruthy();
      expect(expected.phone.equals(actual.phone)).toBeTruthy();
      expect(expected.cemeteries.equals(actual.cemeteries)).toBeTruthy();
      expect(expected.transactionHistories.equals(actual.transactionHistories)).toBeTruthy();

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
      toBeSameCustomer(expected: Customer): R;
    }
  }
}
