import { List } from 'immutable';
import { injectable } from 'inversify';

import { AbstractAdaptor } from 'acl/fsm-backend/common';
import { HttpMethod } from 'aspects/http';
import { Visit, VisitIdentifier, Criteria } from 'domains/visit';

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

  public abstract add(visit: Visit): Promise<void>;

  public abstract update(visit: Visit): Promise<void>;

  public abstract find(identifier: VisitIdentifier): Promise<Visit>;

  public abstract list(criteria: Criteria): Promise<List<Visit>>;

  public abstract delete(identifier: VisitIdentifier): Promise<void>;

  protected createIdentifierRequest(identifier: VisitIdentifier, method: HttpMethod): Request {
    return new Request(`${this.endpoint}/visits/${identifier.value}`, { method });
  }

  protected createPersistRequest(visit: Visit, options: RequestInit): Request {
    const endpoint =
      options.method === HttpMethod.POST
        ? `${this.endpoint}/visits`
        : `${this.endpoint}/visits/${visit.identifier.value}`;

    return new Request(endpoint, {
      ...options,
      body: this.writer.write(visit),
    });
  }

  protected createListRequest(criteria: Criteria): Request {
    const query = new URLSearchParams();

    if (criteria.user) {
      query.set('user', criteria.user.value);
    }

    if (criteria.sort) {
      query.set('sort', criteria.sort);
    }

    return new Request(`${this.endpoint}/visits?${query.toString()}`);
  }
}
