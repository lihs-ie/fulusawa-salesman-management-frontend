import { Map } from 'immutable';

import { ValueObject } from './value-object';

export class MailAddress extends ValueObject {
  public static readonly VALID_LOCAL_PART_PATTERN: RegExp =
    /^(?=.{1,64}$)(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~]+)*)$/;

  public static readonly VALID_DOMAIN_PATTERN: RegExp =
    /^(?=.{1,255}$)([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;

  public static readonly VALID_PATTERN: RegExp =
    /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~]+)*@(?=.{1,255}$)([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;

  public constructor(
    public readonly local: string,
    public readonly domain: string
  ) {
    super();

    if (!local.match(MailAddress.VALID_LOCAL_PART_PATTERN)) {
      throw new Error('Local is must be a valid local part.');
    }

    if (!domain.match(MailAddress.VALID_DOMAIN_PATTERN)) {
      throw new Error('Domain is must be a valid domain part.');
    }
  }

  public toString(): string {
    return `${this.local}@${this.domain}`;
  }

  protected properties(): Map<string, unknown> {
    return Map({
      local: this.local,
      domain: this.domain,
    });
  }
}

export class PhoneNumber extends ValueObject {
  public static readonly VALID_AREA_CODE_PATTERN = /^0\d{1,4}$/;

  public static readonly VALID_LOCAL_CODE_PATTERN = /^\d{1,4}$/;

  public static readonly VALID_SUBSCRIBER_NUMBER_PATTERN = /^\d{3,5}$/;

  public constructor(
    public readonly areaCode: string,
    public readonly localCode: string,
    public readonly subscriberNumber: string
  ) {
    super();

    if (!areaCode.match(PhoneNumber.VALID_AREA_CODE_PATTERN)) {
      throw new Error('Area code must be 0 followed by 1 to 4 digits.');
    }

    if (!localCode.match(PhoneNumber.VALID_LOCAL_CODE_PATTERN)) {
      throw new Error('Local code must be 1 to 4 digits.');
    }

    if (!subscriberNumber.match(PhoneNumber.VALID_SUBSCRIBER_NUMBER_PATTERN)) {
      throw new Error('Subscriber number must be 3 to 5 digits.');
    }
  }

  protected properties(): Map<string, unknown> {
    return Map({
      areaCode: this.areaCode,
      localCode: this.localCode,
      subscriberNumber: this.subscriberNumber,
    });
  }
}
