import { URL, URLMap } from 'domains/common/url';
import { Builder, Factory } from 'tests/factories/common';

type Properties = {
  value: string;
  isRelative: boolean;
};

type MapProperties = {
  data: URLMap;
  isRelative?: boolean;
};

export class URLFactory extends Factory<URL, Properties> {
  protected instantiate(properties: Properties): URL {
    return new URL(properties.value, properties.isRelative);
  }

  protected prepare(overrides: Partial<Properties>, seed: number): Properties {
    const isRelative = overrides.isRelative ?? seed % 2 === 0;
    const origin = isRelative ? '' : 'http://localhost';

    return {
      value: origin + `/some/${seed}`,
      isRelative,
      ...overrides,
    };
  }

  protected retrieve(instance: URL): Properties {
    return {
      value: instance.value,
      isRelative: instance.isRelative,
    };
  }
}

export class URLMapFactory extends Factory<URLMap, MapProperties> {
  protected instantiate(properties: MapProperties): URLMap {
    return properties.data;
  }

  protected prepare(overrides: Partial<MapProperties>, seed: number): MapProperties {
    const size = Math.trunc(seed % 8) + 3;
    const isRelative = overrides.isRelative ?? seed % 2 === 0;

    const data =
      overrides.data ??
      (Builder.get(URLFactory)
        .buildListWith(size, seed, { isRelative: isRelative })
        .map((url, index) => ['key' + index, url])
        .fromEntrySeq()
        .toMap() as URLMap);

    return {
      data,
      isRelative,
    };
  }

  protected retrieve(instance: URLMap): MapProperties {
    return {
      data: instance,
    };
  }
}
