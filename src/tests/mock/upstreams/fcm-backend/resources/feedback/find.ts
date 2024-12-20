import { RawEntryMedia } from 'acl/fsm-backend/feedback/templates';
import { Feedback, FeedbackIdentifier } from 'domains/feedback';
import { Builder } from 'tests/factories';
import { FeedbackFactory, FeedbackIdentifierFactory } from 'tests/factories/domains/feedback';

import { Resource, Type as CommonType } from '../../../common';
import { FeedbackMedia } from '../../media';

export type Overrides = (Partial<RawEntryMedia> & { resource: FeedbackIdentifier }) | Feedback;

export class FindResource extends Resource<CommonType, Overrides, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/feedbacks';
  private media: FeedbackMedia;
  private identifier: FeedbackIdentifier;

  public constructor(type: CommonType, overrides?: Overrides) {
    super(type, overrides ?? Builder.get(FeedbackFactory).build());

    this.media = new FeedbackMedia(this.overrides);
    this.identifier = this.createIdentifier(overrides);
  }

  public code(): string {
    return `${FindResource.CODE_PREFIX}/${this.overrides.identifier}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== 'GET') {
      return false;
    }

    if (!uri.startsWith(`/feedbacks/${this.identifier.value}`)) {
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

  private createIdentifier(overrides?: Overrides): FeedbackIdentifier {
    if (overrides instanceof Feedback) {
      return overrides.identifier;
    }

    return overrides?.resource ?? Builder.get(FeedbackIdentifierFactory).build();
  }
}
