import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

export class AuthService {
  async register(email: string, passwordRaw: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await hashPassword(passwordRaw);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        roles: 'user'
      }
    });

    return { id: user.id, email: user.email, roles: user.roles };
  }

  async login(email: string, passwordRaw: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await verifyPassword(passwordRaw, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const rolesList = user.roles.split(',').map((r: any) => r.trim());
    
    const token = generateToken({
      sub: user.id,
      email: user.email,
      roles: rolesList
    });

    return { accessToken: token, tokenType: 'Bearer' };
  }
}
