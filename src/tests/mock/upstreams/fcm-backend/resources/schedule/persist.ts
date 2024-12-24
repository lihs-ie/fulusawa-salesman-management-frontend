import { Set } from 'immutable';

import { Body } from 'acl/fsm-backend/schedule/delegate';
import { HttpMethod, Status } from 'aspects/http';
import { Schedule } from 'domains/schedule';
import { Builder } from 'tests/factories';
import { ScheduleFactory } from 'tests/factories/domains/schedule';
import { Resource, Type as CommonType } from 'tests/mock/upstreams/common';

export type Overrides = Schedule;

export class PersistResource extends Resource<CommonType, Schedule, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/schedules';

  public constructor(
    type: CommonType,
    private readonly method: HttpMethod,
    overrides?: Overrides
  ) {
    super(type, overrides ?? Builder.get(ScheduleFactory).build());
  }

  public code(): string {
    return `${PersistResource.CODE_PREFIX}/${this.method}/${this.overrides.identifier}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== this.method) {
      return false;
    }

    if (!uri.startsWith(`/schedules`)) {
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

    if (this.overrides.participants.count() !== body.participants.length) {
      return false;
    }

    if (
      !this.overrides.participants
        .map((participant) => participant.value)
        .equals(Set(body.participants))
    ) {
      return false;
    }

    if (this.overrides.creator.value !== body.creator) {
      return false;
    }

    if (this.overrides.updater.value !== body.updater) {
      return false;
    }

    if ((this.overrides.customer?.value ?? null) !== body.customer) {
      return false;
    }

    if (this.overrides.content.title !== body.content.title) {
      return false;
    }

    if (this.overrides.content.description !== body.content.description) {
      return false;
    }

    if (this.overrides.date.min!.toISOString() !== body.date.start) {
      return false;
    }

    if (this.overrides.date.max!.toISOString() !== body.date.end) {
      return false;
    }

    if (this.overrides.status !== body.status) {
      return false;
    }

    if (this.overrides.repeat) {
      if (this.overrides.repeat.type !== body.repeat?.type) {
        return false;
      }

      if (this.overrides.repeat.interval !== body.repeat?.interval) {
        return false;
      }
    } else {
      if (body.repeat) {
        return false;
      }
    }

    return true;
  }
}
