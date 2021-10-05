import 'express-session';
import { User } from '../../typeorm/entities/User';

declare module 'express-session' {
  interface SessionData {
    user?: User;
  }
}
