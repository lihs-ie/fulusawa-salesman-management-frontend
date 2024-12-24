import { HttpMethod } from 'aspects/http';

import { Upstream, Type as CommonType, inject } from '../common';

import {
  IntrospectionOverrides,
  IntrospectionResource,
  LoginOverrides,
  LoginResource,
  LogoutOverrides,
  LogoutResource,
  RefreshOverrides,
  RefreshResource,
  RevokeOverrides,
  RevokeResource,
} from './resources/authentication';
import {
  CemeteriesListOverrides,
  CemeteryDeleteOverrides,
  CemeteryDeleteResource,
  CemeteryFindOverrides,
  CemeteryFindResource,
  CemeteryListResource,
  CemeteryPersistOverrides,
  CemeteryPersistResource,
} from './resources/cemetery';
import {
  CustomerListOverrides,
  CustomerDeleteOverrides,
  CustomerDeleteResource,
  CustomerFindOverrides,
  CustomerFindResource,
  CustomerListResource,
  CustomerPersistOverrides,
  CustomerPersistResource,
} from './resources/customer';
import {
  DailyReportListOverrides,
  DailyReportDeleteOverrides,
  DailyReportDeleteResource,
  DailyReportFindOverrides,
  DailyReportFindResource,
  DailyReportListResource,
  DailyReportPersistOverrides,
  DailyReportPersistResource,
} from './resources/daily-report';
import {
  FeedbackListOverrides,
  FeedbackDeleteOverrides,
  FeedbackDeleteResource,
  FeedbackFindOverrides,
  FeedbackFindResource,
  FeedbackListResource,
  FeedbackPersistOverrides,
  FeedbackPersistResource,
} from './resources/feedback';
import {
  ScheduleListOverrides,
  ScheduleDeleteOverrides,
  ScheduleDeleteResource,
  ScheduleFindOverrides,
  ScheduleFindResource,
  ScheduleListResource,
  SchedulePersistOverrides,
  SchedulePersistResource,
} from './resources/schedule';
import {
  TransactionHistoryListOverrides,
  TransactionHistoryDeleteOverrides,
  TransactionHistoryDeleteResource,
  TransactionHistoryFindOverrides,
  TransactionHistoryFindResource,
  TransactionHistoryListResource,
  TransactionHistoryPersistOverrides,
  TransactionHistoryPersistResource,
} from './resources/transaction-history';
import {
  UserListOverrides,
  UserDeleteOverrides,
  UserDeleteResource,
  UserFindOverrides,
  UserFindResource,
  UserListResource,
  UserPersistOverrides,
  UserPersistResource,
} from './resources/user';
import {
  VisitListOverrides,
  VisitDeleteOverrides,
  VisitDeleteResource,
  VisitFindOverrides,
  VisitFindResource,
  VisitListResource,
  VisitPersistOverrides,
  VisitPersistResource,
} from './resources/visit';

