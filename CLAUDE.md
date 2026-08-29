# CLAUDE.md

This repository has no written conventions of its own yet. Follow what the
surrounding code already does, and prefer the boring, obvious change.

- **Delegate broad codebase searches to the `explore` subagent**
  (`.claude/agents/explore.md`, runs on Haiku). "Where is X handled", "which
  files touch Y", "how many places do Z" — hand those over rather than
  grepping the repo into your own context, and keep only its findings.
