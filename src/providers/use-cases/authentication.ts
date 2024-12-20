import { container } from 'providers/container';
import { Authentication } from 'use-cases/authentication';

container.bind(Authentication).toSelf();
