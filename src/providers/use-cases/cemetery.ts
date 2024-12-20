import { container } from 'providers/container';
import { Cemetery } from 'use-cases/cemetery';

container.bind(Cemetery).toSelf();
