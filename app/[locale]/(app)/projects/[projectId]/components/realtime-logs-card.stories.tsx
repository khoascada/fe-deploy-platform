import type { Meta, StoryObj } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '@/messages/en.json';
import { RealtimeLogsCard, type DeploymentLogItem } from './realtime-logs-card';

const defaultLogs: DeploymentLogItem[] = [
  {
    createdAt: '2026-07-01T11:59:42.000Z',
    deploymentId: 'dep_123',
    level: 'INFO',
    message: 'Deployment accepted by runner. Preparing build workspace.',
    projectId: 'proj_123',
    seq: 29,
    stream: 'SYSTEM',
  },
  {
    createdAt: '2026-07-01T11:59:48.000Z',
    deploymentId: 'dep_123',
    level: 'INFO',
    message: 'Cloning repository github.com/acme/launchpad-web#main into /workspace.',
    projectId: 'proj_123',
    seq: 30,
    stream: 'STDOUT',
  },
  {
    createdAt: '2026-07-01T12:00:04.000Z',
    deploymentId: 'dep_123',
    level: 'WARN',
    message:
      'npm warn deprecated inflight@1.0.6: This module is not supported and may leak memory.',
    projectId: 'proj_123',
    seq: 35,
    stream: 'STDERR',
  },
  {
    createdAt: '2026-07-01T12:00:17.000Z',
    deploymentId: 'dep_123',
    level: 'ERROR',
    message:
      'Health check failed on port 3000 after 30s. Waiting for the next platform probe before marking this run unhealthy.',
    projectId: 'proj_123',
    seq: 37,
    stream: 'SYSTEM',
  },
];

const denseLogs: DeploymentLogItem[] = [
  ...defaultLogs,
  {
    createdAt: '2026-07-01T12:00:21.000Z',
    deploymentId: 'dep_123',
    level: 'DEBUG',
    message: 'Probing container port 3000 with exponential backoff.',
    projectId: 'proj_123',
    seq: 38,
    stream: 'SYSTEM',
  },
  {
    createdAt: '2026-07-01T12:00:23.000Z',
    deploymentId: 'dep_123',
    level: 'INFO',
    message: 'GET /health 200 in 118ms',
    projectId: 'proj_123',
    seq: 39,
    stream: 'STDOUT',
  },
  {
    createdAt: '2026-07-01T12:00:27.000Z',
    deploymentId: 'dep_123',
    level: 'ERROR',
    message:
      'Command failed with exit code 1 after running pnpm build --filter web. Trace: Error: ENOENT: no such file or directory, open /workspace/apps/web/.next/server/app-paths-manifest.json',
    projectId: 'proj_123',
    seq: 40,
    stream: 'STDERR',
  },
];

const meta: Meta<typeof RealtimeLogsCard> = {
  title: 'Features/Projects/RealtimeLogsCard',
  component: RealtimeLogsCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <div className="bg-background min-h-screen p-6 md:p-10">
          <div className="mx-auto max-w-4xl">
            <Story />
          </div>
        </div>
      </NextIntlClientProvider>
    ),
  ],
  args: {
    logs: defaultLogs,
  },
};

export default meta;

type Story = StoryObj<typeof RealtimeLogsCard>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    logs: [],
  },
};

export const DenseFailureStream: Story = {
  args: {
    logs: denseLogs,
  },
};
