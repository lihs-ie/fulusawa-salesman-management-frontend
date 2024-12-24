import { List } from 'immutable';
import { injectable } from 'inversify';

import { Adaptor } from 'acl/fsm-backend/customer/templates';
import { Criteria, Customer, CustomerIdentifier, Repository } from 'domains/customer';

@injectable()
export class ACLCustomerRepository implements Repository {
  public constructor(public readonly adaptor: Adaptor) {}

  public async add(customer: Customer): Promise<void> {
    return await this.adaptor.add(customer);
  }

  public async update(customer: Customer): Promise<void> {
    return await this.adaptor.update(customer);
  }

  public async find(identifier: CustomerIdentifier): Promise<Customer> {
    return await this.adaptor.find(identifier);
  }

  public async list(criteria: Criteria): Promise<List<Customer>> {
    return await this.adaptor.list(criteria);
  }

  public async delete(identifier: CustomerIdentifier): Promise<void> {
    return await this.adaptor.delete(identifier);
  }
}
