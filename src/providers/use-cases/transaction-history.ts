import { container } from 'providers/container';
import { TransactionHistory } from 'use-cases/transaction-history';

container.bind(TransactionHistory).toSelf();
