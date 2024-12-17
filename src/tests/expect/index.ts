import { ValueObject } from 'domains/common';

export {};

expect.extend({
  toBeNullOr<T>(actual: T | null, expected: T | null, comparer?: (expected: T, actual: T) => void) {
    try {
      if (expected === null) {
        expect(actual).toBeNull();
      } else {
        if (comparer) {
          comparer(expected, actual!);
        } else {
          expect(actual).toBe(expected);
        }
      }

      return {
        message: () => 'OK',
        pass: true,
      };
    } catch (error) {
      return {
        message: () => (error as Error).message,
        pass: false,
      };
    }
  },
  toEqualValueObject<T extends ValueObject>(actual: T, expected: T) {
    try {
      expect(expected.equals(actual)).toBeTruthy();

      return {
        message: () => 'OK',
        pass: true,
      };
    } catch (error) {
      return {
        message: () => (error as Error).message,
        pass: false,
      };
    }
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeNullOr<T>(expected: T | null, comparer?: (expected: T, actual: T) => void): R;
      toEqualValueObject<T extends ValueObject>(expected: T): R;
    }
  }
}
