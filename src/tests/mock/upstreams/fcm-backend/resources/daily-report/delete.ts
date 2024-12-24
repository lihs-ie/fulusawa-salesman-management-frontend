import { Status } from 'aspects/http';
import { DailyReportIdentifier } from 'domains/daily-report';
import { Builder } from 'tests/factories';
import { DailyReportIdentifierFactory } from 'tests/factories/domains/daily-report';
import { Resource, Type as CommonType } from 'tests/mock/upstreams/common';

export type Overrides = DailyReportIdentifier;

export class DeleteResource extends Resource<CommonType, Overrides, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/daily-reports/delete';

  public constructor(type: CommonType, overrides?: Overrides) {
    super(type, overrides ?? Builder.get(DailyReportIdentifierFactory).build());
  }

  public code(): string {
    return `${DeleteResource.CODE_PREFIX}/${this.overrides.value}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== 'DELETE') {
      return false;
    }

    if (!uri.startsWith(`/daily-reports/${this.overrides.value}`)) {
      return false;
    }

    return true;
  }

  public content(): string {
    return '';
  }

  protected createSuccessfulResponse(_: Request): Response {
    return new Response(this.content(), { status: Status.NO_CONTENT });
  }
}
