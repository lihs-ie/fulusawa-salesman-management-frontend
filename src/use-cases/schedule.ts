import { List } from 'immutable';
import { injectable } from 'inversify';

import { DateTimeRange } from 'domains/common';
import {
  Repository,
  Schedule as Entity,
  ScheduleIdentifier,
  Status,
  Criteria,
} from 'domains/schedule';
import { UserIdentifier } from 'domains/user';
import { ScheduleHydrator, SchedulePayload } from 'hydration/schedule/common';

export type Conditions = Partial<{
  status: Status;
  dateStart: string;
  dateEnd: string;
  title: string;
  user: string;
}>;

@injectable()
export class Schedule {
  public constructor(private readonly repository: Repository) {}

  public async add(payload: SchedulePayload): Promise<void> {
    const schedule = ScheduleHydrator.hydrate(payload);

    await this.repository.add(schedule);
  }

  public async update(payload: SchedulePayload): Promise<void> {
    const schedule = ScheduleHydrator.hydrate(payload);

    await this.repository.update(schedule);
  }

  public async find(identifier: string): Promise<Entity> {
    return await this.repository.find(new ScheduleIdentifier(identifier));
  }

  public async list(conditions: Conditions): Promise<List<Entity>> {
    return await this.repository.list(this.createCriteria(conditions));
  }

  public async delete(identifier: string): Promise<void> {
    await this.repository.delete(new ScheduleIdentifier(identifier));
  }

  private createCriteria(conditions: Conditions): Criteria {
    return new Criteria(
      conditions.status ?? null,
      this.extractDateTimeRange(conditions),
      conditions.title ?? null,
      this.extractUserIdentifier(conditions)
    );
  }

  private extractDateTimeRange(conditions: Conditions): DateTimeRange | null {
    const start = conditions.dateStart ? new Date(conditions.dateStart) : null;
    const end = conditions.dateEnd ? new Date(conditions.dateEnd) : null;

    if (!start && !end) {
      return null;
    }

    return new DateTimeRange(start, end);
  }

  private extractUserIdentifier(conditions: Conditions): UserIdentifier | null {
    return conditions.user ? new UserIdentifier(conditions.user) : null;
  }
}
