import { z } from 'zod';
import * as bcrypt from 'bcryptjs';
import { userRepository } from './userRepository.js';
import { jwtUtil } from '../../utils/jwt.js';
import crypto from 'crypto';

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});
export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const userService = {
  async list() {
    return userRepository.list();
  },
  async create(input: unknown) {
    const data = CreateUserSchema.parse(input);
    // hash password if provided
    const toCreate: any = { ...data };
    if ((input as any).password) {
      toCreate.password = await bcrypt.hash((input as any).password, 10);
    }
    return userRepository.create(toCreate);
  },
  async login(input: unknown) {
    const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
    const data = LoginSchema.parse(input);
    const user = await userRepository.findByEmail(data.email);
    if (!user) throw new Error('Invalid credentials');
    const match = await bcrypt.compare(data.password, user.password ?? '');
    if (!match) throw new Error('Invalid credentials');
    // Issue tokens
    const access = jwtUtil.signAccess({ sub: user.id, email: user.email });
    const refresh = jwtUtil.signRefresh({ sub: user.id });
    // Store a hash of refresh token (or token itself in dev)
    const refreshHash = crypto.createHash('sha256').update(refresh).digest('hex');
    await userRepository.setRefreshToken(user.id, refreshHash);
    const { password, ...safe } = user;
    return { user: safe, access, refresh };
  },
  async refresh(token: string) {
    if (!token) throw new Error('Missing token');
    const payload: any = jwtUtil.verifyRefresh(token);
    const user = await userRepository.findById(payload.sub);
    if (!user) throw new Error('Invalid token');
    const currentHash = crypto.createHash('sha256').update(token).digest('hex');
    if (user.refreshToken !== currentHash) throw new Error('Invalid token');
    const access = jwtUtil.signAccess({ sub: user.id, email: user.email });
    const refresh = jwtUtil.signRefresh({ sub: user.id });
    const refreshHash = crypto.createHash('sha256').update(refresh).digest('hex');
    await userRepository.setRefreshToken(user.id, refreshHash);
    const { password, ...safe } = user;
    return { user: safe, access, refresh };
  },
  async logout(userId: string) {
    await userRepository.setRefreshToken(userId, null);
  },
};
