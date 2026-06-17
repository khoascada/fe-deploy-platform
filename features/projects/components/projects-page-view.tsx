'use client';

import type { ProjectListItem } from '@/types/project';
import type { ProjectsViewMode } from '@/features/projects/types';
import { AppPagination, Button, Card, CardContent, Input, Skeleton } from '@components/ui';
import { cn } from '@lib/utils';
import { Grid2x2, List, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ProjectCard } from './project-card';

interface ProjectsPageViewProps {
  currentPage: number;
  errorMessage?: string | null;
  hasSearchQuery: boolean;
  isError?: boolean;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onSearchChange: (value: string) => void;
  onViewModeChange: (viewMode: ProjectsViewMode) => void;
  projects: ProjectListItem[];
  searchQuery: string;
  totalPages: number;
  totalProjects: number;
  viewMode: ProjectsViewMode;
}

function ProjectsSkeleton({ viewMode }: { viewMode: ProjectsViewMode }) {
  const wrapperClassName =
    viewMode === 'grid' ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-3' : 'grid gap-4';

  return (
    <div className={wrapperClassName}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="rounded-2xl border-border/60">
          <CardContent className="space-y-4 p-5">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1 rounded-md" />
              <Skeleton className="h-10 flex-1 rounded-md" />
              <Skeleton className="h-10 flex-1 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ProjectsPageView({
  currentPage,
  errorMessage,
  hasSearchQuery,
  isError = false,
  isLoading = false,
  onPageChange,
  onRetry,
  onSearchChange,
  onViewModeChange,
  projects,
  searchQuery,
  totalPages,
  totalProjects,
  viewMode,
}: ProjectsPageViewProps) {
  const t = useTranslations('pages.projects');
  const wrapperClassName =
    viewMode === 'grid' ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-3' : 'grid gap-4';

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xl">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={t('toolbar.searchPlaceholder')}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" color="secondary" disabled>
              <SlidersHorizontal className="h-4 w-4" />
              {t('toolbar.filter')}
            </Button>

            <div className="border-border flex items-center rounded-lg border p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                color={viewMode === 'grid' ? 'primary' : 'default'}
                size="icon"
                onClick={() => onViewModeChange('grid')}
                aria-label={t('toolbar.gridView')}
              >
                <Grid2x2 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                color={viewMode === 'list' ? 'primary' : 'default'}
                size="icon"
                onClick={() => onViewModeChange('list')}
                aria-label={t('toolbar.listView')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" disabled>
              <Plus className="h-4 w-4" />
              {t('toolbar.addNew')}
            </Button>
          </div>
        </div>
      </div>

      <div className="text-muted-foreground text-sm">
        {t('summary.totalProjects', { count: totalProjects })}
      </div>

      {isLoading ? (
        <ProjectsSkeleton viewMode={viewMode} />
      ) : isError ? (
        <Card className="rounded-2xl border-border/60">
          <CardContent className="space-y-4 p-8 text-center">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">{t('states.errorTitle')}</h2>
              <p className="text-muted-foreground">{errorMessage || t('states.errorDescription')}</p>
            </div>
            <div className="flex justify-center">
              <Button onClick={onRetry}>{t('states.retry')}</Button>
            </div>
          </CardContent>
        </Card>
      ) : projects.length === 0 ? (
        <Card className="rounded-2xl border-border/60">
          <CardContent className="space-y-2 p-10 text-center">
            <h2 className="text-lg font-semibold">
              {hasSearchQuery ? t('states.noResultsTitle') : t('states.emptyTitle')}
            </h2>
            <p className="text-muted-foreground">
              {hasSearchQuery ? t('states.noResultsDescription') : t('states.emptyDescription')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className={cn(wrapperClassName)}>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} viewMode={viewMode} />
            ))}
          </div>

          <AppPagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </section>
  );
}
