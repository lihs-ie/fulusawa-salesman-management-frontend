import { Address, asPrefecture, PhoneNumber, PostalCode } from 'domains/common';

import { AddressMedia, PhoneNumberMedia } from './media-types';

export interface TranslatorInterface<T, I> {
  translate: (media: T) => I;
}

export class CommonDomainTranslator {
  public translateAddress(media: AddressMedia): Address {
    return new Address(
      asPrefecture(media.prefecture),
      new PostalCode(media.postalCode.first, media.postalCode.second),
      media.city,
      media.street,
      media.building
    );
  }

  public translatePhoneNumber(media: PhoneNumberMedia): PhoneNumber {
    return new PhoneNumber(media.areaCode, media.localCode, media.subscriberNumber);
  }
}
