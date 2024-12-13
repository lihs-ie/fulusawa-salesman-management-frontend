import { Pager } from 'domains/common/pager';
import { ValueObjectTest } from 'tests/units/domains/common/value-object';

describe('Package pager', () => {
  describe('Class Pager', () => {
    type Properties = ConstructorParameters<typeof Pager>;

    const generator = (): Properties => [100, 10, 5];

    describe('instantiation', () => {
      it('success.', () => {
        const props = generator();
        const instance = new Pager(...props);

        expect(instance.total).toBe(props[0]);
        expect(instance.items).toBe(props[1]);
        expect(instance.current).toBe(props[2]);
      });

      describe('fails', () => {
        it('with negative total.', () => {
          expect(() => {
            new Pager(-1, 10, 5);
          }).toThrow();
        });

        it('with non-positive items.', () => {
          expect(() => {
            new Pager(100, 0, 5);
          }).toThrow();
        });

        it('with non-positive current.', () => {
          expect(() => {
            new Pager(100, 10, 0);
          }).toThrow();
        });
      });
    });

    it('offset is valid value.', () => {
      const instance = new Pager(100, 10, 10);

      expect(instance.offset()).toEqual(90);
    });

    describe('first', () => {
      it('is 1 when total is positive.', () => {
        const instance = new Pager(100, 10, 10);

        expect(instance.first()).toEqual(1);
      });

      it('when total is 0.', () => {
        const instance = new Pager(0, 10, 1);

        expect(instance.first()).toEqual(0);
      });
    });

    describe('last', () => {
      it.each([
        {
          total: 100,
          items: 10,
          current: 3,
          expected: 10,
        },
        {
          total: 10,
          items: 3,
          current: 1,
          expected: 4,
        },
      ])('is valid value.', (values) => {
        const instance = new Pager(values.total, values.items, values.current);

        expect(instance.last()).toEqual(values.expected);
      });

      it('when total is 0.', () => {
        const instance = new Pager(0, 10, 1);

        expect(instance.last()).toEqual(0);
      });
    });

    ValueObjectTest(
      Pager,
      generator,
      ([total, items, current]): Array<Properties> => [
        [Number.MAX_SAFE_INTEGER, items, current],
        [total, Number.MAX_SAFE_INTEGER, current],
        [total, items, Number.MAX_SAFE_INTEGER],
      ]
    );
  });
});
