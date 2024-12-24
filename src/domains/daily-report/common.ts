import { List } from 'immutable';
import { injectable } from 'inversify';

import { UniversallyUniqueIdentifier } from 'domains/common';
import { ScheduleIdentifier } from 'domains/schedule';
import { UserIdentifier } from 'domains/user';
import { VisitIdentifier } from 'domains/visit';

import { Criteria } from './criteria';

export class DailyReportIdentifier extends UniversallyUniqueIdentifier {
  public constructor(value: string) {
    super(value);
  }
}

export class DailyReport {
  public constructor(
    public readonly identifier: DailyReportIdentifier,
    public readonly user: UserIdentifier,
    public readonly date: Date,
    public readonly schedules: List<ScheduleIdentifier>,
    public readonly visits: List<VisitIdentifier>,
    public readonly isSubmitted: boolean
  ) {}
}

@injectable()
export abstract class Repository {
  public abstract add(dailyReport: DailyReport): Promise<void>;

  public abstract update(dailyReport: DailyReport): Promise<void>;

  public abstract find(identifier: DailyReportIdentifier): Promise<DailyReport>;

  public abstract list(criteria: Criteria): Promise<List<DailyReport>>;

  public abstract delete(identifier: DailyReportIdentifier): Promise<void>;
}
