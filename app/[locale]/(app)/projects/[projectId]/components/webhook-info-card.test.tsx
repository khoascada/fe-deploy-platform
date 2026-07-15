import { NextIntlClientProvider } from 'next-intl';
import { render, screen } from '@lib/test/test-utils';
import { describe, expect, it } from 'vitest';
import enMessages from '../../../../../../messages/en.json';
import type { ProjectDetail, WebhookEventStatus } from '@/types/project';
import { WebhookInfoCard } from './webhook-info-card';

const project: ProjectDetail = {
  id: 'project-1',
  ownerId: 'user-1',
  name: 'Deploy Platform',
  slug: 'deploy-platform',
  repoFullName: 'khoa/deploy-platform',
  repoOwner: 'khoa',
  repoName: 'deploy-platform',
  repoUrl: 'https://github.com/khoa/deploy-platform',
  githubRepoId: '123',
  githubDefaultBranch: 'main',
  deployBranch: 'main',
  rootDirectory: '.',
  dockerfilePath: 'Dockerfile',
  buildContext: '.',
  runnerType: 'LOCAL',
  localRepoPath: null,
  sshHost: null,
  sshPort: null,
  sshUser: null,
  sshKeyEncrypted: null,
  containerPort: 3000,
  hostPort: 8080,
  containerName: 'deploy-platform',
  imageName: 'deploy-platform',
  autoDeploy: true,
  webhookId: '456',
  latestDeploy: null,
  latestWebhookEvent: null,
  status: 'ACTIVE',
  createdAt: '2026-07-11T09:00:00.000Z',
  updatedAt: '2026-07-11T09:30:00.000Z',
};

function renderCard(value: ProjectDetail) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <WebhookInfoCard project={value} />
    </NextIntlClientProvider>,
  );
}

function withLatestEvent(status: WebhookEventStatus): ProjectDetail {
  return {
    ...project,
    latestWebhookEvent: {
      id: 'event-1',
      eventName: 'push',
      status,
      statusReason: null,
      isVerified: true,
      receivedAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
      branch: 'main',
      commitSha: 'abc123def456',
      commitMessage: 'feat: show latest webhook event',
    },
  };
}

describe('WebhookInfoCard', () => {
  it('shows the disconnected state before webhook provisioning', () => {
    renderCard({ ...project, webhookId: null });

    expect(screen.getByText('Not connected')).toBeInTheDocument();
    expect(
      screen.getByText(/Connect the repository webhook before delivery activity/),
    ).toBeInTheDocument();
  });

  it('waits for the first delivery after provisioning', () => {
    renderCard(project);

    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByText(/waiting for its first delivery/)).toBeInTheDocument();
  });

  it.each([
    ['RECEIVED', 'Received'],
    ['PENDING', 'Waiting for current deployment'],
    ['PROCESSED', 'Deployment created'],
    ['IGNORED', 'Ignored'],
    ['FAILED', 'Processing failed'],
    ['SUPERSEDED', 'Replaced by a newer push'],
  ] as const)('renders the %s event status', (status, label) => {
    renderCard(withLatestEvent(status));

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('shows sanitized push metadata and an available reason', () => {
    const value = withLatestEvent('IGNORED');
    value.latestWebhookEvent!.statusReason =
      'Branch dev does not match deploy branch main';

    renderCard(value);

    expect(screen.getByText('main')).toBeInTheDocument();
    expect(screen.getByText('abc123d')).toBeInTheDocument();
    expect(screen.getByText('feat: show latest webhook event')).toBeInTheDocument();
    expect(
      screen.getByText('Branch dev does not match deploy branch main'),
    ).toBeInTheDocument();
  });
});
