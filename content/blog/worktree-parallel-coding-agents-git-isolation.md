---
slug: "worktree-parallel-coding-agents-git-isolation"
title: "The Worktree Pattern: Running Parallel Coding Agents Without Them Destroying Each Other"
excerpt: "Two coding agents on a shared checkout will race on the git index, clobber each other's uncommitted edits, and fight over node_modules. git worktree gives each agent its own working directory, index, and HEAD while sharing one object database. This is the field-tested setup — the commands, the five collision surfaces that survive the split, and the cleanup that actually works."
date: "2026-07-21"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Engineering", "AI Agents", "Linux", "Git"]
tags: ["git-worktree", "parallel-agents", "multi-agent", "hermes", "agent-isolation", "git", "developer-workflow", "concurrency"]
readTime: 14
image: "/images/blog/worktree-parallel-coding-agents-git-isolation-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/worktree-parallel-coding-agents-git-isolation"
---

The most common multi-agent failure I see is not a model failure. It is a filesystem failure dressed up as one. Two coding agents are pointed at the same repository. Agent A starts a refactor. Agent B starts an unrelated feature. Both run `git add -A && git commit` at roughly the same time. One of them wins the index lock. The other gets `fatal: Unable to create '/repo/.git/index.lock': File exists`, retries, and either commits the wrong tree or gives up. Meanwhile the working directory has both agents' uncommitted edits sitting in it, and the first `git checkout` either agent runs blows away the other's in-flight changes.

The model is fine. The prompt is fine. The tools are fine. What broke was the **working directory**. Two autonomous processes sharing one checkout is the same anti-pattern as two threads sharing one mutable struct with no lock. You can get away with it for read-only research. The moment both agents write, it falls apart.

The fix is not "be more careful." The fix is structural: give each agent its own working tree with `git worktree`, share the object database, and make the remaining collision surfaces explicit. This post is the setup I run every day for parallel Hermes agents. It is concrete, it is short on theory, and every command below is one I have run in anger.

## The problem, precisely

A git repository has two parts:

1. **The object database** — `.git/objects`, the immutable content-addressed store of blobs, trees, and commits. Append-only, safe to share.
2. **The working state** — `.git/index` (the staged tree), `.git/HEAD` (where you are), `.git/ORIG_HEAD`, `.git/MERGE_HEAD`, the refs under `.git/refs/`, and the actual checked-out files in the working directory.

When two agents share a checkout, they share *both*. The object database sharing is fine — it is append-only and git handles concurrent writers with a lock. The working-state sharing is not fine. The index is a single binary file. `HEAD` is a single pointer. The working directory is a single set of files. There is no per-agent isolation. Every `git add`, `git checkout`, `git reset`, or `git stash` from one agent mutates state the other agent is reading and assuming is stable.

The failure modes I have personally watched happen:

| Failure | How it manifests | Root cause |
|---------|------------------|------------|
| Index lock contention | `fatal: Unable to create '.git/index.lock'` | Two `git add`/`commit` calls race on `.git/index.lock` |
| Phantom commits | Agent B commits a tree that includes Agent A's half-finished refactor | Both agents stage from the same working dir |
| Lost uncommitted edits | Agent A runs `git checkout .` to discard its experiment; Agent B's in-flight changes vanish with it | Shared working directory |
| HEAD tug-of-war | Agent A is on `feature/auth`; Agent B does `git checkout main` mid-build; Agent A's next `git status` lies | Shared `HEAD` pointer |
| Stash collision | Agent A stashes; Agent B pops the stash Agent A just made and commits it | Shared stash ref |
| Reflog confusion | `git reset --hard ORIG_HEAD` on one agent undoes the other agent's last reset | Shared `ORIG_HEAD` |
| Build-cache fights | Both agents write to `.next/` / `node_modules/.cache/` / `__pycache__/` simultaneously | Shared untracked build artifacts |

Every one of these looks like a flaky agent when it happens. It is not flaky. It is two processes sharing mutable state without a protocol.

## The structural fix: `git worktree add`

`git worktree` creates an additional working directory attached to the same repository. Each worktree has its own:

- Working directory (the files you edit)
- `HEAD` pointer (which branch/commit it is on)
- Index (staged tree)
- Untracked files

And shares the one thing that is safe to share:

- Object database (`.git/objects`)
- Remote configuration
- The ref store (with locking)

The win is that each agent gets a fully independent checkout — its own files, its own branch, its own `git status` — without cloning the repo twice and without diverging object databases.

### The lifecycle

