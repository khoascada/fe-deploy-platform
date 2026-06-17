import { z } from 'zod';

const SettingSchema = z.object({
    id: z.number(),
    theme: z.enum(['light', 'dark']).nullable(),
    language: z.enum(['VN', 'EN']).nullable(),
});

export const UserSchema = z.object({
    id: z.number(),
    user_name: z.string(),
    email: z.email(),
    avt_url: z.string().nullable(),
    role: z.enum(['USER', 'ADMIN']),
    setting: SettingSchema.nullable(),
    is_verified: z.boolean(),
});

export const AuthResponseSchema = z.object({
    user: UserSchema
});

export const MeSchema = z.object({
    id: z.number(),
    email: z.email(),
    avt_url: z.string().nullable(),
    full_name: z.string(),
    phone_number: z.string().nullable().nullable(),
    roles: z.enum(['USER', 'ADMIN']),
    setting: SettingSchema.nullable(),
    is_verified: z.boolean(),
    // github
    github_connected: z.boolean(),
    github_username: z.string().nullable(),
    github_avt_url: z.string().nullable()

});
