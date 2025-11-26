import { AuthService } from '../../src/services/auth.service';
import { UserRepository } from '../../src/repositories/user.repository';
import { RefreshTokenRepository } from '../../src/repositories/refreshToken.repository';
import { ConflictError, UnauthorizedError } from '../../src/utils/errors';

jest.mock('../../src/repositories/user.repository');
jest.mock('../../src/repositories/refreshToken.repository');
jest.mock('../../src/utils/email.util');

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockRefreshTokenRepository: jest.Mocked<RefreshTokenRepository>;

  beforeEach(() => {
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    mockRefreshTokenRepository = new RefreshTokenRepository() as jest.Mocked<RefreshTokenRepository>;
    authService = new AuthService(mockUserRepository, mockRefreshTokenRepository);
  });

  describe('signup', () => {
    it('should create a new user successfully', async () => {
      const input = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'customer' as const,
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue({
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        role: 'CUSTOMER',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockRefreshTokenRepository.create.mockResolvedValue({
        id: 'token-1',
        userId: 'user-1',
        token: 'refresh-token',
        expiresAt: new Date(),
        createdAt: new Date(),
      });

      const result = await authService.signup(input);

      expect(result.user.email).toBe(input.email);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw ConflictError if email already exists', async () => {
      const input = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      mockUserRepository.findByEmail.mockResolvedValue({
        id: 'user-1',
        name: 'Existing User',
        email: 'test@example.com',
        passwordHash: 'hash',
        role: 'CUSTOMER',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(authService.signup(input)).rejects.toThrow(ConflictError);
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const input = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockUserRepository.findByEmail.mockResolvedValue({
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        role: 'CUSTOMER',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      mockRefreshTokenRepository.create.mockResolvedValue({
        id: 'token-1',
        userId: 'user-1',
        token: 'refresh-token',
        expiresAt: new Date(),
        createdAt: new Date(),
      });

      const result = await authService.login(input);

      expect(result.user.email).toBe(input.email);
      expect(result.accessToken).toBeDefined();
    });

    it('should throw UnauthorizedError with invalid credentials', async () => {
      const input = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login(input)).rejects.toThrow(UnauthorizedError);
    });
  });
});


