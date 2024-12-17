import { List } from 'immutable';

import { Builder, Factory } from 'tests/factories';

const createPersistHandler = <T>(): [
  onPersist: (instance: T) => void,
  persisted: { current: List<T> },
] => {
  const persisted = { current: List<T>() };

  const onPersist = (instance: T) => {
    persisted.current = persisted.current.push(instance);
  };

  return [onPersist, persisted];
};

type RepositoryOverrides<T> = {
  instances: List<T>;
  onPersist?: (instance: T) => void;
  onRemove?: (instances: List<T>) => void;
};

export const createPersistUseCase = <U, I, R, RO extends RepositoryOverrides<I>>(
  target: new (...args: any[]) => U,
  repositoryFactory: new () => Factory<R, RO>,
  instances: List<I> = List()
): [useCase: U, persisted: { current: List<I> }] => {
  const [onPersist, persisted] = createPersistHandler<I>();

  const overrides = { instances, onPersist } as RO;

  const useCase = new target(Builder.get(repositoryFactory).build(overrides));

  return [useCase, persisted];
};

const createRemoveHandler = <T>(): [
  onRemove: (instances: List<T>) => void,
  removed: { current: List<T> },
] => {
  const removed = { current: List<T>() };

  const onRemove = (instances: List<T>) => {
    removed.current = removed.current.concat(instances);
  };

  return [onRemove, removed];
};

export const createRemoveUseCase = <U, I, R, RO extends RepositoryOverrides<I>>(
  target: new (...args: any[]) => U,
  repositoryFactory: new () => Factory<R, RO>,
  instances: List<I> = List()
): [useCase: U, removed: { current: List<I> }] => {
  const [onRemove, removed] = createRemoveHandler<I>();

  const overrides = { instances, onRemove } as RO;

  const useCase = new target(Builder.get(repositoryFactory).build(overrides));

  return [useCase, removed];
};
