import { Map } from 'immutable';

import { ValueObject } from 'domains/common';

export const Type = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
} as const;

export type Type = (typeof Type)[keyof typeof Type];

export class RepeatFrequency extends ValueObject {
  private DAYS_IN_A_WEEK = 7;

  public constructor(
    public readonly type: Type,
    public readonly interval: number
  ) {
    super();

    if (interval < 1 || !Number.isInteger(interval)) {
      throw new Error('Interval must be a positive integer.');
    }
  }

  protected properties(): Map<string, unknown> {
    return Map({
      type: this.type,
      interval: this.interval,
    });
  }

  public next(base: Date): Date {
    const next = new Date(base);

    switch (this.type) {
      case Type.DAILY:
        next.setDate(next.getDate() + this.interval);
        break;
      case Type.WEEKLY:
        next.setDate(next.getDate() + this.interval * this.DAYS_IN_A_WEEK);
        break;
      case Type.MONTHLY:
        next.setMonth(next.getMonth() + this.interval);
        break;
      case Type.YEARLY:
        next.setFullYear(next.getFullYear() + this.interval);
        break;
    }

    return next;
  }
}
