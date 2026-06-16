import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    BACKEND_URL: z.url().default('http://localhost:4000'),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.url().default('http://localhost:4000/api/v1'),
    NEXT_PUBLIC_SOCKET_URL: z.url().default('http://localhost:4000'),
    NEXT_PUBLIC_SSE_URL: z.url().optional(),
    NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
  },
  runtimeEnv: {
    BACKEND_URL: process.env.BACKEND_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
    NEXT_PUBLIC_SSE_URL: process.env.NEXT_PUBLIC_SSE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
});
