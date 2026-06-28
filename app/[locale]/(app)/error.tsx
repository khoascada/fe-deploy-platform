'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Typography } from '@components/ui';
import { Link } from '@i18n/navigation';
import { devError } from '@lib/utils/logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors.errorLoadData');

  useEffect(() => {
    devError('[AppError]', error);
    // TODO(1.4): Sentry.captureException(error)
  }, [error]);

  return (
    <div className="flex h-full min-h-[400px] items-center justify-center">
      <div className="mx-4 flex flex-col items-center gap-4 text-center">
        <Typography variant="h2" className="text-destructive">
          {t('title')}
        </Typography>
        <Typography variant="body1" className="text-muted-foreground max-w-md">
          {t('description')}
        </Typography>
        <div className="flex gap-4">
          <Button color="primary" asChild>
            <Link href="/home">{t('backToHome')}</Link>
          </Button>
          <Button onClick={reset} variant="outline">
            {t('tryAgain')}
          </Button>
        </div>
      </div>
    </div>
  );
}
