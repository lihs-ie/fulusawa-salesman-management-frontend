import { RawEntryMedia } from 'acl/fsm-backend/visit/templates';
import { Visit, VisitIdentifier } from 'domains/visit';
import { Builder } from 'tests/factories';
import { VisitFactory, VisitIdentifierFactory } from 'tests/factories/domains/visit';

import { Resource, Type as CommonType } from '../../../common';
import { VisitMedia } from '../../media';

export type Overrides = (Partial<RawEntryMedia> & { resource: VisitIdentifier }) | Visit;

export class FindResource extends Resource<CommonType, Overrides, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/visits';
  private media: VisitMedia;
  private identifier: VisitIdentifier;

  public constructor(type: CommonType, overrides?: Overrides) {
    super(type, overrides ?? Builder.get(VisitFactory).build());

    this.media = new VisitMedia(this.overrides);
    this.identifier = this.createIdentifier(overrides);
  }

  public code(): string {
    return `${FindResource.CODE_PREFIX}/${this.overrides.identifier}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== 'GET') {
      return false;
    }

    if (!uri.startsWith(`/visits/${this.identifier.value}`)) {
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

  private createIdentifier(overrides?: Overrides): VisitIdentifier {
    if (overrides instanceof Visit) {
      return overrides.identifier;
    }

    return overrides?.resource ?? Builder.get(VisitIdentifierFactory).build();
  }
}
