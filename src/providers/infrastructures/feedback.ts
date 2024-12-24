import { Repository } from 'domains/feedback';
import { ACLFeedbackRepository } from 'infrastructures';
import { container } from 'providers/container';

container.bind(Repository).to(ACLFeedbackRepository);
