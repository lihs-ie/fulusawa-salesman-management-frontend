import { List } from 'immutable';
import { injectable } from 'inversify';

import { AbstractAdaptor } from 'acl/fsm-backend/common';
import { HttpMethod } from 'aspects/http';
import { Cemetery, CemeteryIdentifier, Criteria } from 'domains/cemetery';

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

  public abstract add(cemetery: Cemetery): Promise<void>;

  public abstract update(cemetery: Cemetery): Promise<void>;

  public abstract find(identifier: CemeteryIdentifier): Promise<Cemetery>;

  public abstract list(criteria: Criteria): Promise<List<Cemetery>>;

  public abstract delete(identifier: CemeteryIdentifier): Promise<void>;

  protected createIdentifierRequest(identifier: CemeteryIdentifier, method: HttpMethod): Request {
    return new Request(`${this.endpoint}/cemeteries/${identifier.value}`, { method });
  }

  protected createPersistRequest(cemetery: Cemetery, options: RequestInit): Request {
    const endpoint =
      options.method === HttpMethod.POST
        ? `${this.endpoint}/cemeteries`
        : `${this.endpoint}/cemeteries/${cemetery.identifier.value}`;

    return new Request(endpoint, {
      ...options,
      body: this.writer.write(cemetery),
    });
  }

  protected createListRequest(criteria: Criteria): Request {
    const query = new URLSearchParams();

    if (criteria.customer !== null) {
      query.append('customer', criteria.customer.value);
    }

    return new Request(`${this.endpoint}/cemeteries?${query.toString()}`);
  }
}
