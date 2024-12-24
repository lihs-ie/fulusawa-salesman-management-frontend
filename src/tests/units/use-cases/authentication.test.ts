import { List } from 'immutable';
import { v7 as uuid } from 'uuid';

import { Authentication as Entity, Repository, TokenType } from 'domains/authentication';
import { MailAddressHydrator } from 'hydration/common/contact';
import { container } from 'providers';
import { Builder } from 'tests/factories';
import {
  AuthenticationFactory,
  RepositoryFactory,
  RepositoryProperties,
  TokenFactory,
} from 'tests/factories/domains/authentication';
import { MailAddressFactory } from 'tests/factories/domains/common/contact';
import { PasswordFactory } from 'tests/factories/domains/user';
import { Authentication } from 'use-cases/authentication';

import { createPersistUseCase, createRemoveUseCase } from './helper';

describe('Package authentication', () => {
  describe('Class Authentication', () => {
    describe('instantiate', () => {
      it('success', () => {
        const useCase = new Authentication(Builder.get(RepositoryFactory).build());

        expect(useCase).toBeInstanceOf(Authentication);

        const test = container.get(Repository);
      });
    });

    describe('login', () => {
      it('successfully returns authentication.', async () => {
        const [useCase] = createPersistUseCase<
          Authentication,
          Entity,
          Repository,
          RepositoryProperties
        >(Authentication, RepositoryFactory, List());

        const mailAddress = MailAddressHydrator.dehydrate(Builder.get(MailAddressFactory).build());
        const password = Builder.get(PasswordFactory).build();
        const identifier = uuid();

        const actual = await useCase.login(identifier, mailAddress, password.value);

        expect(actual).toBeInstanceOf(Entity);
        expect(actual.identifier.value).toBe(identifier);
      });

      it('unsuccessfully with existing authentication.', async () => {
        const instances = Builder.get(AuthenticationFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase] = createPersistUseCase<
          Authentication,
          Entity,
          Repository,
          RepositoryProperties
        >(Authentication, RepositoryFactory, instances);

        const mailAddress = MailAddressHydrator.dehydrate(Builder.get(MailAddressFactory).build());
        const password = Builder.get(PasswordFactory).build();

        const target = instances.get(Math.floor(Math.random() * instances.count()));

        await expect(
          useCase.login(target!.identifier.value, mailAddress, password.value)
        ).rejects.toThrow();
      });
    });

    describe('logout', () => {
      it('successfully remove authentication.', async () => {
        const instances = Builder.get(AuthenticationFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase, removed] = createRemoveUseCase<
          Authentication,
          Entity,
          Repository,
          RepositoryProperties
        >(Authentication, RepositoryFactory, instances);

        const target = instances.get(Math.floor(Math.random() * instances.count()));

        await useCase.logout(target!.identifier.value);

        removed.current.forEach((instance) => {
          expect(instance.identifier).not.toEqualValueObject(target!.identifier);
        });
      });

      it('unsuccessfully with non-existing authentication.', async () => {
        const instances = Builder.get(AuthenticationFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase] = createRemoveUseCase<
          Authentication,
          Entity,
          Repository,
          RepositoryProperties
        >(Authentication, RepositoryFactory, instances);

        const identifier = uuid();

        await expect(useCase.logout(identifier)).rejects.toThrow();
      });
    });

    describe('refresh', () => {
      it('successfully returns authentication.', async () => {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 1);

        const instance = Builder.get(AuthenticationFactory).build({
          refreshToken: Builder.get(TokenFactory).build({
            type: TokenType.REFRESH,
            expiresAt,
          }),
        });

        const [useCase] = createPersistUseCase<
          Authentication,
          Entity,
          Repository,
          RepositoryProperties
        >(Authentication, RepositoryFactory, List([instance]));

        const actual = await useCase.refresh(instance.refreshToken!.value);

        expect(actual).toBeInstanceOf(Entity);
        expect(actual.identifier).toEqualValueObject(instance.identifier);
      });
    });

    // describe('revoke', () => {
    //   it('successfully revoke authentication.', async () => {
    //     const instances = Builder.get(AuthenticationFactory).buildList(
    //       Math.floor(Math.random() * 10) + 1
    //     );

    //     const [useCase, persisted] = createPersistUseCase<
    //       Authentication,
    //       Entity,
    //       Repository,
    //       RepositoryProperties
    //     >(Authentication, RepositoryFactory, instances);

    //     const target = instances.get(Math.floor(Math.random() * instances.count()));

    //     await useCase.revoke(target!.accessToken!.value, TokenType.ACCESS);

    //     const actual = persisted.current.first((instance: Entity) =>
    //       target!.identifier.equals(instance.identifier)
    //     );

    //     expect(actual!.accessToken).toBeNull();
    //   });

    //   it('unsuccessfully with non-existing authentication.', async () => {
    //     const instances = Builder.get(AuthenticationFactory).buildList(
    //       Math.floor(Math.random() * 10) + 1
    //     );

    //     const [useCase] = createPersistUseCase<
    //       Authentication,
    //       Entity,
    //       Repository,
    //       RepositoryProperties
    //     >(Authentication, RepositoryFactory, instances);

    //     const value = uuid();

    //     await expect(useCase.revoke(value, TokenType.ACCESS)).rejects.toThrow();
    //   });
    // })
  });
});
