import { RawEntryMedia } from 'acl/fsm-backend/schedule/templates';
import { Schedule, ScheduleIdentifier } from 'domains/schedule';
import { Builder } from 'tests/factories';
import { ScheduleFactory, ScheduleIdentifierFactory } from 'tests/factories/domains/schedule';

import { Resource, Type as CommonType } from '../../../common';
import { ScheduleMedia } from '../../media';

export type Overrides = (Partial<RawEntryMedia> & { resource: ScheduleIdentifier }) | Schedule;

export class FindResource extends Resource<CommonType, Overrides, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/schedules';
  private media: ScheduleMedia;
  private identifier: ScheduleIdentifier;

  public constructor(type: CommonType, overrides?: Overrides) {
    super(type, overrides ?? Builder.get(ScheduleFactory).build());

    this.media = new ScheduleMedia(this.overrides);
    this.identifier = this.createIdentifier(overrides);
  }

  public code(): string {
    return `${FindResource.CODE_PREFIX}/${this.overrides.identifier}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== 'GET') {
      return false;
    }

    if (!uri.startsWith(`/schedules/${this.identifier.value}`)) {
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

  private createIdentifier(overrides?: Overrides): ScheduleIdentifier {
    if (overrides instanceof Schedule) {
      return overrides.identifier;
    }

    return overrides?.resource ?? Builder.get(ScheduleIdentifierFactory).build();
  }
}
