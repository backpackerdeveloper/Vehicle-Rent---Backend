import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess } from '../utils/response.util';
import {
  SignupInput,
  LoginInput,
  RefreshTokenInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '../schemas/auth.schema';

export class AuthController {
  private authService: AuthService;

  constructor(authService?: AuthService) {
    this.authService = authService || new AuthService();
  }

  signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = req.body as SignupInput;
      const result = await this.authService.signup(input);
      sendSuccess(res, result, 'User registered successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = req.body as LoginInput;
      const result = await this.authService.login(input);
      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = req.body as RefreshTokenInput;
      const result = await this.authService.refreshToken(input.refreshToken);
      sendSuccess(res, result, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = req.body as RefreshTokenInput;
      await this.authService.logout(input.refreshToken);
      sendSuccess(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = req.body as ForgotPasswordInput;
      await this.authService.forgotPassword(input.email);
      sendSuccess(
        res,
        null,
        'If the email exists, a password reset link has been sent'
      );
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = req.body as ResetPasswordInput;
      await this.authService.resetPassword(input.token, input.password);
      sendSuccess(res, null, 'Password reset successfully');
    } catch (error) {
      next(error);
    }
  };
}

