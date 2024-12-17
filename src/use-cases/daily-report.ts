import { List } from 'immutable';
import { injectable } from 'inversify';

import { DateTimeRange } from 'domains/common';
import {
  Criteria,
  DailyReportIdentifier,
  DailyReport as Entity,
  Repository,
} from 'domains/daily-report';
import { UserIdentifier } from 'domains/user';
import { DailyReportHydrator, DailyReportPayload } from 'hydration/daily-report';

export type Conditions = Partial<{
  dateStart: string;
  dateEnd: string;
  user: string;
  isSubmitted: boolean;
}>;

@injectable()
export class DailyReport {
  public constructor(private readonly repository: Repository) {}

  public async add(payload: DailyReportPayload): Promise<void> {
    const dailyReport = DailyReportHydrator.hydrate(payload);

    await this.repository.add(dailyReport);
  }

  public async update(payload: DailyReportPayload): Promise<void> {
    const dailyReport = DailyReportHydrator.hydrate(payload);

    await this.repository.update(dailyReport);
  }

  public async find(identifier: string): Promise<Entity> {
    return await this.repository.find(new DailyReportIdentifier(identifier));
  }

  public async list(conditions: Conditions): Promise<List<Entity>> {
    return await this.repository.list(this.createCriteria(conditions));
  }

  public async delete(identifier: string): Promise<void> {
    await this.repository.delete(new DailyReportIdentifier(identifier));
  }

  private createCriteria(conditions: Conditions): Criteria {
    return new Criteria(
      this.extractDate(conditions),
      this.extractUser(conditions),
      conditions.isSubmitted === undefined ? null : conditions.isSubmitted
    );
  }

  private extractUser(conditions: Conditions): UserIdentifier | null {
    return conditions.user ? new UserIdentifier(conditions.user) : null;
  }

  private extractDate(conditions: Conditions): DateTimeRange | null {
    const start = conditions.dateStart ? new Date(conditions.dateStart) : null;
    const end = conditions.dateEnd ? new Date(conditions.dateEnd) : null;

    return start && end ? new DateTimeRange(start, end) : null;
  }
}
