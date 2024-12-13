import { FrequencyType, RepeatFrequency } from 'domains/schedule';
import { Builder } from 'tests/factories';
import { FrequencyTypeFactory } from 'tests/factories/domains/schedule';

describe('Package frequency', () => {
  describe('Class RepeatFrequency', () => {
    type Properties = ConstructorParameters<typeof RepeatFrequency>;

    const generator = (): Properties => [
      Builder.get(FrequencyTypeFactory).build(),
      Math.trunc(Math.random() * 10) + 1,
    ];

    describe('instantiate', () => {
      it('success.', () => {
        const props = generator();

        const instance = new RepeatFrequency(...props);

        expect(instance).toBeInstanceOf(RepeatFrequency);
        expect(instance.type).toBe(props[0]);
        expect(instance.interval).toBe(props[1]);
      });

      it.each([0, -1, 0.5])('fails with invalid interval %s.', (interval) => {
        expect(() => new RepeatFrequency(FrequencyType.DAILY, interval)).toThrow();
      });
    });

    describe('next', () => {
      const interval = 1;

      it.each<[type: FrequencyType, expected: Date]>([
        [FrequencyType.DAILY, new Date('2021-01-02')],
        [FrequencyType.WEEKLY, new Date('2021-01-08')],
        [FrequencyType.MONTHLY, new Date('2021-02-01')],
        [FrequencyType.YEARLY, new Date('2022-01-01')],
      ])('successfully return next date when %s.', (type, expected) => {
        const instance = new RepeatFrequency(type, interval);

        const base = new Date('2021-01-01');

        const actual = instance.next(base);

        expect(actual).toEqual(expected);
      });
    });
  });
});
