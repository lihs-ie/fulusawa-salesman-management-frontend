import { List } from 'immutable';
import { injectable } from 'inversify';

import { HttpMethod } from 'aspects/http';
import { Visit, VisitIdentifier, Criteria } from 'domains/visit';

import { Adaptor as BaseAdaptor, Reader, Translator, Writer } from '../templates';

@injectable()
export class Adaptor extends BaseAdaptor {
  public constructor(endpoint: string, writer: Writer, reader: Reader, translator: Translator) {
    super(endpoint, writer, reader, translator);
  }

  public async add(visit: Visit): Promise<void> {
    const request = this.createPersistRequest(visit, { method: HttpMethod.POST });

    const response = await fetch(request);

    if (!response.ok) {
      this.handleErrorResponse(response);
    }
  }

  public async update(visit: Visit): Promise<void> {
    const request = this.createPersistRequest(visit, { method: HttpMethod.PUT });

    const response = await fetch(request);

    if (!response.ok) {
      this.handleErrorResponse(response);
    }
  }

  public async find(identifier: VisitIdentifier): Promise<Visit> {
    const request = this.createIdentifierRequest(identifier, HttpMethod.GET);

    const response = await fetch(request);

    if (!response.ok) {
      this.handleErrorResponse(response);
    }

    const content = await response.text();

    const media = this.reader.readEntry(content);

    return this.translator.translateEntry(media);
  }

  public async list(criteria: Criteria): Promise<List<Visit>> {
    const request = this.createListRequest(criteria);

    const response = await fetch(request);

    if (!response.ok) {
      this.handleErrorResponse(response);
    }

    const content = await response.text();

    const media = this.reader.read(content);

    return this.translator.translate(media);
  }

  public async delete(identifier: VisitIdentifier): Promise<void> {
    const request = this.createIdentifierRequest(identifier, HttpMethod.DELETE);

    const response = await fetch(request);

    if (!response.ok) {
      this.handleErrorResponse(response);
    }
  }
}
