import { RegisterForm } from '@/features/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@components/ui/card';
import { Link } from '@i18n/navigation';
import { getTranslations } from 'next-intl/server';

export default async function RegisterPage() {
  const t = await getTranslations('auth');
  const tCommon = await getTranslations('common');

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden py-12">
      <Card className="border-border/50 z-10 w-full max-w-md shadow-xl backdrop-blur-xl">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">{t('registerTitle')}</CardTitle>
          <CardDescription>{t('registerDescription')}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <RegisterForm />
        </CardContent>

        <CardFooter className="text-muted-foreground justify-center text-sm">
          {t('haveAccount')}{' '}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 ml-1 font-medium hover:underline"
          >
            {tCommon('login')}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
