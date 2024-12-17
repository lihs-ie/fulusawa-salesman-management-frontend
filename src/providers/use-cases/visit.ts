import { container } from 'providers/container';
import { Visit } from 'use-cases/visit';

container.bind(Visit).toSelf();
