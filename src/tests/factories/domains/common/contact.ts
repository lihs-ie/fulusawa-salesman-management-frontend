import { createDigits } from 'aspects/character';
import { MailAddress, PhoneNumber } from 'domains/common';
import { Factory } from 'tests/factories/common';

type MailAddressProperties = {
  local: string;
  domain: string;
};

export class MailAddressFactory extends Factory<MailAddress, MailAddressProperties> {
  protected instantiate(properties: MailAddressProperties): MailAddress {
    return new MailAddress(properties.local, properties.domain);
  }

  protected prepare(
    overrides: Partial<MailAddressProperties>,
    seed: number
  ): MailAddressProperties {
    return {
      local: 'test'.padEnd(Math.min(Math.trunc(seed % 10), 64), '0'),
      domain: '.com'.padStart(Math.min(Math.trunc(seed % 10), 255), '0'),
      ...overrides,
    };
  }

  protected retrieve(instance: MailAddress): MailAddressProperties {
    return {
      local: instance.local,
      domain: instance.domain,
    };
  }
}

type PhoneNumberProperties = {
  areaCode: string;
  localCode: string;
  subscriberNumber: string;
};

export class PhoneNumberFactory extends Factory<PhoneNumber, PhoneNumberProperties> {
  protected instantiate(properties: PhoneNumberProperties): PhoneNumber {
    return new PhoneNumber(properties.areaCode, properties.localCode, properties.subscriberNumber);
  }

  protected prepare(
    overrides: Partial<PhoneNumberProperties>,
    seed: number
  ): PhoneNumberProperties {
    return {
      areaCode: '0' + createDigits(seed, 4),
      localCode: createDigits(seed, 4),
      subscriberNumber: createDigits(seed, 4),
      ...overrides,
    };
  }

  protected retrieve(instance: PhoneNumber): PhoneNumberProperties {
    return {
      areaCode: instance.areaCode,
      localCode: instance.localCode,
      subscriberNumber: instance.subscriberNumber,
    };
  }
}
