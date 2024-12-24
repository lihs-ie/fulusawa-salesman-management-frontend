import { RawEntryMedia } from 'acl/fsm-backend/daily-report/templates';
import { DailyReport, DailyReportIdentifier } from 'domains/daily-report';
import { Builder } from 'tests/factories';
import {
  DailyReportFactory,
  DailyReportIdentifierFactory,
} from 'tests/factories/domains/daily-report';

import { Resource, Type as CommonType } from '../../../common';
import { DailyReportMedia } from '../../media';

export type Overrides =
  | (Partial<RawEntryMedia> & { resource: DailyReportIdentifier })
  | DailyReport;

export class FindResource extends Resource<CommonType, Overrides, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/daily-reports';
  private media: DailyReportMedia;
  private identifier: DailyReportIdentifier;

  public constructor(type: CommonType, overrides?: Overrides) {
    super(type, overrides ?? Builder.get(DailyReportFactory).build());

    this.media = new DailyReportMedia(this.overrides);
    this.identifier = this.createIdentifier(overrides);
  }

  public code(): string {
    return `${FindResource.CODE_PREFIX}/${this.overrides.identifier}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== 'GET') {
      return false;
    }

    if (!uri.startsWith(`/daily-reports/${this.identifier.value}`)) {
      return false;
    }

    return true;
  }

  public content(): string {
    return this.media.createSuccessfulContent();
  }

  protected createSuccessfulResponse(_: Request): Response {
    return new Response(this.content());
  }

  private createIdentifier(overrides?: Overrides): DailyReportIdentifier {
    if (overrides instanceof DailyReport) {
      return overrides.identifier;
    }

    return overrides?.resource ?? Builder.get(DailyReportIdentifierFactory).build();
  }
}
