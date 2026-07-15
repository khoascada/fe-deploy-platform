import type { ProjectDetail } from '@/types/project';
import { describe, expect, it } from 'vitest';
import { createUpdateProjectSchema, toUpdateProjectRequest } from './update-project.schema';

const t = (key: string) => key;
const project = {
  deployBranch: 'main', rootDirectory: '.', dockerfilePath: 'Dockerfile',
  buildContext: '.', containerPort: 3000, hostPort: 8080, autoDeploy: true,
} as ProjectDetail;

describe('update project validation', () => {
  it('normalizes paths and ports', () => {
    const result = createUpdateProjectSchema(t).parse({
      deployBranch: ' main ', rootDirectory: '', dockerfilePath: '', buildContext: '',
      containerPort: '3000', hostPort: '', autoDeploy: false,
    });

    expect(result).toEqual({
      deployBranch: 'main', rootDirectory: '.', dockerfilePath: 'Dockerfile',
      buildContext: '.', containerPort: 3000, hostPort: null, autoDeploy: false,
    });
  });

  it('builds a payload containing only changed settings', () => {
    expect(toUpdateProjectRequest(project, {
      deployBranch: 'main', rootDirectory: '.', dockerfilePath: 'Dockerfile',
      buildContext: '.', containerPort: 3000, hostPort: null, autoDeploy: false,
    })).toEqual({ hostPort: null, autoDeploy: false });
  });

  it('rejects invalid ports', () => {
    const schema = createUpdateProjectSchema(t);
    expect(() => schema.parse({
      deployBranch: 'main', rootDirectory: '.', dockerfilePath: 'Dockerfile',
      buildContext: '.', containerPort: 0, hostPort: null, autoDeploy: true,
    })).toThrow();
  });
});
