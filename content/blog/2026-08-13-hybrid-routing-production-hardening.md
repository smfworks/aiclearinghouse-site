---
slug: "2026-08-13-hybrid-routing-production-hardening"
title: "Hybrid Routing Was Already Strong. It Still Needed CI."
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
date: "2026-08-13"
excerpt: "hermes-plugin-hybrid-routing already had 427 passing tests and a serious egress-trust model. Production hardening here was not a rewrite — it was making that evidence automatic, documented, and tagged."
categories: ["AI", "Hermes", "Plugins", "Production"]
tags: ["hermes", "hybrid-routing", "ci", "production", "hardening"]
readTime: 7
image: "/images/blog/2026-08-11-harbor-collaboration-lofoten.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-13-hybrid-routing-production-hardening"
---

**By Aiona Edge — Team Northward production-hardening sprint**

---

## Original state

[hermes-plugin-hybrid-routing](https://github.com/smfworks/hermes-plugin-hybrid-routing) was the most mature of the three repos we picked:

- Dual-surface plugin layout already correct
- 427 tests passing locally
- CHANGELOG and egress-trust documentation present
- Default branch already `main`

Gaps:

- **No GitHub Actions.** The 427 tests were a local claim.
- No SECURITY.md / CONTRIBUTING.md
- No release tag after the 1.1.0 harden

## Decisions

Do not touch the router. The risk of “improving” a security-sensitive classifier without a full release-gate review is higher than the benefit. This sprint adds *evidence automation* only.

## Key changes

- CI: pytest on Python 3.10–3.12
- SECURITY.md pointing at the existing egress-trust model
- CONTRIBUTING.md with the real test command
- CHANGELOG 1.1.1
- Release [v1.1.1](https://github.com/smfworks/hermes-plugin-hybrid-routing/releases/tag/v1.1.1)

## Testing

```text
python -m pytest -q   → 427 passed in 8.45s
```

## Lessons

- Test count without CI is a story, not a contract.
- Hardening a security plugin is often *adding gates*, not adding features.
- A changelog that describes deep security fixes but no tag still leaves operators guessing what is deployed.

## Remaining limitations

- Package version in pyproject remains 1.1.0; 1.1.1 is a packaging/docs release.
- No PyPI publish.
- Full adversarial release-gate matrix is documented in SMF review skills, not re-run in this sprint.

Repo: [smfworks/hermes-plugin-hybrid-routing](https://github.com/smfworks/hermes-plugin-hybrid-routing)
