import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '@/messages/en.json';
import type { LogItem } from '@/types/log';
import type { DeployListItem, ProjectListItem } from '@/types/project';
import { LogsPageView } from './logs-page-view';

const projects: ProjectListItem[] = [
  {
    id: 'project-acme-web',
    name: 'Acme Web',
    repoFullName: 'acme/acme-web',
    deployBranch: 'main',
    latestDeploy: {
      id: 'deploy-104',
      status: 'BUILDING',
      commitSha: '7a3f52ce8ab42c4a6cf2a4b7f42f09f42f3390cc',
      commitMessage: 'Ship log filters and terminal polish',
      createdAt: '2026-07-02T08:15:00.000Z',
      finishedAt: null,
      trigger: 'GITHUB_PUSH',
    },
    deployCount: 104,
    repoUrl: 'https://github.com/acme/acme-web',
    webhookId: 'wh_123',
    isWebhookProvisioned: true,
  },
  {
    id: 'project-admin-portal',
    name: 'Admin Portal',
    repoFullName: 'acme/admin-portal',
    deployBranch: 'release',
    latestDeploy: {
      id: 'deploy-91',
      status: 'FAILED',
      commitSha: 'c69b2f49e9e3e82f0ebaf765917eb43f409492c1',
      commitMessage: 'Rework access policy checks',
      createdAt: '2026-07-01T04:30:00.000Z',
      finishedAt: '2026-07-01T04:41:00.000Z',
      trigger: 'MANUAL',
    },
    deployCount: 91,
    repoUrl: 'https://github.com/acme/admin-portal',
    webhookId: 'wh_456',
    isWebhookProvisioned: true,
  },
  {
    id: 'project-docs',
    name: 'Docs Hub',
    repoFullName: 'acme/docs-hub',
    deployBranch: 'main',
    latestDeploy: null,
    deployCount: 0,
    repoUrl: 'https://github.com/acme/docs-hub',
    webhookId: null,
    isWebhookProvisioned: false,
  },
];

const deployments: DeployListItem[] = [
  {
    id: 'deploy-104',
    projectId: 'project-acme-web',
    deploymentNumber: 104,
    status: 'BUILDING',
    trigger: 'GITHUB_PUSH',
    branch: 'main',
    commitSha: '7a3f52ce8ab42c4a6cf2a4b7f42f09f42f3390cc',
    commitMessage: 'Ship log filters and terminal polish',
    queuedAt: '2026-07-02T08:13:00.000Z',
    createdAt: '2026-07-02T08:15:00.000Z',
    finishedAt: null,
    containerId: 'ctr_104',
    port: 3000,
  },
  {
    id: 'deploy-103',
    projectId: 'project-acme-web',
    deploymentNumber: 103,
    status: 'SUCCESS',
    trigger: 'MANUAL',
    branch: 'main',
    commitSha: '26d3bf16e5fd4f2b6179fd2f9c3ad20fd9886c1a',
    commitMessage: 'Improve dashboard empty states',
    queuedAt: '2026-07-01T15:08:00.000Z',
    createdAt: '2026-07-01T15:10:00.000Z',
    finishedAt: '2026-07-01T15:14:00.000Z',
    containerId: 'ctr_103',
    port: 3000,
  },
  {
    id: 'deploy-102',
    projectId: 'project-acme-web',
    deploymentNumber: 102,
    status: 'FAILED',
    trigger: 'GITHUB_PUSH',
    branch: 'feature/logs-console',
    commitSha: '9be78294ef3d89e8c228529c31f8a17ca8b2ad4c',
    commitMessage: 'Add live log viewer shell',
    queuedAt: '2026-06-30T10:02:00.000Z',
    createdAt: '2026-06-30T10:05:00.000Z',
    finishedAt: '2026-06-30T10:09:00.000Z',
    containerId: 'ctr_102',
    port: 3001,
  },
];

