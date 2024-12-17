import { Map } from 'immutable';

import { PhoneNumber, PostalCode, ValueObject } from 'domains/common';

export class Criteria extends ValueObject {
  public static readonly MAX_NAME_LENGTH = 255;

  public constructor(
    public readonly name: string | null,
    public readonly postalCode: PostalCode | null,
    public readonly phone: PhoneNumber | null
  ) {
    super();

    if (name !== null && (name === '' || Criteria.MAX_NAME_LENGTH < name.length)) {
      throw new Error('Name must not be empty.');
    }
  }

  protected properties(): Map<string, unknown> {
    return Map({
      name: this.name,
      postalCode: this.postalCode,
      phone: this.phone,
    });
  }
}
