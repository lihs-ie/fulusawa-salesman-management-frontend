import { UniversallyUniqueIdentifier } from 'domains/common';

export class UserIdentifier extends UniversallyUniqueIdentifier {
  constructor(value: string) {
    super(value);
  }
}
