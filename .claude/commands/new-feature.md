---
description: Create a new feature branch and set up for implementation
argument-hint: <feature-name>
---

Start a new feature with proper branch hygiene.

1. Verify working tree is clean (git status). If not, ask user to commit/stash.
2. Checkout main and pull: git checkout main && git pull
3. Create branch feat/$ARGUMENTS
4. Propose a Conventional Commits scaffolding message for the initial commit
5. Confirm plan with user before implementation

After implementation:
1. Run npm run typecheck && npm test
2. Stage and commit (Conventional Commits format)
3. Push: git push -u origin feat/$ARGUMENTS
4. Open PR with gh pr create including:
   - Title in Conventional Commits format
   - Body sections: What / How / Test / Preview
