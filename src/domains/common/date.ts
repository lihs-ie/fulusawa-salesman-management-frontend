import { Range } from './range';

export class DateTimeRange extends Range<Date> {
  public constructor(start: Date | null, end: Date | null) {
    super(start, end);
  }

  protected validate(): boolean {
    return true;
  }
}
