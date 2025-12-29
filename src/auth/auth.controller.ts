import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(ResponseInterceptor)
  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiOperation({ summary: 'register a new user' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @UseInterceptors(ResponseInterceptor)
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: 'login user' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
