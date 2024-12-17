import { List } from 'immutable';
import { injectable } from 'inversify';

import { CemeteryIdentifier, Cemetery as Entity, Criteria, Repository } from 'domains/cemetery';
import { CustomerIdentifier } from 'domains/customer';
import { CemeteryHydrator, CemeteryPayload } from 'hydration/cemetery';

export type Conditions = {
  customer: string;
};

@injectable()
export class Cemetery {
  public constructor(private readonly repository: Repository) {}

  public async add(payload: CemeteryPayload): Promise<void> {
    const cemetery = CemeteryHydrator.hydrate(payload);

    await this.repository.add(cemetery);
  }

  public async update(payload: CemeteryPayload): Promise<void> {
    const cemetery = CemeteryHydrator.hydrate(payload);

    await this.repository.update(cemetery);
  }

  public async find(identifier: string): Promise<Entity> {
    return await this.repository.find(new CemeteryIdentifier(identifier));
  }

  public async list(conditions: Conditions): Promise<List<Entity>> {
    const criteria = this.createCriteria(conditions);

    return await this.repository.list(criteria);
  }

  public async delete(identifier: string): Promise<void> {
    await this.repository.delete(new CemeteryIdentifier(identifier));
  }

  private createCriteria(conditions: Conditions): Criteria {
    return new Criteria(this.extractCustomer(conditions));
  }

  private extractCustomer(conditions: Conditions): CustomerIdentifier | null {
    return conditions.customer ? new CustomerIdentifier(conditions.customer) : null;
  }
}
