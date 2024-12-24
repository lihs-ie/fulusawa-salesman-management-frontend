import { Reader, Translator } from 'acl/fsm-backend/customer/delegate';
import { Builder } from 'tests/factories';
import { CustomerFactory } from 'tests/factories/domains/customer';
import { CustomersMedia, CustomerMedia } from 'tests/mock/upstreams/fcm-backend/media';

describe('Package translator', () => {
  describe('Class Translator', () => {
    describe('instantiate', () => {
      it('success', () => {
        const translator = new Translator();

        expect(translator).toBeInstanceOf(Translator);
      });
    });

    describe('translate', () => {
      it('successfully returns customers.', () => {
        const expecteds = Builder.get(CustomerFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const media = new CustomersMedia(expecteds);

        const translator = new Translator();

        const reader = new Reader();

        const actuals = translator.translate(reader.read(media.createSuccessfulContent()));

        expecteds.zip(actuals).forEach(([expected, actual]) => {
          expect(actual).toBeSameCustomer(expected);
        });
      });
    });

    describe('translateEntry', () => {
      it('successfully returns customer.', () => {
        const expected = Builder.get(CustomerFactory).build();

        const media = new CustomerMedia(expected);

        const translator = new Translator();

        const reader = new Reader();

        const actual = translator.translateEntry(reader.readEntry(media.createSuccessfulContent()));

        expect(actual).toBeSameCustomer(expected);
      });
    });
  });
});
