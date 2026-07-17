'use client';

import { Badge } from '@components/ui';
import { Code2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { interviewNotes } from './landing-data';

export function InterviewNotes() {
  const t = useTranslations('landing.workflow');

  return (
    <section className="grid gap-4 rounded-xl border bg-surface p-4 md:grid-cols-[0.85fr_1.15fr] md:p-6">
      <div className="space-y-3">
        <Badge variant="outline" className="gap-2">
          <Code2 className="size-3.5" />
          {t('badge')}
        </Badge>
        <h2 className="text-2xl font-semibold tracking-tight">{t('title')}</h2>
        <p className="text-muted-foreground leading-7">
          {t('description')}
        </p>
      </div>

      <div className="grid gap-3">
        {interviewNotes.map((note) => (
          <div key={note.key} className="rounded-lg border bg-background/60 p-4">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              {t(`${note.key}.label`)}
            </p>
            <p className="mt-2 font-medium">{t(`${note.key}.value`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}