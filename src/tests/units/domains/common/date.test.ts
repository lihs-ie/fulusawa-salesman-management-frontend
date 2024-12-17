import { DateTimeRange } from 'domains/common/date';
import { RangeTest } from 'tests/units/domains/common/range';

describe('Package date', () => {
  describe('Class DateTimeRange', () => {
    const generator = () => {
      const min = new Date();
      const max = new Date(min.getTime() + 60 * 60 * 1000);

      return { min, max };
    };

    describe('instantiation', () => {
      it('success.', () => {
        const props = generator();
        const instance = new DateTimeRange(props.min, props.max);

        expect(instance.min).toBe(props.min);
        expect(instance.max).toBe(props.max);
      });

      it('fails when max is less than min.', () => {
        expect(() => {
          new DateTimeRange(new Date('2024-04-01T10:00:01'), new Date('2024-04-01T10:00:00'));
        }).toThrow();
      });
    });

    const decrementer = (value: Date) => new Date(value.getTime() - 1000);
    const incrementer = (value: Date) => new Date(value.getTime() + 1000);

    RangeTest(DateTimeRange, generator, decrementer, incrementer);
  });
});