const logs: LogItem[] = [
  {
    id: 'log-1',
    deploymentId: 'deploy-104',
    projectId: 'project-acme-web',
    seq: 1,
    level: 'INFO',
    stream: 'SYSTEM',
    message: 'Deployment accepted by runner. Preparing build workspace.',
    createdAt: '2026-07-02T08:15:04.000Z',
  },
  {
    id: 'log-2',
    deploymentId: 'deploy-104',
    projectId: 'project-acme-web',
    seq: 2,
    level: 'INFO',
    stream: 'STDOUT',
    message: 'Cloning github.com/acme/acme-web#main into /workspace/app.',
    createdAt: '2026-07-02T08:15:11.000Z',
  },
  {
    id: 'log-3',
    deploymentId: 'deploy-104',
    projectId: 'project-acme-web',
    seq: 3,
    level: 'WARN',
    stream: 'STDERR',
    message: 'pnpm warned about a deprecated transitive dependency during install.',
    createdAt: '2026-07-02T08:15:24.000Z',
  },
  {
    id: 'log-4',
    deploymentId: 'deploy-104',
    projectId: 'project-acme-web',
    seq: 4,
    level: 'INFO',
    stream: 'STDOUT',
    message: 'Compiled /logs in 2.8s with 0 type errors.',
    createdAt: '2026-07-02T08:15:41.000Z',
  },
  {
    id: 'log-5',
    deploymentId: 'deploy-104',
    projectId: 'project-acme-web',
    seq: 5,
    level: 'DEBUG',
    stream: 'SYSTEM',
    message: 'Waiting for container health check on port 3000.',
    createdAt: '2026-07-02T08:15:53.000Z',
  },
];

const meta: Meta<typeof LogsPageView> = {
  title: 'App/Logs/LogsPageView',
  component: LogsPageView,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <div className="bg-background min-h-screen p-4 md:p-8">
          <div className="mx-auto max-w-[1440px]">
            <Story />
          </div>
        </div>
      </NextIntlClientProvider>
    ),
  ],
  args: {
    deploymentErrorMessage: '',
    deployments,
    hasSearchQuery: false,
    isDeploymentsError: false,
    isDeploymentsLoading: false,
    isLogsError: false,
    isLogsLoading: false,
    isProjectsError: false,
    isProjectsLoading: false,
    logs,
    logsErrorMessage: '',
    onDeploymentChange: () => {},
    onProjectChange: () => {},
    onRetryDeployments: () => {},
    onRetryProjects: () => {},
    onSearchChange: () => {},
    projectErrorMessage: '',
    projects,
    searchQuery: '',
    selectedDeployment: deployments[0],
    selectedProject: projects[0],
  },
};

export default meta;

type Story = StoryObj<typeof LogsPageView>;

export const Default: Story = {};

export const NoSelection: Story = {
  args: {
    deployments: [],
    logs: [],
    selectedDeployment: null,
    selectedProject: null,
  },
};

export const Loading: Story = {
  args: {
    deployments: [],
    isDeploymentsLoading: true,
    isLogsLoading: true,
    isProjectsLoading: true,
    logs: [],
    projects: [],
    selectedDeployment: null,
    selectedProject: null,
  },
};

export const EmptySearchResults: Story = {
  args: {
    deployments: [],
    hasSearchQuery: true,
    logs: [],
    projects: [],
    searchQuery: 'billing',
    selectedDeployment: null,
    selectedProject: null,
  },
};

export const ProjectsError: Story = {
  args: {
    deployments: [],
    isProjectsError: true,
    logs: [],
    projectErrorMessage: 'Unable to load repositories from GitHub right now.',
    projects: [],
    selectedDeployment: null,
    selectedProject: null,
  },
};

export const LogsError: Story = {
  args: {
    isLogsError: true,
    logs: [],
    logsErrorMessage: 'The log stream disconnected before the snapshot finished loading.',
  },
};
