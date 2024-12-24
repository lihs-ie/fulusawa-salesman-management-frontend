import { Repository } from 'domains/transaction-history';
import { ACLTransactionHistoryRepository } from 'infrastructures';
import { container } from 'providers/container';

container.bind(Repository).to(ACLTransactionHistoryRepository);
