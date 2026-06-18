---
description: Generate Conventional Commits message and execute commit
argument-hint: [optional context hint]
---

Generate and execute a commit for the current changes.

Steps:
1. Run git status and git diff --staged (or git diff if nothing staged)
2. Analyze the changes and infer:
   - Type: feat, fix, docs, refactor, test, chore, perf, style, ci
   - Scope: domain area (property, guide, chat, ui, db, ai, infra, deps)
   - Subject: imperative present, lowercase, no trailing period, max 72 chars

3. Write a commit message following Conventional Commits:

   <type>(<scope>): <subject>

   <body explaining WHY, not what — the diff already shows what.
   Keep bullets short, focused on intent and rationale.>

4. If there are unstaged changes, ask whether to run git add . first
5. Show the proposed message to the user for review before committing
6. After confirmation, run git commit (the Co-Authored-By trailer is added 
   automatically by Claude Code — do not include it manually)
7. Suggest the next step (push, open PR, or continue working)

Rules:
- NEVER commit secrets, .env files, or anything in .gitignore
- Prefer atomic commits (one logical change per commit)
- If changes span multiple unrelated concerns, suggest splitting them
- For body bullets, focus on WHY (rationale, requirement, trade-off) not WHAT
- Use $ARGUMENTS as additional context hint if provided
