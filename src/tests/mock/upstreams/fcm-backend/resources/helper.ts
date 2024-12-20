import {
  AddressMedia as RawAddressMedia,
  PhoneNumberMedia as RawPhoneNumberMedia,
} from 'acl/fsm-backend/common';
import { Address, PhoneNumber } from 'domains/common';

export const matchAddress = (model: Address, input: RawAddressMedia): boolean => {
  if (model.prefecture !== input.prefecture) {
    return false;
  }

  if (model.postalCode.first !== input.postalCode.first) {
    return false;
  }

  if (model.postalCode.second !== input.postalCode.second) {
    return false;
  }

  if (model.city !== input.city) {
    return false;
  }

  if (model.street !== input.street) {
    return false;
  }

  if (model.building !== input.building) {
    return false;
  }

  return true;
};

export const matchPhoneNumber = (model: PhoneNumber, input: RawPhoneNumberMedia): boolean => {
  if (model.areaCode !== input.areaCode) {
    return false;
  }

  if (model.localCode !== input.localCode) {
    return false;
  }

  if (model.subscriberNumber !== input.subscriberNumber) {
    return false;
  }

  return true;
};
