# messages/*.json editing

Use this guide whenever editing translation files under `messages/*.json`.

## Goal

Keep translation JSON valid UTF-8 without BOM and avoid mojibake such as `ÄÄƒng nháº­p`.

## Hard rules

- Treat any garbled Vietnamese text as corrupted data, not as a display-only issue.
- Do not copy translation content from terminal output if the terminal is not clearly rendering UTF-8 correctly.
- Do not rewrite `messages/*.json` by round-tripping text through shell output, ad-hoc encoding conversions, or tools with unclear file encoding behavior.
- Before saving, spot-check a few Vietnamese characters such as `Đ`, `ă`, `ê`, `ơ`, `ư`, and `ạ`.
- If a file already looks corrupted, stop and recover from a known-good source or diff before making further edits.

## Preferred workflow

1. Read the existing JSON structure directly from the file in the workspace.
2. Edit only the intended keys.
3. Preserve UTF-8 without BOM.
4. Re-open or diff the file and verify that Vietnamese text still reads correctly.

## Verification

- JSON remains parseable.
- No mojibake markers like `Ã`, `Â`, `Ä`, or `á»` appear where natural Vietnamese text is expected.
- The file encoding remains UTF-8 without BOM.
