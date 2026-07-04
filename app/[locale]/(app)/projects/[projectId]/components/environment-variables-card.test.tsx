import * as React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { render, screen } from '@lib/test/test-utils';
import { describe, expect, it, vi } from 'vitest';
import enMessages from '../../../../../../messages/en.json';
import { EnvironmentVariablesCard } from './environment-variables-card';

vi.mock('../hooks/use-environment-variables-card', () => ({
  useEnvironmentVariablesCard: vi.fn(),
}));

import { useEnvironmentVariablesCard } from '../hooks/use-environment-variables-card';

function renderCard() {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <EnvironmentVariablesCard projectId="project-1" />
    </NextIntlClientProvider>,
  );
}

describe('EnvironmentVariablesCard', () => {
  it('renders the empty state when no env vars exist', () => {
    vi.mocked(useEnvironmentVariablesCard).mockReturnValue({
      activeEnvVar: null,
      busyEnvVarId: null,
      envVars: [],
      envVarsErrorMessage: '',
      isCreateDialogOpen: false,
      isDialogSubmitting: false,
      isEditDialogOpen: false,
      isError: false,
      isLoading: false,
      onCreate: vi.fn(),
      onDelete: vi.fn(),
      onOpenChange: vi.fn(),
      onOpenCreateDialog: vi.fn(),
      onOpenEditDialog: vi.fn(),
      onRetry: vi.fn(),
      onToggle: vi.fn(),
      onUpdate: vi.fn(),
      submitErrorMessage: '',
    });

    renderCard();

    expect(screen.getByText('No environment variables yet')).toBeInTheDocument();
    expect(screen.getAllByText('Add variable')).toHaveLength(2);
  });

  it('renders env var rows with scope and status badges', () => {
    vi.mocked(useEnvironmentVariablesCard).mockReturnValue({
      activeEnvVar: null,
      busyEnvVarId: null,
      envVars: [
        {
          id: 'env-1',
          projectId: 'project-1',
          key: 'DATABASE_URL',
          scope: 'BOTH',
          isEnabled: true,
          hasValue: true,
          createdAt: '2026-07-04T00:00:00.000Z',
          updatedAt: '2026-07-04T01:00:00.000Z',
        },
      ],
      envVarsErrorMessage: '',
      isCreateDialogOpen: false,
      isDialogSubmitting: false,
      isEditDialogOpen: false,
      isError: false,
      isLoading: false,
      onCreate: vi.fn(),
      onDelete: vi.fn(),
      onOpenChange: vi.fn(),
      onOpenCreateDialog: vi.fn(),
      onOpenEditDialog: vi.fn(),
      onRetry: vi.fn(),
      onToggle: vi.fn(),
      onUpdate: vi.fn(),
      submitErrorMessage: '',
    });

    renderCard();

    expect(screen.getByText('DATABASE_URL')).toBeInTheDocument();
    expect(screen.getByText('Runtime + Build')).toBeInTheDocument();
    expect(screen.getByText('Enabled')).toBeInTheDocument();
    expect(screen.getByText('Secret stored securely')).toBeInTheDocument();
  });
});