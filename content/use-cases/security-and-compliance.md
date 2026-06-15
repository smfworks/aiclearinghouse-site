---
{
  "slug": "security-and-compliance",
  "title": "Security & Compliance Agents",
  "excerpt": "Agents that audit code, check dependencies, review permissions, and enforce policy.",
  "category": "Use Case",
  "tags": ["security", "compliance", "audit", "dependencies", "policy"]
}
---

## Top picks

### Socket
Scans dependencies for malicious behavior, not just known CVEs.

### Snyk
Dependency and code vulnerability scanning with auto-fix PRs.

### Semgrep
Static analysis with custom rules for security and compliance.

### Robusta AI Security Audit
External review of agent tool permissions, prompt injection risks, and deployment posture.

## How to choose

- Use Socket when supply-chain risk is your primary concern.
- Use Snyk for breadth across containers, dependencies, and IaC.
- Use Semgrep for policy-as-code and language-specific rules.
- Use Robusta for agent-specific threat modeling.

## Common gotchas

- Security agents can suggest breaking changes; run fixes through CI.
- Define which findings are blocking vs. advisory.
- Combine static analysis with runtime protection for defense in depth.
