import { UserIdentifier } from 'domains/user';

import { UniversallyUniqueIdentifierTest } from '../common/identifier';

describe('Package common', () => {
  describe('UserIdentifier', () => {
    UniversallyUniqueIdentifierTest(UserIdentifier);
  });
});
