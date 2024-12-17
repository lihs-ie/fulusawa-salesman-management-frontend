import { container } from 'providers/container';
import { Customer } from 'use-cases/customer';

container.bind(Customer).toSelf();
