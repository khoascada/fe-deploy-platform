'use client';

import type { GithubBranchOption, GithubRepositoryOption } from '@/features/projects/hooks/actions';
import {
  createCreateProjectSchema,
  type CreateProjectFormInput,
  type CreateProjectFormValues,
} from '@/features/projects/validations';
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@i18n/navigation';
import { cn } from '@lib/utils';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  FolderGit2,
  GitBranch,
  Github,
  Loader2,
  Lock,
  Package,
  RefreshCw,
  ServerCog,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, type ComponentType, type ReactNode } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

interface NewProjectPageViewProps {
  branchSearch: string;
  branchesErrorMessage: string;
  filteredBranchOptions: GithubBranchOption[];
  filteredRepositoryOptions: GithubRepositoryOption[];
  findRepositoryOptionById: (repositoryId: string) => GithubRepositoryOption | null;
  isBranchesError: boolean;
  isBranchesLoading: boolean;
  isRefreshingBranches: boolean;
  isRepositoriesError: boolean;
  isRepositoriesLoading: boolean;
  isRefreshingRepositories: boolean;
  isSubmitting: boolean;
  onBranchSearchChange: (value: string) => void;
  onRefreshBranches: () => void;
  onRefreshRepositories: () => void;
  onRepositorySearchChange: (value: string) => void;
  onRetryRepositories: () => void;
  onSelectRepository: (repositoryId: string) => GithubRepositoryOption | null;
  onSubmit: (values: CreateProjectFormValues) => Promise<void>;
  repositoriesErrorMessage: string;
  repositorySearch: string;
  submitErrorMessage: string;
}

interface FieldProps {
  id: keyof CreateProjectFormInput;
  label: string;
  description?: string;
  required?: boolean;
  error?: string;
  action?: ReactNode;
  children: ReactNode;
}

