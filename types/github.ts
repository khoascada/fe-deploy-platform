export interface GithubRepository {
  id: string;
  name: string;
  fullName: string;
  url: string;
  defaultBranch: string;
  private: boolean;
  owner: {
    login: string;
    avatarUrl: string | null;
  };
}

export interface GithubRepoResponse {
  items: GithubRepository[];
  meta: {
    total: number;
  };
}

export interface GithubBranch {
  name: string;
  protected: boolean;
  commit: {
    sha: string;
    url: string;
  };
}

export interface GithubBranchResponse {
  items: GithubBranch[];
  meta: {
    total: number
  }
}
