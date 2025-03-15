import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Roles } from '../guards/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import {
  ChangePasswordDto,
  ChangeRoleDto,
  SignInDto,
  SignUpDto,
} from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'owner')
  @Post('change-role/:account_id')
  changeRole(
    @Param('account_id') account_id: string,
    @Body() changeRoleDto: ChangeRoleDto,
  ) {
    return this.authService.changeRole(account_id, changeRoleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  update(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    const account_id = req.user.account_id;
    return this.authService.changePassword(account_id, changePasswordDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @Post('reset-password/:account_id')
  resetPassword(@Param('account_id') account_id: string) {
    return this.authService.resetPassword(account_id);
  }
}
