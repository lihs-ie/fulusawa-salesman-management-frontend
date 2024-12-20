import { List } from 'immutable';
import { injectable } from 'inversify';

import { PhoneNumber, PostalCode } from 'domains/common';
import { Criteria, CustomerIdentifier, Customer as Entity, Repository } from 'domains/customer';
import { CustomerHydrator, CustomerPayload } from 'hydration/customer';

export type Conditions = Partial<{
  name: string;
  postalCodeFirst: string;
  postalCodeSecond: string;
  areaCode: string;
  localCode: string;
  subscriberNumber: string;
}>;

@injectable()
export class Customer {
  public constructor(private readonly repository: Repository) {}

  public async add(payload: CustomerPayload): Promise<void> {
    const customer = CustomerHydrator.hydrate(payload);

    await this.repository.add(customer);
  }

  public async update(payload: CustomerPayload): Promise<void> {
    const customer = CustomerHydrator.hydrate(payload);

    await this.repository.update(customer);
  }

  public async find(identifier: string): Promise<Entity> {
    return await this.repository.find(new CustomerIdentifier(identifier));
  }

  public async list(conditions: Conditions): Promise<List<Entity>> {
    return await this.repository.list(this.createCriteria(conditions));
  }

  public async delete(identifier: string): Promise<void> {
    await this.repository.delete(new CustomerIdentifier(identifier));
  }

  private createCriteria(conditions: Conditions): Criteria {
    return new Criteria(
      conditions.name ?? null,
      this.extractPostalCode(conditions),
      this.extractPhone(conditions)
    );
  }

  private extractPostalCode(conditions: Conditions): PostalCode | null {
    if (!conditions.postalCodeFirst || !conditions.postalCodeSecond) {
      return null;
    }

    return new PostalCode(conditions.postalCodeFirst, conditions.postalCodeSecond);
  }

  private extractPhone(conditions: Conditions): PhoneNumber | null {
    if (!conditions.areaCode || !conditions.localCode || !conditions.subscriberNumber) {
      return null;
    }

    return new PhoneNumber(conditions.areaCode, conditions.localCode, conditions.subscriberNumber);
  }
}
