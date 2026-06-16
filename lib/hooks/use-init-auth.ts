'use client';

export function useInitAuth(shouldInit: boolean = true) {
  return { isLoading: false, shouldInit };
}
