import { List } from 'immutable';
import { injectable } from 'inversify';

import { AbstractAdaptor } from 'acl/fsm-backend/common';
import { HttpMethod } from 'aspects/http';
import { DailyReport, DailyReportIdentifier, Criteria } from 'domains/daily-report';

import { Reader, Writer } from './media-types';
import { Translator } from './translator';

@injectable()
export abstract class Adaptor extends AbstractAdaptor {
  public constructor(
    private readonly endpoint: string,
    private readonly writer: Writer,
    protected readonly reader: Reader,
    protected readonly translator: Translator
  ) {
    super();
  }

  public abstract add(dailyReport: DailyReport): Promise<void>;

  public abstract update(dailyReport: DailyReport): Promise<void>;

  public abstract find(identifier: DailyReportIdentifier): Promise<DailyReport>;

  public abstract list(criteria: Criteria): Promise<List<DailyReport>>;

  public abstract delete(identifier: DailyReportIdentifier): Promise<void>;

  protected createIdentifierRequest(
    identifier: DailyReportIdentifier,
    method: HttpMethod
  ): Request {
    return new Request(`${this.endpoint}/daily-reports/${identifier.value}`, { method });
  }

  protected createPersistRequest(dailyReport: DailyReport, options: RequestInit): Request {
    const endpoint =
      options.method === HttpMethod.POST
        ? `${this.endpoint}/daily-reports`
        : `${this.endpoint}/daily-reports/${dailyReport.identifier.value}`;

    return new Request(endpoint, {
      ...options,
      body: this.writer.write(dailyReport),
    });
  }

  protected createListRequest(criteria: Criteria): Request {
    const query = new URLSearchParams();

    if (criteria.date) {
      query.append('date', JSON.stringify({ start: criteria.date.min, end: criteria.date.max }));
    }

    if (criteria.user) {
      query.append('user', criteria.user.value);
    }

    if (criteria.isSubmitted !== null) {
      query.append('isSubmitted', String(criteria.isSubmitted));
    }

    return new Request(`${this.endpoint}/daily-reports?${query.toString()}`);
  }
}
