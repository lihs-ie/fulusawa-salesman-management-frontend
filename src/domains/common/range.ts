import { Map } from 'immutable';

import { ValueObject } from './value-object';

export abstract class Range<T> extends ValueObject {
  public readonly min: T | null;
  public readonly max: T | null;

  public constructor(min: T | null, max: T | null) {
    super();

    if (min && max && min > max) {
      throw new Error(`Max ${String(min)} must be more than or equal to Min ${String(max)}.`);
    }

    this.min = min;
    this.max = max;

    if (!this.validate()) {
      throw new Error(`Range validation error.`);
    }
  }

  protected abstract validate(): boolean;

  public includes(comparand: Range<T>): boolean {
    return this.isGreaterThan(comparand) && this.isLessThan(comparand);
  }

  public isGreaterThan(comparand: Range<T>) {
    if (this.min === null || this.min === undefined) {
      return true;
    }

    if (comparand.min === null || comparand.min === undefined) {
      return true;
    }

    return this.min <= comparand.min;
  }

  public isLessThan(comparand: Range<T>) {
    if (this.max === null || this.max === undefined) {
      return true;
    }

    if (comparand.max === null || comparand.max === undefined) {
      return true;
    }

    return comparand.max <= this.max;
  }

  protected properties(): Map<string, any> {
    return Map({
      min: this.min,
      max: this.max,
    });
  }
}
