import { MailAddress, PhoneNumber } from 'domains/common/contact';

describe('Package contact', () => {
  describe('Class MailAddress', () => {
    describe('instantiation', () => {
      it('success.', () => {
        const local = 'test.local';
        const domain = 'test-domain.com';

        const instance = new MailAddress(local, domain);

        expect(instance).toBeInstanceOf(MailAddress);
        expect(instance.local).toBe(local);
        expect(instance.domain).toBe(domain);
      });

      it.each([
        { local: 'a'.padEnd(65) },
        { domain: 'invalid' },
        { domain: '.com'.padStart(256, 'a') },
      ])('fails with invalid value.', (invalidValue) => {
        const values = {
          local: 'a'.padEnd(64),
          domain: 'test-domain.com',
          ...invalidValue,
        };

        expect(() => new MailAddress(values.local, values.domain)).toThrow();
      });
    });
  });

  describe('Class PhoneNumber', () => {
    describe('instantiation', () => {
      it('success.', () => {
        const areaCode = '0' + Math.floor(Math.random() * 1000);
        const localCode = '123';
        const subscriberNumber = '1234';

        const instance = new PhoneNumber(areaCode, localCode, subscriberNumber);

        expect(instance).toBeInstanceOf(PhoneNumber);
        expect(instance.areaCode).toBe(areaCode);
        expect(instance.localCode).toBe(localCode);
        expect(instance.subscriberNumber).toBe(subscriberNumber);
      });

      it.each([{ areaCode: 'invalid' }, { localCode: 'invalid' }, { subscriberNumber: 'invalid' }])(
        'fails with invalid value.',
        (invalidValue) => {
          const values = {
            areaCode: '0' + Math.floor(Math.random() * 1000),
            localCode: '123',
            subscriberNumber: '1234',
            ...invalidValue,
          };

          expect(
            () => new PhoneNumber(values.areaCode, values.localCode, values.subscriberNumber)
          ).toThrow();
        }
      );
    });
  });
});
