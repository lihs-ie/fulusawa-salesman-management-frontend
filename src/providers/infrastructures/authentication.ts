import { Repository } from 'domains/authentication';
import { ACLAuthenticationRepository } from 'infrastructures';
import { container } from 'providers/container';

container.bind(Repository).to(ACLAuthenticationRepository);
