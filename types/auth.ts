import { MeSchema, UserSchema } from '@/lib/schemas/auth.schema';
import { z } from 'zod';

export type User = z.infer<typeof UserSchema>;
export type Me = z.infer<typeof MeSchema>;

export interface UpdateProfileData {
  name: string;
  avatarUrl?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  theme: 'LIGHT' | 'DARK';
  language: 'VI' | 'EN';
}

export interface AuthResponse {
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RefreshTokenResponse {}

export interface RoleOption {
  id: number;
  name: string;
  description?: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordFormData extends ChangePasswordData {
  confirmPassword: string;
}
