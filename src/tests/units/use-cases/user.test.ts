import { List } from 'immutable';
import { v7 as uuid } from 'uuid';

import { User as Entity, Repository } from 'domains/user';
import { UserHydrator } from 'hydration/user';
import { Builder } from 'tests/factories';
import { UserFactory, RepositoryFactory, RepositoryProperties } from 'tests/factories/domains/user';
import { User } from 'use-cases/user';

import { createPersistUseCase, createRemoveUseCase } from './helper';

describe('Package user', () => {
  describe('Class User', () => {
    describe('instantiate', () => {
      it('success', () => {
        const useCase = new User(Builder.get(RepositoryFactory).build());

        expect(useCase).toBeInstanceOf(User);
      });
    });

    describe('add', () => {
      it('successfully persist user.', async () => {
        const [useCase, persisted] = createPersistUseCase<
          User,
          Entity,
          Repository,
          RepositoryProperties
        >(User, RepositoryFactory, List());

        const expected = Builder.get(UserFactory).build();

        await useCase.add(UserHydrator.dehydrate(expected));

        const actual = persisted.current.first((instance: Entity) =>
          expected.identifier.equals(instance.identifier)
        );

        expect(actual).toBeSameUser(expected);
      });

      it('unsuccessfully with existing user.', async () => {
        const instances = Builder.get(UserFactory).buildList(Math.floor(Math.random() * 10) + 1);

        const [useCase] = createPersistUseCase<User, Entity, Repository, RepositoryProperties>(
          User,
          RepositoryFactory,
          instances
        );

        const target = instances.get(Math.floor(Math.random() * instances.count()));

        await expect(useCase.add(UserHydrator.dehydrate(target!))).rejects.toThrow();
      });
    });

    describe('update', () => {
      it('successfully update user.', async () => {
        const instances = Builder.get(UserFactory).buildList(Math.floor(Math.random() * 10) + 1);

        const [useCase, persisted] = createPersistUseCase<
          User,
          Entity,
          Repository,
          RepositoryProperties
        >(User, RepositoryFactory, instances);
        const target = instances.get(Math.floor(Math.random() * instances.count()));

        const expected = Builder.get(UserFactory).build({ identifier: target!.identifier });

        await useCase.update(UserHydrator.dehydrate(expected));

        const actual = persisted.current.first((instance: Entity) =>
          expected.identifier.equals(instance.identifier)
        );

        expect(actual).toBeSameUser(expected);
      });

      it('unsuccessfully with missing user.', async () => {
        const [useCase] = createPersistUseCase<User, Entity, Repository, RepositoryProperties>(
          User,
          RepositoryFactory
        );

        const target = Builder.get(UserFactory).build();

        await expect(useCase.update(UserHydrator.dehydrate(target))).rejects.toThrow();
      });
    });

    describe('find', () => {
      it('successfully return user.', async () => {
        const instances = Builder.get(UserFactory).buildList(Math.floor(Math.random() * 10) + 1);

        const [useCase] = createPersistUseCase<User, Entity, Repository, RepositoryProperties>(
          User,
          RepositoryFactory,
          instances
        );
        const target = instances.get(Math.floor(Math.random() * instances.count()));

        const actual = await useCase.find(target!.identifier.value);

        expect(actual).toBeSameUser(target!);
      });

      it('unsuccessfully with missing user.', async () => {
        const [useCase] = createPersistUseCase<User, Entity, Repository, RepositoryProperties>(
          User,
          RepositoryFactory
        );

        await expect(useCase.find(uuid())).rejects.toThrow();
      });
    });

    describe('list', () => {
      it(`successfully.`, async () => {
        const expecteds = Builder.get(UserFactory).buildList(Math.floor(Math.random() * 10) + 1);

        const [useCase] = createPersistUseCase<User, Entity, Repository, RepositoryProperties>(
          User,
          RepositoryFactory,
          expecteds
        );

        const actuals = await useCase.list();

        expecteds.zip(actuals).forEach(([expected, actual]) => {
          expect(actual).toBeSameUser(expected);
        });
      });
    });

    describe('delete', () => {
      it('successfully remove user.', async () => {
        const instances = Builder.get(UserFactory).buildList(Math.floor(Math.random() * 10) + 1);

        const [useCase, removed] = createRemoveUseCase<
          User,
          Entity,
          Repository,
          RepositoryProperties
        >(User, RepositoryFactory, instances);

        const target = instances.get(Math.floor(Math.random() * instances.count()));

        await useCase.delete(target!.identifier.value);

        removed.current.forEach((instance) => {
          expect(instance).not.toBeSameUser(target!);
        });
      });

      it('unsuccessfully with missing user.', async () => {
        const [useCase] = createRemoveUseCase<User, Entity, Repository, RepositoryProperties>(
          User,
          RepositoryFactory
        );

        await expect(useCase.delete(uuid())).rejects.toThrow();
      });
    });
  });
});
