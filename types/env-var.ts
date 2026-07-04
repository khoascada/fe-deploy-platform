export type EnvVarScope = 'RUNTIME' | 'BUILD' | 'BOTH';

export interface EnvVar {
  id: string;
  projectId: string;
  key: string;
  scope: EnvVarScope;
  isEnabled: boolean;
  hasValue: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnvVarRequest {
  key: string;
  value: string;
  scope: EnvVarScope;
  isEnabled?: boolean;
}

export interface UpdateEnvVarRequest {
  key?: string;
  value?: string;
  scope?: EnvVarScope;
  isEnabled?: boolean;
}
