import { Repository } from 'domains/cemetery';
import { ACLCemeteryRepository } from 'infrastructures';
import { container } from 'providers/container';

container.bind(Repository).to(ACLCemeteryRepository);
