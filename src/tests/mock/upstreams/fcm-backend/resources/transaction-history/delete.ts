import { Status } from 'aspects/http';
import { TransactionHistoryIdentifier } from 'domains/transaction-history';
import { Builder } from 'tests/factories';
import { TransactionHistoryIdentifierFactory } from 'tests/factories/domains/transaction-history';
import { Resource, Type as CommonType } from 'tests/mock/upstreams/common';

export type Overrides = TransactionHistoryIdentifier;

export class DeleteResource extends Resource<CommonType, Overrides, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/transaction-histories/delete';

  public constructor(type: CommonType, overrides?: Overrides) {
    super(type, overrides ?? Builder.get(TransactionHistoryIdentifierFactory).build());
  }

  public code(): string {
    return `${DeleteResource.CODE_PREFIX}/${this.overrides.value}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== 'DELETE') {
      return false;
    }

    if (!uri.startsWith(`/transaction-histories/${this.overrides.value}`)) {
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
