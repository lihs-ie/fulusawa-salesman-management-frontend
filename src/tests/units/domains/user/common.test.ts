import { Address, MailAddress, PhoneNumber } from 'domains/common';
import { Password, Role, User, UserIdentifier } from 'domains/user';
import { Builder, StringFactory } from 'tests/factories';
import { AddressFactory } from 'tests/factories/domains/common';
import { MailAddressFactory, PhoneNumberFactory } from 'tests/factories/domains/common/contact';
import { PasswordFactory, RoleFactory, UserIdentifierFactory } from 'tests/factories/domains/user';

import { UniversallyUniqueIdentifierTest } from '../common/identifier';

describe('Package common', () => {
  describe('class UserIdentifier', () => {
    UniversallyUniqueIdentifierTest(UserIdentifier);
  });

  describe('class User', () => {
    describe('instantiate', () => {
      const generator = (): [
        UserIdentifier,
        string,
        string,
        Address,
        PhoneNumber,
        MailAddress,
        Role,
      ] => [
        Builder.get(UserIdentifierFactory).build(),
        Builder.get(StringFactory(1, User.MAX_FIRST_NAME_LENGTH)).build(),
        Builder.get(StringFactory(1, User.MAX_LAST_NAME_LENGTH)).build(),
        Builder.get(AddressFactory).build(),
        Builder.get(PhoneNumberFactory).build(),
        Builder.get(MailAddressFactory).build(),
        Builder.get(RoleFactory).build(),
      ];

      it.each<Password | null>([Builder.get(PasswordFactory).build(), null])(
        'success with password %s',
        (password) => {
          const [identifier, firstName, lastName, address, phone, email, role] = generator();

          const user = new User(
            identifier,
            firstName,
            lastName,
            address,
            phone,
            email,
            password,
            role
          );

          expect(user).toBeInstanceOf(User);
          expect(user.identifier).toEqualValueObject(identifier);
          expect(user.firstName).toBe(firstName);
          expect(user.lastName).toBe(lastName);
          expect(user.address).toEqualValueObject(address);
          expect(user.phone).toEqualValueObject(phone);
          expect(user.email).toEqualValueObject(email);
          expect(user.password).toBeNullOr(password, (expectedPassword, actualPassword) =>
            expect(actualPassword).toEqualValueObject(expectedPassword)
          );
          expect(user.role).toBe(role);
        }
      );

      it.each([
        {
          firstName: '',
        },
        { firstName: 'a'.padEnd(User.MAX_FIRST_NAME_LENGTH + 1, 'a') },
        {
          lastName: '',
        },
        { lastName: 'a'.padEnd(User.MAX_LAST_NAME_LENGTH + 1, 'a') },
      ])('fails with invalid value %s', (invalid) => {
        const valids = generator();

        const props = {
          identifier: valids[0],
          firstName: valids[1],
          lastName: valids[2],
          address: valids[3],
          phone: valids[4],
          email: valids[5],
          password: null,
          role: valids[6],
          ...invalid,
        };

        expect(
          () =>
            new User(
              props.identifier,
              props.firstName,
              props.lastName,
              props.address,
              props.phone,
              props.email,
              null,
              props.role
            )
        ).toThrow();
      });
    });
  });
});
