import { HttpErrorConstructor } from 'http-errors';

import { Type } from 'tests/mock/upstreams/common';

type Variation = [type: Type, thrown: new (...args: Array<any>) => HttpErrorConstructor | Error];

export const AdaptorFailureTest = <T, O extends {}>(
  provider: (...args: Array<any>) => Promise<T>,
  inject: (type: Type, overrides?: O) => void,
  variations: Array<Variation>,
  mediaOverrides?: O
) => {
  it.each(variations)('throws %s.', async (...variation) => {
    const [type, thrown] = variation;

    inject(type, mediaOverrides);

    await expect(provider()).rejects.toThrow(thrown);
  });
};
