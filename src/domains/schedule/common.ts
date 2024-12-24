import { List, Map, Set } from 'immutable';

import { DateTimeRange, UniversallyUniqueIdentifier, ValueObject } from 'domains/common';
import { CustomerIdentifier } from 'domains/customer';
import { UserIdentifier } from 'domains/user';

import { Criteria } from './criteria';
import { RepeatFrequency } from './frequency';

export class ScheduleIdentifier extends UniversallyUniqueIdentifier {
  public constructor(value: string) {
    super(value);
  }
}

export const Status = {
  IN_COMPLETE: 'IN_COMPLETE',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export const isStatus = (value: unknown): value is Status => {
  const candidates = Set(Object.values(Status));

  return candidates.has(value as Status);
};

export const asStatus = (value: unknown): Status => {
  if (isStatus(value)) {
    return value;
  }

  throw new Error(`Status ${value} is not supported.`);
};

export class Content extends ValueObject {
  public static readonly MAX_TITLE_LENGTH = 255;

  public static readonly MAX_DESCRIPTION_LENGTH = 1000;

  public constructor(
    public readonly title: string,
    public readonly description: string | null
  ) {
    if (title === '' || Content.MAX_TITLE_LENGTH < title.length) {
      throw new Error(`Title must be 1 to ${Content.MAX_TITLE_LENGTH} characters.`);
    }

    if (
      description !== null &&
      (description === '' || Content.MAX_DESCRIPTION_LENGTH < description.length)
    ) {
      throw new Error(`Description must be 1 to ${Content.MAX_DESCRIPTION_LENGTH} characters.`);
    }

    super();
  }

  protected properties(): Map<string, unknown> {
    return Map({
      title: this.title,
      description: this.description,
    });
  }
}

export class Schedule {
  public static readonly MAX_PARTICIPANTS = 10;

  public constructor(
    public readonly identifier: ScheduleIdentifier,
    public readonly participants: Set<UserIdentifier>,
    public readonly creator: UserIdentifier,
    public readonly updater: UserIdentifier,
    public readonly customer: CustomerIdentifier | null,
    public readonly content: Content,
    public readonly date: DateTimeRange,
    public readonly status: Status,
    public readonly repeat: RepeatFrequency | null
  ) {
    if (participants.isEmpty()) {
      throw new Error('Participants must not be empty.');
    }

    if (Schedule.MAX_PARTICIPANTS < participants.count()) {
      throw new Error(`Participants must be 1 to ${Schedule.MAX_PARTICIPANTS}.`);
    }
  }
}

export abstract class Repository {
  public abstract add(schedule: Schedule): Promise<void>;

  public abstract update(schedule: Schedule): Promise<void>;

  public abstract find(identifier: ScheduleIdentifier): Promise<Schedule>;

  public abstract list(criteria: Criteria): Promise<List<Schedule>>;

  public abstract delete(identifier: ScheduleIdentifier): Promise<void>;
}
