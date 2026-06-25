import { Link } from '@i18n/navigation';
import { Button, Typography } from '@components/ui';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60dvh] items-center justify-center px-4">
      <div className="flex max-w-md flex-col gap-6 text-center">
        <Typography variant="h3" className="text-error">
          404
        </Typography>
        <Typography variant="body1">The page you are looking for could not be found.</Typography>
        <Button asChild color="primary">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
