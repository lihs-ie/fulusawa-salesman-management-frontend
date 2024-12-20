import { List } from 'immutable';
import { injectable } from 'inversify';

import { EntriesMedia } from 'acl/fsm-backend/common';
import { DateTimeRange } from 'domains/common';
import { CustomerIdentifier } from 'domains/customer';
import { asStatus, Content, RepeatFrequency, Schedule, ScheduleIdentifier } from 'domains/schedule';
import { asType } from 'domains/schedule/frequency';
import { UserIdentifier } from 'domains/user';

import { Translator as BaseTranslator, EntryMedia } from '../templates';

@injectable()
export class Translator extends BaseTranslator {
  public constructor() {
    super();
  }

  public translate(media: EntriesMedia<EntryMedia>): List<Schedule> {
    return media.entries.map((entry) => this.translateEntry(entry));
  }

  public translateEntry(media: EntryMedia): Schedule {
    return new Schedule(
      new ScheduleIdentifier(media.identifier),
      media.participants.map((participant) => new UserIdentifier(participant)),
      new UserIdentifier(media.creator),
      new UserIdentifier(media.updater),
      media.customer ? new CustomerIdentifier(media.customer) : null,
      new Content(media.content.title, media.content.description),
      new DateTimeRange(new Date(media.date.start), new Date(media.date.end)),
      asStatus(media.status),
      media.repeat ? new RepeatFrequency(asType(media.repeat.type), media.repeat.interval) : null
    );
  }
}
