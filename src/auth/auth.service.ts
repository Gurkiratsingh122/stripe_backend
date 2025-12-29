import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async register(dto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(dto.email);
    console.log(existingUser);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userService.create({
      ...dto,
      password: hashedPassword,
    });

    return { accessToken: this.generateToken(user), user };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new ConflictException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new ConflictException('Invalid password');
    }

    const { accessToken } = this.generateToken(user);
    return {
      accessToken,
      user: { _id: user._id, email: user.email, name: user.username },
    };
  }

  private generateToken(user: any) {
    const payload = {
      sub: user._id,
      email: user.email,
    };

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }
}
