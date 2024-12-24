import { Repository } from 'domains/user';
import { ACLUserRepository } from 'infrastructures';
import { container } from 'providers/container';

container.bind(Repository).to(ACLUserRepository);
