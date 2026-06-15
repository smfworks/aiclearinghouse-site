---
{
  "slug": "permission-models",
  "title": "Agent Permission Models",
  "excerpt": "Compare how agents handle file access, command execution, and human approval.",
  "category": "Trust",
  "tags": ["safety", "permissions", "agent", "security"]
}
---

## Common patterns

| Pattern | Description | Examples |
|---|---|---|
| Read-only | Agent can inspect files and logs but cannot write or run commands | Static analysis tools |
| Suggested edits | Agent proposes diffs; human must apply them | GitHub Copilot, many code review agents |
| Command preview | Agent generates shell commands; human approves each | Claude Code, Cline |
| Auto-approve safe ops | Low-risk commands run automatically; destructive ones gated | Cursor agent mode |
| Full auto | Agent runs commands and commits without approval; highest risk | Some CI agents |

## Recommendations

- Start with read-only or suggested-edit modes.
- Use command preview for any agent touching production systems.
- Log every action for audit review.
