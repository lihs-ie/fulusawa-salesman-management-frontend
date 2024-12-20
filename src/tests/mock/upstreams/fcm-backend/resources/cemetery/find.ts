import { RawEntryMedia } from 'acl/fsm-backend/cemetery/templates';
import { Cemetery, CemeteryIdentifier } from 'domains/cemetery';
import { Builder } from 'tests/factories';
import { CemeteryFactory, CemeteryIdentifierFactory } from 'tests/factories/domains/cemetery';

import { Resource, Type as CommonType } from '../../../common';
import { CemeteryMedia } from '../../media';

export type Overrides = (Partial<RawEntryMedia> & { resource: CemeteryIdentifier }) | Cemetery;

export class FindResource extends Resource<CommonType, Overrides, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/cemeteries';
  private media: CemeteryMedia;
  private identifier: CemeteryIdentifier;

  public constructor(type: CommonType, overrides?: Overrides) {
    super(type, overrides ?? Builder.get(CemeteryFactory).build());

    this.media = new CemeteryMedia(this.overrides);
    this.identifier = this.createIdentifier(overrides);
  }

  public code(): string {
    return `${FindResource.CODE_PREFIX}/${this.overrides.identifier}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== 'GET') {
      return false;
    }

    if (!uri.startsWith(`/cemeteries/${this.identifier.value}`)) {
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

  private createIdentifier(overrides?: Overrides): CemeteryIdentifier {
    if (overrides instanceof Cemetery) {
      return overrides.identifier;
    }

    return overrides?.resource ?? Builder.get(CemeteryIdentifierFactory).build();
  }
}
