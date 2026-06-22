// types/project.ts

export type DeployStatus = "PENDING" | "BUILDING" | "SUCCESS" | "FAILED";

export type WebhookStatus = "CONNECTED" | "MISSING" | "ERROR"
// Thông tin deploy gần nhất, nhúng trong Project (cho list view)
export interface LatestDeploy {
    id: string;
    status: DeployStatus;
    commitSha: string;       // full sha, FE tự cắt 7 ký tự khi hiển thị, thông tin commit 
    commitMsg: string | null;
    createdAt: string;       // ISO string, FE format bằng dayjs/date-fns
    finishedAt: string | null;

    triggeredBy: "manual" | "webhook";
}

// Dùng cho trang Dashboard (GET /projects) — list nhiều project
export interface ProjectListItem {
    id: string;
    name: string;
    repoFullName: string;    // "owner/repo"
    branch: string;
    latestDeploy: LatestDeploy | null; // null nếu project mới tạo, chưa deploy lần nào
    deployCount: number;     // tổng số lần deploy, hiển thị nhỏ ở card
    appUrl: string | null;

    webhookStatus: WebhookStatus
}

export interface ProjectListResponse {
    items: ProjectListItem[],
    total: number,
    totalPage: number
}

export interface ProjectListParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface CreateProjectRequest {
    githubRepoId: string;
    repoFullName: string;
    repoOwner: string;
    repoName: string;
    repoUrl: string;
    githubDefaultBranch: string;
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
export interface ProjectDetail {
    id: string;
    name: string;
    repoFullName: string;
    branch: string;
    dockerfilePath: string;
    createdAt: string;
    latestDeploy: LatestDeploy | null;
    // Detail page cần thêm field mà list view không cần load để đỡ nặng:
    webhookId: number;
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
