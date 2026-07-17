'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button, Typography } from '@components/ui';
import { devError } from '@lib/utils/logger';

const SUPPORTED_LOCALES = new Set(['vi', 'en']);

function getLocaleAwareHomeHref() {
  if (typeof window === 'undefined') {
    return '/';
  }

  const maybeLocale = window.location.pathname.split('/')[1];

  return SUPPORTED_LOCALES.has(maybeLocale) ? `/${maybeLocale}` : '/';
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    devError('[RootError]', error);
  }, [error]);

  const homeHref = getLocaleAwareHomeHref();

  return (
    <div className="flex h-full min-h-[400px] items-center justify-center">
      <div className="mx-4 flex flex-col items-center gap-4 text-center">
        <Typography variant="h2" className="text-destructive">
          Something went wrong
        </Typography>
        <Typography variant="body1" className="text-muted-foreground max-w-md">
          Please try again later or contact support if the problem persists.
        </Typography>
        <div className="flex gap-4">
          <Button color="primary" asChild>
            <Link href={homeHref}>Back to home</Link>
          </Button>
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
