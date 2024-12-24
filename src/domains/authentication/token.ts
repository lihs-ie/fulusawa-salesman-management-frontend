import { Map, Set } from 'immutable';

import { ValueObject } from 'domains/common/value-object';

export const TokenType = {
  ACCESS: 'ACCESS',
  REFRESH: 'REFRESH',
} as const;

export type TokenType = (typeof TokenType)[keyof typeof TokenType];

export const isTokenType = (value: unknown): value is TokenType => {
  const candidates = Set(Object.values(TokenType));

  return candidates.has(value as TokenType);
};

export const asTokenType = (value: unknown): TokenType => {
  if (isTokenType(value)) {
    return value;
  }

  throw new Error(`TokenType ${value} is not supported.`);
};

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
