import { Status } from 'aspects/http';
import { FeedbackIdentifier } from 'domains/feedback';
import { Builder } from 'tests/factories';
import { FeedbackIdentifierFactory } from 'tests/factories/domains/feedback';
import { Resource, Type as CommonType } from 'tests/mock/upstreams/common';

export type Overrides = FeedbackIdentifier;

export class DeleteResource extends Resource<CommonType, Overrides, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/feedbacks/delete';

  public constructor(type: CommonType, overrides?: Overrides) {
    super(type, overrides ?? Builder.get(FeedbackIdentifierFactory).build());
  }

  public code(): string {
    return `${DeleteResource.CODE_PREFIX}/${this.overrides.value}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== 'DELETE') {
      return false;
    }

    if (!uri.startsWith(`/feedbacks/${this.overrides.value}`)) {
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
