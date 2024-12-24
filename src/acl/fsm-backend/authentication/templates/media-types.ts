import { injectable } from 'inversify';

import { Reader as BaseReader, Writer as BaseWriter } from 'acl/fsm-backend/common';
import { AuthenticationIdentifier, TokenType } from 'domains/authentication';
import { MailAddress } from 'domains/common';
import { Password } from 'domains/user';

export type RawEntryMedia = {
  identifier: string;
  user: string;
  accessToken: null | {
    type: string;
    value: string;
    expiresAt: string;
  };
  refreshToken: null | {
    type: string;
    value: string;
    expiresAt: string;
  };
};

export type EntryMedia = {
  identifier: string;
  user: string;
  accessToken: null | {
    type: string;
    value: string;
    expiresAt: Date;
  };
  refreshToken: null | {
    type: string;
    value: string;
    expiresAt: Date;
  };
};

export type IntrospectionMedia = {
  active: boolean;
};

@injectable()
export abstract class Reader implements BaseReader<EntryMedia> {
  public abstract read(payload: string): EntryMedia;

  public abstract readIntrospection(payload: string): IntrospectionMedia;
}

export type Body = {
  identifier: string;
  email: string;
  password: string;
};

@injectable()
export abstract class Writer
  implements
    BaseWriter<[identifier: AuthenticationIdentifier, email: MailAddress, password: Password]>
{
  public abstract write(
    args: [identifier: AuthenticationIdentifier, email: MailAddress, password: Password]
  ): string;

  public abstract writeLogout(identifier: AuthenticationIdentifier): string;

  public abstract writeToken(value: string, type: TokenType): string;
}
