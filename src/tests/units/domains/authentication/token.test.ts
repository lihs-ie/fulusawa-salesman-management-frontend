import { hash } from 'immutable';

import { Token, TokenType } from 'domains/authentication';

describe('Package token', () => {
  describe('Class Token', () => {
    type Properties = ConstructorParameters<typeof Token>;

    const generator = (): Properties => [
      hash(Math.random()).toString(),
      TokenType.ACCESS,
      new Date(),
    ];

    describe('instantiation', () => {
      it('success.', () => {
        const props = generator();

        const instance = new Token(...props);

        expect(instance).toBeInstanceOf(Token);
        expect(instance.value).toBe(props[0]);
        expect(instance.type).toBe(props[1]);
        expect(instance.expiresAt).toBe(props[2]);
      });

      it('fails with empty value.', () => {
        expect(() => new Token('', TokenType.ACCESS, new Date())).toThrow();
      });
    });
  });
});
