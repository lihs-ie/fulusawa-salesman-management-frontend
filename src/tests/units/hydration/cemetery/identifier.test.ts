import { cemeteryIdentifierSchema } from 'hydration/cemetery';

import { universallyUniqueIdentifierSchemaTest } from '../common/identifier';

describe('Package cemetery', () => {
  describe('Schema cemeteryIdentifier', () => {
    universallyUniqueIdentifierSchemaTest(cemeteryIdentifierSchema);
  });
});
