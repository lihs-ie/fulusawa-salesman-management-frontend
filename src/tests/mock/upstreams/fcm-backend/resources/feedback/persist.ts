import { Body } from 'acl/fsm-backend/feedback/delegate';
import { HttpMethod, Status } from 'aspects/http';
import { Feedback } from 'domains/feedback';
import { Builder } from 'tests/factories';
import { FeedbackFactory } from 'tests/factories/domains/feedback';
import { Resource, Type as CommonType } from 'tests/mock/upstreams/common';

export type Overrides = Feedback;

export class PersistResource extends Resource<CommonType, Feedback, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/feedbacks';

  public constructor(
    type: CommonType,
    private readonly method: HttpMethod,
    overrides?: Overrides
  ) {
    super(type, overrides ?? Builder.get(FeedbackFactory).build());
  }

  public code(): string {
    return `${PersistResource.CODE_PREFIX}/${this.method}/${this.overrides.identifier}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== this.method) {
      return false;
    }

    if (!uri.startsWith(`/feedbacks`)) {
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

    if (this.overrides.type !== body.type) {
      return false;
    }

    if (this.overrides.status !== body.status) {
      return false;
    }

    if (this.overrides.content !== body.content) {
      return false;
    }

    if (this.overrides.createdAt.toISOString() !== body.createdAt) {
      return false;
    }

    if (this.overrides.updatedAt.toISOString() !== body.updatedAt) {
      return false;
    }

    return true;
  }
}
