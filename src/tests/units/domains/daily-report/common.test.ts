import { DailyReport, DailyReportIdentifier } from 'domains/daily-report';
import { Builder } from 'tests/factories';
import { DailyReportIdentifierFactory } from 'tests/factories/domains/daily-report';
import { ScheduleIdentifierFactory } from 'tests/factories/domains/schedule';
import { UserIdentifierFactory } from 'tests/factories/domains/user';
import { VisitIdentifierFactory } from 'tests/factories/domains/visit';

import { UniversallyUniqueIdentifierTest } from '../common/identifier';

describe('Package common', () => {
  describe('Class VisitIdentifier', () => {
    UniversallyUniqueIdentifierTest(DailyReportIdentifier);
  });

  describe('Class DailyReport', () => {
    type Properties = ConstructorParameters<typeof DailyReport>;

    const generator = (): Properties => [
      Builder.get(DailyReportIdentifierFactory).build(),
      Builder.get(UserIdentifierFactory).build(),
      new Date(),
      Builder.get(ScheduleIdentifierFactory).buildList(10),
      Builder.get(VisitIdentifierFactory).buildList(10),
      Math.random() < 0.5,
    ];

    describe('instantiate', () => {
      it('success', () => {
        const props = generator();

        const instance = new DailyReport(...props);

        expect(instance).toBeInstanceOf(DailyReport);
        expect(instance.identifier).toEqualValueObject(props[0]);
        expect(instance.user).toEqualValueObject(props[1]);
        expect(instance.date).toBe(props[2]);
        expect(instance.schedules.count()).toBe(props[3].count());
        props[3]
          .zip(instance.schedules)
          .forEach(([expectedSchedule, actualSchedule]) =>
            expect(actualSchedule).toEqualValueObject(expectedSchedule)
          );
        expect(instance.visits.count()).toBe(props[4].count());
        props[4]
          .zip(instance.visits)
          .forEach(([expectedVisit, actualVisit]) =>
            expect(actualVisit).toEqualValueObject(expectedVisit)
          );
        expect(instance.isSubmitted).toBe(props[5]);
      });
    });
  });
});
