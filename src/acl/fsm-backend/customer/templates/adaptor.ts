import { List } from 'immutable';
import { injectable } from 'inversify';

import { AbstractAdaptor } from 'acl/fsm-backend/common';
import { HttpMethod } from 'aspects/http';
import { Customer, CustomerIdentifier, Criteria } from 'domains/customer';

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

  public abstract add(customer: Customer): Promise<void>;

  public abstract update(customer: Customer): Promise<void>;

  public abstract find(identifier: CustomerIdentifier): Promise<Customer>;

  public abstract list(criteria: Criteria): Promise<List<Customer>>;

  public abstract delete(identifier: CustomerIdentifier): Promise<void>;

  protected createIdentifierRequest(identifier: CustomerIdentifier, method: HttpMethod): Request {
    return new Request(`${this.endpoint}/customers/${identifier.value}`, { method });
  }

  protected createPersistRequest(customer: Customer, options: RequestInit): Request {
    const endpoint =
      options.method === HttpMethod.POST
        ? `${this.endpoint}/customers`
        : `${this.endpoint}/customers/${customer.identifier.value}`;

    return new Request(endpoint, {
      ...options,
      body: this.writer.write(customer),
    });
  }

  protected createListRequest(criteria: Criteria): Request {
    const query = new URLSearchParams();

    if (criteria.name !== null) {
      query.append('name', criteria.name);
    }

    if (criteria.postalCode !== null) {
      query.append(
        'postalCode',
        JSON.stringify({ first: criteria.postalCode.first, second: criteria.postalCode.second })
      );
    }

    if (criteria.phone !== null) {
      query.append(
        'phone',
        JSON.stringify({
          areaCode: criteria.phone.areaCode,
          localCode: criteria.phone.localCode,
          subscriberNumber: criteria.phone.subscriberNumber,
        })
      );
    }

    return new Request(`${this.endpoint}/customers?${query.toString()}`);
  }
}
