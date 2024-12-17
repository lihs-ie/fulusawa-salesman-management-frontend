import { List } from 'immutable';
import { injectable } from 'inversify';

import { Repository, User as Entity, UserIdentifier } from 'domains/user';
import { UserHydrator, UserPayload } from 'hydration/user';

@injectable()
export class User {
  public constructor(private readonly repository: Repository) {}

  public async add(payload: UserPayload): Promise<void> {
    const user = UserHydrator.hydrate(payload);

    await this.repository.add(user);
  }

  public async update(payload: UserPayload): Promise<void> {
    const user = UserHydrator.hydrate(payload);

    await this.repository.update(user);
  }

  public async find(identifier: string): Promise<Entity> {
    return this.repository.find(new UserIdentifier(identifier));
  }

  public async list(): Promise<List<Entity>> {
    return this.repository.list();
  }

  public async delete(identifier: string): Promise<void> {
    await this.repository.delete(new UserIdentifier(identifier));
  }
}
