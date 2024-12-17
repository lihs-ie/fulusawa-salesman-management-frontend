import { List } from 'immutable';
import { v7 as uuid } from 'uuid';

import { Criteria, Customer as Entity, Repository } from 'domains/customer';
import { CustomerHydrator } from 'hydration/customer';
import { Builder, StringFactory } from 'tests/factories';
import { PostalCodeFactory } from 'tests/factories/domains/common';
import { PhoneNumberFactory } from 'tests/factories/domains/common/contact';
import {
  CriteriaFactory,
  CustomerFactory,
  RepositoryFactory,
  RepositoryProperties,
} from 'tests/factories/domains/customer';
import { Customer, Conditions } from 'use-cases/customer';

import { createPersistUseCase, createRemoveUseCase } from './helper';

describe('Package customer', () => {
  describe('Class Customer', () => {
    describe('instantiate', () => {
      it('success', () => {
        const useCase = new Customer(Builder.get(RepositoryFactory).build());

        expect(useCase).toBeInstanceOf(Customer);
      });
    });

    describe('add', () => {
      it('successfully persist customer.', async () => {
        const [useCase, persisted] = createPersistUseCase<
          Customer,
          Entity,
          Repository,
          RepositoryProperties
        >(Customer, RepositoryFactory, List());

        const expected = Builder.get(CustomerFactory).build();

        await useCase.add(CustomerHydrator.dehydrate(expected));

        const actual = persisted.current.first((instance: Entity) =>
          expected.identifier.equals(instance.identifier)
        );

        expect(actual).toBeSameCustomer(expected);
      });

      it('unsuccessfully with existing customer.', async () => {
        const instances = Builder.get(CustomerFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase] = createPersistUseCase<Customer, Entity, Repository, RepositoryProperties>(
          Customer,
          RepositoryFactory,
          instances
        );

        const target = instances.get(Math.floor(Math.random() * instances.count()));

        await expect(useCase.add(CustomerHydrator.dehydrate(target!))).rejects.toThrow();
      });
    });

    describe('update', () => {
      it('successfully update customer.', async () => {
        const instances = Builder.get(CustomerFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase, persisted] = createPersistUseCase<
          Customer,
          Entity,
          Repository,
          RepositoryProperties
        >(Customer, RepositoryFactory, instances);
        const target = instances.get(Math.floor(Math.random() * instances.count()));

        const expected = Builder.get(CustomerFactory).build({ identifier: target!.identifier });

        await useCase.update(CustomerHydrator.dehydrate(expected));

        const actual = persisted.current.first((instance: Entity) =>
          expected.identifier.equals(instance.identifier)
        );

        expect(actual).toBeSameCustomer(expected);
      });

      it('unsuccessfully with missing customer.', async () => {
        const [useCase] = createPersistUseCase<Customer, Entity, Repository, RepositoryProperties>(
          Customer,
          RepositoryFactory
        );

        const target = Builder.get(CustomerFactory).build();

        await expect(useCase.update(CustomerHydrator.dehydrate(target))).rejects.toThrow();
      });
    });

    describe('find', () => {
      it('successfully return customer.', async () => {
        const instances = Builder.get(CustomerFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase] = createPersistUseCase<Customer, Entity, Repository, RepositoryProperties>(
          Customer,
          RepositoryFactory,
          instances
        );
        const target = instances.get(Math.floor(Math.random() * instances.count()));

        const actual = await useCase.find(target!.identifier.value);

        expect(actual).toBeSameCustomer(target!);
      });

      it('unsuccessfully with missing customer.', async () => {
        const [useCase] = createPersistUseCase<Customer, Entity, Repository, RepositoryProperties>(
          Customer,
          RepositoryFactory
        );

        await expect(useCase.find(uuid())).rejects.toThrow();
      });
    });

    describe('list', () => {
      const createConditions = (criteria: Criteria): Conditions => ({
        name: criteria.name ?? undefined,
        postalCodeFirst: criteria.postalCode?.first ?? undefined,
        postalCodeSecond: criteria.postalCode?.second ?? undefined,
        areaCode: criteria.phone?.areaCode ?? undefined,
        localCode: criteria.phone?.localCode ?? undefined,
        subscriberNumber: criteria.phone?.subscriberNumber ?? undefined,
      });

      const createExpecteds = (criteria: Criteria, instances: List<Entity>): List<Entity> => {
        return instances.filter((instance) => {
          if (
            criteria.name &&
            (!instance.lastName.includes(criteria.name) ||
              !instance.firstName?.includes(criteria.name))
          ) {
            return false;
          }

          if (criteria.postalCode && criteria.postalCode.equals(instance.address.postalCode)) {
            return false;
          }

          if (criteria.phone && !criteria.phone.equals(instance.phone)) {
            return false;
          }

          return true;
        });
      };

      it.each<Criteria>([
        Builder.get(CriteriaFactory).build(),
        Builder.get(CriteriaFactory).build({
          name: Builder.get(StringFactory(1, Criteria.MAX_NAME_LENGTH)).build(),
        }),
        Builder.get(CriteriaFactory).build({
          postalCode: Builder.get(PostalCodeFactory).build(),
        }),
        Builder.get(CriteriaFactory).build({
          phone: Builder.get(PhoneNumberFactory).build(),
        }),
      ])(`successfully return customers with conditions %s.`, async (criteria) => {
        const instances = Builder.get(CustomerFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const expecteds = createExpecteds(criteria, instances);

        const [useCase] = createPersistUseCase<Customer, Entity, Repository, RepositoryProperties>(
          Customer,
          RepositoryFactory,
          instances
        );

        const actuals = await useCase.list(createConditions(criteria));

        expecteds.zip(actuals).forEach(([expected, actual]) => {
          expect(actual).toBeSameCustomer(expected);
        });
      });
    });

    describe('delete', () => {
      it('successfully remove customer.', async () => {
        const instances = Builder.get(CustomerFactory).buildList(
          Math.floor(Math.random() * 10) + 1
        );

        const [useCase, removed] = createRemoveUseCase<
          Customer,
          Entity,
          Repository,
          RepositoryProperties
        >(Customer, RepositoryFactory, instances);

        const target = instances.get(Math.floor(Math.random() * instances.count()));

        await useCase.delete(target!.identifier.value);

        removed.current.forEach((instance) => {
          expect(instance).not.toBeSameCustomer(target!);
        });
      });

      it('unsuccessfully with missing customer.', async () => {
        const [useCase] = createRemoveUseCase<Customer, Entity, Repository, RepositoryProperties>(
          Customer,
          RepositoryFactory
        );

        await expect(useCase.delete(uuid())).rejects.toThrow();
      });
    });
  });
});