```bash
# From the main repo (~/projects/myapp)
cd ~/projects/myapp
git fetch origin
git worktree add ../myapp-auth feature/auth    # checks out feature/auth into a sibling dir
git worktree add ../myapp-feat  feature/payments

# Each worktree is a full working directory
cd ../myapp-auth && git status   # on feature/auth, clean
cd ../myapp-feat  && git status   # on feature/payments, clean

# List them
git worktree list
# /home/you/projects/myapp          (main)
# /home/you/projects/myapp-auth     (feature/auth)
# /home/you/projects/myapp-feat     (feature/payments)

# When done, remove the worktree and prune
git worktree remove ../myapp-auth
git worktree prune
```

The worktree directories are siblings, not subdirectories of the main checkout. This matters — a worktree cannot live inside another worktree's working tree, and keeping them as siblings makes the mental model clean.

### Hermes ships this as `-w` / `--worktree`

Hermes Agent has a `--worktree` flag that wraps the above:

```bash
# Spawn an agent that creates its own worktree and works in it
hermes -w chat -q "Refactor the auth module to use the new session store"

# Two parallel agents, each in its own worktree, via tmux
tmux new-session -d -s auth -x 120 -y 40 'hermes -w'
tmux new-session -d -s feat  -x 120 -y 40 'hermes -w'
```

With `-w`, the agent runs `git worktree add`, does its work, and you can merge the resulting branch without ever having had two agents touch the same files. This is the single most important flag for parallel coding agents, and it is underused.

## The five collision surfaces that survive the split

Worktree isolation is not a complete answer. The object database and refs are still shared, and some tools reach outside the repo entirely. Here are the five surfaces I have had to handle explicitly, with the mitigation for each.

### 1. The ref store (shared, locked — mostly safe)

`git push`, `git fetch`, `git branch`, and `git tag` all write under `.git/refs/` and `.git/packed-refs`. Git serializes these with ref locks, so concurrent writes do not corrupt the ref file. What *can* happen is a logical race: Agent A pushes `feature/auth` while Agent B force-pushes the same branch from another worktree. The second push wins. This is a normal distributed-VCS problem, not a worktree problem.

**Mitigation:** one branch per agent, ever. If two agents are working on the same branch, you have already lost — worktree or not. Name worktrees by the branch they hold and enforce the invariant in your orchestration.

### 2. The shared config (`.git/config`)

All worktrees share the same `.git/config`. If one agent runs `git config user.email ...` it affects every worktree. This is usually what you want (consistent identity), but it means a misconfigured agent can poison the others.

**Mitigation:** set identity once at the repo level, not per-worktree. If you need per-worktree identity, use the conditional includes git supports via `includeIf`:

```ini
# .git/config
[includeIf "gitdir:~/projects/myapp-auth/"]
    path = ~/projects/myapp-auth/.git-auth-config
```

### 3. Build caches and `node_modules` (per-worktree, but you have to let them be)

This is the one that surprises people. Each worktree has its own working directory, so `.next/`, `node_modules/`, `__pycache__/`, `.pytest_cache/`, `dist/`, and `target/` are all naturally per-worktree. Good. The cost is disk and time: every worktree needs its own `npm install` / `pip install -e .` / `cargo build`. On a large repo this is real — three worktrees on a Next.js app can be 3 × 800 MB of `node_modules`.

**Mitigation:**

- Accept the disk cost. It is the price of real isolation. A 2 TB NVMe makes this a non-issue.
- Cache the install with a package-manager feature, not a shared symlink. `pnpm`'s content-addressed store and `uv`'s cache are worktree-safe because they dedupe at the store, not at `node_modules`. Do **not** symlink `node_modules` across worktrees — that reintroduces the shared-state problem at the package level and breaks on any package that writes to its own directory at runtime.
- For Python, use a separate venv per worktree: `uv venv` inside each worktree directory. One shared venv across worktrees will get its `pip install -e .` metadata clobbered by whichever agent installed last.

### 4. Absolute-path resources outside the repo (databases, ports, sockets)

Worktree isolation stops at the repo boundary. If both agents migrate the same local Postgres database, bind the same port, or write to the same `~/.cache/` directory, you have reintroduced shared mutable state one level up.

**Mitigation:** make every external resource agent-scoped by environment variable, and set that variable per-worktree. The pattern:

```bash
# ~/projects/myapp-auth/.env.local
DATABASE_URL=postgres://localhost/myapp_auth
REDIS_URL=redis://localhost:6380/1
PORT=3101
TEST_DB=myapp_auth_test

# ~/projects/myapp-feat/.env.local
DATABASE_URL=postgres://localhost/myapp_feat
REDIS_URL=redis://localhost:6380/2
PORT=3102
TEST_DB=myapp_feat_test
```

