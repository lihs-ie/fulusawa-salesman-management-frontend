import { Status } from 'aspects/http';
import { ScheduleIdentifier } from 'domains/schedule';
import { Builder } from 'tests/factories';
import { ScheduleIdentifierFactory } from 'tests/factories/domains/schedule';
import { Resource, Type as CommonType } from 'tests/mock/upstreams/common';

export type Overrides = ScheduleIdentifier;

export class DeleteResource extends Resource<CommonType, Overrides, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/schedules/delete';

  public constructor(type: CommonType, overrides?: Overrides) {
    super(type, overrides ?? Builder.get(ScheduleIdentifierFactory).build());
  }

  public code(): string {
    return `${DeleteResource.CODE_PREFIX}/${this.overrides.value}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== 'DELETE') {
      return false;
    }

    if (!uri.startsWith(`/schedules/${this.overrides.value}`)) {
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
