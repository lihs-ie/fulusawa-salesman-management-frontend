import { Criteria } from 'domains/feedback';
import { Builder } from 'tests/factories';
import { StatusFactory, TypeFactory, SortFactory } from 'tests/factories/domains/feedback';

import { ValueObjectTest } from '../common/value-object';

describe('Package criteria', () => {
  describe('Class Criteria', () => {
    type Properties = ConstructorParameters<typeof Criteria>;

    const generator = (): Properties => [null, null, null];

    describe('instantiation', () => {
      it('success.', () => {
        const props = generator();

        const instance = new Criteria(...props);

        expect(instance).toBeInstanceOf(Criteria);
        expect(instance.type).toBe(props[0]);
        expect(instance.status).toBe(props[1]);
        expect(instance.sort).toBe(props[2]);
      });

      ValueObjectTest(
        Criteria,
        generator,
        ([type, status, sort]): Array<Properties> => [
          [Builder.get(TypeFactory).build(), status, sort],
          [type, Builder.get(StatusFactory).build(), sort],
          [type, status, Builder.get(SortFactory).build()],
        ]
      );
    });
  });
});
