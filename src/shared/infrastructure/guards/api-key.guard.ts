import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly expectedKey =
    process.env.API_KEY || '42p8x5tgt3vdyj82VOhRgpCKvgR2dO1k';

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey: string | undefined = request.headers['x-api-key'];

    if (!apiKey || apiKey !== this.expectedKey) {
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }
}
