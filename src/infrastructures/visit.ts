import { List } from 'immutable';
import { injectable } from 'inversify';

import { Adaptor } from 'acl/fsm-backend/visit/templates';
import { Criteria, Repository, Visit, VisitIdentifier } from 'domains/visit';

@injectable()
export class ACLVisitRepository implements Repository {
  public constructor(public readonly adaptor: Adaptor) {}

  public async add(visit: Visit): Promise<void> {
    return await this.adaptor.add(visit);
  }

  public async update(visit: Visit): Promise<void> {
    return await this.adaptor.update(visit);
  }

  public async find(identifier: VisitIdentifier): Promise<Visit> {
    return await this.adaptor.find(identifier);
  }

  public async list(criteria: Criteria): Promise<List<Visit>> {
    return await this.adaptor.list(criteria);
  }

  public async delete(identifier: VisitIdentifier): Promise<void> {
    return await this.adaptor.delete(identifier);
  }
}
