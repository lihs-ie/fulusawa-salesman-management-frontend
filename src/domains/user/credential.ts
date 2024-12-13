import { Map } from 'immutable';

import { ValueObject } from 'domains/common';

export class Password extends ValueObject {
  public static readonly MIN_LENGTH: number = 8;

  public static readonly MAX_LENGTH: number = 64;

  public static readonly LOWERCASE_PATTERN: RegExp = /[a-z]/;

  public static readonly UPPERCASE_PATTERN: RegExp = /[A-Z]/;

  public static readonly DIGIT_PATTERN: RegExp = /\d/;

  public static readonly SPECIAL_CHARACTER_PATTERN: RegExp = /[!?@\-+]/;

  public static readonly VALID_PATTERN: RegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!?@\-+])[A-Za-z\d!?@\-+]{8,}$/;

  public constructor(public readonly value: string) {
    super();

    if (value.length < Password.MIN_LENGTH || value.length > Password.MAX_LENGTH) {
      throw new Error(`Value must be ${Password.MIN_LENGTH} to ${Password.MAX_LENGTH} characters.`);
    }

    if (!Password.LOWERCASE_PATTERN.test(value)) {
      throw new Error('Value must contain at least one lowercase letter.');
    }

    if (!Password.UPPERCASE_PATTERN.test(value)) {
      throw new Error('Value must contain at least one uppercase letter.');
    }

    if (!Password.DIGIT_PATTERN.test(value)) {
      throw new Error('Value must contain at least one digit.');
    }

    if (!Password.SPECIAL_CHARACTER_PATTERN.test(value)) {
      throw new Error('Value must contain at least one special character. (e.g. !?@-+)');
    }
  }

  public static isValid(value: string): boolean {
    return value.match(Password.VALID_PATTERN) !== null;
  }

  protected properties(): Map<string, unknown> {
    return Map({
      value: this.value,
    });
  }
}
