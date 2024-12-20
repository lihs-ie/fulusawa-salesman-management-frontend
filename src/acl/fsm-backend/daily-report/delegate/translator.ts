import { List } from 'immutable';
import { injectable } from 'inversify';

import { EntriesMedia } from 'acl/fsm-backend/common';
import { DailyReport, DailyReportIdentifier } from 'domains/daily-report';
import { ScheduleIdentifier } from 'domains/schedule';
import { UserIdentifier } from 'domains/user';
import { VisitIdentifier } from 'domains/visit';

import { Translator as BaseTranslator, EntryMedia } from '../templates';

@injectable()
export class Translator extends BaseTranslator {
  public constructor() {
    super();
  }

  public translate(media: EntriesMedia<EntryMedia>): List<DailyReport> {
    return media.entries.map((entry) => this.translateEntry(entry));
  }

  public translateEntry(media: EntryMedia): DailyReport {
    return new DailyReport(
      new DailyReportIdentifier(media.identifier),
      new UserIdentifier(media.user),
      media.date,
      media.schedules.map((schedule) => new ScheduleIdentifier(schedule)),
      media.visits.map((visit) => new VisitIdentifier(visit)),
      media.isSubmitted
    );
  }
}
