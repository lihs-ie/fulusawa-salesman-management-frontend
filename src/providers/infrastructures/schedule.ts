import { Repository } from 'domains/schedule';
import { ACLScheduleRepository } from 'infrastructures';
import { container } from 'providers/container';

container.bind(Repository).to(ACLScheduleRepository);
