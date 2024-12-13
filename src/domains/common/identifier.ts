import { Map } from 'immutable';

import { ValueObject } from './value-object';

export abstract class UniversallyUniqueIdentifier extends ValueObject {
  public static readonly VALID_PATTERN: RegExp =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-7[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  public constructor(public readonly value: string) {
    super();

    if (!value.match(UniversallyUniqueIdentifier.VALID_PATTERN)) {
      throw new Error('Value must be a valid UUID.');
    }
  }

  protected properties(): Map<string, unknown> {
    return Map({
      value: this.value,
    });
  }
}
