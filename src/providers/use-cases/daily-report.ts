import { container } from 'providers/container';
import { DailyReport } from 'use-cases/daily-report';

container.bind(DailyReport).toSelf();
