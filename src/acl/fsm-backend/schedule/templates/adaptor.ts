import { List } from 'immutable';
import { injectable } from 'inversify';

import { AbstractAdaptor } from 'acl/fsm-backend/common';
import { HttpMethod } from 'aspects/http';
import { Schedule, ScheduleIdentifier, Criteria } from 'domains/schedule';

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

  public abstract add(schedule: Schedule): Promise<void>;

  public abstract update(schedule: Schedule): Promise<void>;

  public abstract find(identifier: ScheduleIdentifier): Promise<Schedule>;

  public abstract list(criteria: Criteria): Promise<List<Schedule>>;

  public abstract delete(identifier: ScheduleIdentifier): Promise<void>;

  protected createIdentifierRequest(identifier: ScheduleIdentifier, method: HttpMethod): Request {
    return new Request(`${this.endpoint}/schedules/${identifier.value}`, { method });
  }

  protected createPersistRequest(schedule: Schedule, options: RequestInit): Request {
    const endpoint =
      options.method === HttpMethod.POST
        ? `${this.endpoint}/schedules`
        : `${this.endpoint}/schedules/${schedule.identifier.value}`;

    return new Request(endpoint, {
      ...options,
      body: this.writer.write(schedule),
    });
  }

  protected createListRequest(criteria: Criteria): Request {
    const query = new URLSearchParams();

    if (criteria.date) {
      query.set(
        'date',
        JSON.stringify({
          start: criteria.date.min?.toISOString() ?? null,
          end: criteria.date.max?.toISOString() ?? null,
        })
      );
    }

    if (criteria.title) {
      query.set('title', criteria.title);
    }

    if (criteria.status) {
      query.set('status', criteria.status);
    }

    if (criteria.user) {
      query.set('user', criteria.user.value);
    }

    return new Request(`${this.endpoint}/schedules?${query.toString()}`);
  }
}
