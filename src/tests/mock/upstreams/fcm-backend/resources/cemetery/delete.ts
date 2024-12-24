import { Status } from 'aspects/http';
import { CemeteryIdentifier } from 'domains/cemetery';
import { Builder } from 'tests/factories';
import { CemeteryIdentifierFactory } from 'tests/factories/domains/cemetery';

import { Resource, Type as CommonType } from '../../../common';

export type Overrides = CemeteryIdentifier;

export class DeleteResource extends Resource<CommonType, Overrides, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/cemeteries/delete';

  public constructor(type: CommonType, overrides?: Overrides) {
    super(type, overrides ?? Builder.get(CemeteryIdentifierFactory).build());
  }

  public code(): string {
    return `${DeleteResource.CODE_PREFIX}/${this.overrides.value}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== 'DELETE') {
      return false;
    }

    if (!uri.startsWith(`/cemeteries/${this.overrides.value}`)) {
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
