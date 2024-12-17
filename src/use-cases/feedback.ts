import { List } from 'immutable';
import { injectable } from 'inversify';

import {
  Criteria,
  Feedback as Entity,
  FeedbackIdentifier,
  Repository,
  Sort,
  Status,
  Type,
} from 'domains/feedback';
import { FeedbackHydrator, FeedbackPayload } from 'hydration/feedback';

export type Conditions = Partial<{
  type: Type;
  status: Status;
  sort: Sort;
}>;

@injectable()
export class Feedback {
  public constructor(private readonly repository: Repository) {}

  public async add(payload: FeedbackPayload): Promise<void> {
    const feedback = FeedbackHydrator.hydrate(payload);

    await this.repository.add(feedback);
  }

  public async update(payload: FeedbackPayload): Promise<void> {
    const feedback = FeedbackHydrator.hydrate(payload);

    await this.repository.update(feedback);
  }

  public async find(identifier: string): Promise<Entity> {
    return await this.repository.find(new FeedbackIdentifier(identifier));
  }

  public async list(conditions: Conditions): Promise<List<Entity>> {
    return await this.repository.list(this.createCriteria(conditions));
  }

  public async delete(identifier: string): Promise<void> {
    await this.repository.delete(new FeedbackIdentifier(identifier));
  }

  private createCriteria(conditions: Conditions): Criteria {
    return new Criteria(
      conditions.type ?? null,
      conditions.status ?? null,
      conditions.sort ?? null
    );
  }
}