If your app reads `.env.local` from the working directory, each worktree gets its own. If it reads a global `~/.env`, you have to fix that first — this is the same reason Hermes skills warn against hardcoding `~/.cache/`.

### 5. The `.git` directory itself (administrative files)

`.git/COMMIT_EDITMSG`, `.git/MERGE_HEAD`, `.git/ORIG_HEAD`, `.git/stash` are shared across worktrees in the administrative subdirectory. A `git stash` on one worktree writes to the shared stash ref; a `git stash pop` on another worktree can pop it. This is rare in practice because stashes are per-worktree-HEAD-ish in modern git, but `ORIG_HEAD` is genuinely shared and a `git reset --hard ORIG_HEAD` on one worktree will use whatever the last reset on *any* worktree left there.

**Mitigation:** do not reach for `ORIG_HEAD` across worktrees. If an agent needs to undo, use the reflog of its own branch: `git reset --hard <branch>@{1}`. The reflog is per-ref and safe.

| Collision surface | Shared? | Safe to share? | Mitigation |
|---|---|---|---|
| Object database (`.git/objects`) | Yes | Yes — append-only, locked | None needed |
| Refs (`.git/refs/`, `packed-refs`) | Yes | Yes — locked, but watch logical races | One branch per agent |
| Working directory | **No** — per worktree | n/a | That is the whole point |
| Index (`.git/index` per worktree) | **No** — per worktree | n/a | That is the whole point |
| `HEAD` | **No** — per worktree | n/a | That is the whole point |
| Config (`.git/config`) | Yes | Mostly | Set identity at repo level; use `includeIf` for per-worktree overrides |
| Build caches (`.next/`, `node_modules/`) | **No** — per worktree | n/a | Accept the cost; use pnpm/uv for store-level dedupe; never symlink `node_modules` |
| External resources (DB, ports, sockets) | Outside git | No | Agent-scoped env vars per worktree |
| `ORIG_HEAD`, `COMMIT_EDITMSG` | Yes | No | Use per-branch reflog, not `ORIG_HEAD` |

## The two-agent setup I actually run

Here is the full setup for running two Hermes coding agents in parallel on the same repo, with tmux for oversight. This is adapted from the Hermes multi-agent coordination pattern, with the worktree isolation made explicit.

### Step 1 — Prepare the worktrees

```bash
cd ~/projects/myapp
git fetch origin
git checkout main && git pull --ff-only origin main

# Create a fresh branch for each agent off main
git worktree add -b agent/auth ../myapp-auth main
git worktree add -b agent/payments ../myapp-payments main
```

The `-b agent/auth` creates the branch and checks it out in the new worktree in one step. Naming the branches `agent/<scope>` makes it obvious in `git branch` output which branches are agent work and which are human work.

### Step 2 — Install per worktree (yes, both)

```bash
cd ~/projects/myapp-auth   && pnpm install
cd ~/projects/myapp-payments && pnpm install
```

This is the slow part. On a clean install it is real time. With pnpm's content-addressed store, the second install is mostly hardlinks and is fast. With npm, you pay the full cost twice. Use pnpm if you can.

### Step 3 — Per-worktree env for external resources

```bash
# Auth agent
cat > ~/projects/myapp-auth/.env.local <<'EOF'
DATABASE_URL=postgres://localhost/myapp_auth
PORT=3101
EOF

# Payments agent
cat > ~/projects/myapp-payments/.env.local <<'EOF'
DATABASE_URL=postgres://localhost/myapp_payments
PORT=3102
EOF
```

### Step 4 — Spawn the agents in tmux

```bash
tmux new-session -d -s auth -x 120 -y 40 \
  "cd ~/projects/myapp-auth && hermes -w chat"

tmux new-session -d -s pay -x 120 -y 40 \
  "cd ~/projects/myapp-payments && hermes -w chat"
```

Note the `cd` into the worktree directory before launching Hermes. Hermes' `--worktree` flag will create a *new* worktree off the current branch if you let it; by `cd`-ing into an existing worktree first, Hermes operates inside it rather than creating a nested one. (If you want Hermes to create the worktree for you, run it from the main repo and let `-w` pick the branch. Both work; the `cd`-first approach gives you control over branch names.)

### Step 5 — Send each agent its task

```bash
sleep 8  # let Hermes start
tmux send-keys -t auth "Refactor src/auth/ to use the new session store. Keep the public API stable. Run pnpm test before you finish." Enter
tmux send-keys -t pay  "Add idempotent webhook handler for payment events in src/payments/. Add tests. Run pnpm test before you finish." Enter
```

### Step 6 — Watch and relay

```bash
# See what each agent is doing
tmux capture-pane -t auth -p | tail -40
tmux capture-pane -t pay  -p | tail -40
```

