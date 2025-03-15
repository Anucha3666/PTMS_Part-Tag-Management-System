import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ClassAuthHelper {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(dataUser: any): string {
    return this.jwtService.sign({
      account_id: dataUser._id,
      username: dataUser.username,
      employee_number: dataUser.employee_number,
    });
  }
}

export const AuthHelper = {
  class: new ClassAuthHelper(new JwtService()),
};
