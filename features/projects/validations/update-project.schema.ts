import type { ProjectDetail, UpdateProjectRequest } from '@/types/project';
import { z } from 'zod';

export interface UpdateProjectFormInput {
  deployBranch: string;
  rootDirectory: string;
  dockerfilePath: string;
  buildContext: string;
  containerPort: string | number;
  hostPort: string | number | null;
  autoDeploy: boolean;
}

const positivePort = z.union([z.string(), z.number()]).transform((value, ctx) => {
    if (value === '') {
      ctx.addIssue({ code: 'custom', message: 'Invalid port number' });
      return z.NEVER;
    }

    const parsed = typeof value === 'number' ? value : Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      ctx.addIssue({ code: 'custom', message: 'Invalid port number' });
      return z.NEVER;
    }
    return parsed;
  });

const nullablePort = z
  .union([z.string(), z.number(), z.null()])
  .transform((value, ctx) => {
    if (value === '' || value === null) return null;
    const parsed = typeof value === 'number' ? value : Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      ctx.addIssue({ code: 'custom', message: 'Invalid port number' });
      return z.NEVER;
    }
    return parsed;
  });

export const createUpdateProjectSchema = (t: (key: string) => string) =>
  z.object({
    deployBranch: z.string().trim().min(1, t('validation.deployBranchRequired')),
    rootDirectory: z.string().trim().transform((value) => value || '.'),
    dockerfilePath: z.string().trim().transform((value) => value || 'Dockerfile'),
    buildContext: z.string().trim().transform((value) => value || '.'),
    containerPort: positivePort,
    hostPort: nullablePort,
    autoDeploy: z.boolean(),
  });

export type UpdateProjectFormValues = z.infer<
  ReturnType<typeof createUpdateProjectSchema>
>;

export function toUpdateProjectRequest(
  project: ProjectDetail,
  values: UpdateProjectFormValues
): UpdateProjectRequest {
  const fields: Array<keyof UpdateProjectRequest> = [
    'deployBranch',
    'rootDirectory',
    'dockerfilePath',
    'buildContext',
    'containerPort',
    'hostPort',
    'autoDeploy',
  ];

  return fields.reduce<UpdateProjectRequest>((payload, field) => {
    if (values[field] !== project[field]) {
      Object.assign(payload, { [field]: values[field] });
    }
    return payload;
  }, {});
}
