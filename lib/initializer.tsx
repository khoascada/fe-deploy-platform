'use client';

import { ReactNode } from 'react';

interface AppInitializerProps {
  children: ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  return <>{children}</>;
}
