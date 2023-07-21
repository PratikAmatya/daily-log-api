import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    let token =
      request.headers['x-access-token'] || request.headers.authorization; // Express headers are auto converted to lowercase

    if (!token) {
      throw new ForbiddenException('Token Not Supplied');
    }

    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        throw new ForbiddenException('Invalid Token Supplied');
      } else {
        request.decoded = decoded;
      }
    });

    return true;
  }
}
