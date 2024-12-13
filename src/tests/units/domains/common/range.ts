import { Range } from 'domains/common/range';
import { ValueObjectTest } from 'tests/units/domains/common/value-object';

export const RangeTest = <T extends Range<U>, U>(
  initializer: new (min: U | null, max: U | null) => T,
  generator: () => { min: U | null; max: U | null },
  decrementer: (value: U) => U,
  incrementer: (value: U) => U
) => {
  describe('Package range', () => {
    describe('includes', () => {
      const props = generator();

      it.each([
        {},
        { min: incrementer(props.min!) },
        { max: decrementer(props.max!) },
        { min: incrementer(props.min!), max: decrementer(props.max!) },
      ])('returns true with included range.', (modifier) => {
        const comparand = { ...props, ...modifier };

        const instance1 = new initializer(props.min, props.max);
        const instance2 = new initializer(comparand.min, comparand.max);

        expect(instance1.includes(instance2)).toBe(true);
      });

      it.each([
        { min: decrementer(props.min!) },
        { max: incrementer(props.max!) },
        { min: decrementer(props.min!), max: incrementer(props.max!) },
      ])('returns false with not included range.', (modifier) => {
        const comparand = { ...props, ...modifier };

        const instance1 = new initializer(props.min, props.max);
        const instance2 = new initializer(comparand.min, comparand.max);

        expect(instance1.includes(instance2)).toBe(false);
      });
    });

    describe('isGreaterThan', () => {
      const props = generator();

      it('returns true with less range.', () => {
        const lessRange = {
          min: decrementer(props.min!),
          max: props.min,
        };

        const instance1 = new initializer(lessRange.min, lessRange.max);
        const instance2 = new initializer(props.min, props.max);

        expect(instance1.isGreaterThan(instance2)).toBe(true);
      });
    });

    describe('isLessThan', () => {
      const props = generator();

      it('returns true with greater range.', () => {
        const greaterRange = {
          min: props.max,
          max: incrementer(props.max!),
        };

        const instance1 = new initializer(greaterRange.min, greaterRange.max);
        const instance2 = new initializer(props.min, props.max);

        expect(instance1.isLessThan(instance2)).toBe(true);
      });
    });

    ValueObjectTest(
      initializer,
      (): [min: U | null, max: U | null] => {
        const props = generator();

        return [props.min, props.max];
      },
      ([min, max]): [U, U][] => [
        [decrementer(min!), decrementer(max!)],
        [incrementer(min!), incrementer(max!)],
      ]
    );
  });
};
