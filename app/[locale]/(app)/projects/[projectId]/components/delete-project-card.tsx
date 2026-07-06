'use client';

import type { ProjectDetail } from '@/types/project';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@components/ui';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface DeleteProjectCardProps {
  deleteErrorMessage: string;
  isDeleting: boolean;
  onDeleteProject: () => void;
  projectName: string;
}

export function DeleteProjectCard({
  deleteErrorMessage,
  isDeleting,
  onDeleteProject,
  projectName,
}: DeleteProjectCardProps) {
  const t = useTranslations('pages.projectDetail');

  return (
    <Card className="border-warning/35 bg-warning/5 overflow-hidden rounded-3xl">
      <CardHeader className="border-warning/20 border-b">
        <div className="flex items-start gap-4">
          <div className="bg-warning/12 text-warning flex size-11 items-center justify-center rounded-2xl">
            <AlertTriangle className="size-5" />
          </div>
          <div className="space-y-2">
            <p className="text-warning text-sm font-semibold uppercase tracking-[0.18em]">
              {t('deleteProject.eyebrow')}
            </p>
            <CardTitle className="text-xl">{t('deleteProject.title')}</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-6">
        <div className="rounded-2xl border border-dashed border-warning/35 bg-background/70 p-4">
          <p className="text-sm font-semibold">{t('deleteProject.warningTitle', { projectName })}</p>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            {t('deleteProject.description')}
          </p>
        </div>

        {deleteErrorMessage ? (
          <div
            className="border-destructive/30 bg-destructive/8 text-destructive rounded-2xl border px-4 py-3 text-sm"
            role="alert"
          >
            {deleteErrorMessage}
          </div>
        ) : null}

        <Button color="destructive" className="w-full sm:w-auto" loading={isDeleting} onClick={onDeleteProject}>
          <Trash2 className="size-4" />
          {isDeleting ? t('deleteProject.deletingAction') : t('deleteProject.action')}
        </Button>
      </CardContent>
    </Card>
  );
}
