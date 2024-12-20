import { User } from 'domains/user';
import { container } from 'providers/container';

container.bind(User).toSelf();
