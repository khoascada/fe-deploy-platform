import { validateResponse } from '@/lib/utils/validate-response';
import type {
    AuthResponse,
    ChangePasswordData,
    LoginCredentials,
    Me,
    RefreshTokenResponse,
    RegisterData,
    UpdateProfileData
} from '@/types/auth';
import apiClient from '@lib/api/api-client';
import { AuthResponseSchema, MeSchema } from '@lib/schemas/auth.schema';
import type { ApiResponse } from '@lib/types/base';

// API functions
export const authApi = {
    login: async (credentials: LoginCredentials) => {
        const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
        const data = validateResponse(AuthResponseSchema, response.data.data);
        return { ...response.data, data };
    },

    register: async (data: RegisterData) => {
        const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
        const validated = validateResponse(AuthResponseSchema, response.data.data);
        return { ...response.data, data: validated };
    },

    getMe: async () => {
        const response = await apiClient.get<ApiResponse<Me>>('/users/me');
        return validateResponse(MeSchema, response.data.data);
    },

    updateProfile: async (data: UpdateProfileData) => {
        const response = await apiClient.patch<ApiResponse<void>>('/user/me', data);
        return response.data;
    },

    uploadAvatar: async (data: FormData) => {
        const response = await apiClient.post<ApiResponse<{ url: string }>>('/user/me/upload', data, {
            headers: {
                'Content-Type': undefined,
                // cần xóa content type mặc định mà ta config để axios tự định nghĩa multipart/form-data để có gửi boundary
            },
        });
        return response.data.data;
    },

    changePassword: async (data: ChangePasswordData) => {
        const response = await apiClient.patch<ApiResponse<void>>('/user/me/change-password', data);
        return response.data;
    },

    logout: async () => {
        const response = await apiClient.post<ApiResponse<void>>('/auth/logout');
        return response.data;
    },

    refresh: async () => {
        const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh');
        return response.data;
    },

    verifyEmail: async (code: string) => {
        return await apiClient.post('/auth/verify', {
            code
        })
    },

    resendVerify: async () => {
        return await apiClient.post('/auth/resend-verification')
    }
};
