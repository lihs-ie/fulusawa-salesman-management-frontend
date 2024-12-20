import { Body } from 'acl/fsm-backend/visit/delegate';
import { HttpMethod, Status } from 'aspects/http';
import { Visit } from 'domains/visit';
import { Builder } from 'tests/factories';
import { VisitFactory } from 'tests/factories/domains/visit';
import { Resource, Type as CommonType } from 'tests/mock/upstreams/common';

import { matchAddress, matchPhoneNumber } from '../helper';

export type Overrides = Visit;

export class PersistResource extends Resource<CommonType, Visit, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/visits';

  public constructor(
    type: CommonType,
    private readonly method: HttpMethod,
    overrides?: Overrides
  ) {
    super(type, overrides ?? Builder.get(VisitFactory).build());
  }

  public code(): string {
    return `${PersistResource.CODE_PREFIX}/${this.method}/${this.overrides.identifier}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== this.method) {
      return false;
    }

    if (!uri.startsWith(`/visits`)) {
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

    if (body.identifier !== this.overrides.identifier.value) {
      return false;
    }

    if (body.user !== this.overrides.user.value) {
      return false;
    }

    if (body.visitedAt !== this.overrides.visitedAt.toISOString()) {
      return false;
    }

    if (!matchAddress(this.overrides.address, body.address)) {
      return false;
    }

    if (this.overrides.phone) {
      if (!body.phone) {
        return false;
      }

      if (!matchPhoneNumber(this.overrides.phone, body.phone)) {
        return false;
      }
    } else {
      if (body.phone) {
        return false;
      }
    }

    if (body.hasGraveyard !== this.overrides.hasGraveyard) {
      return false;
    }

    if (body.note !== this.overrides.note) {
      return false;
    }

    if (body.result !== this.overrides.result) {
      return false;
    }

    return true;
  }
}
