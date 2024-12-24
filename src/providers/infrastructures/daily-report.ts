import { Repository } from 'domains/daily-report';
import { ACLDailyReportRepository } from 'infrastructures';
import { container } from 'providers/container';

container.bind(Repository).to(ACLDailyReportRepository);
