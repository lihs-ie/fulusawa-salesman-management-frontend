import { UserIdentifier } from 'domains/user/common';

import { UniversallyUniqueIdentifierFactory } from '../common';

export class UserIdentifierFactory extends UniversallyUniqueIdentifierFactory(UserIdentifier) {}
