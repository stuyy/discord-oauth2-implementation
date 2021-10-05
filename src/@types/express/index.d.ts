import 'express';
import { User } from '../../typeorm/entities/User';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
