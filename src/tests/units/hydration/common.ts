import { z, ZodError } from 'zod';

import { asPayload, Hydrator } from 'hydration/common';

export const HydratorTest = <T, P extends {}, S extends z.ZodType>(
  hydrator: Hydrator<T, P>,
  variations: Array<T>,
  schema: S
) => {
  describe('Hydrator', () => {
    describe('dehydrate', () => {
      it.each(variations)('success', (value) => {
        const dehydrated = hydrator.dehydrate(value);

        expect(asPayload(dehydrated, schema)).not.toThrow(ZodError);
      });
    });

    describe('hydrate', () => {
      it.each(variations)('success', (value) => {
        const dehydrated = hydrator.dehydrate(value);
        const hydrated = hydrator.hydrate(dehydrated);

        expect(hydrated).toEqual(value);
      });
    });
  });
};

export const SchemaTest = <T extends z.ZodType, P extends {}>(
  schema: T,
  variations: Array<P>,
  invalids: Array<Partial<P>>
) => {
  describe('Schema', () => {
    describe('parse', () => {
      it.each(variations)('success', (value) => {
        expect(() => schema.parse(value)).not.toThrow(ZodError);
      });

      it.each(invalids)('failure', (invalid) => {
        const value = { ...variations[0], ...invalid };

        expect(() => schema.parse(value)).toThrow(ZodError);
      });
    });
  });
};