export class FSMBackend extends Upstream {
  public addCemeteryFind(
    type: CommonType,
    overrides?: CemeteryFindOverrides
  ): CemeteryFindResource {
    const resource = new CemeteryFindResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addCemeteryList(
    type: CommonType,
    overrides?: CemeteriesListOverrides
  ): CemeteryListResource {
    const resource = new CemeteryListResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addCemeteryPersist(
    type: CommonType,
    method: HttpMethod,
    overrides?: CemeteryPersistOverrides
  ): CemeteryPersistResource {
    const resource = new CemeteryPersistResource(type, method, overrides);
    this.add(resource);

    return resource;
  }

  public addCemeteryDelete(
    type: CommonType,
    overrides?: CemeteryDeleteOverrides
  ): CemeteryDeleteResource {
    const resource = new CemeteryDeleteResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addCustomerFind(
    type: CommonType,
    overrides?: CustomerFindOverrides
  ): CustomerFindResource {
    const resource = new CustomerFindResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addCustomerList(
    type: CommonType,
    overrides?: CustomerListOverrides
  ): CustomerListResource {
    const resource = new CustomerListResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addCustomerPersist(
    type: CommonType,
    method: HttpMethod,
    overrides?: CustomerPersistOverrides
  ): CustomerPersistResource {
    const resource = new CustomerPersistResource(type, method, overrides);
    this.add(resource);

    return resource;
  }

  public addCustomerDelete(
    type: CommonType,
    overrides?: CustomerDeleteOverrides
  ): CustomerDeleteResource {
    const resource = new CustomerDeleteResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addDailyReportFind(
    type: CommonType,
    overrides?: DailyReportFindOverrides
  ): DailyReportFindResource {
    const resource = new DailyReportFindResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addDailyReportList(
    type: CommonType,
    overrides?: DailyReportListOverrides
  ): DailyReportListResource {
    const resource = new DailyReportListResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addDailyReportPersist(
    type: CommonType,
    method: HttpMethod,
    overrides?: DailyReportPersistOverrides
  ): DailyReportPersistResource {
    const resource = new DailyReportPersistResource(type, method, overrides);
    this.add(resource);

    return resource;
  }

  public addDailyReportDelete(
    type: CommonType,
    overrides?: DailyReportDeleteOverrides
  ): DailyReportDeleteResource {
    const resource = new DailyReportDeleteResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addFeedbackFind(
    type: CommonType,
    overrides?: FeedbackFindOverrides
  ): FeedbackFindResource {
    const resource = new FeedbackFindResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addFeedbackList(
    type: CommonType,
    overrides?: FeedbackListOverrides
  ): FeedbackListResource {
    const resource = new FeedbackListResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addFeedbackPersist(
    type: CommonType,
    method: HttpMethod,
    overrides?: FeedbackPersistOverrides
  ): FeedbackPersistResource {
    const resource = new FeedbackPersistResource(type, method, overrides);
    this.add(resource);

    return resource;
  }

  public addFeedbackDelete(
    type: CommonType,
    overrides?: FeedbackDeleteOverrides
  ): FeedbackDeleteResource {
    const resource = new FeedbackDeleteResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addScheduleFind(
    type: CommonType,
    overrides?: ScheduleFindOverrides
  ): ScheduleFindResource {
    const resource = new ScheduleFindResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addScheduleList(
    type: CommonType,
    overrides?: ScheduleListOverrides
  ): ScheduleListResource {
    const resource = new ScheduleListResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addSchedulePersist(
    type: CommonType,
    method: HttpMethod,
    overrides?: SchedulePersistOverrides
  ): SchedulePersistResource {
    const resource = new SchedulePersistResource(type, method, overrides);
    this.add(resource);

    return resource;
  }

  public addScheduleDelete(
    type: CommonType,
    overrides?: ScheduleDeleteOverrides
  ): ScheduleDeleteResource {
    const resource = new ScheduleDeleteResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addTransactionHistoryFind(
    type: CommonType,
    overrides?: TransactionHistoryFindOverrides
  ): TransactionHistoryFindResource {
    const resource = new TransactionHistoryFindResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addTransactionHistoryList(
    type: CommonType,
    overrides?: TransactionHistoryListOverrides
  ): TransactionHistoryListResource {
    const resource = new TransactionHistoryListResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addTransactionHistoryPersist(
    type: CommonType,
    method: HttpMethod,
    overrides?: TransactionHistoryPersistOverrides
  ): TransactionHistoryPersistResource {
    const resource = new TransactionHistoryPersistResource(type, method, overrides);
    this.add(resource);

    return resource;
  }

  public addTransactionHistoryDelete(
    type: CommonType,
    overrides?: TransactionHistoryDeleteOverrides
  ): TransactionHistoryDeleteResource {
    const resource = new TransactionHistoryDeleteResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addVisitFind(type: CommonType, overrides?: VisitFindOverrides): VisitFindResource {
    const resource = new VisitFindResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addVisitList(type: CommonType, overrides?: VisitListOverrides): VisitListResource {
    const resource = new VisitListResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addVisitPersist(
    type: CommonType,
    method: HttpMethod,
    overrides?: VisitPersistOverrides
  ): VisitPersistResource {
    const resource = new VisitPersistResource(type, method, overrides);
    this.add(resource);

    return resource;
  }

  public addVisitDelete(type: CommonType, overrides?: VisitDeleteOverrides): VisitDeleteResource {
    const resource = new VisitDeleteResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addUserFind(type: CommonType, overrides?: UserFindOverrides): UserFindResource {
    const resource = new UserFindResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addUserList(type: CommonType, overrides?: UserListOverrides): UserListResource {
    const resource = new UserListResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addUserPersist(
    type: CommonType,
    method: HttpMethod,
    overrides?: UserPersistOverrides
  ): UserPersistResource {
    const resource = new UserPersistResource(type, method, overrides);
    this.add(resource);

    return resource;
  }

  public addUserDelete(type: CommonType, overrides?: UserDeleteOverrides): UserDeleteResource {
    const resource = new UserDeleteResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addIntrospection(
    type: CommonType,
    overrides: IntrospectionOverrides
  ): IntrospectionResource {
    const resource = new IntrospectionResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addLogin(type: CommonType, overrides: LoginOverrides): LoginResource {
    const resource = new LoginResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addLogout(type: CommonType, overrides: LogoutOverrides): LogoutResource {
    const resource = new LogoutResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addRefresh(type: CommonType, overrides: RefreshOverrides): RefreshResource {
    const resource = new RefreshResource(type, overrides);
    this.add(resource);

    return resource;
  }

  public addRevoke(type: CommonType, overrides: RevokeOverrides): RevokeResource {
    const resource = new RevokeResource(type, overrides);
    this.add(resource);

    return resource;
  }
}

export const prepare = <R>(endpoint: string, registerer: (upstream: FSMBackend) => R): R => {
  const upstream = new FSMBackend(endpoint);

  const resources = registerer(upstream);

  inject(upstream);

  return resources;
};
