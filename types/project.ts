// types/project.ts

export type DeployStatus = "BUILDING" | "SUCCESS" | "FAILED" | "CANCELED" | "QUEUED" | "PULLING" | "DEPLOYING";

// Thông tin deploy gần nhất, nhúng trong Project (cho list view)
export interface LatestDeploy {
    id: string;
    status: DeployStatus;
    commitSha: string;       // full sha, FE tự cắt 7 ký tự khi hiển thị, thông tin commit 
    commitMessage: string | null;
    createdAt: string;       // ISO string, FE format bằng dayjs/date-fns
    finishedAt: string | null;

    trigger: 'MANUAL' | 'GITHUB_PUSH';
}

// Dùng cho trang Dashboard (GET /projects) — list nhiều project
export interface ProjectListItem {
    id: string;
    name: string;
    repoFullName: string;    // "owner/repo"
    deployBranch: string;
    latestDeploy: LatestDeploy | null; // null nếu project mới tạo, chưa deploy lần nào
    deployCount: number;     // tổng số lần deploy, hiển thị nhỏ ở card
    repoUrl: string | null;
    webhookId: string | null;
    isWebhookProvisioned: boolean;
}

export interface ProjectListResponse {
    items: ProjectListItem[],
    meta: {
        page: number,
        limit: number,
        total: number,
        totalPage: number
    }
}

export interface ProjectListParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface CreateProjectRequest {
    githubRepoId: string;
    name: string;
    deployBranch: string;
    rootDirectory?: string;
    dockerfilePath?: string;
    buildContext?: string;
    containerPort?: number;
    hostPort: number | null;
    autoDeploy?: boolean;
}

// Dùng cho trang Project Detail (GET /projects/:id) — chi tiết 1 project
export type ProjectRunnerType = 'LOCAL' | 'SSH';
export type ProjectStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED';

// Response from GET /projects/:id.
export interface ProjectDetail {
    id: string;
    ownerId: string;
    name: string;
    slug: string;
    repoFullName: string;
    repoOwner: string;
    repoName: string;
    repoUrl: string;
    githubRepoId: string | null;
    githubDefaultBranch: string;
    deployBranch: string;
    rootDirectory: string;
    dockerfilePath: string;
    buildContext: string;
    runnerType: ProjectRunnerType;
    localRepoPath: string | null;
    sshHost: string | null;
    sshPort: number | null;
    sshUser: string | null;
    sshKeyEncrypted: string | null;
    containerPort: number;
    hostPort: number | null;
    containerName: string | null;
    imageName: string | null;
    autoDeploy: boolean;
    webhookId: string | null;
    webhookSecretEncrypted: string | null;
    status: ProjectStatus;
    createdAt: string;
    updatedAt: string;
}

// Dùng cho trang Deployment History (GET /projects/:id/deploys)
export interface DeployListItem {
    id: string;
    status: DeployStatus;
    commitSha: string;
    commitMsg: string | null;
    createdAt: string;
    finishedAt: string | null;
    containerId: string | null;
    port: number | null;
}
