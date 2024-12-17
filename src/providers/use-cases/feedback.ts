import { container } from 'providers/container';
import { Feedback } from 'use-cases/feedback';

container.bind(Feedback).toSelf();
