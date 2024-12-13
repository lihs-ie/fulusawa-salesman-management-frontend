import { Map } from 'immutable';

import { ValueObject } from './value-object';

export class Pager extends ValueObject {
  public readonly total: number;
  public readonly items: number;
  public readonly current: number;

  public constructor(total: number, items: number, current: number) {
    if (total < 0) {
      throw new Error('Total must be 0 or positive number.');
    }

    if (items <= 0) {
      throw new Error('Items must be 0 or positive number.');
    }

    if (current <= 0) {
      throw new Error('Current must be 0 or positive number.');
    }

    super();

    this.total = total;
    this.items = items;
    this.current = current;
  }

  public offset(): number {
    return (this.current - 1) * this.items;
  }

  public first(): number {
    return this.total === 0 ? 0 : 1;
  }

  public last(): number {
    return Math.ceil(this.total / this.items);
  }

  protected properties(): Map<string, any> {
    return Map({
      total: this.total,
      items: this.items,
      current: this.current,
    });
  }
}
