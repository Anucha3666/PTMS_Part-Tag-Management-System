import {
  Body,
  Controller,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
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

  @Patch('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  update(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    const account_id = req.user.account_id;
    return this.authService.changePassword(account_id, changePasswordDto);
  }
}
