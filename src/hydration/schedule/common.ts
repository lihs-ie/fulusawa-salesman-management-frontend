import { z } from 'zod';

import { Content, Schedule, ScheduleIdentifier, Status } from 'domains/schedule';
import { SetHydrator } from 'hydration/collection';
import { asPayload, Hydrator, OptionalHydrator } from 'hydration/common';
import { DateTimeRangeHydrator, dateTimeRangeSchema } from 'hydration/common/date';
import {
  UniversallyUniqueIdentifierHydrator,
  universallyUniqueIdentifierSchema,
} from 'hydration/common/identifier';
import { CustomerIdentifierHydrator, customerIdentifierSchema } from 'hydration/customer';
import { UserIdentifierHydrator, userIdentifierSchema } from 'hydration/user';

import { RepeatFrequencyHydrator, repeatFrequencySchema } from './frequency';

export const scheduleIdentifierSchema = universallyUniqueIdentifierSchema.brand(
  'ScheduleIdentifierSchema'
);

export type ScheduleIdentifierPayload = z.infer<typeof scheduleIdentifierSchema>;

export const ScheduleIdentifierHydrator = UniversallyUniqueIdentifierHydrator<
  ScheduleIdentifier,
  ScheduleIdentifierPayload
>(ScheduleIdentifier);

export const statusSchema = z.nativeEnum(Status).brand('StatusSchema');

export type StatusPayload = z.infer<typeof statusSchema>;

export const contentSchema = z
  .object({
    title: z.string().min(1).max(Content.MAX_TITLE_LENGTH),
    description: z.string().min(1).max(Content.MAX_DESCRIPTION_LENGTH).nullable(),
  })
  .brand('ContentSchema');

export type ContentPayload = z.infer<typeof contentSchema>;

export const ContentHydrator: Hydrator<Content, ContentPayload> = {
  hydrate: (value) => new Content(value.title, value.description),

  dehydrate: (value) =>
    ({
      title: value.title,
      description: value.description,
    }) as ContentPayload,

  asPayload: (value) => asPayload(value, contentSchema),
};

export const scheduleSchema = z
  .object({
    identifier: scheduleIdentifierSchema,
    participants: z.array(userIdentifierSchema).max(10),
    creator: userIdentifierSchema,
    updater: userIdentifierSchema,
    customer: customerIdentifierSchema.nullable(),
    content: contentSchema,
    date: dateTimeRangeSchema,
    status: statusSchema,
    repeat: repeatFrequencySchema.nullable(),
  })
  .brand('ScheduleSchema');

export type SchedulePayload = z.infer<typeof scheduleSchema>;

export const ScheduleHydrator: Hydrator<Schedule, SchedulePayload> = {
  hydrate: (value) =>
    new Schedule(
      ScheduleIdentifierHydrator.hydrate(value.identifier),
      SetHydrator(UserIdentifierHydrator).hydrate(value.participants),
      UserIdentifierHydrator.hydrate(value.creator),
      UserIdentifierHydrator.hydrate(value.updater),
      OptionalHydrator(CustomerIdentifierHydrator).hydrate(value.customer),
      ContentHydrator.hydrate(value.content),
      DateTimeRangeHydrator.hydrate(value.date),
      value.status,
      OptionalHydrator(RepeatFrequencyHydrator).hydrate(value.repeat)
    ),

  dehydrate: (value) =>
    ({
      identifier: ScheduleIdentifierHydrator.dehydrate(value.identifier),
      participants: SetHydrator(UserIdentifierHydrator).dehydrate(value.participants),
      creator: UserIdentifierHydrator.dehydrate(value.creator),
      updater: UserIdentifierHydrator.dehydrate(value.updater),
      customer: OptionalHydrator(CustomerIdentifierHydrator).dehydrate(value.customer),
      content: ContentHydrator.dehydrate(value.content),
      date: DateTimeRangeHydrator.dehydrate(value.date),
      status: value.status,
      repeat: OptionalHydrator(RepeatFrequencyHydrator).dehydrate(value.repeat),
    }) as SchedulePayload,

  asPayload: (value) => asPayload(value, scheduleSchema),
};
