import { List } from 'immutable';
import { injectable } from 'inversify';

import { Adaptor } from 'acl/fsm-backend/feedback/templates';
import { Criteria, Feedback, FeedbackIdentifier, Repository } from 'domains/feedback';

@injectable()
export class ACLFeedbackRepository implements Repository {
  public constructor(public readonly adaptor: Adaptor) {}

  public async add(feedback: Feedback): Promise<void> {
    return await this.adaptor.add(feedback);
  }

  public async update(feedback: Feedback): Promise<void> {
    return await this.adaptor.update(feedback);
  }

  public async find(identifier: FeedbackIdentifier): Promise<Feedback> {
    return await this.adaptor.find(identifier);
  }

  public async list(criteria: Criteria): Promise<List<Feedback>> {
    return await this.adaptor.list(criteria);
  }

  public async delete(identifier: FeedbackIdentifier): Promise<void> {
    return await this.adaptor.delete(identifier);
  }
}
