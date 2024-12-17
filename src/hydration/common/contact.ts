import { z } from 'zod';

import { MailAddress, PhoneNumber } from 'domains/common';
import { asPayload, Hydrator } from 'hydration/common';

export const mailAddressSchema = z
  .object({
    local: z.string().regex(MailAddress.VALID_LOCAL_PART_PATTERN),
    domain: z.string().regex(MailAddress.VALID_DOMAIN_PATTERN),
  })
  .brand('MailAddressSchema');

export type MailAddressPayload = z.infer<typeof mailAddressSchema>;

export const MailAddressHydrator: Hydrator<MailAddress, MailAddressPayload> = {
  hydrate: (value) => new MailAddress(value.local, value.domain),

  dehydrate: (value) =>
    ({
      local: value.local,
      domain: value.domain,
    }) as MailAddressPayload,

  asPayload: (value) => asPayload(value, mailAddressSchema),
};

export const phoneNumberSchema = z
  .object({
    areaCode: z.string().regex(PhoneNumber.VALID_AREA_CODE_PATTERN),
    localCode: z.string().regex(PhoneNumber.VALID_LOCAL_CODE_PATTERN),
    subscriberNumber: z.string().regex(PhoneNumber.VALID_SUBSCRIBER_NUMBER_PATTERN),
  })
  .brand('PhoneNumberSchema');

export type PhoneNumberPayload = z.infer<typeof phoneNumberSchema>;

export const PhoneNumberHydrator: Hydrator<PhoneNumber, PhoneNumberPayload> = {
  hydrate: (value) => new PhoneNumber(value.areaCode, value.localCode, value.subscriberNumber),

  dehydrate: (value) =>
    ({
      areaCode: value.areaCode,
      localCode: value.localCode,
      subscriberNumber: value.subscriberNumber,
    }) as PhoneNumberPayload,

  asPayload: (value) => asPayload(value, phoneNumberSchema),
};
