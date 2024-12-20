import { v7 as uuid } from 'uuid';
import { z } from 'zod';

export const universallyUniqueIdentifierSchemaTest = (schema: z.ZodType) => {
  describe('universallyUniqueIdentifierSchema', () => {
    it('success', () => {
      expect(() => schema.parse({ value: uuid() })).not.toThrow();
    });

    it('fails with invalid value.', () => {
      expect(() => schema.parse({ value: 'invalid' })).toThrow();
    });
  });
};
