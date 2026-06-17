import type { Meta, StoryObj } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '@/messages/en.json';
import { ProjectsPageView } from './projects-page-view';
import { emptyProjectListResponse, mockProjectListResponse } from '../mock-projects';

const meta: Meta<typeof ProjectsPageView> = {
  title: 'Features/Projects/ProjectsPageView',
  component: ProjectsPageView,
  tags: ['autodocs'],
  args: {
    currentPage: 1,
    errorMessage: null,
    hasSearchQuery: false,
    isError: false,
    isLoading: false,
    onPageChange: () => {},
    onRetry: () => {},
    onSearchChange: () => {},
    onViewModeChange: () => {},
    projects: mockProjectListResponse.projects,
    searchQuery: '',
    totalPages: mockProjectListResponse.totalPage,
    totalProjects: mockProjectListResponse.total,
    viewMode: 'grid',
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <div className="bg-background min-h-screen p-8">
          <Story />
        </div>
      </NextIntlClientProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ProjectsPageView>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    projects: emptyProjectListResponse.projects,
    totalPages: emptyProjectListResponse.totalPage,
    totalProjects: emptyProjectListResponse.total,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    projects: [],
    totalPages: 0,
    totalProjects: 0,
  },
};
