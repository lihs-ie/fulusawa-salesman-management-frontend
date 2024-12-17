import { container } from 'providers/container';
import { Schedule } from 'use-cases/schedule';

container.bind(Schedule).toSelf();
