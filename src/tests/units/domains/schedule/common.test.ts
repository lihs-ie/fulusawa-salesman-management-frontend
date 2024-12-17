import { Set } from 'immutable';

import { Content, Schedule } from 'domains/schedule';
import { UserIdentifier } from 'domains/user';
import { Builder, StringFactory } from 'tests/factories';
import { DateTimeRangeFactory } from 'tests/factories/domains/common';
import { CustomerIdentifierFactory } from 'tests/factories/domains/customer';
import {
  ContentFactory,
  RepeatFrequencyFactory,
  ScheduleIdentifierFactory,
  StatusFactory,
} from 'tests/factories/domains/schedule';
import { UserIdentifierFactory } from 'tests/factories/domains/user';

import { ValueObjectTest } from '../common/value-object';

describe('Package common', () => {
  describe('Class Content', () => {
    type Properties = ConstructorParameters<typeof Content>;

    const generator = (): Properties => [
      Builder.get(StringFactory(1, Content.MAX_TITLE_LENGTH)).build(),
      Builder.get(StringFactory(1, Content.MAX_DESCRIPTION_LENGTH)).build(),
    ];

    describe('instantiate', () => {
      it('success.', () => {
        const props = generator();

        const instance = new Content(...props);

        expect(instance).toBeInstanceOf(Content);
        expect(instance.title).toBe(props[0]);
        expect(instance.description).toBe(props[1]);
      });

      it.each([
        { title: '' },
        { title: 'a'.repeat(Content.MAX_TITLE_LENGTH + 1) },
        { description: '' },
        { description: 'a'.repeat(Content.MAX_DESCRIPTION_LENGTH + 1) },
      ])(`fails with invalid properties %j.`, (invalid) => {
        const valids = generator();

        const props = {
          title: valids[0],
          description: valids[1],
          ...invalid,
        };

        expect(() => new Content(props.title, props.description)).toThrow();
      });
    });

    ValueObjectTest(Content, generator, ([title]): Array<Properties> => [[title, null]]);
  });

  describe('Class Schedule', () => {
    type Properties = ConstructorParameters<typeof Schedule>;

    const generator = (): Properties => [
      Builder.get(ScheduleIdentifierFactory).build(),
      Builder.get(UserIdentifierFactory).buildList(Schedule.MAX_PARTICIPANTS).toSet(),
      Builder.get(UserIdentifierFactory).build(),
      Builder.get(UserIdentifierFactory).build(),
      Builder.get(CustomerIdentifierFactory).build(),
      Builder.get(ContentFactory).build(),
      Builder.get(DateTimeRangeFactory).build(),
      Builder.get(StatusFactory).build(),
      Builder.get(RepeatFrequencyFactory).build(),
    ];

    describe('instantiate', () => {
      it('success.', () => {
        const props = generator();

        const instance = new Schedule(...props);

        expect(instance).toBeInstanceOf(Schedule);
        expect(instance.identifier).toEqualValueObject(props[0]);
        expect(instance.participants.equals(props[1])).toBeTruthy();
        expect(instance.creator).toEqualValueObject(props[2]);
        expect(instance.updater).toEqualValueObject(props[3]);
        expect(instance.customer).toBeNullOr(props[4], (expectedCustomer, actualCustomer) =>
          expect(expectedCustomer.equals(actualCustomer)).toBeTruthy()
        );
        expect(instance.content).toEqualValueObject(props[5]);
        expect(instance.date).toEqualValueObject(props[6]);
        expect(instance.status).toBe(props[7]);
        expect(instance.repeat).toBeNullOr(props[8], (expectedRepeat, actualRepeat) =>
          expect(expectedRepeat).toEqualValueObject(actualRepeat)
        );
      });

      it.each([
        { participants: Set<UserIdentifier>() },
        {
          participants: Builder.get(UserIdentifierFactory)
            .buildList(Schedule.MAX_PARTICIPANTS + 1)
            .toSet(),
        },
      ])(`fails with invalid properties %j.`, (invalid) => {
        const valids = generator();

        const props = {
          identifier: valids[0],
          creator: valids[2],
          updater: valids[3],
          customer: valids[4],
          content: valids[5],
          date: valids[6],
          status: valids[7],
          repeat: valids[8],
          ...invalid,
        };

        expect(
          () =>
            new Schedule(
              props.identifier,
              props.participants,
              props.creator,
              props.updater,
              props.customer,
              props.content,
              props.date,
              props.status,
              props.repeat
            )
        ).toThrow();
      });
    });
  });
});
