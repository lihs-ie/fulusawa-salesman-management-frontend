import { List } from 'immutable';
import { injectable } from 'inversify';

import { Adaptor } from 'acl/fsm-backend/cemetery/templates';
import { Cemetery, CemeteryIdentifier, Criteria, Repository } from 'domains/cemetery';

@injectable()
export class ACLCemeteryRepository implements Repository {
  public constructor(private readonly adaptor: Adaptor) {}

  public async add(cemetery: Cemetery): Promise<void> {
    await this.adaptor.add(cemetery);
  }

  public async update(cemetery: Cemetery): Promise<void> {
    await this.adaptor.update(cemetery);
  }

  public async find(identifier: CemeteryIdentifier): Promise<Cemetery> {
    return await this.adaptor.find(identifier);
  }

  public async list(criteria: Criteria): Promise<List<Cemetery>> {
    return await this.adaptor.list(criteria);
  }

  public async delete(identifier: CemeteryIdentifier): Promise<void> {
    await this.adaptor.delete(identifier);
  }
}
