import { Map, Set } from 'immutable';

import { ValueObject } from './value-object';

export const Prefecture = {
  HOKKAIDO: 1,
  AOMORI: 2,
  IWATE: 3,
  MIYAGI: 4,
  AKITA: 5,
  YAMAGATA: 6,
  FUKUSHIMA: 7,
  IBARAKI: 8,
  TOCHIGI: 9,
  GUNMA: 10,
  SAITAMA: 11,
  CHIBA: 12,
  TOKYO: 13,
  KANAGAWA: 14,
  NIIGATA: 15,
  TOYAMA: 16,
  ISHIKAWA: 17,
  FUKUI: 18,
  YAMANASHI: 19,
  NAGANO: 20,
  GIFU: 21,
  SHIZUOKA: 22,
  AICHI: 23,
  MIE: 24,
  SHIGA: 25,
  KYOTO: 26,
  OSAKA: 27,
  HYOGO: 28,
  NARA: 29,
  WAKAYAMA: 30,
  TOTTORI: 31,
  SHIMANE: 32,
  OKAYAMA: 33,
  HIROSHIMA: 34,
  YAMAGUCHI: 35,
  TOKUSHIMA: 36,
  KAGAWA: 37,
  EHIME: 38,
  KOCHI: 39,
  FUKUOKA: 40,
  SAGA: 41,
  NAGASAKI: 42,
  KUMAMOTO: 43,
  OITA: 44,
  MIYAZAKI: 45,
  KAGOSHIMA: 46,
  OKINAWA: 47,
} as const;

export type Prefecture = (typeof Prefecture)[keyof typeof Prefecture];

const candidates = Set(Object.values(Prefecture));

export const isPrefecture = (value: unknown): value is Prefecture => {
  return candidates.has(value as Prefecture);
};

export const asPrefecture = (prefecture: unknown): Prefecture => {
  if (isPrefecture(prefecture)) {
    return prefecture;
  }

  throw new Error(`Prefecture ${prefecture} is not supported.`);
};

export class PostalCode extends ValueObject {
  public static readonly VALID_FIRST_PATTERN: RegExp = /^\d{3}$/;

  public static readonly VALID_SECOND_PATTERN: RegExp = /^\d{4}$/;

  public constructor(
    public readonly first: string,
    public readonly second: string
  ) {
    super();

    if (!first.match(PostalCode.VALID_FIRST_PATTERN)) {
      throw new Error('First is must be 3 digits.');
    }

    if (!second.match(PostalCode.VALID_SECOND_PATTERN)) {
      throw new Error('Second is must be 4 digits.');
    }
  }

  public toString(): string {
    return `${this.first}-${this.second}`;
  }

  protected properties(): Map<string, unknown> {
    return Map({
      first: this.first,
      second: this.second,
    });
  }
}

export class Address extends ValueObject {
  public static readonly MAX_CITY_LENGTH: number = 255;

  public static readonly MAX_STREET_LENGTH: number = 255;

  public static readonly MAX_BUILDING_LENGTH: number = 255;

  public constructor(
    public readonly prefecture: Prefecture,
    public readonly postalCode: PostalCode,
    public readonly city: string,
    public readonly street: string,
    public readonly building: string | null
  ) {
    if (city === '' || Address.MAX_CITY_LENGTH < city.length) {
      throw new Error(`City must be 1 to ${Address.MAX_CITY_LENGTH} characters.`);
    }

    if (street === '' || Address.MAX_STREET_LENGTH < street.length) {
      throw new Error(`Street must be 1 to ${Address.MAX_STREET_LENGTH} characters.`);
    }

    if (building && (building === '' || Address.MAX_BUILDING_LENGTH < building.length)) {
      throw new Error(`Building must be 1 to ${Address.MAX_BUILDING_LENGTH} characters.`);
    }

    super();
  }

  protected properties(): Map<string, unknown> {
    return Map({
      prefecture: this.prefecture,
      postalCode: this.postalCode,
      city: this.city,
      street: this.street,
      building: this.building,
    });
  }
}
