import { List } from 'immutable';
import { injectable } from 'inversify';

import { AbstractAdaptor } from 'acl/fsm-backend/common';
import { HttpMethod } from 'aspects/http';
import { Feedback, FeedbackIdentifier, Criteria } from 'domains/feedback';

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

  public abstract add(feedback: Feedback): Promise<void>;

  public abstract update(feedback: Feedback): Promise<void>;

  public abstract find(identifier: FeedbackIdentifier): Promise<Feedback>;

  public abstract list(criteria: Criteria): Promise<List<Feedback>>;

  public abstract delete(identifier: FeedbackIdentifier): Promise<void>;

  protected createIdentifierRequest(identifier: FeedbackIdentifier, method: HttpMethod): Request {
    return new Request(`${this.endpoint}/feedbacks/${identifier.value}`, { method });
  }

  protected createPersistRequest(feedback: Feedback, options: RequestInit): Request {
    const endpoint =
      options.method === HttpMethod.POST
        ? `${this.endpoint}/feedbacks`
        : `${this.endpoint}/feedbacks/${feedback.identifier.value}`;

    return new Request(endpoint, {
      ...options,
      body: this.writer.write(feedback),
    });
  }

  protected createListRequest(criteria: Criteria): Request {
    const query = new URLSearchParams();

    if (criteria.type) {
      query.append('type', criteria.type);
    }

    if (criteria.status) {
      query.append('status', criteria.status);
    }

    if (criteria.sort) {
      query.append('sort', criteria.sort);
    }

    return new Request(`${this.endpoint}/feedbacks?${query.toString()}`);
  }
}
