import querystring from 'querystring';

import { Map } from 'immutable';
import fetchMock, { MockResponseInit } from 'jest-fetch-mock';

export const Type = {
  OK: 'ok',
  BAD_REQUEST: 'bad_request',
  NOT_FOUND: 'not_found',
  INTERNAL_SERVER_ERROR: 'internal_server_error',
} as const;

export type Type = (typeof Type)[keyof typeof Type];

export abstract class Resource<T, O extends object, Q extends object> {
  public constructor(
    protected readonly type: T,
    protected readonly overrides: O
  ) {}

  // リクエストを実行し、レスポンスを生成する
  public handle(request: Request, uri: string): Response {
    if (!this.matches(request, uri)) {
      throw new Error('Request not match.');
    }

    return this.createResponse(request);
  }

  public parseQuery(uri: string): Q {
    return querystring.parse(uri.substring(uri.indexOf('?') + 1)) as Q;
  }

  // 自身を一意に識別する文字列を生成する
  public abstract code(): string;

  // リクエストが自身へのものかどうか判定する
  public abstract matches(request: Request, uri: string): boolean;

  public abstract content(): string;

  // 正常系レスポンスを生成する
  protected abstract createSuccessfulResponse(request: Request): Response;

  protected createBadRequestResponse(request: Request): Response {
    return new Response(null, { status: 400 });
  }

  protected createNotFoundResponse(request: Request): Response {
    return new Response(null, { status: 404 });
  }

  // リソース固有のレスポンス種別に応じたレスポンスを生成するメソッドは「任意」の要素なのでデフォルト実装を用意しておく
  protected createCustomResponse(request: Request): Response | null {
    return null;
  }

  protected createResponse(request: Request, data?: object): Response {
    switch (this.type) {
      case Type.OK:
        return this.createSuccessfulResponse(request);

      case Type.BAD_REQUEST:
        return this.createBadRequestResponse(request);

      case Type.NOT_FOUND:
        return this.createNotFoundResponse(request);
    }

    return this.createCustomResponse(request) ?? new Response(null, { status: 500 });
  }
}

/**
 * 単一のコンテキスト（asfのAPI Route、apollo-shopping、dejimaなど）のモックを表すクラス
 */
export abstract class Upstream {
  private resources: Map<string, Resource<any, object, object>>;

  public constructor(public readonly endpoint: string) {
    this.resources = Map();
  }

  // リクエストを実行する
  public async handle(request: Request): Promise<MockResponseInit> {
    const uri = request.url.replace(new RegExp(`^${this.endpoint}`), '');
    const resource = this.resources.find((resource) => resource.matches(request, uri));

    if (!resource) {
      return {
        body: 'Not found.',
        status: 404,
      };
    }

    const response = resource.handle(request, uri);

    return {
      body: await response.text(),
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
    };
  }

  // リソースを追加する
  protected add<T, O extends object, Q extends object>(resource: Resource<T, O, Q>): void {
    this.resources = this.resources.set(resource.code(), resource);
  }

  protected addAll<T, O extends object, Q extends object>(...resources: Resource<T, O, Q>[]): void {
    resources.forEach((resource) => this.add(resource));
  }
}

/**
 * 複数のupstreamモックを単一のモック関数に束ねるユーティリティ
 */
export const UpstreamRouter = (...upstreams: Upstream[]) => {
  return async (request: Request) => {
    const route = upstreams.find((route) => request.url.startsWith(route.endpoint));

    if (!route) {
      // エンドポイントが一致するものがなければエラーとする
      throw new Error('Request url is not found.');
    }

    return route.handle(request);
  };
};

// upstreamモックを束ねてjest-fetch-mockに結び付ける
export const inject = (...upstreams: Upstream[]): void => {
  fetchMock.mockResponse(UpstreamRouter(...upstreams));
};

export abstract class Media<T extends object, M extends object> {
  protected readonly _data: Required<T>;

  public constructor(protected readonly overrides?: T | M) {
    this._data = this.fill(overrides);
  }

  public data(): Required<T> {
    return this._data;
  }

  public abstract createSuccessfulContent(): string;

  public abstract createFailureContent(): string;

  protected abstract fillByModel(overrides: M): T;

  protected abstract fill(overrides?: T | M): Required<T>;
}
