import { injectable } from 'inversify';

import { AuthenticationIdentifier } from 'domains/authentication';
import { MailAddress } from 'domains/common';
import { Password } from 'domains/user';

import {
  Reader as BaseReader,
  EntryMedia,
  Writer as BaseWriter,
  RawEntryMedia,
  IntrospectionMedia,
} from '../templates';

@injectable()
export class Reader extends BaseReader {
  public read(payload: string): EntryMedia {
    const media = JSON.parse(payload) as RawEntryMedia;

    return {
      ...media,
      accessToken: media.accessToken
        ? {
            value: media.accessToken.value,
            type: media.accessToken.type,
            expiresAt: new Date(media.accessToken.expiresAt),
          }
        : null,
      refreshToken: media.refreshToken
        ? {
            value: media.refreshToken.value,
            type: media.refreshToken.type,
            expiresAt: new Date(media.refreshToken.expiresAt),
          }
        : null,
    };
  }

  public readIntrospection(payload: string): IntrospectionMedia {
    return JSON.parse(payload) as IntrospectionMedia;
  }
}

export type Body = {
  identifier: string;
  email: string;
  password: string;
};

@injectable()
export class Writer extends BaseWriter {
  public write(
    args: [identifier: AuthenticationIdentifier, email: MailAddress, password: Password]
  ): string {
    const [identifier, email, password] = args;

    const body: Body = {
      identifier: identifier.value,
      email: email.toString(),
      password: password.value,
    };

    return JSON.stringify(body);
  }

  public writeLogout(identifier: AuthenticationIdentifier): string {
    return JSON.stringify({ identifier: identifier.value });
  }

  public writeToken(value: string, type: string): string {
    return JSON.stringify({ value, type });
  }
}
