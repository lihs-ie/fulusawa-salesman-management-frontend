import { Map } from 'immutable';

import { ValueObject } from 'domains/common/value-object';

export class URL extends ValueObject {
  public static readonly MAX_LENGTH = 1024;

  public readonly value: string;
  public readonly isRelative: boolean;

  public constructor(value: string, isRelative: boolean) {
    super();

    if (!URL.isValid(value, isRelative)) {
      throw new Error(`Value '${value}' is not a valid URL.`);
    }

    this.value = value;
    this.isRelative = isRelative;
  }

  public static isValid(value: string, isReactive = false) {
    if (this.MAX_LENGTH < value.length) {
      return false;
    }

    const urlPattern = new RegExp(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i);

    if (!isReactive && !urlPattern.test(value)) {
      return false;
    }

    const urlPartPattern = new RegExp('^(/?|/\\S+|\\?\\S*|#\\S*)$', 'u');

    if (isReactive && !urlPartPattern.test(value)) {
      return false;
    }

    return true;
  }

  protected properties(): Map<string, any> {
    return Map({
      value: this.value,
      isRelative: this.isRelative,
    });
  }
}

export type URLMap = Map<string, URL>;
