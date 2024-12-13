import { v7 as uuid } from 'uuid';

import { UniversallyUniqueIdentifier } from 'domains/common';

import { ValueObjectTest } from './value-object';

export const UniversallyUniqueIdentifierTest = <T extends UniversallyUniqueIdentifier>(
  target: new (value: string, ...args: any[]) => T
) => {
  describe(target.name, () => {
    type Properties = ConstructorParameters<typeof target>;

    const generator = (): Properties => [uuid()];

    describe('instantiate', () => {
      it('success', () => {
        const props = generator();
        const instance = new target(...props);

        expect(instance).toBeInstanceOf(target);
        expect(instance.value).toBe(props[0]);
      });

      it('fails with invalid value', () => {
        expect(() => new target('invalid')).toThrow();
      });
    });

    ValueObjectTest(target, generator, (): Array<Properties> => [[uuid()]]);
  });
};
