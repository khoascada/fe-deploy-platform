import { z } from 'zod';

const GithubConnectionSchema = z.object({
  isConnected: z.boolean(),
  username: z.string().nullable(),
  avatarUrl: z.string().nullable(),
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  avatarUrl: z.string().nullable(),
  role: z.enum(['USER', 'ADMIN']),
  theme: z.enum(['LIGHT', 'DARK']),
  language: z.enum(['VI', 'EN']),
  isVerifiedEmail: z.boolean(),
});

export const AuthResponseSchema = z.object({
  user: UserSchema,
});

export const MeSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  avatarUrl: z.string().nullable(),
  role: z.enum(['USER', 'ADMIN']),
  theme: z.enum(['LIGHT', 'DARK']),
  language: z.enum(['VI', 'EN']),
  isVerifiedEmail: z.boolean(),
  githubConnection: GithubConnectionSchema,
});
