'use client';

import {
  createUpdateProjectSchema,
  toUpdateProjectRequest,
  type UpdateProjectFormInput,
  type UpdateProjectFormValues,
  useGetGithubBranches,
  useUpdateProject,
} from '@/features/projects';
import type { ProjectDetail } from '@/types/project';
import {
  Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Input, Label, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger,
  SelectValue, Spinner, Switch,
} from '@components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslateError } from '@lib/hooks';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ProjectSettingsCardProps {
  isDeploymentActive: boolean;
  project: ProjectDetail;
}

function getDefaultValues(project: ProjectDetail): UpdateProjectFormInput {
  return {
    deployBranch: project.deployBranch,
    rootDirectory: project.rootDirectory,
    dockerfilePath: project.dockerfilePath,
    buildContext: project.buildContext,
    containerPort: project.containerPort,
    hostPort: project.hostPort,
    autoDeploy: project.autoDeploy,
  };
}

export function ProjectSettingsCard({ isDeploymentActive, project }: ProjectSettingsCardProps) {
  const t = useTranslations('pages.projectDetail.settings');
  const [isEditing, setIsEditing] = useState(false);
  const { getErrorMessage } = useTranslateError();
  const mutation = useUpdateProject(project.id);
  const branches = useGetGithubBranches(project.repoOwner, project.repoName, {
    enabled: isEditing && Boolean(project.githubRepoId),
  });
  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
    register,
    reset,
  } = useForm<UpdateProjectFormInput, unknown, UpdateProjectFormValues>({
    resolver: zodResolver(createUpdateProjectSchema(t)),
    defaultValues: getDefaultValues(project),
  });

  const closeEditor = () => {
    reset(getDefaultValues(project));
    mutation.reset();
    setIsEditing(false);
  };

  const submit = async (values: UpdateProjectFormValues) => {
    const payload = toUpdateProjectRequest(project, values);
    if (Object.keys(payload).length === 0) return closeEditor();

    try {
      await mutation.updateProject(payload);
      toast.success(t('toast.updated'));
      setIsEditing(false);
    } catch {
      // Mutation error is rendered with the form.
    }
  };

  const useBranchFallback = !project.githubRepoId || branches.isError;

  return (
    <Card className='border-border/70 rounded-3xl'>
      <CardHeader className='border-border/60 flex flex-row items-start justify-between gap-4 border-b'>
        <div className='flex flex-col gap-1.5'>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </div>
        {!isEditing && (
          <Button type='button' variant='outline' disabled={isDeploymentActive} onClick={() => setIsEditing(true)}>
            {t('actions.edit')}
          </Button>
        )}
      </CardHeader>
      <form onSubmit={handleSubmit(submit)}>
        <CardContent className='grid gap-5 p-6 md:grid-cols-2'>
          {isDeploymentActive && (
            <p className='text-muted-foreground md:col-span-2' role='status'>{t('activeDeployment')}</p>
          )}
          <Controller
            control={control}
            name='deployBranch'
            render={({ field }) => (
              <div className='flex flex-col gap-2'>
                <Label htmlFor='settings-deploy-branch'>{t('fields.deployBranch')}</Label>
                {isEditing && !useBranchFallback ? (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id='settings-deploy-branch' aria-invalid={!!errors.deployBranch}>
                      <SelectValue placeholder={t('placeholders.deployBranch')} />
                    </SelectTrigger>
                    <SelectContent><SelectGroup>
                      {!branches.data?.some((branch) => branch.value === field.value) && (
                        <SelectItem value={field.value}>{field.value}</SelectItem>
                      )}
                      {branches.data?.map((branch) => (
                        <SelectItem key={branch.value} value={branch.value}>{branch.label}</SelectItem>
                      ))}
                    </SelectGroup></SelectContent>
                  </Select>
                ) : (
                  <Input id='settings-deploy-branch' readOnly={!isEditing} aria-invalid={!!errors.deployBranch} {...field} />
                )}
                {errors.deployBranch && <p className='text-destructive text-sm'>{errors.deployBranch.message}</p>}
              </div>
            )}
          />
          {(['rootDirectory', 'dockerfilePath', 'buildContext'] as const).map((name) => (
            <div className='flex flex-col gap-2' key={name}>
              <Label htmlFor={`settings-${name}`}>{t(`fields.${name}`)}</Label>
              <Input id={`settings-${name}`} readOnly={!isEditing} {...register(name)} />
            </div>
          ))}
          {(['containerPort', 'hostPort'] as const).map((name) => (
            <div className='flex flex-col gap-2' key={name}>
              <Label htmlFor={`settings-${name}`}>{t(`fields.${name}`)}</Label>
              <Input
                id={`settings-${name}`}
                type='number'
                min={1}
                readOnly={!isEditing}
                aria-invalid={!!errors[name]}
                {...register(name)}
              />
              {errors[name] && <p className='text-destructive text-sm'>{t('validation.invalidPort')}</p>}
            </div>
          ))}
          <Controller
            control={control}
            name='autoDeploy'
            render={({ field }) => (
              <div className='flex items-center justify-between gap-4 md:col-span-2'>
                <div className='flex flex-col gap-1'>
                  <Label htmlFor='settings-auto-deploy'>{t('fields.autoDeploy')}</Label>
                  <p className='text-muted-foreground text-sm'>{t('autoDeployDescription')}</p>
                </div>
                <Switch id='settings-auto-deploy' checked={field.value} disabled={!isEditing} onCheckedChange={field.onChange} />
              </div>
            )}
          />
          {mutation.error && (
            <p className='text-destructive text-sm md:col-span-2' role='alert'>
              {getErrorMessage(mutation.error)}
            </p>
          )}
        </CardContent>
        {isEditing && (
          <CardFooter className='justify-end gap-3 border-t pt-6'>
            <Button type='button' variant='ghost' disabled={mutation.isPending} onClick={closeEditor}>
              {t('actions.cancel')}
            </Button>
            <Button type='submit' disabled={mutation.isPending || !isDirty}>
              {mutation.isPending && <Spinner data-icon='inline-start' />}
              {mutation.isPending ? t('actions.saving') : t('actions.save')}
            </Button>
          </CardFooter>
        )}
      </form>
    </Card>
  );
}
