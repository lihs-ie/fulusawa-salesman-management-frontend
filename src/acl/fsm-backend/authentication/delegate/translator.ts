import { injectable } from 'inversify';

import {
  asTokenType,
  Authentication,
  AuthenticationIdentifier,
  Token,
} from 'domains/authentication';
import { UserIdentifier } from 'domains/user';

import { Translator as BaseTranslator, EntryMedia } from '../templates';

@injectable()
export class Translator extends BaseTranslator {
  public constructor() {
    super();
  }

  public translate(media: EntryMedia): Authentication {
    return new Authentication(
      new AuthenticationIdentifier(media.identifier),
      new UserIdentifier(media.user),
      media.accessToken
        ? new Token(
            media.accessToken.value,
            asTokenType(media.accessToken.type),
            media.accessToken.expiresAt
          )
        : null,
      media.refreshToken
        ? new Token(
            media.refreshToken.value,
            asTokenType(media.refreshToken.type),
            media.refreshToken.expiresAt
          )
        : null
    );
  }
}
