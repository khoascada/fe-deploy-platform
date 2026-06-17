import { MeSchema, UserSchema } from '@/lib/schemas/auth.schema';
import { z } from 'zod';

export type User = z.infer<typeof UserSchema>;
export type Me = z.infer<typeof MeSchema>;

export interface UpdateProfileData {
  full_name?: string;
  address?: string;
  phone_number?: string | null;
  avt_url?: string;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Register data
export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  theme?: 'light' | 'dark';
  language?: 'VI' | 'EN';
}

// Auth response from API
export interface AuthResponse {
  user: User;
}



// Refresh token request
export interface RefreshTokenRequest {
  refreshToken: string;
}

// Refresh token response - AT is now set via cookie
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RefreshTokenResponse { }

export interface RoleOption {
  id: number;
  name: string;
  description?: string;
}

// Change password data
export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

export interface ChangePasswordFormData extends ChangePasswordData {
  confirm_password: string;
}
