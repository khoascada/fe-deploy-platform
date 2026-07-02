import { render, screen, fireEvent } from '@lib/test/test-utils';
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '../../../messages/en.json';
import { describe, expect, it } from 'vitest';
import { LogsTerminalViewer } from './logs-terminal-viewer';

describe('LogsTerminalViewer', () => {
  it('shows a jump-to-latest action after the user scrolls away from the bottom', () => {
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <LogsTerminalViewer
          deployment={{
            id: 'deployment-1',
            projectId: 'project-1',
            deploymentNumber: 3,
            status: 'BUILDING',
            trigger: 'MANUAL',
            branch: 'main',
            commitSha: 'abc123',
            commitMessage: 'Ship logs workbench',
            queuedAt: '2026-07-02T00:00:00.000Z',
            createdAt: '2026-07-02T00:00:00.000Z',
            finishedAt: null,
          }}
          logs={[
            {
              id: 'log-1',
              deploymentId: 'deployment-1',
              projectId: 'project-1',
              seq: 1,
              level: 'INFO',
              stream: 'STDOUT',
              message: 'Build started',
              createdAt: '2026-07-02T00:00:00.000Z',
            },
          ]}
          project={{
            id: 'project-1',
            name: 'Acme App',
            repoFullName: 'acme/app',
            deployBranch: 'main',
            latestDeploy: null,
            deployCount: 1,
            repoUrl: null,
            webhookId: null,
            isWebhookProvisioned: false,
          }}
        />
      </NextIntlClientProvider>
    );

    const logRegion = screen.getByRole('log');
    Object.defineProperty(logRegion, 'clientHeight', { configurable: true, value: 300 });
    Object.defineProperty(logRegion, 'scrollHeight', { configurable: true, value: 1000 });
    Object.defineProperty(logRegion, 'scrollTop', { configurable: true, value: 100 });

    fireEvent.scroll(logRegion);

    expect(screen.getByRole('button', { name: 'Jump to latest' })).toBeInTheDocument();
  });
});
