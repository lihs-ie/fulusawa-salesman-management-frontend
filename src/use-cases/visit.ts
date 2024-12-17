import { List } from 'immutable';
import { injectable } from 'inversify';

import { UserIdentifier } from 'domains/user';
import { Repository, Visit as Entity, VisitIdentifier, Sort, Criteria } from 'domains/visit';
import { VisitHydrator, VisitPayload } from 'hydration/visit';

export type Conditions = Partial<{
  user: string;
  sort: Sort;
}>;

@injectable()
export class Visit {
  public constructor(private readonly repository: Repository) {}

  public async add(payload: VisitPayload): Promise<void> {
    const visit = VisitHydrator.hydrate(payload);

    await this.repository.add(visit);
  }

  public async update(payload: VisitPayload): Promise<void> {
    const visit = VisitHydrator.hydrate(payload);

    await this.repository.update(visit);
  }

  public async find(identifier: string): Promise<Entity> {
    return this.repository.find(new VisitIdentifier(identifier));
  }

  public async list(conditions: Conditions): Promise<List<Entity>> {
    return this.repository.list(this.createCriteria(conditions));
  }

  public async delete(identifier: string): Promise<void> {
    await this.repository.delete(new VisitIdentifier(identifier));
  }

  private createCriteria(conditions: Conditions): Criteria {
    return new Criteria(this.extractUser(conditions), conditions.sort ?? null);
  }

  private extractUser(conditions: Conditions): UserIdentifier | null {
    return conditions.user ? new UserIdentifier(conditions.user) : null;
  }
}
