import { List } from 'immutable';
import { injectable } from 'inversify';

import { Adaptor } from 'acl/fsm-backend/schedule/templates';
import { Criteria, Repository, Schedule, ScheduleIdentifier } from 'domains/schedule';

@injectable()
export class ACLScheduleRepository implements Repository {
  public constructor(public readonly adaptor: Adaptor) {}

  public async add(schedule: Schedule): Promise<void> {
    return await this.adaptor.add(schedule);
  }

  public async update(schedule: Schedule): Promise<void> {
    return await this.adaptor.update(schedule);
  }

  public async find(identifier: ScheduleIdentifier): Promise<Schedule> {
    return await this.adaptor.find(identifier);
  }

  public async list(criteria: Criteria): Promise<List<Schedule>> {
    return await this.adaptor.list(criteria);
  }

  public async delete(identifier: ScheduleIdentifier): Promise<void> {
    return await this.adaptor.delete(identifier);
  }
}
