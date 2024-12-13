import { AuthenticationIdentifier } from 'domains/authentication/common';
import { UniversallyUniqueIdentifierHydrator } from 'hydration/common/identifier';

export const AuthenticationIdentifierHydrator =
  UniversallyUniqueIdentifierHydrator(AuthenticationIdentifier);
