# Security Policy

## Reporting a vulnerability

Email **michael@smfworks.com** with a description, affected path, and impact.
Do not open a public issue that includes secret values, tokens, or private keys.

## Secrets

- Never commit API keys, tokens, or private keys.
- Hero image generation reads **only** `TOGETHER_API_KEY` from the environment and **fails closed** if it is missing.
- Copy `.env.example` to `.env.local` for local work. `.env*` is gitignored except `.env.example`.
- A Together.ai key was previously committed in `scripts/generate-hero.mjs`. Treat that key as compromised and **rotate it**. Git history is not rewritten unless an operator explicitly orders it.

## Production expectations

- Site deploys from `main` via Vercel. Runtime secrets belong in the Vercel project environment, not in the repository.
- Pull requests run a tracked-file secret scan and the hero-script contract tests.
- If the secret scan fails, do not merge. Rotate the credential and remove it from the working tree.

## Operator rotation checklist (Together.ai)

1. Revoke the exposed Together.ai key in the Together console.
2. Issue a new key and store it only in the operator environment / Vercel env (if a deploy-time generator is ever used).
3. Confirm `scripts/generate-hero.mjs` contains no `tgp_v1_` literal.
4. Confirm CI `secret-scan` is green on the hardening branch.
