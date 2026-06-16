import { cookies } from 'next/headers';
import { env } from '@/env';

interface ServerFetchOptions {
  params?: Record<string, string | number>;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  cache?: RequestCache;
  next?: NextFetchRequestConfig; // Next.js fetch options (tags, revalidate)
}

export async function serverFetch<T>(
  endpoint: string,
  options: ServerFetchOptions = {}
): Promise<T> {
  const { params, method = 'GET', body, cache = 'no-store', next } = options;

  const baseUrl = `${env.BACKEND_URL}${env.NEXT_PUBLIC_API_URL}`;
  // Tránh việc bị mất prefix /api/v1 khi endpoint bắt đầu bằng /
  const fullUrl = `${baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  const url = new URL(fullUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const cookieStore = await cookies();

  const response = await fetch(url.toString(), {
    method,
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieStore.toString(),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache,
    next,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const json = await response.json();
  return json;
}