function Field({ id, label, description, required = false, error, action, children }: FieldProps) {
  return (
    <div className="grid gap-2">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <Label htmlFor={id} className="text-sm font-medium">
            {label}
            {required ? <span className="text-destructive ml-1">*</span> : null}
          </Label>
          {description ? <p className="text-muted-foreground text-xs">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
      {error ? (
        <p className="text-destructive text-xs" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SectionHeader({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
        <Icon className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}

export function NewProjectPageView({
  branchSearch,
  branchesErrorMessage,
  filteredBranchOptions,
  filteredRepositoryOptions,
  findRepositoryOptionById,
  isBranchesError,
  isBranchesLoading,
  isRefreshingBranches,
  isRepositoriesError,
  isRepositoriesLoading,
  isRefreshingRepositories,
  isSubmitting,
  onBranchSearchChange,
  onRefreshBranches,
  onRefreshRepositories,
  onRepositorySearchChange,
  onRetryRepositories,
  onSelectRepository,
  onSubmit,
  repositoriesErrorMessage,
  repositorySearch,
  submitErrorMessage,
}: NewProjectPageViewProps) {
  const t = useTranslations('pages.newProject');
  const schema = createCreateProjectSchema(t);

  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    setValue,
  } = useForm<CreateProjectFormInput, unknown, CreateProjectFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      autoDeploy: true,
      buildContext: undefined,
      containerPort: undefined,
      deployBranch: '',
      dockerfilePath: undefined,
      githubRepoId: '',
      hostPort: null,
      name: '',
      rootDirectory: undefined,
    },
  });

  const selectedRepositoryId = useWatch({
    control,
    name: 'githubRepoId',
  });

  useEffect(() => {
    if (!selectedRepositoryId) {
      return;
    }

    const selectedOption = findRepositoryOptionById(selectedRepositoryId);

    if (!selectedOption) {
      return;
    }

    if (!getValues('name').trim()) {
      setValue('name', selectedOption.repository.name, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    setValue('deployBranch', selectedOption.repository.defaultBranch, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [findRepositoryOptionById, getValues, selectedRepositoryId, setValue]);

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="space-y-3">
        <Button asChild variant="ghost" color="default" className="w-fit px-0">
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Link>
        </Button>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">{t('description')}</p>
        </div>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle>{t('card.title')}</CardTitle>
          <CardDescription>{t('card.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {submitErrorMessage ? (
            <div
              className="border-destructive/30 bg-destructive/8 text-destructive rounded-xl border px-4 py-3 text-sm"
              role="alert"
            >
              {submitErrorMessage}
            </div>
          ) : null}

          <form
            id="create-project-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
            aria-label={t('formAriaLabel')}
          >
            <div className="space-y-5">
              <SectionHeader
                icon={FolderGit2}
                title={t('sections.repository.title')}
                description={t('sections.repository.description')}
              />

              {isRepositoriesError ? (
                <div className="border-warning/30 bg-warning/8 rounded-xl border p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-3">
                      <div className="bg-warning/15 text-warning flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{t('repositories.errorTitle')}</p>
                        <p className="text-muted-foreground text-sm">{repositoriesErrorMessage}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      color="warning"
                      onClick={onRetryRepositories}
                    >
                      <RefreshCw className="h-4 w-4" />
                      {t('repositories.retry')}
                    </Button>
                  </div>
                </div>
              ) : null}

              {/* githubRepo */}
              <div className="grid gap-5">
                <Controller
                  name="githubRepoId"
                  control={control}
                  render={({ field }) => (
                    <Field
                      id="githubRepoId"
                      label={t('fields.githubRepoId.label')}
                      description={t('fields.githubRepoId.description')}
                      required
                      error={errors.githubRepoId?.message}
                      action={
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              color="default"
                              size="icon"
                              onClick={onRefreshRepositories}
                              disabled={isSubmitting || isRefreshingRepositories}
                              aria-label={t('repositories.refresh')}
                            >
                              <RefreshCw
                                className={cn(
                                  'h-4 w-4',
                                  isRefreshingRepositories && 'animate-spin'
                                )}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t('repositories.refresh')}</TooltipContent>
                        </Tooltip>
                      }
                    >
                      <Autocomplete
                        value={repositorySearch}
                        onChange={(value) => {
                          onRepositorySearchChange(value);

                          const matchedOption = filteredRepositoryOptions.find(
                            (option) => option.label === value
                          );

                          if (!matchedOption || matchedOption.value !== field.value) {
                            field.onChange('');
                            setValue('deployBranch', '', {
                              shouldDirty: true,
                              shouldTouch: true,
                            });
                            onBranchSearchChange('');
                            onSelectRepository('');
                          }
                        }}
                        onFocus={onRepositorySearchChange}
                        onSelect={(option) => {
                          field.onChange(option.value);
                          onRepositorySearchChange(option.label);
                          const selectedOption = onSelectRepository(option.value);
                          const defaultBranch = selectedOption?.repository.defaultBranch ?? '';
                          setValue('deployBranch', defaultBranch, {
                            shouldDirty: true,
                            shouldTouch: true,
                          });
                          onBranchSearchChange(defaultBranch);
                        }}
                        options={filteredRepositoryOptions}
                        isLoading={isRepositoriesLoading || isRefreshingRepositories}
                        placeholder={t('fields.githubRepoId.placeholder')}
                        emptyMessage={
                          repositorySearch.trim()
                            ? t('repositories.emptySearch')
                            : t('repositories.empty')
                        }
                        className={cn(
                          errors.githubRepoId
                            ? 'border-destructive focus-visible:ring-destructive'
                            : ''
                        )}
                        disabled={isSubmitting}
                        renderOption={(option) => (
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 space-y-1">
                              <div className="flex items-center gap-2">
                                <Github className="text-muted-foreground h-4 w-4" />
                                <span className="truncate font-medium">
                                  {option.repository.fullName}
                                </span>
                              </div>
                              <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
                                <span className="inline-flex items-center gap-1">
                                  <GitBranch className="h-3.5 w-3.5" />
                                  {option.repository.defaultBranch}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  {option.repository.private ? (
                                    <>
                                      <Lock className="h-3.5 w-3.5" />
                                      {t('repositories.private')}
                                    </>
                                  ) : (
                                    t('repositories.public')
                                  )}
                                </span>
                              </div>
                            </div>
                            {field.value === option.value ? (
                              <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                            ) : null}
                          </div>
                        )}
                      />
                    </Field>
                  )}
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Field
                        id="name"
                        label={t('fields.name.label')}
                        description={t('fields.name.description')}
                        required
                        error={errors.name?.message}
                      >
                        <Input
                          id="name"
                          {...field}
                          placeholder={t('fields.name.placeholder')}
                          disabled={isSubmitting}
                          className={cn(
                            errors.name ? 'border-destructive focus-visible:ring-destructive' : ''
                          )}
                        />
                      </Field>
                    )}
                  />

                  <Controller
                    name="deployBranch"
                    control={control}
                    render={({ field }) => (
                      <Field
                        id="deployBranch"
                        label={t('fields.deployBranch.label')}
                        description={t('fields.deployBranch.description')}
                        required
                        error={
                          errors.deployBranch?.message ||
                          (isBranchesError ? branchesErrorMessage : '')
                        }
                        action={
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                color="default"
                                size="icon"
                                onClick={onRefreshBranches}
                                disabled={
                                  isSubmitting || isRefreshingBranches || !selectedRepositoryId
                                }
                                aria-label={t('branches.refresh')}
                              >
                                <RefreshCw
                                  className={cn('h-4 w-4', isRefreshingBranches && 'animate-spin')}
                                />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{t('branches.refresh')}</TooltipContent>
                          </Tooltip>
                        }
                      >
                        <Autocomplete
                          value={branchSearch}
                          onChange={(value) => {
                            onBranchSearchChange(value);

                            const matchedOption = filteredBranchOptions.find(
                              (option) => option.label === value
                            );

                            if (!matchedOption || matchedOption.value !== field.value) {
                              field.onChange(value);
                            }
                          }}
                          onFocus={onBranchSearchChange}
                          onSelect={(option) => {
                            field.onChange(option.value);
                            onBranchSearchChange(option.label);
                          }}
                          options={filteredBranchOptions}
                          isLoading={
                            Boolean(selectedRepositoryId) &&
                            (isBranchesLoading || isRefreshingBranches)
                          }
                          placeholder={t('fields.deployBranch.placeholder')}
                          emptyMessage={
                            selectedRepositoryId
                              ? t('branches.empty')
                              : t('branches.selectRepositoryFirst')
                          }
                          className={cn(
                            errors.deployBranch
                              ? 'border-destructive focus-visible:ring-destructive'
                              : ''
                          )}
                          disabled={isSubmitting || !selectedRepositoryId}
                        />
                      </Field>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <SectionHeader
                icon={Package}
                title={t('sections.build.title')}
                description={t('sections.build.description')}
              />

              <div className="grid gap-5 md:grid-cols-2">
                <Controller
                  name="rootDirectory"
                  control={control}
                  render={({ field }) => (
                    <Field
                      id="rootDirectory"
                      label={t('fields.rootDirectory.label')}
                      description={t('fields.rootDirectory.description')}
                      error={errors.rootDirectory?.message}
                    >
                      <Input
                        id="rootDirectory"
                        {...field}
                        value={field.value ?? ''}
                        placeholder={t('fields.rootDirectory.placeholder')}
                        disabled={isSubmitting}
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="dockerfilePath"
                  control={control}
                  render={({ field }) => (
                    <Field
                      id="dockerfilePath"
                      label={t('fields.dockerfilePath.label')}
                      description={t('fields.dockerfilePath.description')}
                      error={errors.dockerfilePath?.message}
                    >
                      <Input
                        id="dockerfilePath"
                        {...field}
                        value={field.value ?? ''}
                        placeholder={t('fields.dockerfilePath.placeholder')}
                        disabled={isSubmitting}
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="buildContext"
                  control={control}
                  render={({ field }) => (
                    <Field
                      id="buildContext"
                      label={t('fields.buildContext.label')}
                      description={t('fields.buildContext.description')}
                      error={errors.buildContext?.message}
                    >
                      <Input
                        id="buildContext"
                        {...field}
                        value={field.value ?? ''}
                        placeholder={t('fields.buildContext.placeholder')}
                        disabled={isSubmitting}
                      />
                    </Field>
                  )}
                />
              </div>
            </div>

            <div className="space-y-5">
              <SectionHeader
                icon={ServerCog}
                title={t('sections.runtime.title')}
                description={t('sections.runtime.description')}
              />

              <div className="grid gap-5 md:grid-cols-2">
                <Controller
                  name="containerPort"
                  control={control}
                  render={({ field }) => (
                    <Field
                      id="containerPort"
                      label={t('fields.containerPort.label')}
                      description={t('fields.containerPort.description')}
                      error={errors.containerPort?.message}
                    >
                      <Input
                        id="containerPort"
                        type="number"
                        min={1}
                        step={1}
                        value={field.value ?? ''}
                        onChange={(event) => field.onChange(event.target.value)}
                        placeholder={t('fields.containerPort.placeholder')}
                        disabled={isSubmitting}
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="hostPort"
                  control={control}
                  render={({ field }) => (
                    <Field
                      id="hostPort"
                      label={t('fields.hostPort.label')}
                      description={t('fields.hostPort.description')}
                      error={errors.hostPort?.message}
                    >
                      <Input
                        id="hostPort"
                        type="number"
                        min={1}
                        step={1}
                        value={field.value ?? ''}
                        onChange={(event) => field.onChange(event.target.value)}
                        placeholder={t('fields.hostPort.placeholder')}
                        disabled={isSubmitting}
                      />
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="autoDeploy"
                control={control}
                render={({ field }) => (
                  <div className="border-border/60 flex items-start justify-between gap-4 rounded-xl border p-4">
                    <div className="space-y-1">
                      <Label htmlFor="autoDeploy" className="text-sm font-medium">
                        {t('fields.autoDeploy.label')}
                      </Label>
                      <p className="text-muted-foreground text-xs">
                        {t('fields.autoDeploy.description')}
                      </p>
                    </div>
                    <Switch
                      id="autoDeploy"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </div>
                )}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button asChild variant="outline" color="secondary" className="w-full sm:w-auto">
            <Link href="/projects">{t('actions.cancel')}</Link>
          </Button>

          <Button
            type="submit"
            form="create-project-form"
            color="primary"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? t('actions.submitting') : t('actions.submit')}
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
