import { Body } from 'acl/fsm-backend/transaction-history/delegate';
import { HttpMethod, Status } from 'aspects/http';
import { TransactionHistory } from 'domains/transaction-history';
import { Builder } from 'tests/factories';
import { TransactionHistoryFactory } from 'tests/factories/domains/transaction-history';
import { Resource, Type as CommonType } from 'tests/mock/upstreams/common';

export type Overrides = TransactionHistory;

export class PersistResource extends Resource<CommonType, TransactionHistory, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/transaction-histories/persist';

  public constructor(
    type: CommonType,
    private readonly method: HttpMethod,
    overrides?: Overrides
  ) {
    super(type, overrides ?? Builder.get(TransactionHistoryFactory).build());
  }

  public code(): string {
    return `${PersistResource.CODE_PREFIX}/${this.method}/${this.overrides.identifier}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== this.method) {
      return false;
    }

    if (!uri.startsWith(`/transaction-histories`)) {
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

    if (this.overrides.user.value !== body.user) {
      return false;
    }

    if (this.overrides.date.toISOString() !== body.date) {
      return false;
    }

    if (this.overrides.type !== body.type) {
      return false;
    }

    if (this.overrides.description !== body.description) {
      return false;
    }

    return true;
  }
}
