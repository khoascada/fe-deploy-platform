import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@components/ui/card';
import { LoginForm } from '@/features/auth';
import { Link } from '@i18n/navigation';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { SessionExpiredHandler } from './session-expire-handler';

export default async function LoginPage() {
  const t = await getTranslations('auth');
  const tCommon = await getTranslations('common');

  return (
    <div className="flex min-h-[100dvh] items-center justify-center overflow-hidden">
      <Card className="border-border/50 z-10 w-full max-w-xl shadow-xl backdrop-blur-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto mb-2">
            <Image src="/bee.svg" alt="Wordy Bee" width={80} height={107} priority />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">{t('loginTitle')}</CardTitle>
          <CardDescription>{t('welcomeMessage')}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <LoginForm />

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-secondary hover:text-secondary/80 text-sm font-medium hover:underline"
            >
              {t('forgotPassword')}
            </Link>
          </div>
        </CardContent>

        <CardFooter className="text-muted-foreground justify-center text-sm">
          {t('noAccount')}{' '}
          <Link
            href="/register"
            className="text-primary hover:text-primary/80 ml-1 font-medium hover:underline"
          >
            {tCommon('register')}
          </Link>
        </CardFooter>
      </Card>

      <SessionExpiredHandler />
    </div>
  );
}
