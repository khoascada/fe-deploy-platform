import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        // Commit type phải là một trong các loại dưới đây
        "type-enum": [
            2,
            "always",
            [
                "feat",     // Thêm tính năng mới
                "fix",      // Sửa bug
                "docs",     // Thay đổi tài liệu
                "style",    // Format code, không ảnh hưởng logic
                "refactor", // Refactor code
                "perf",     // Cải thiện performance
                "test",     // Thêm/sửa tests
                "chore",    // Công việc bảo trì, build tools
                "revert",   // Revert commit trước đó
                "ci",       // Thay đổi CI/CD config
                "temp",     // Temporary commit
            ],
        ],
        "type-case": [2, "always", "lower-case"],
        "type-empty": [2, "never"],
        "subject-empty": [2, "never"],
        "subject-full-stop": [2, "never", "."],
        "header-max-length": [2, "always", 150],
    },
};

export default config;
