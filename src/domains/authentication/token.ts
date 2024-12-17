import { Map } from 'immutable';

import { ValueObject } from 'domains/common/value-object';

export const TokenType = {
  ACCESS: 'ACCESS',
  REFRESH: 'REFRESH',
} as const;

export type TokenType = (typeof TokenType)[keyof typeof TokenType];

export class Token extends ValueObject {
  public constructor(
    public readonly value: string,
    public readonly type: TokenType,
    public readonly expiresAt: Date
  ) {
    super();

    if (value === '') {
      throw new Error('Token must not be empty.');
    }
  }

  protected properties(): Map<string, unknown> {
    return Map({
      value: this.value,
      type: this.type,
      expiresAt: this.expiresAt,
    });
  }
}
