import { Body } from 'acl/fsm-backend/user/delegate';
import { HttpMethod, Status } from 'aspects/http';
import { User } from 'domains/user';
import { Builder } from 'tests/factories';
import { UserFactory } from 'tests/factories/domains/user';
import { Resource, Type as CommonType } from 'tests/mock/upstreams/common';

import { matchAddress, matchPhoneNumber } from '../helper';

export type Overrides = User;

export class PersistResource extends Resource<CommonType, User, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/users';

  public constructor(
    type: CommonType,
    private readonly method: HttpMethod,
    overrides?: Overrides
  ) {
    super(type, overrides ?? Builder.get(UserFactory).build());
  }

  public code(): string {
    return `${PersistResource.CODE_PREFIX}/${this.method}/${this.overrides.identifier}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== this.method) {
      return false;
    }

    if (!uri.startsWith(`/users`)) {
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

    if (body.name.first !== this.overrides.firstName) {
      return false;
    }

    if (body.name.last !== this.overrides.lastName) {
      return false;
    }

    if (!matchAddress(this.overrides.address, body.address)) {
      return false;
    }

    if (!matchPhoneNumber(this.overrides.phone, body.phone)) {
      return false;
    }

    if (body.email !== this.overrides.email.toString()) {
      return false;
    }

    if (body.role !== this.overrides.role) {
      return false;
    }

    return true;
  }
}
