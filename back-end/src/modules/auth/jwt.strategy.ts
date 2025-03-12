import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTUtils } from 'src/utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY ?? 'SECRET_KEY',
    });
  }

  
  async validate(payload: any) {
    try {
      const verifiedToken = await JWTUtils.verify(payload);  
      if (!verifiedToken) {
        throw new UnauthorizedException('Invalid token');
      }
      return verifiedToken;  
    } catch () {
      throw new UnauthorizedException('Token verification failed');
    }
  }
}
