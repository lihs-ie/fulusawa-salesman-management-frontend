import { List } from 'immutable';
import { injectable } from 'inversify';

import { Adaptor } from 'acl/fsm-backend/user/templates';
import { Repository, User, UserIdentifier } from 'domains/user';

@injectable()
export class ACLUserRepository implements Repository {
  public constructor(public readonly adaptor: Adaptor) {}

  public async add(user: User): Promise<void> {
    return await this.adaptor.add(user);
  }

  public async update(user: User): Promise<void> {
    return await this.adaptor.update(user);
  }

  public async find(identifier: UserIdentifier): Promise<User> {
    return await this.adaptor.find(identifier);
  }

  public async list(): Promise<List<User>> {
    return await this.adaptor.list();
  }

  public async delete(identifier: UserIdentifier): Promise<void> {
    return await this.adaptor.delete(identifier);
  }
}
