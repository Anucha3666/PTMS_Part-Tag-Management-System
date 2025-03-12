import { Body, Controller, Post } from '@nestjs/common';

import { SignInDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  // @Post('sign-up')
  // signUp(@Body() signUpDto: SignUpDto) {
  //   return this.authService.create(signUpDto);
  // }

  // @Post('change-role')
  // @UseGuards(JwtAuthGuard)
  // update(@Param('id') id: string, @Body() changeRoleDto: ChangeRoleDto) {
  //   return this.authService.update(id, changeRoleDto);
  // }

  // @Put('change-password')
  // update(
  //   @Param('id') id: string,
  //   @Body() changePasswordDto: ChangePasswordDto,
  // ) {
  //   return this.authService.update(id, changePasswordDto);
  // }

  // @Post('reset-password')
  // update(@Param('id') id: string, @Body() resetPasswordDto: ResetPasswordDto) {
  //   return this.authService.update(id, resetPasswordDto);
  // }
}
