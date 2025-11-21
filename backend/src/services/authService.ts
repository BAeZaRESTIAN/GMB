import bcrypt from 'bcryptjs';
import database from '../config/database';
import { User, UserRole } from '../types';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  tenantName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  async register(data: RegisterData) {
    const { email, password, firstName, lastName, tenantName } = data;

    // Check if user already exists
    const existingUser = await database.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create tenant if tenant name provided
    let tenantId: string | undefined;
    if (tenantName) {
      const slug = tenantName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const tenantResult = await database.query(
        'INSERT INTO tenants (name, slug) VALUES ($1, $2) RETURNING id',
        [tenantName, slug]
      );
      tenantId = tenantResult.rows[0].id;
    }

    // Create user
    const userResult = await database.query(
      `INSERT INTO users (tenant_id, email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, tenant_id, email, first_name, last_name, role, is_active, email_verified, created_at`,
      [tenantId, email, passwordHash, firstName, lastName, tenantId ? UserRole.TENANT_ADMIN : UserRole.USER]
    );

    const user = userResult.rows[0];

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        tenantId: user.tenant_id,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginData) {
    const { email, password } = data;

    // Find user
    const userResult = await database.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (userResult.rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = userResult.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await database.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        tenantId: user.tenant_id,
      },
      accessToken,
      refreshToken,
    };
  }

  async getUserById(userId: string): Promise<User | null> {
    const result = await database.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await database.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [passwordHash, userId]
    );
  }
}

export default new AuthService();
