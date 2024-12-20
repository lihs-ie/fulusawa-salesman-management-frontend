import { List } from 'immutable';
import { injectable } from 'inversify';

import { HttpMethod } from 'aspects/http';
import { User, UserIdentifier } from 'domains/user';

import { Adaptor as BaseAdaptor, Reader, Translator, Writer } from '../templates';

@injectable()
export class Adaptor extends BaseAdaptor {
  public constructor(endpoint: string, writer: Writer, reader: Reader, translator: Translator) {
    super(endpoint, writer, reader, translator);
  }

  public async add(user: User): Promise<void> {
    const request = this.createPersistRequest(user, { method: HttpMethod.POST });

    const response = await fetch(request);

    if (!response.ok) {
      this.handleErrorResponse(response);
    }
  }

  public async update(user: User): Promise<void> {
    const request = this.createPersistRequest(user, { method: HttpMethod.PUT });

    const response = await fetch(request);

    if (!response.ok) {
      this.handleErrorResponse(response);
    }
  }

  public async find(identifier: UserIdentifier): Promise<User> {
    const request = this.createIdentifierRequest(identifier, HttpMethod.GET);

    const response = await fetch(request);

    if (!response.ok) {
      this.handleErrorResponse(response);
    }

    const content = await response.text();

    const media = this.reader.readEntry(content);

    return this.translator.translateEntry(media);
  }

  public async list(): Promise<List<User>> {
    const request = this.createListRequest();

    const response = await fetch(request);

    if (!response.ok) {
      this.handleErrorResponse(response);
    }

    const content = await response.text();

    const media = this.reader.read(content);

    return this.translator.translate(media);
  }

  public async delete(identifier: UserIdentifier): Promise<void> {
    const request = this.createIdentifierRequest(identifier, HttpMethod.DELETE);

    const response = await fetch(request);

    if (!response.ok) {
      this.handleErrorResponse(response);
    }
  }
}
