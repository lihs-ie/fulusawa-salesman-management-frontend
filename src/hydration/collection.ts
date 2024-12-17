import { List, Map, OrderedMap, Set } from 'immutable';

import { Hydrator } from './common';
import { PrimitiveHydrator, Primitives } from './common/primitive';

export type ListPayload<P> = P[];

export const ListHydrator = <T, P>(inner: Hydrator<T, P>): Hydrator<List<T>, ListPayload<P>> => ({
  hydrate: (value) => List(value.map(inner.hydrate)),
  dehydrate: (value) => value.map(inner.dehydrate).toArray(),
});

export type MapPayload<P> = { [key: string]: P };

const tryParse = <T>(payload: string): T => {
  try {
    return JSON.parse(payload) as T;
  } catch {
    return payload as T;
  }
};

export type SetPayload<P> = P[];

export const SetHydrator = <T, P>(inner: Hydrator<T, P>): Hydrator<Set<T>, SetPayload<P>> => ({
  hydrate: (value) => Set(value.map(inner.hydrate)),
  dehydrate: (value) => value.map(inner.dehydrate).toArray(),
});

export const MapHydrator = <KV, KP, VV, VP>(
  keyHydrator: Hydrator<KV, KP>,
  valueHydrator: Hydrator<VV, VP>,
  asOrdered?: boolean
): Hydrator<Map<KV, VV>, MapPayload<VP>> => ({
  hydrate: (value) => {
    const valueMap = asOrdered ? OrderedMap(value) : Map(value);

    return valueMap
      .mapKeys((k) => keyHydrator.hydrate(tryParse(k as string)))
      .map(valueHydrator.hydrate);
  },

  dehydrate: (value) =>
    value
      .mapKeys((k) => JSON.stringify(keyHydrator.dehydrate(k)))
      .map(valueHydrator.dehydrate)
      .toObject(),
});

export const SimpleMapHydrator = <K extends Primitives, V extends Primitives>(
  asOrdered?: boolean
): Hydrator<Map<K, V>, MapPayload<V>> => ({
  hydrate: (value) =>
    MapHydrator(PrimitiveHydrator<K>(), PrimitiveHydrator<V>(), asOrdered).hydrate(value),

  dehydrate: (value) =>
    MapHydrator(PrimitiveHydrator<K>(), PrimitiveHydrator<V>(), asOrdered).dehydrate(value),
});
