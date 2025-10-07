import { AppDataSource } from '../../data-source.js';
import { User as UserEntity } from '../../entities/user.js';

// Keep an in-memory fallback for dev/testing when DB is not ready
const fallback = new Map<string, any>();
(() => {
  const u1 = { id: 'u_1', name: 'Alice', email: 'alice@example.com', createdAt: new Date() };
  const u2 = { id: 'u_2', name: 'Bob', email: 'bob@example.com', createdAt: new Date() };
  fallback.set(u1.id, u1);
  fallback.set(u2.id, u2);
})();

export const userRepository = {
  async list(): Promise<any[]> {
    if (AppDataSource.isInitialized) {
      const repo = AppDataSource.getRepository(UserEntity);
      const items = await repo.find();
      return items.map((it: any) => ({ id: it.id, name: it.name, email: it.email, createdAt: it.createdAt }));
    }
    return Array.from(fallback.values());
  },
  async create(data: { name: string; email: string }): Promise<any> {
    if (AppDataSource.isInitialized) {
      const repo = AppDataSource.getRepository(UserEntity);
      const entity = repo.create({ name: data.name, email: data.email, createdAt: new Date(), password: (data as any).password });
      const saved = await repo.save(entity);
      return { id: saved.id, name: saved.name, email: saved.email, createdAt: saved.createdAt };
    }
    const id = Math.random().toString(36).slice(2);
    const user = { id, name: data.name, email: data.email, createdAt: new Date() };
    fallback.set(id, user);
    return user;
  },
  async findByEmail(email: string): Promise<any | null> {
    if (AppDataSource.isInitialized) {
      const repo = AppDataSource.getRepository(UserEntity);
      const found = await repo.findOne({ where: { email } });
      if (!found) return null;
      return {
        id: found.id,
        name: found.name,
        email: found.email,
        password: found.password,
        createdAt: found.createdAt,
      };
    }
    for (const u of fallback.values()) {
      if (u.email === email) return u;
    }
    return null;
  },
  async setRefreshToken(userId: string, token: string | null) {
    if (AppDataSource.isInitialized) {
      const repo = AppDataSource.getRepository(UserEntity);
      await repo.update(userId, { refreshToken: token });
      return;
    }
    const u = fallback.get(userId);
    if (u) u.refreshToken = token;
  },
  async findById(id: string) {
    if (AppDataSource.isInitialized) {
      const repo = AppDataSource.getRepository(UserEntity);
      return await repo.findOne({ where: { id } });
    }
    return fallback.get(id) ?? null;
  },
};
