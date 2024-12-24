import { List } from 'immutable';
import { injectable } from 'inversify';

import { Adaptor } from 'acl/fsm-backend/daily-report/templates';
import { Criteria, DailyReport, DailyReportIdentifier, Repository } from 'domains/daily-report';

@injectable()
export class ACLDailyReportRepository implements Repository {
  public constructor(public readonly adaptor: Adaptor) {}

  public async add(dailyReport: DailyReport): Promise<void> {
    return await this.adaptor.add(dailyReport);
  }

  public async update(dailyReport: DailyReport): Promise<void> {
    return await this.adaptor.update(dailyReport);
  }

  public async find(identifier: DailyReportIdentifier): Promise<DailyReport> {
    return await this.adaptor.find(identifier);
  }

  public async list(criteria: Criteria): Promise<List<DailyReport>> {
    return await this.adaptor.list(criteria);
  }

  public async delete(identifier: DailyReportIdentifier): Promise<void> {
    return await this.adaptor.delete(identifier);
  }
}
