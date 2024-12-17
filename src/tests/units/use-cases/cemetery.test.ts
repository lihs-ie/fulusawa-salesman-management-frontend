import { List } from 'immutable';
import { v7 as uuid } from 'uuid';

import { Criteria, Cemetery as Entity, Repository } from 'domains/cemetery';
import { CemeteryHydrator } from 'hydration/cemetery';
import { Builder } from 'tests/factories';
import {
  CemeteryFactory,
  CriteriaFactory,
  CriteriaProperties,
  RepositoryFactory,
  RepositoryProperties,
} from 'tests/factories/domains/cemetery';
import { CustomerIdentifierFactory } from 'tests/factories/domains/customer';
import { Cemetery, Conditions } from 'use-cases/cemetery';

import { createPersistUseCase, createRemoveUseCase } from './helper';

describe('Package cemetery', () => {
  describe('Class Cemetery', () => {
    describe('instantiate', () => {
      it('success', () => {
        const useCase = new Cemetery(Builder.get(RepositoryFactory).build());

        expect(useCase).toBeInstanceOf(Cemetery);
      });
    });

    describe('add', () => {
      it('successfully persist cemetery.', async () => {
        const [useCase, persisted] = createPersistUseCase<
          Cemetery,
          Entity,
          Repository,
          RepositoryProperties
        >(Cemetery, RepositoryFactory, List());

        const expected = Builder.get(CemeteryFactory).build();

        await useCase.add(CemeteryHydrator.dehydrate(expected));

        const actual = persisted.current.first((instance: Entity) =>
          expected.identifier.equals(instance.identifier)
        );

        expect(actual).toBeSameCemetery(expected);
      });

      it('unsuccessfully with existing cemetery.', async () => {
        const instances = Builder.get(CemeteryFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase] = createPersistUseCase<Cemetery, Entity, Repository, RepositoryProperties>(
          Cemetery,
          RepositoryFactory,
          instances
        );

        const target = instances.get(Math.floor(Math.random() * instances.count()));

        await expect(useCase.add(CemeteryHydrator.dehydrate(target!))).rejects.toThrow();
      });
    });

    describe('update', () => {
      it('successfully update cemetery.', async () => {
        const instances = Builder.get(CemeteryFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase, persisted] = createPersistUseCase<
          Cemetery,
          Entity,
          Repository,
          RepositoryProperties
        >(Cemetery, RepositoryFactory, instances);
        const target = instances.get(Math.floor(Math.random() * instances.count()));

        const expected = Builder.get(CemeteryFactory).build({ identifier: target!.identifier });

        await useCase.update(CemeteryHydrator.dehydrate(expected));

        const actual = persisted.current.first((instance: Entity) =>
          expected.identifier.equals(instance.identifier)
        );

        expect(actual).toBeSameCemetery(expected);
      });

      it('unsuccessfully with missing cemetery.', async () => {
        const [useCase] = createPersistUseCase<Cemetery, Entity, Repository, RepositoryProperties>(
          Cemetery,
          RepositoryFactory
        );

        const target = Builder.get(CemeteryFactory).build();

        await expect(useCase.update(CemeteryHydrator.dehydrate(target))).rejects.toThrow();
      });
    });

    describe('find', () => {
      it('successfully return cemetery.', async () => {
        const instances = Builder.get(CemeteryFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase] = createPersistUseCase<Cemetery, Entity, Repository, RepositoryProperties>(
          Cemetery,
          RepositoryFactory,
          instances
        );
        const target = instances.get(Math.floor(Math.random() * instances.count()));

        const actual = await useCase.find(target!.identifier.value);

        expect(actual).toBeSameCemetery(target!);
      });

      it('unsuccessfully with missing cemetery.', async () => {
        const [useCase] = createPersistUseCase<Cemetery, Entity, Repository, RepositoryProperties>(
          Cemetery,
          RepositoryFactory
        );

        await expect(useCase.find(uuid())).rejects.toThrow();
      });
    });

    describe('list', () => {
      const createConditions = (criteria: Criteria): Conditions => ({
        customer: criteria.customer?.value ?? '',
      });

      const createExpecteds = (criteria: Criteria, instances: List<Entity>): List<Entity> => {
        return instances.filter((instance) => {
          if (criteria.customer && !criteria.customer.equals(instance.customer)) {
            return false;
          }

          return true;
        });
      };

      it.each<CriteriaProperties>([
        { customer: null },
        { customer: Builder.get(CustomerIdentifierFactory).build() },
      ])(`successfully return cemeteries with conditions %s.`, async (CriteriaProperties) => {
        const criteria = Builder.get(CriteriaFactory).build(CriteriaProperties);

        const instances = Builder.get(CemeteryFactory).buildList(
          Math.floor(Math.random() * 10) + 1,
          criteria.customer ? { customer: criteria.customer } : {}
        );

        const expecteds = createExpecteds(criteria, instances);

        const [useCase] = createPersistUseCase<Cemetery, Entity, Repository, RepositoryProperties>(
          Cemetery,
          RepositoryFactory,
          instances
        );

        const actuals = await useCase.list(createConditions(criteria));

        expecteds.zip(actuals).forEach(([expected, actual]) => {
          expect(actual).toBeSameCemetery(expected);
        });
      });
    });

    describe('delete', () => {
      it('successfully remove cemetery.', async () => {
        const instances = Builder.get(CemeteryFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase, removed] = createRemoveUseCase<
          Cemetery,
          Entity,
          Repository,
          RepositoryProperties
        >(Cemetery, RepositoryFactory, instances);

        const target = instances.get(Math.floor(Math.random() * instances.count()));

        await useCase.delete(target!.identifier.value);

        removed.current.forEach((instance) => {
          expect(instance).not.toBeSameCemetery(target!);
        });
      });

      it('unsuccessfully with missing cemetery.', async () => {
        const [useCase] = createRemoveUseCase<Cemetery, Entity, Repository, RepositoryProperties>(
          Cemetery,
          RepositoryFactory
        );

        await expect(useCase.delete(uuid())).rejects.toThrow();
      });
    });
  });
});
