import type {
  DeployStatus,
  LatestDeploy,
  ProjectDetail,
  ProjectRunnerType,
  ProjectStatus,
  WebhookEventStatus,
} from '@/types/project';
import { Badge } from '@components/ui';
import { cn } from '@lib/utils';
import { formatDate, getRelativeTime } from '@lib/utils/date';
import { AlertTriangle, CheckCircle2, Clock3, LoaderCircle, Rocket, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';

type Tone = 'muted' | 'info' | 'warning' | 'success' | 'danger';

function toneClassName(tone: Tone) {
  switch (tone) {
    case 'info':
      return 'border-info/25 bg-info/10 text-info';
    case 'warning':
      return 'border-warning/25 bg-warning/10 text-warning';
    case 'success':
      return 'border-success/25 bg-success/10 text-success';
    case 'danger':
      return 'border-destructive/25 bg-destructive/10 text-destructive';
    case 'muted':
    default:
      return 'border-border bg-muted text-muted-foreground';
  }
}

export function getDeployStatusTone(status: DeployStatus): Tone {
  switch (status) {
    case 'SUCCESS':
      return 'success';
    case 'FAILED':
    case 'CANCELED':
      return 'danger';
    case 'DEPLOYING':
      return 'warning';
    case 'BUILDING':
    case 'PULLING':
      return 'info';
    case 'QUEUED':
    default:
      return 'muted';
  }
}

export function getProjectStatusTone(status: ProjectStatus): Tone {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'PAUSED':
      return 'warning';
    case 'ARCHIVED':
    default:
      return 'muted';
  }
}

export function getRunnerTone(runnerType: ProjectRunnerType): Tone {
  return runnerType === 'SSH' ? 'warning' : 'info';
}

export function getWebhookTone(project: ProjectDetail): Tone {
  if (project.webhookId) {
    return 'success';
  }

  return project.autoDeploy ? 'warning' : 'muted';
}

export function getWebhookEventTone(status: WebhookEventStatus): Tone {
  switch (status) {
    case 'PROCESSED':
      return 'success';
    case 'FAILED':
      return 'danger';
    case 'PENDING':
      return 'warning';
    case 'RECEIVED':
      return 'info';
    case 'IGNORED':
    case 'SUPERSEDED':
    default:
      return 'muted';
  }
}

export function renderStatusIcon(status: DeployStatus, className?: string) {
  switch (status) {
    case 'SUCCESS':
      return <CheckCircle2 color="var(--success)" className={className} />;
    case 'FAILED':
    case 'CANCELED':
      return <XCircle color="var(--destructive)" className={className} />;
    case 'DEPLOYING':
      return <Rocket color="var(--info)" className={className} />;
    case 'BUILDING':
    case 'PULLING':
      return <LoaderCircle color="var(--info)" className={className} />;
    case 'QUEUED':
    default:
      return <Clock3 className={className} />;
  }
}

export function getCommitShortSha(commitSha: string) {
  return commitSha.slice(0, 7);
}

export function formatProjectTimestamp(date: string, locale: string) {
  return formatDate(date, { locale, showTime: true });
}

export function getDeployFinishedLabel(deploy: LatestDeploy, locale: string) {
  if (!deploy.finishedAt) {
    return null;
  }

  return formatDate(deploy.finishedAt, { locale, showTime: true });
}

export function getDeployRelativeLabel(deploy: LatestDeploy, locale: string) {
  return getRelativeTime(deploy.createdAt, locale);
}

export function StatusBadge({
  children,
  className,
  tone,
}: {
  children: ReactNode;
  className?: string;
  tone: Tone;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded-full px-3 py-1 text-[11px] font-semibold uppercase',
        toneClassName(tone),
        className
      )}
    >
      {children}
    </Badge>
  );
}

export function EmptyMetric({ description, title }: { description: string; title: string }) {
  return (
    <div className="border-border/60 bg-background/70 flex min-h-32 flex-col justify-center rounded-2xl border border-dashed p-5">
      <div className="flex items-start gap-3">
        <div className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-xl">
          <AlertTriangle className="size-4" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-muted-foreground text-sm leading-6">{description}</p>
        </div>
      </div>
    </div>
  );
}
