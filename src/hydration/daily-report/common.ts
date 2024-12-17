import { z } from 'zod';

import { DailyReport, DailyReportIdentifier } from 'domains/daily-report';
import { ListHydrator } from 'hydration/collection';
import { asPayload, Hydrator } from 'hydration/common';
import {
  UniversallyUniqueIdentifierHydrator,
  universallyUniqueIdentifierSchema,
} from 'hydration/common/identifier';
import { ScheduleIdentifierHydrator, scheduleIdentifierSchema } from 'hydration/schedule/common';
import { UserIdentifierHydrator, userIdentifierSchema } from 'hydration/user';
import { VisitIdentifierHydrator, visitIdentifierSchema } from 'hydration/visit';

export const dailyReportIdentifierSchema = universallyUniqueIdentifierSchema.brand(
  'DailyReportIdentifierSchema'
);

export type DailyReportIdentifierPayload = z.infer<typeof dailyReportIdentifierSchema>;

export const DailyReportIdentifierHydrator = UniversallyUniqueIdentifierHydrator<
  DailyReportIdentifier,
  DailyReportIdentifierPayload
>(DailyReportIdentifier);

export const dailyReportSchema = z
  .object({
    identifier: dailyReportIdentifierSchema,
    user: userIdentifierSchema,
    date: z.string().date(),
    schedules: z.array(scheduleIdentifierSchema),
    visits: z.array(visitIdentifierSchema),
    isSubmitted: z.boolean(),
  })
  .brand('DailyReportSchema');

export type DailyReportPayload = z.infer<typeof dailyReportSchema>;

export const DailyReportHydrator: Hydrator<DailyReport, DailyReportPayload> = {
  hydrate: (value) =>
    new DailyReport(
      DailyReportIdentifierHydrator.hydrate(value.identifier),
      UserIdentifierHydrator.hydrate(value.user),
      new Date(value.date),
      ListHydrator(ScheduleIdentifierHydrator).hydrate(value.schedules),
      ListHydrator(VisitIdentifierHydrator).hydrate(value.visits),
      value.isSubmitted
    ),

  dehydrate: (value) =>
    ({
      identifier: DailyReportIdentifierHydrator.dehydrate(value.identifier),
      user: UserIdentifierHydrator.dehydrate(value.user),
      date: value.date.toISOString(),
      schedules: ListHydrator(ScheduleIdentifierHydrator).dehydrate(value.schedules),
      visits: ListHydrator(VisitIdentifierHydrator).dehydrate(value.visits),
      isSubmitted: value.isSubmitted,
    }) as DailyReportPayload,

  asPayload: (value) => asPayload(value, dailyReportSchema),
};
