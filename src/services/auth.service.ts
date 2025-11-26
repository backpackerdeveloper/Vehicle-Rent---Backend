import {
  IUserRepository,
  UserRepository,
} from '../repositories/user.repository';
import {
  IRefreshTokenRepository,
  RefreshTokenRepository,
} from '../repositories/refreshToken.repository';
import { hashPassword, comparePassword } from '../utils/password.util';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
} from '../utils/jwt.util';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from '../utils/errors';
import { SignupInput, LoginInput } from '../schemas/auth.schema';
import { sendPasswordResetEmail } from '../utils/email.util';
import { UserRole } from '../types';

export class AuthService {
  private userRepository: IUserRepository;
  private refreshTokenRepository: IRefreshTokenRepository;

  constructor(
    userRepository?: IUserRepository,
    refreshTokenRepository?: IRefreshTokenRepository
  ) {
    this.userRepository = userRepository || new UserRepository();
    this.refreshTokenRepository =
      refreshTokenRepository || new RefreshTokenRepository();
  }

  async signup(input: SignupInput) {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const passwordHash = await hashPassword(input.password);
    const role = (input.role as UserRole) || 'customer';

    const user = await this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: role.toUpperCase() as 'CUSTOMER' | 'OWNER',
    });

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepository.create({
      token: refreshToken,
      expiresAt,
      user: {
        connect: { id: user.id },
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(input: LoginInput) {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(
      input.password,
      user.passwordHash
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepository.create({
      token: refreshToken,
      expiresAt,
      user: {
        connect: { id: user.id },
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    const tokenRecord = await this.refreshTokenRepository.findByToken(
      refreshToken
    );
    if (!tokenRecord) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    if (tokenRecord.expiresAt < new Date()) {
      await this.refreshTokenRepository.deleteByToken(refreshToken);
      throw new UnauthorizedError('Refresh token expired');
    }

    const decoded = verifyToken(refreshToken);
    const user = await this.userRepository.findById(decoded.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    return { accessToken };
  }

  async logout(refreshToken: string) {
    await this.refreshTokenRepository.deleteByToken(refreshToken);
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return;
    }

    const resetToken = generatePasswordResetToken(user.id);
    await sendPasswordResetEmail(email, resetToken);
  }

  async resetPassword(token: string, newPassword: string) {
    const decoded = verifyPasswordResetToken(token);
    const user = await this.userRepository.findById(decoded.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const passwordHash = await hashPassword(newPassword);
    await this.userRepository.update(user.id, { passwordHash });
  }
}

