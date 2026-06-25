import { ProjectDetailPageClient } from './project-detail-page-client';

interface ProjectDetailPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { projectId } = await params;

  return <ProjectDetailPageClient projectId={projectId} />;
}
