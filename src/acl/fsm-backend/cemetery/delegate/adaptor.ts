import { List } from 'immutable';
import { injectable } from 'inversify';

import { HttpMethod } from 'aspects/http';
import { Cemetery, CemeteryIdentifier, Criteria } from 'domains/cemetery';

import { Adaptor as BaseAdaptor, Reader, Translator, Writer } from '../templates';

@injectable()
export class Adaptor extends BaseAdaptor {
  public constructor(endpoint: string, writer: Writer, reader: Reader, translator: Translator) {
    super(endpoint, writer, reader, translator);
  }

  public async add(cemetery: Cemetery): Promise<void> {
    const request = this.createPersistRequest(cemetery, { method: HttpMethod.POST });

    const response = await fetch(request);

    if (!response.ok) {
      this.handleErrorResponse(response);
    }
  }

  public async update(cemetery: Cemetery): Promise<void> {
    const request = this.createPersistRequest(cemetery, { method: HttpMethod.PUT });

    const response = await fetch(request);

    if (!response.ok) {
      this.handleErrorResponse(response);
    }
  }

  public async find(identifier: CemeteryIdentifier): Promise<Cemetery> {
    const request = this.createIdentifierRequest(identifier, HttpMethod.GET);

    const response = await fetch(request);

    if (!response.ok) {
      this.handleErrorResponse(response);
    }

    const content = await response.text();

    const media = this.reader.readEntry(content);

    return this.translator.translateEntry(media);
  }

  public async list(criteria: Criteria): Promise<List<Cemetery>> {
    const request = this.createListRequest(criteria);

    const response = await fetch(request);

    if (!response.ok) {
      this.handleErrorResponse(response);
    }

    const content = await response.text();

    const media = this.reader.read(content);

    return this.translator.translate(media);
  }

  public async delete(identifier: CemeteryIdentifier): Promise<void> {
    const request = this.createIdentifierRequest(identifier, HttpMethod.DELETE);

    const response = await fetch(request);

    if (!response.ok) {
      this.handleErrorResponse(response);
    }
  }
}
