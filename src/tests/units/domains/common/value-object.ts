import { ValueObject } from 'domains/common/value-object';

export const ValueObjectTest = <T extends ValueObject, P extends any[]>(
  initializer: new (...args: P) => T,
  generator: () => P,
  variations: (...args: [P]) => P[]
) => {
  describe('Package value-object', () => {
    describe('equals', () => {
      it('returns true with same value.', () => {
        const props = generator();

        const instance1 = new initializer(...props);
        const instance2 = new initializer(...props);

        expect(instance1.equals(instance2)).toBe(true);
        expect(instance2.equals(instance1)).toBe(true);
      });

      it.each(variations(generator()))('returns false with different value.', (...variation) => {
        const props = generator();

        const instance1 = new initializer(...props);
        const instance2 = new initializer(...variation);

        expect(instance1).not.toEqual(instance2);
        expect(instance2).not.toEqual(instance1);
      });
    });

    describe('hashCode', () => {
      it('returns integer.', () => {
        const props = generator();
        const instance = new initializer(...props);

        expect(Number.isInteger(instance.hashCode())).toBe(true);
      });
    });
  });
};
