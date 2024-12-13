import { hash } from 'immutable';

import { Token, TokenType } from 'domains/authentication';

import { Builder, EnumFactory, Factory } from '../../common';

export const TokenTYpeFactory = EnumFactory(TokenType);

type TokenProperties = {
  value: string;
  type: TokenType;
  expiresAt: Date;
};

export class TokenFactory extends Factory<Token, TokenProperties> {
  protected instantiate(properties: TokenProperties): Token {
    return new Token(properties.value, properties.type, properties.expiresAt);
  }

  protected prepare(overrides: Partial<TokenProperties>, seed: number): TokenProperties {
    return {
      value: hash(seed).toString(),
      type: Builder.get(TokenTYpeFactory).buildWith(seed),
      expiresAt: new Date(seed),
      ...overrides,
    };
  }

  protected retrieve(instance: Token): TokenProperties {
    return {
      value: instance.value,
      type: instance.type,
      expiresAt: instance.expiresAt,
    };
  }
}
