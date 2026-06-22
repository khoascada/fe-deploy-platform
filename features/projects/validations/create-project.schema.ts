import { z } from 'zod';

export interface CreateProjectFormInput {
  githubRepoId: string;
  name: string;
  deployBranch: string;
  rootDirectory?: string;
  dockerfilePath?: string;
  buildContext?: string;
  containerPort?: string | number;
  hostPort: string | number | null;
  autoDeploy?: boolean;
}

// chuỗi optional, rỗng thì thành undefined
const optionalTrimmedString = z
  .string()
  .trim()
  .transform((value) => (value.length === 0 ? undefined : value))
  .optional();

// port optional, rỗng thì thành undefined, có giá trị thì phải là số nguyên dương
const optionalPortNumber = z
  .union([z.string(), z.number()])
  .optional()
  .transform((value, ctx) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }

    const parsed = typeof value === 'number' ? value : Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Invalid port number',
      });
      return z.NEVER;
    }

    return parsed;
  });

// port nullable, rỗng thì thành null, có giá trị thì phải là số nguyên dương
const nullablePortNumber = z
  .union([z.string(), z.number(), z.null()])
  .transform((value, ctx) => {
    if (value === '' || value === undefined || value === null) {
      return null;
    }

    const parsed = typeof value === 'number' ? value : Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Invalid port number',
      });
      return z.NEVER;
    }

    return parsed;
  });

export const createCreateProjectSchema = (t: (key: string) => string) =>
  z.object({
    githubRepoId: z.string().trim().min(1, t('validation.githubRepoIdRequired')),
    name: z.string().trim().min(1, t('validation.nameRequired')),
    deployBranch: z.string().trim().min(1, t('validation.deployBranchRequired')),
    rootDirectory: optionalTrimmedString,
    dockerfilePath: optionalTrimmedString,
    buildContext: optionalTrimmedString,
    containerPort: optionalPortNumber,
    hostPort: nullablePortNumber,
    autoDeploy: z.boolean().default(false),
  });

export type CreateProjectFormValues = z.infer<ReturnType<typeof createCreateProjectSchema>>;

