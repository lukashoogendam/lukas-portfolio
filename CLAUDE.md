# CLAUDE.md

This repository has no written conventions of its own yet. Follow what the
surrounding code already does, and prefer the boring, obvious change.

- **Delegate broad codebase searches to the `explore` subagent**
  (`.claude/agents/explore.md`, runs on Haiku). "Where is X handled", "which
  files touch Y", "how many places do Z" — hand those over rather than
  grepping the repo into your own context, and keep only its findings.

## What a card session cannot do

A card session runs in an isolated git worktree, unattended. A few things
are unreachable from there — if a task needs one of these, say so early
rather than spending the run discovering it:

- `/opt/data/bin` tools are not reachable from a card worktree.
- `npm` and other approval-gated commands are refused in unattended
  sessions (a past card lost its run to this waiting on an npm install).
- `.claude/**` is write-protected above project settings.
- There is no live deployment to verify changes against.
