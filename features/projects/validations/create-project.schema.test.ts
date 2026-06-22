import { describe, expect, it } from 'vitest';
import { createCreateProjectSchema } from './create-project.schema';

describe('createCreateProjectSchema', () => {
  const t = (key: string) => key;
  const schema = createCreateProjectSchema(t);

  it('validates required fields', () => {
    const result = schema.safeParse({
      githubRepoId: '',
      name: '',
      deployBranch: '',
      hostPort: null,
      autoDeploy: false,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toEqual(
        expect.arrayContaining([
          'validation.githubRepoIdRequired',
          'validation.nameRequired',
          'validation.deployBranchRequired',
        ])
      );
    }
  });

  it('normalizes optional fields correctly', () => {
    const result = schema.parse({
      githubRepoId: '123',
      name: 'demo-app',
      deployBranch: 'main',
      rootDirectory: '',
      dockerfilePath: 'Dockerfile',
      buildContext: '',
      containerPort: '',
      hostPort: '',
      autoDeploy: true,
    });

    expect(result).toEqual({
      githubRepoId: '123',
      name: 'demo-app',
      deployBranch: 'main',
      rootDirectory: undefined,
      dockerfilePath: 'Dockerfile',
      buildContext: undefined,
      containerPort: undefined,
      hostPort: null,
      autoDeploy: true,
    });
  });

  it('accepts valid positive ports', () => {
    const result = schema.parse({
      githubRepoId: '123',
      name: 'demo-app',
      deployBranch: 'main',
      containerPort: '3000',
      hostPort: '8080',
      autoDeploy: false,
    });

    expect(result.containerPort).toBe(3000);
    expect(result.hostPort).toBe(8080);
  });
});
