---
slug: "2026-10-18-allow-ai-scan-then-enable-it"
title: "Allow AI Scan. Then enable it. Do not use the finding as a merge gate."
excerpt: "Allow AI Scan at the enterprise before you select it on the organization. The pull-request finding is advisory. It will not fail the code scanning check."
date: "2026-10-18"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-18-allow-ai-scan-then-enable-it"
categories: ["Microsoft", "GitHub Copilot"]
tags: ["GitHub Copilot", "code scanning", "AI Scan", "CodeQL"]
readTime: 11
image: "/images/blog/2026-10-18-allow-ai-scan-then-enable-it-hero.png"
---

Allow AI Scan at the enterprise. Then enable it on the organization. Do not use the pull-request finding as a merge gate.

If you are about to select the organization control, stop and read which page you are on. Allow is not enable. The finding will not fail the check. I did not allow the policy, enable the setting, open a pull request, or call the REST API on this host. The steps below are the ones the October 15 changelog and the GitHub Docs pages actually print.

The dated primary is [AI Scan for pull requests generally available](https://github.blog/changelog/2026-10-15-ai-scan-for-pull-requests-generally-available/). The visible date is October 15, 2026. `article:modified_time` is `2026-10-15T15:07:40+00:00`. The GitHub Changelog RSS `pubDate` is Thu, 15 Oct 2026 15:04:51 +0000. This host's clock at 2026-10-18 07:05 EDT put that RSS time 68 hours back. That is inside 72 hours and outside 48 hours.

The changelog feed's newer item is [Open source license compliance generally available](https://github.blog/changelog/2026-10-16-open-source-license-compliance-generally-available/), RSS `pubDate` Fri, 16 Oct 2026 14:00:32 +0000. I fetched it. It is a license-policy GA, not this how-to.

## Read the product split before you click

[AI Scan for pull requests](https://docs.github.com/en/code-security/concepts/code-scanning/ai-powered-security-detections) is the procedure page. The saved HTML from this run had no `ms.date`, no `updated_at`, and no `2026-10` timestamp in the article body. Cite it as the enablement page, not as a second news recap.

The changelog says code scanning AI Scan for pull requests is now generally available. It complements CodeQL by finding vulnerabilities in pull request changes for languages and frameworks that CodeQL does not currently cover, including PHP, Shell/Bash, Terraform configuration (HCL), Dockerfiles, JSP for Java, Blazor for C#, and more.

The docs page says examples include that same list, and it does not add "and more" on that sentence. Keep the extra words on the changelog.

Findings can include an explanation of the security risk and a suggested autofix. That is the changelog's sentence. The docs page says each finding describes the security issue and explains the risk, and that most findings also include a suggested remediation. When available, Copilot Autofix recommends a code change, as it does for CodeQL alerts.

That suggested change is not the Assign to Copilot button on a default-branch code scanning alert. AI Scan findings are only available on pull requests. They do not appear as backlog alerts in the repository's security view. You cannot assign a finding that the security view does not list.

## Allow first. The default is Not allowed.

Do this before the organization switch, because the switch is immediate.

Confirm the repository is eligible. The docs page prints this table:

| Repository owner | Visibility | Availability and requirement |
| --- | --- | --- |
| Organization | Public | Available without an active-committer license |
| Organization | Private or internal | Available with GitHub Code Security or GitHub Advanced Security |
| Personal account | Public | Available |
| Personal account | Private | Not available |

AI Scan for pull requests is not available for repositories in a managed user account's personal namespace, even if code scanning is enabled for the repository.

The changelog says AI Scan is available for public repositories owned by organizations or personal accounts. For private and internal organization-owned repositories, GitHub Code Security or GitHub Advanced Security is required. It does not print the personal private row or the managed-user exclusion.

A GitHub Copilot license is not required. That is the changelog. The docs page says you do not need a GitHub Copilot license to use AI Scan. Those are two sentences. Cite both. You also do not need to select a model to enable AI Scan. That sentence is only on the docs page.

If the repository sits in an enterprise, allow the policy before anyone enables the organization. [Enforcing policies for code security and analysis](https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-code-security-and-analysis-for-your-enterprise#enforcing-a-policy-to-manage-ai-scan-in-your-enterprises-repositories) is the click path I fetched. I did not open the dropdown.

As an enterprise owner, you can control whether organizations in your enterprise can enable AI Scan. This policy is set to "Not allowed" by default. Allowing AI Scan at the enterprise level does not enable it for any organization. Organization administrators must enable AI Scan for their organization. Eligible repositories where code scanning is enabled inherit the organization setting, and repository administrators can opt out for individual repositories.

The concepts page uses fewer words for the same split. The policy is set to "Not allowed" by default. Allowing AI Scan does not enable it automatically.

The enterprise page's click path is:

1. Navigate to your enterprise. For example, from the Enterprises page on GitHub.com.
2. At the top of the page, click Policies.
3. Under "Policies", click Advanced Security.
4. Under "AI Scan", select the dropdown menu and click a policy.

The saved page prints "Not allowed" as the default. It does not print the other dropdown labels. I am not going to invent them. If the menu is open in front of you, write the labels down before you click one.

## Set the budget, then select AI Scan

The concepts page tells you to confirm eligibility, review the billing account's included AI credits, and configure budgets for metered usage before you enable AI Scan on pull requests for an organization.

Enabling the organization setting enables AI Scan immediately for all eligible repositories where code scanning is enabled. Repository administrators can then opt out, but qualifying pull requests can consume Code Security AI Credits before they do.

That is why the budget comes first. The org control does not wait for the opt-out.

[Configuring global security settings for your organization](https://docs.github.com/en/code-security/how-tos/secure-at-scale/configure-organization-security/establish-complete-coverage/configure-global-settings#enabling-ai-scan) names the control. You can select AI Scan to enable AI Scan for eligible repositories in your organization where code scanning is enabled. Repositories inherit the organization setting, but repository administrators can opt out for individual repositories. The saved section does not print a longer click path than that sentence. I did not invent one.

On an organization-owned repository, people with admin access can opt out when the organization has enabled AI Scan. They cannot opt in when the organization setting is disabled.

On a public repository owned by a personal account, people with admin access enable or disable AI Scan directly with the AI Scan for pull requests toggle under "Code scanning". I did not open that toggle.

## Keep the billing nouns on the page that used them

Do not merge the billing paragraphs. The nouns do not match.

The changelog says AI Scan for pull requests consumes Code Security AI Credits. AI Credit usage is displayed in the "AI usage" section of enterprise billing and licensing as the "Advanced Security" product. You can also set SKU-level budgets for Code Security AI Credits.

The docs page says usage is separate from active-committer licensing and is reported under the Code Security AI Credits SKU. Usage begins only when a qualifying pull request is scanned.

For organization-owned repositories, usage is billed to the account responsible for the organization's billing.

For public repositories owned by a personal account, usage is billed to that personal account unless the repository owner has a GitHub Copilot license provided by an organization or enterprise. In that case, usage is billed to the organization or enterprise that provides the license.

If the billing account receives included AI credits through a GitHub Copilot entitlement, AI Scan uses those credits first. After the included credits are exhausted, or if the account has no included credits, usage is metered and governed by the applicable budgets. If a hard budget leaves no Code Security AI Credits available, AI Scan cannot produce findings. Scanning resumes when an administrator increases the limiting budget or a new billing cycle begins. The changelog does not print that stop. No price or credit amount was on the pages I fetched.

## Expect a pull-request finding, not a failed check

AI Scan runs automatically when all of these are true, on the docs page:

- Code scanning is enabled for the repository.
- The repository's AI Scan on pull requests setting is enabled.
- A pull request that is not from a fork or created by Dependabot contains changes in a supported language or framework that CodeQL does not cover.

Scans run when a pull request is created and after each new commit, as they do for CodeQL.

AI Scan does not require CodeQL default setup and does not depend on the state of CodeQL analysis. If CodeQL analysis fails or is in a waiting state, AI Scan will still run.

Results are posted as they are found. If the CodeQL scan takes longer, you may see AI Scan findings before CodeQL results, or the other way around.

The changelog says findings appear alongside CodeQL results on the Conversation and Files changed tabs, with an "AI" indicator. AI Scan findings are advisory. They do not fail the code scanning check and cannot block pull request merges through ruleset requirements. Lowercase "code scanning" is the changelog's spelling.

The docs page capitalizes it as the Code scanning check, and it adds that the findings provide signals about where code security can be improved without interrupting your workflow. Leave that sentence on the docs page.

The same page says full repository scans are not supported, findings cannot yet be used in rulesets to enforce merge requirements, and detection categories and supported languages may change as the feature evolves. It also says findings may include false positives, and that you should use the feedback mechanism to report inaccurate results. That control is thumbs up or thumbs down. I did not click one.

The scanning engine analyzes pull request code without requiring a build system and may use code search to gather more context before flagging an issue. It uses specialized prompts, not custom instruction files such as `/.github/copilot-instructions.md` or `/CLAUDE.md`. I am quoting the leading slash the page printed.

## Do not add a tenth category

The docs page names nine detection categories and says coverage may change as the feature evolves. Use the names it printed:

- String injection: unsafe string-built SQL, HTML, shell, JSON, or YAML with missing or incorrect escaping or sanitization.
- Weak cryptography: weak algorithms, small keys, insecure randomness, missing encryption, or weak password hashing.
- Broken access control: path traversal, CSRF gaps, or user-driven open redirects.
- Sensitive data exposure: secrets, tokens, passwords, or stack traces stored, logged, or sent without adequate protection.
- Security misconfiguration: risky defaults or settings, such as disabling security controls or enabling debug features.
- Authentication failures: missing TLS or validation, insecure authentication flows, or missing rate limiting.
- Data integrity failures: unsafe deserialization, HTTP for sensitive actions, prototype pollution, or executing untrusted content.
- Server-side request forgery (SSRF): server fetches attacker-controlled URLs, hosts, or protocols.
- Supply chain risks: unpinned third-party actions, packages, or images, or downloads without integrity checks.

## Read `pr_scan`. Do not guess the rejection code.

[REST API endpoints for code scanning](https://docs.github.com/en/rest/code-scanning/code-scanning#get-the-ai-scan-setting-for-an-organization) is where the concepts page sends you. I fetched the page. I did not send a request.

Get the AI Scan setting for an organization is `GET /orgs/{org}/code-scanning/ai-scan`. The response reports the value stored on the organization. Organization respects enterprise policy. The sample response is `{"pr_scan":"enabled"}`. The authenticated user must be an owner or security manager. The sample header is `X-GitHub-Api-Version: 2026-03-10`. That is the sample. I did not verify it against a live call.

Update the AI Scan setting for an organization is `PATCH` on the same path. The body field is `pr_scan`, and it can be `enabled` or `disabled`. The page says disabled organizations prevent repositories from enabling AI Scan. Enabled organizations enable AI Scan for their repositories, but individual repositories can opt out. Enabling is rejected when the enterprise disallows AI Scan.

The update status table lists 200, 403 Forbidden, 404, and 422 Validation failed, or the endpoint has been spammed. It does not say which of those codes is the enterprise rejection. I am not going to pick one.

Get AI Scan enablement for a repository is `GET /repos/{owner}/{repo}/code-scanning/ai-scan`. The page says it gets whether AI Scan is enabled for a repository. The sample response is the same `pr_scan` object. Its 403 description is "Response if GitHub Advanced Security is not enabled for this repository." The availability table says a public organization repository is available without an active-committer license, and a public personal repository is available. The REST page does not explain how those rows meet that 403. Leave both sentences where they are.

Update AI Scan enablement for a repository is `PATCH` on the repo path, with the same `pr_scan` values. Its 403 description is "Response if the repository is archived or if GitHub Advanced Security is not enabled for this repository." I did not mint a token, and I did not send either PATCH.

If the enterprise policy is still Not allowed, which status code does that organization PATCH actually return?
