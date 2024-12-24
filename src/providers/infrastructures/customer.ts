import { Repository } from 'domains/customer';
import { ACLCustomerRepository } from 'infrastructures';
import { container } from 'providers/container';

container.bind(Repository).to(ACLCustomerRepository);
