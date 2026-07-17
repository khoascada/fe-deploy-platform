import type { StatusTone } from './landing-data';

export function StatusDot({ tone }: { tone: StatusTone }) {
  const toneClass = {
    info: 'bg-info',
    success: 'bg-success',
    warning: 'bg-warning',
  }[tone];

  return <span className={`${toneClass} size-2 rounded-full`} aria-hidden="true" />;
}