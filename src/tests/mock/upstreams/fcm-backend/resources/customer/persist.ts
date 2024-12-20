import { List } from 'immutable';

import { Body } from 'acl/fsm-backend/customer/delegate';
import { HttpMethod, Status } from 'aspects/http';
import { Customer } from 'domains/customer';
import { Builder } from 'tests/factories';
import { CustomerFactory } from 'tests/factories/domains/customer';
import { Resource, Type as CommonType } from 'tests/mock/upstreams/common';

import { matchAddress, matchPhoneNumber } from '../helper';

export type Overrides = Customer;

export class PersistResource extends Resource<CommonType, Customer, {}> {
  private static readonly CODE_PREFIX = 'fcm-backend/customres';

  public constructor(
    type: CommonType,
    private readonly method: HttpMethod,
    overrides?: Overrides
  ) {
    super(type, overrides ?? Builder.get(CustomerFactory).build());
  }

  public code(): string {
    return `${PersistResource.CODE_PREFIX}/${this.method}/${this.overrides.identifier}`;
  }

  public matches(request: Request, uri: string): boolean {
    if (request.method !== this.method) {
      return false;
    }

    if (!uri.startsWith(`/customers`)) {
      return false;
    }

    if (!this.matchBody(request)) {
      return false;
    }

    return true;
  }

  public content(): string {
    return '';
  }

  protected createSuccessfulResponse(_: Request): Response {
    const status = this.method === 'POST' ? Status.CREATED : Status.NO_CONTENT;

    return new Response(this.content(), { status });
  }

  private matchBody(request: Request): boolean {
    const body = JSON.parse(String(request.body)) as Body;

    if (this.overrides.identifier.value !== body.identifier) {
      return false;
    }

    if (this.overrides.firstName !== body.name.first) {
      return false;
    }

    if (this.overrides.lastName !== body.name.last) {
      return false;
    }

    if (!matchAddress(this.overrides.address, body.address)) {
      return false;
    }

    if (!matchPhoneNumber(this.overrides.phone, body.phone)) {
      return false;
    }

    if (this.overrides.cemeteries.count() !== body.cemeteries.length) {
      return false;
    }

    const cemeteryValids = this.overrides.cemeteries
      .zip(List(body.cemeteries))
      .every(([expected, actual]) => {
        if (expected.value !== actual) {
          return false;
        }

        return true;
      });

    if (!cemeteryValids) {
      return false;
    }

    if (this.overrides.transactionHistories.count() !== body.transactionHistories.length) {
      return false;
    }

    const historyValids = this.overrides.transactionHistories
      .zip(List(body.transactionHistories))
      .every(([expected, actual]) => {
        if (expected.value !== actual) {
          return false;
        }

        return true;
      });

    if (!historyValids) {
      return false;
    }

    return true;
  }
}
