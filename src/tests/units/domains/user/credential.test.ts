import { Password } from 'domains/user';

import { ValueObjectTest } from '../common/value-object';

describe('Package credentials', () => {
  describe('Class Password', () => {
    type Properties = ConstructorParameters<typeof Password>;

    const generator = (): Properties => ['Test1234!'];

    describe('instantiation', () => {
      it('success.', () => {
        const props = generator();

        const instance = new Password(...props);

        expect(instance).toBeInstanceOf(Password);
        expect(instance.value).toBe(props[0]);
      });

      it.each([
        'invalid',
        '',
        'Test1234',
        'test1234!',
        'TEST1234!',
        '12345678!',
        'Test12345',
        'Test1234!'.padEnd(Password.MAX_LENGTH + 1, 'a'),
        'Test12!',
      ])('fails with invalid value.', (invalid) => {
        expect(() => new Password(invalid)).toThrow();
      });
    });

    ValueObjectTest(
      Password,
      generator,
      (): Array<Properties> => [['Test1234@'], ['Test1234?'], ['Test1234+'], ['Test1234-']]
    );
  });
});
