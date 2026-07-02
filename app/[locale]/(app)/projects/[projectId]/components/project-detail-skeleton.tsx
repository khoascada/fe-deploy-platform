'use client';

import { Button, Card, CardContent, Skeleton } from '@components/ui';
import { ArrowLeft } from 'lucide-react';

export function ProjectDetailSkeleton() {
  return (
    <section className="mx-auto w-full max-w-7xl space-y-6 pb-8">
      <div className="border-border/70 space-y-5 border-b pb-6">
        <Button variant="ghost" className="-ml-3 w-fit" disabled>
          <ArrowLeft className="size-4" />
          <span>Loading</span>
        </Button>
        <div className="space-y-3">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.7fr)]">
        <Card className="rounded-3xl">
          <CardContent className="space-y-5 p-6">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-40 w-full rounded-2xl" />
            <div className="grid gap-3 md:grid-cols-3">
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl">
        <CardContent className="space-y-5 p-6">
          <Skeleton className="h-6 w-56" />
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-28 w-full rounded-2xl" />
              ))}
            </div>
            <Skeleton className="h-full min-h-80 w-full rounded-2xl" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="rounded-3xl">
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
