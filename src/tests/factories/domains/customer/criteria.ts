import { PhoneNumber, PostalCode } from 'domains/common';
import { Criteria } from 'domains/customer';
import { Builder, Factory, StringFactory } from 'tests/factories/common';

import { PostalCodeFactory } from '../common';
import { PhoneNumberFactory } from '../common/contact';

type CriteriaProperties = {
  name: string | null;
  postalCode: PostalCode | null;
  phone: PhoneNumber | null;
  fulfilled?: boolean;
};

export class CriteriaFactory extends Factory<Criteria, CriteriaProperties> {
  protected instantiate(properties: CriteriaProperties) {
    return new Criteria(properties.name, properties.postalCode, properties.phone);
  }

  protected prepare(overrides: Partial<CriteriaProperties>, seed: number): CriteriaProperties {
    if (overrides.fulfilled) {
      return {
        name: Builder.get(StringFactory(1, Criteria.MAX_NAME_LENGTH)).buildWith(seed),
        postalCode: Builder.get(PostalCodeFactory).buildWith(seed),
        phone: Builder.get(PhoneNumberFactory).buildWith(seed),
        ...overrides,
      };
    }

    return {
      name: null,
      postalCode: null,
      phone: null,
      ...overrides,
    };
  }

  protected retrieve(instance: Criteria): CriteriaProperties {
    return {
      name: instance.name,
      postalCode: instance.postalCode,
      phone: instance.phone,
    };
  }
}
