import { RawEntryMedia } from 'acl/fsm-backend/transaction-history/templates';
import { TransactionHistory, TransactionHistoryIdentifier } from 'domains/transaction-history';
import { Builder } from 'tests/factories';
import {
  TransactionHistoryFactory,
  TransactionHistoryIdentifierFactory,
} from 'tests/factories/domains/transaction-history';

import { Resource, Type as CommonType } from '../../../common';
import { TransactionHistoryMedia } from '../../media';

export type Overrides =
  | (Partial<RawEntryMedia> & { resource: TransactionHistoryIdentifier })
  | TransactionHistory;

export class FindResource extends Resource<CommonType, Overrides, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/transaction-histories';
  private media: TransactionHistoryMedia;
  private identifier: TransactionHistoryIdentifier;

  public constructor(type: CommonType, overrides?: Overrides) {
    super(type, overrides ?? Builder.get(TransactionHistoryFactory).build());

    this.media = new TransactionHistoryMedia(this.overrides);
    this.identifier = this.createIdentifier(overrides);
  }

  public code(): string {
    return `${FindResource.CODE_PREFIX}/${this.overrides.identifier}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== 'GET') {
      return false;
    }

    if (!uri.startsWith(`/transaction-histories/${this.identifier.value}`)) {
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

  private createIdentifier(overrides?: Overrides): TransactionHistoryIdentifier {
    if (overrides instanceof TransactionHistory) {
      return overrides.identifier;
    }

    return overrides?.resource ?? Builder.get(TransactionHistoryIdentifierFactory).build();
  }
}
