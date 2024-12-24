import { Repository } from 'domains/visit';
import { ACLVisitRepository } from 'infrastructures';
import { container } from 'providers/container';

container.bind(Repository).to(ACLVisitRepository);
