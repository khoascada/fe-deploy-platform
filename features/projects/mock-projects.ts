import type { ProjectListItem, ProjectListResponse } from '@/types/project';

export const mockProjects: ProjectListItem[] = [
  {
    id: 'project-wordy-web',
    name: 'wordy-web',
    repoFullName: 'khoa/wordy-web',
    branch: 'main',
    latestDeploy: {
      id: 'deploy-wordy-web-1',
      status: 'SUCCESS',
      commitSha: 'a12bc3f5d6789ef0123456789abcdef01234567',
      commitMsg: 'Deploy latest frontend changes',
      createdAt: '2026-06-17T03:20:00.000Z',
      finishedAt: '2026-06-17T03:24:00.000Z',
      triggeredBy: 'manual',
    },
    deployCount: 12,
    repoUrl: 'http://14.xxx.xxx.xxx:3001',
    webhookStatus: 'CONNECTED',
  },
  {
    id: 'project-deploy-api',
    name: 'deploy-api',
    repoFullName: 'khoa/deploy-api',
    branch: 'develop',
    latestDeploy: {
      id: 'deploy-deploy-api-1',
      status: 'BUILDING',
      commitSha: 'b45de67fa1234567890abcdef1234567890abcd',
      commitMsg: 'Run container rebuild',
      createdAt: '2026-06-17T04:05:00.000Z',
      finishedAt: null,
      triggeredBy: 'webhook',
    },
    deployCount: 27,
    repoUrl: 'http://14.xxx.xxx.xxx:4000',
    webhookStatus: 'CONNECTED',
  },
  {
    id: 'project-monitoring',
    name: 'monitoring-dashboard',
    repoFullName: 'khoa/monitoring-dashboard',
    branch: 'main',
    latestDeploy: {
      id: 'deploy-monitoring-1',
      status: 'FAILED',
      commitSha: 'c89ef0123456789abcdef0123456789abcdef01',
      commitMsg: 'Fix log stream parser',
      createdAt: '2026-06-16T23:12:00.000Z',
      finishedAt: '2026-06-16T23:15:00.000Z',
      triggeredBy: 'manual',
    },
    deployCount: 9,
    repoUrl: null,
    webhookStatus: 'ERROR',
  },
  {
    id: 'project-docs',
    name: 'platform-docs',
    repoFullName: 'khoa/platform-docs',
    branch: 'main',
    latestDeploy: null,
    deployCount: 0,
    repoUrl: null,
    webhookStatus: 'MISSING',
  },
];

export const mockProjectListResponse: ProjectListResponse = {
  projects: mockProjects,
  total: 12,
  totalPage: 2,
};

export const emptyProjectListResponse: ProjectListResponse = {
  projects: [],
  total: 0,
  totalPage: 0,
};
