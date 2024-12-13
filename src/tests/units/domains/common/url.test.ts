import { URL } from 'domains/common/url';
import { ValueObjectTest } from 'tests/units/domains/common/value-object';

describe('Package url', () => {
  describe('Class URL', () => {
    type Properties = ConstructorParameters<typeof URL>;

    const generator = (): Properties => ['https://stg.buyee.jp', false];

    describe('instantiation', () => {
      it('success.', () => {
        const props = generator();
        const instance = new URL(...props);

        expect(instance.value).toBe(props[0]);
        expect(instance.isRelative).toBe(props[1]);
      });

      it.each([
        {
          value: 'https://a',
          isRelative: false,
        },
        {
          value: 'abc',
          isRelative: true,
        },
      ])('fails with invalid value.', (values) => {
        expect(() => {
          new URL(values.value, values.isRelative);
        }).toThrow();
      });
    });

    describe('isValid', () => {
      it.each([1024, 1025])('check max length.', (length) => {
        const value = 'https://'.padEnd(length, 'a');
        const expected = length <= 1024;

        expect(URL.isValid(value, false)).toBe(expected);
      });

      it.each(['http://stg.buyee.jp', 'ftp://stg.buyee.jp'])(
        'success with valid url pattern.',
        (value) => {
          expect(URL.isValid(value, false)).toBe(true);
        }
      );

      it.each(['https://a', 'scp://stg.buyee.jp'])('fails with invalid url pattern.', (value) => {
        expect(URL.isValid(value, false)).toBe(false);
      });

      it.each(['/abc', '?param=1', '#top'])('success with valid url part pattern.', (value) => {
        expect(URL.isValid(value, true)).toBe(true);
      });

      it.each(['abc', '&param=1'])('fails with invalid url part pattern.', (value) => {
        expect(URL.isValid(value, true)).toBe(false);
      });
    });

    ValueObjectTest(
      URL,
      generator,
      ([value, isRelative]): Array<Properties> => [
        ['http://stg.buyee.jp', isRelative],
        ['/abc', true],
      ]
    );
  });
});
