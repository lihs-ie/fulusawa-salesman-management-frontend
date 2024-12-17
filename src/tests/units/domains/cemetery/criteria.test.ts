import { Criteria } from 'domains/cemetery';
import { Builder } from 'tests/factories';
import { CustomerIdentifierFactory } from 'tests/factories/domains/customer';

import { ValueObjectTest } from '../common/value-object';

describe('Package criteria', () => {
  describe('Class Criteria', () => {
    type Properties = ConstructorParameters<typeof Criteria>;

    const generator = (): Properties => [null];

    describe('instantiation', () => {
      it('success.', () => {
        const props = generator();

        const instance = new Criteria(...props);

        expect(instance).toBeInstanceOf(Criteria);
        expect(instance.customer).toBeNull();
      });

      ValueObjectTest(
        Criteria,
        generator,
        (_): Array<Properties> => [[Builder.get(CustomerIdentifierFactory).build()]]
      );
    });
  });
});
