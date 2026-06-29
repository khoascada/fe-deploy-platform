import type { DeployListItem, DeployStatus, LatestDeploy } from './project';

export type { DeployListItem, DeployStatus, LatestDeploy };

export interface CreateDeploymentResponse {
  id: string;
  projectId: string;
  deploymentNumber: number;
  trigger: LatestDeploy['trigger'];
  status: DeployStatus;
  branch: string;
  queuedAt: string;
  createdAt: string;
}