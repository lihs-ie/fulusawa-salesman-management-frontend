import { Password } from 'domains/user';
import { Factory } from 'tests/factories/common';

type PasswordProperties = {
  value: string;
};

export class PasswordFactory extends Factory<Password, PasswordProperties> {
  protected instantiate(properties: PasswordProperties): Password {
    return new Password(properties.value);
  }

  protected prepare(overrides: Partial<PasswordProperties>, seed: number): PasswordProperties {
    return {
      value: 'Test1234!'.padEnd(Math.min(Math.trunc(seed % 10), Password.MAX_LENGTH), '0'),
      ...overrides,
    };
  }

  protected retrieve(instance: Password): PasswordProperties {
    return {
      value: instance.value,
    };
  }
}
