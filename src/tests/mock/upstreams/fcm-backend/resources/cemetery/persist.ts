import { HttpMethod, Status } from 'aspects/http';
import { Cemetery } from 'domains/cemetery';
import { Builder } from 'tests/factories';
import { CemeteryFactory } from 'tests/factories/domains/cemetery';

import { Resource, Type as CommonType } from '../../../common';

export type Overrides = Cemetery;

type Body = {
  identifier: string;
  customer: string;
  name: string;
  type: string;
  construction: string;
  inHouse: boolean;
};

export class PersistResource extends Resource<CommonType, Cemetery, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/cemeteries';

  public constructor(
    type: CommonType,
    private readonly method: HttpMethod,
    overrides?: Overrides
  ) {
    super(type, overrides ?? Builder.get(CemeteryFactory).build());
  }

  public code(): string {
    return `${PersistResource.CODE_PREFIX}/${this.method}/${this.overrides.identifier}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== this.method) {
      return false;
    }

    if (!uri.startsWith(`/cemeteries`)) {
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

    if (this.overrides.customer.value !== body.customer) {
      return false;
    }

    if (this.overrides.name !== body.name) {
      return false;
    }

    if (this.overrides.type !== body.type) {
      return false;
    }

    if (this.overrides.construction.toISOString() !== body.construction) {
      return false;
    }

    if (this.overrides.inHouse !== body.inHouse) {
      return false;
    }

    return true;
  }
}