Because each agent is in its own worktree on its own branch, you can let them run for an hour without checking on them. Neither can clobber the other's files. The worst case is a merge conflict at integration time — and that is a real, bounded, reviewable problem, not a silent data-loss event.

### Step 7 — Integrate

```bash
cd ~/projects/myapp
git checkout main

# Merge the auth agent's work
git merge --no-ff agent/auth
# Resolve any conflicts (there should be few if the scopes were disjoint)

# Merge the payments agent's work
git merge --no-ff agent/payments

# Run the full suite once on the integrated tree
pnpm test

# Push
git push origin main

# Clean up
git worktree remove ../myapp-auth
git worktree remove ../myapp-payments
git branch -D agent/auth agent/payments
git worktree prune
```

The integration step is where the parallelism stops being free. Two agents that touched overlapping files will produce conflicts here. The mitigation is the same as for any parallel work: **disjoint scopes**. If you give one agent `src/auth/` and the other `src/payments/`, the merges are clean. If you give both agents `src/`, you will be resolving conflicts by hand and the parallelism was not worth it.

## When NOT to use worktrees

Worktrees are not free — disk, install time, mental overhead — and they are not always necessary.

**Read-only research agents do not need worktrees.** If the agent is going to read the codebase, run searches, and produce a report, it does not need its own working tree. Run it in the main checkout. It will not write.

**A single coding agent does not need a worktree.** The isolation benefit is about *concurrency*. One agent in one checkout is the normal case.

**Short-lived one-shot agents that only touch one file do not need worktrees.** The overhead of creating the worktree and installing deps exceeds the work. Use `hermes chat -q "fix the typo in src/foo.ts"` in the main checkout.

**Agents that need to test against a shared database schema do not benefit from worktrees for that part.** Worktree isolation is filesystem isolation. If your test correctness depends on a shared DB state, the DB is the shared resource and the worktree does not help. You need agent-scoped databases (see collision surface 4).

The decision is simple: if there are two or more agents that will *write* to the same repository at the same time, use worktrees. Otherwise, do not.

## Pitfalls

| Pitfall | Fix |
|---------|-----|
| `git worktree add` fails with `'already checked out` | The branch is checked out in another worktree. Create a new branch: `git worktree add -b new-branch ../dir existing-branch` |
| Worktree directory inside the main checkout | Not allowed by git. Worktrees must be siblings, not children. |
| `node_modules` shared via symlink across worktrees | Do not do this. It reintroduces shared-state races at the package level and breaks packages that write to their own dir at runtime. Use pnpm's store-level dedupe instead. |
| Forgetting to `git worktree prune` after a manual `rm -rf` | `git worktree list` will show stale entries. `git worktree prune` cleans them. Always remove with `git worktree remove`, not `rm -rf`. |
| Two agents on the same branch in different worktrees | Not allowed by git, and would be wrong even if it were. One branch per agent. |
| Agent runs `git checkout main` and clobbers the main worktree's state | This is why each agent should be on its own `agent/<scope>` branch, not `main`. The main worktree stays on `main` and is only touched at integration time. |
| Disk fills up from N copies of `node_modules` | Use pnpm or yarn PnP. Accept the cost or prune worktrees aggressively. A 2 TB NVMe costs less than the debugging time you save. |
| `ORIG_HEAD` reset on one worktree undoes another's last reset | Do not use `ORIG_HEAD` across worktrees. Use `git reset --hard <branch>@{1}` — the reflog is per-ref. |
| Port conflicts when both agents run a dev server | Per-worktree `.env.local` with distinct `PORT` values. |
| Hermes `-w` creates a nested worktree inside an existing one | `cd` into the worktree you want before launching Hermes, so `-w` operates inside it rather than creating a new one. Or run Hermes from the main repo and let `-w` create the worktree. Pick one pattern and stick to it. |
| `git pull --rebase` in one worktree rewrites a branch another worktree is on | One branch per agent. Never rebase a branch another worktree is checked out on. |
| Agent leaves uncommitted changes and you `git worktree remove` it | `git worktree remove` refuses if there are uncommitted changes (good). Use `--force` only after you have confirmed the changes are disposable. |

## The mental model

Stop thinking of a git repository as one directory. It is one object database plus N working trees. The object database is safe to share. The working trees are not. `git worktree` makes the split explicit and gives you as many isolated working trees as you have agents.

If you are running one coding agent, this does not matter. The moment you run two, it is the difference between a system that works and a system that silently loses work. The five collision surfaces above are the ones that bite after the split — handle them with one-branch-per-agent, per-worktree env files, and per-branch reflog instead of `ORIG_HEAD`, and you have a parallel-agent setup that does not require you to be lucky.