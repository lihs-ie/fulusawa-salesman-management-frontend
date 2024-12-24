import { List } from 'immutable';

import { Body } from 'acl/fsm-backend/daily-report/delegate';
import { HttpMethod, Status } from 'aspects/http';
import { DailyReport } from 'domains/daily-report';
import { Builder } from 'tests/factories';
import { DailyReportFactory } from 'tests/factories/domains/daily-report';
import { Resource, Type as CommonType } from 'tests/mock/upstreams/common';

export type Overrides = DailyReport;

export class PersistResource extends Resource<CommonType, DailyReport, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/customres';

  public constructor(
    type: CommonType,
    private readonly method: HttpMethod,
    overrides?: Overrides
  ) {
    super(type, overrides ?? Builder.get(DailyReportFactory).build());
  }

  public code(): string {
    return `${PersistResource.CODE_PREFIX}/${this.method}/${this.overrides.identifier}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== this.method) {
      return false;
    }

    if (!uri.startsWith(`/daily-reports`)) {
      return false;
    }

    if (!this.matchBody(request)) {
      return false;
    }

    return true;
  }

  public content(): string {
    return '';
  }

  protected createSuccessfulResponse(_: Request): Response {
    const status = this.method === 'POST' ? Status.CREATED : Status.NO_CONTENT;

    return new Response(this.content(), { status });
  }

  private matchBody(request: Request): boolean {
    const body = JSON.parse(String(request.body)) as Body;

    if (this.overrides.identifier.value !== body.identifier) {
      return false;
    }

    if (this.overrides.user.value !== body.user) {
      return false;
    }

    if (this.overrides.date.toISOString() !== body.date) {
      return false;
    }

    const schedulesValids = this.overrides.schedules
      .zip(List(body.schedules))
      .every(([expected, actual]) => {
        if (expected.value !== actual) {
          return false;
        }

        return true;
      });

    if (!schedulesValids) {
      return false;
    }

    if (this.overrides.visits.count() !== body.visits.length) {
      return false;
    }

    const historyValids = this.overrides.visits
      .zip(List(body.visits))
      .every(([expected, actual]) => {
        if (expected.value !== actual) {
          return false;
        }

        return true;
      });

    if (!historyValids) {
      return false;
    }

    return true;
  }
}
