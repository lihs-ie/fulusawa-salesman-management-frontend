import { List } from 'immutable';

import { Address, PhoneNumber } from 'domains/common';

export type EntriesMedia<T> = {
  entries: List<T>;
};

export type AddressMedia = {
  postalCode: {
    first: string;
    second: string;
  };
  prefecture: number;
  city: string;
  street: string;
  building: string | null;
};

export type PhoneNumberMedia = {
  areaCode: string;
  localCode: string;
  subscriberNumber: string;
};

export interface Reader<T> {
  read: (payload: string) => T;
}

export interface EntriesReader<T> {
  read: (payload: string) => EntriesMedia<T>;
}

export interface Writer<T> {
  write: (...args: Array<T>) => string;
}

export class CommonDomainWriter {
  public writeAddress(address: Address): AddressMedia {
    return {
      prefecture: address.prefecture,
      postalCode: {
        first: address.postalCode.first,
        second: address.postalCode.second,
      },
      city: address.city,
      street: address.street,
      building: address.building,
    };
  }

  public writePhoneNumber(phoneNumber: PhoneNumber): PhoneNumberMedia {
    return {
      areaCode: phoneNumber.areaCode,
      localCode: phoneNumber.localCode,
      subscriberNumber: phoneNumber.subscriberNumber,
    };
  }
}
