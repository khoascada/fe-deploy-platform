import {
  DatabaseZap,
  Globe2,
  Layers3,
  LockKeyhole,
  ShieldCheck,
  TerminalSquare,
} from 'lucide-react';

export const deploymentRows = [
  {
    branch: 'main',
    id: '#142',
    project: 'web-console',
    status: 'Ready',
    tone: 'success',
    updatedAtKey: '2mAgo',
  },
  {
    branch: 'feature/log-viewer',
    id: '#141',
    project: 'api-worker',
    status: 'Building',
    tone: 'warning',
    updatedAtKey: '8mAgo',
  },
  {
    branch: 'release/auth-session',
    id: '#140',
    project: 'dashboard',
    status: 'Queued',
    tone: 'info',
    updatedAtKey: '17mAgo',
  },
] as const;

export const logLines = [
  { time: '[10:42:12]', messageKey: 'gitClone' },
  { time: '[10:42:18]', messageKey: 'installDeps' },
  { time: '[10:43:04]', messageKey: 'nextBuild' },
  { time: '[10:44:29]', messageKey: 'promoted' },
] as const;

export const capabilityKeys = [
  'gitIntegration',
  'statusTracking',
  'logInspection',
  'secureDashboard',
  'i18nRouting',
  'validationConfig',
] as const;

export const engineeringHighlights = [
  {
    key: 'gitConnected',
    icon: Layers3,
  },
  {
    key: 'logStream',
    icon: TerminalSquare,
  },
  {
    key: 'envIsolation',
    icon: LockKeyhole,
  },
  {
    key: 'controlRoom',
    icon: DatabaseZap,
  },
  {
    key: 'multiLocale',
    icon: Globe2,
  },
  {
    key: 'optimized',
    icon: ShieldCheck,
  },
] as const;

export const interviewNotes = [
  {
    key: 'connect',
  },
  {
    key: 'configure',
  },
  {
    key: 'monitor',
  },
] as const;

export type StatusTone = (typeof deploymentRows)[number]['tone'];