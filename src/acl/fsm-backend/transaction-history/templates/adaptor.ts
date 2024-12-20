import { List } from 'immutable';
import { injectable } from 'inversify';

import { AbstractAdaptor } from 'acl/fsm-backend/common';
import { HttpMethod } from 'aspects/http';
import {
  TransactionHistory,
  TransactionHistoryIdentifier,
  Criteria,
} from 'domains/transaction-history';

import { Reader, Writer } from './media-types';
import { Translator } from './translator';

@injectable()
export abstract class Adaptor extends AbstractAdaptor {
  public constructor(
    private readonly endpoint: string,
    private readonly writer: Writer,
    protected readonly reader: Reader,
    protected readonly translator: Translator
  ) {
    super();
  }

  public abstract add(transactionHistory: TransactionHistory): Promise<void>;

  public abstract update(transactionHistory: TransactionHistory): Promise<void>;

  public abstract find(identifier: TransactionHistoryIdentifier): Promise<TransactionHistory>;

  public abstract list(criteria: Criteria): Promise<List<TransactionHistory>>;

  public abstract delete(identifier: TransactionHistoryIdentifier): Promise<void>;

  protected createIdentifierRequest(
    identifier: TransactionHistoryIdentifier,
    method: HttpMethod
  ): Request {
    return new Request(`${this.endpoint}/transaction-histories/${identifier.value}`, { method });
  }

  protected createPersistRequest(
    transactionHistory: TransactionHistory,
    options: RequestInit
  ): Request {
    const endpoint =
      options.method === HttpMethod.POST
        ? `${this.endpoint}/transaction-histories`
        : `${this.endpoint}/transaction-histories/${transactionHistory.identifier.value}`;

    return new Request(endpoint, {
      ...options,
      body: this.writer.write(transactionHistory),
    });
  }

  protected createListRequest(criteria: Criteria): Request {
    const query = new URLSearchParams();

    if (criteria.user) {
      query.set('user', criteria.user.value);
    }

    if (criteria.customer) {
      query.set('customer', criteria.customer.value);
    }

    if (criteria.sort) {
      query.set('sort', criteria.sort);
    }

    return new Request(`${this.endpoint}/transaction-histories?${query.toString()}`);
  }
}
