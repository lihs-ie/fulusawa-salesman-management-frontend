import { List } from 'immutable';
import { injectable } from 'inversify';

import { AbstractAdaptor } from 'acl/fsm-backend/common';
import { HttpMethod } from 'aspects/http';
import { User, UserIdentifier } from 'domains/user';

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

  public abstract add(user: User): Promise<void>;

  public abstract update(user: User): Promise<void>;

  public abstract find(identifier: UserIdentifier): Promise<User>;

  public abstract list(): Promise<List<User>>;

  public abstract delete(identifier: UserIdentifier): Promise<void>;

  protected createIdentifierRequest(identifier: UserIdentifier, method: HttpMethod): Request {
    return new Request(`${this.endpoint}/users/${identifier.value}`, { method });
  }

  protected createPersistRequest(user: User, options: RequestInit): Request {
    const endpoint =
      options.method === HttpMethod.POST
        ? `${this.endpoint}/users`
        : `${this.endpoint}/users/${user.identifier.value}`;

    return new Request(endpoint, {
      ...options,
      body: this.writer.write(user),
    });
  }

  protected createListRequest(): Request {
    return new Request(`${this.endpoint}/users`);
  }
}
