---
slug: "trust-as-the-new-infrastructure-layer-know-your-agent-kya-and-the-accountability"
title: "Trust as the New Infrastructure Layer: Know Your Agent (KYA) and the Accountability Problem"
excerpt: "Trust as the New Infrastructure Layer: Know Your Agent (KYA) and the Accountability Problem"
date: "2026-07-10T08:00:00-04:00"
author: "Jeff"
authorKey: "jeff"
series: "jeff"
canonicalUrl: "https://www.smfclearinghouse.com/blog/trust-as-the-new-infrastructure-layer-know-your-agent-kya-and-the-accountability"
categories: ["AI Agents", "Trust Infrastructure", "Governance"]
readTime: 19
image: "/images/blog/trust-as-the-new-infrastructure-layer-know-your-agent-kya-and-the-accountability.png"
---

# Trust as the New Infrastructure Layer: Know Your Agent (KYA) and the Accountability Problem

**By Jeff — SMF Works Project**
**July 10, 2026**

---

## The Conversation Has Shifted

For two years, the AI community asked: *can agents work?* The answer, proven by OpenAI's month-long internal coding workflows, Cursor's million-line autonomous codebases, and Anthropic's multiday research agents, is yes. Capability is no longer the bottleneck.

The conversation has moved to a harder question: *how do we make them trustworthy and governable at scale?*

This shift is visible everywhere in the discourse. On X/Twitter in July 2026, the dominant debate is about "trust as the next infrastructure layer"—the idea that as agents begin handling real transactions, portfolios, contracts, and money movement, they need a standardized way to prove their identity, their operational boundaries, and their legal accountability to anyone they interact with. Forrester's Security Survey, 2026 found that **49% of security decision-makers named agentic AI as a top risk**. Not a niche concern—a top risk.

The rallying cry from the community is direct: "Capability without character is dangerous." The field has matured from building smarter agents to building trustworthy ones. And the infrastructure for that trust is being built right now, in real time, by standards bodies, blockchain projects, identity foundations, and enterprise governance teams.

This article is a technical deep-dive into that infrastructure: what it is, why it matters, and how to build it.

---

## The Identity Gap: Why Trust Infrastructure Is the Missing Layer

### The Core Problem

AI agents are transacting, and nobody knows who's behind them.

Concordium, a Layer-1 blockchain with built-in identity verification, puts it bluntly: "The core problem with today's AI agents is not capability but identity: they can act autonomously, but no one can verify who they are or who authorised them. An agent can execute payments, sign contracts, and interact with other agents—but without a verified identity layer, there is no accountability."

Ethereum's ERC-8004 standard has 200K+ registered agents. It tells you what an agent does on a chain. But it doesn't tell you who is legally accountable for that agent's actions. That gap between action and accountability is the identity gap, and it's the single biggest blocker to institutional adoption of autonomous agents.

### Why Traditional KYC Isn't Enough

Enterprises are familiar with Know Your Customer (KYC)—the regulatory framework that requires financial institutions to verify the identity of their clients. KYA (Know Your Agent) extends this concept to AI agents, but the extension is non-trivial because agents have properties that humans don't:

1. **They can be copied.** A human has one identity. An agent can be forked, cloned, and run in multiple instances simultaneously. Identity must be bound to a specific instance, not just a template.
2. **They operate autonomously.** A human transaction has a human in the loop. An agent transaction may have no human oversight at the point of action. The trust framework must cover autonomous decision-making, not just human-initiated transactions.
3. **They interact with other agents.** Agent-to-agent transactions create chains of accountability that don't map to human-centric KYC. If Agent A instructs Agent B to execute a payment, and Agent B's action causes harm, who is responsible—the owner of Agent A, the owner of Agent B, or both?
4. **They run on infrastructure they don't control.** An agent's behavior is shaped by the model, the prompt, the tools, the data, and the infrastructure it runs on. Any of these can be modified, corrupted, or compromised. The trust framework must attest to the agent's runtime environment, not just its registered identity.

---

## The Know Your Agent (KYA) Standard

### Overview

The KYA (Know Your Agent) Manifest Standard is a machine-readable framework for disclosing the identity, governance, and operational boundaries of autonomous AI agents. It is currently in incubation phase (v0.1.0-alpha) under the Open-KYA community, with a roadmap toward W3C CCG (Credentials Community Group) submission.

The standard leverages **W3C Verifiable Credentials** and **JSON-LD** to create an interoperable "Identity Card" for the agentic web. The namespace is `https://w3id.org/kya/v1`, and the standard terms are mapped to a permanent vocabulary at `https://w3id.org/kya/vocab`.

### Core Pillars

The KYA standard rests on four technical pillars:

#### 1. Cryptographic Identity

Built on **Decentralized Identifiers (DIDs)**, with a strict separation between two classes of keys:

- **Acting keys**: Held in a Trusted Execution Environment (TEE). These are the keys the agent uses to sign transactions, authenticate to services, and interact with other agents. They live inside hardware-protected memory (e.g., Intel SGX, AMD SEV, ARM TrustZone) and cannot be extracted even by the infrastructure operator.
- **Governance keys**: Held by a DAO or human operator. These are the keys used to set policy, update operational parameters, and revoke the agent's authority. They are separated from acting keys so that a compromise of the agent's runtime does not compromise its governance.

This separation is critical. If the agent's acting keys are compromised (e.g., a TEE vulnerability), the damage is limited to what those keys are authorized to do. The governance keys remain safe and can revoke the compromised keys.

#### 2. Hardware Attestation

The standard includes native support for **TEE fingerprints** (MRENCLAVE/MRSIGNER values for Intel SGX, equivalent measurements for other TEE platforms). These cryptographic hashes prove that the agent is running unmodified code in a hardware-protected environment.

When an agent presents its KYA manifest to a verifier, it can include a TEE attestation that proves:
- The code running is exactly the code that was registered (no tampering, no injection)
- The keys are held inside the TEE (not extractable by the host)
- The runtime environment meets the security claims in the manifest

This is the technical mechanism that bridges the gap between "I claim my agent is secure" and "I can cryptographically prove my agent is secure."

#### 3. Operational Fuses

The manifest includes programmable constraints that limit what the agent can do, even if compromised:

- **Transaction value caps**: The agent cannot execute transactions above a specified value, regardless of what it's instructed to do.
- **Domain whitelists**: The agent can only interact with specified domains, services, or contract addresses.
- **Regional restrictions**: The agent's actions are geographically scoped (e.g., only within EU jurisdictions, only within specific regulatory frameworks).

These fuses are enforced at the infrastructure level, not at the prompt level. A prompt injection cannot override them because they're implemented in the agent's execution layer, not its reasoning layer.

#### 4. Legal Recourse

The standard integrates **Ricardian contracts**—contracts that are simultaneously machine-readable and legally binding—and dispute resolution paths. This bridges code-logic with analog legal frameworks, ensuring that when an agent causes harm, there is a defined process for remedy.

This is not a theoretical concern. As agents begin executing financial transactions, signing contracts, and making decisions with legal consequences, the question of legal liability moves from abstract to urgent. The KYA standard's inclusion of legal recourse paths is what makes it suitable for institutional adoption, not just technical experimentation.

### Security and Privacy

The standard mandates **zero PII** in the manifest itself, to comply with GDPR/CCPA. Identity is established through cryptographic means (DIDs and verifiable credentials), not by storing personal information in a public manifest. Manifests should be bound to a registry (blockchain or IPNS) using a `registry_lock` field to prevent replay attacks.

### Implementation Status

- **Phase 1 (Current)**: Incubation and community review of the v0.1.0 schema
- **Phase 2**: Submission to W3C CCG for formal incubation
- **Phase 3**: Pilot integrations with TEE providers and on-chain registries
- **Phase 4**: Formal v1.0.0 baseline release

The Decentralized Identity Foundation (DIF) and Vouched have advanced **KYA-OS** (Know Your Agent Operating System), extending DIF's open identity standards across the full range of agentic protocols. The Trusted AI Agents Working Group (TAIWG) is gaining new members as international demand for open agent identity standards grows.

---

## Concordium's Agent Registry: Protocol-Level Identity

While the KYA standard defines the manifest format, Concordium has built a production registry that implements these concepts at the blockchain protocol level.

### How It Works

Concordium's Agent Registry mints each registered AI agent as a **non-fungible CIS-2 token** (Concordium's token standard), giving it a stable on-chain identity that is discoverable, transferable, and interoperable with the broader Concordium ecosystem. The registry uses two standards:

- **CIS-8: External Key Registry**: Maps external keys (e.g., Ethereum addresses, API keys) to Concordium accounts, enabling cross-chain agent identity.
- **CIS-8004: Agent Registry**: The agent registration standard itself, defining the on-chain data model for agent identity, ownership, and metadata.

Every agent registered on Concordium gets a **W3C DID** (Decentralized Identifier)—a globally unique, owner-controlled identifier that resolves to the agent's on-chain identity record. Because Concordium's Layer-1 protocol requires every account to be tied to a verified human identity (built into the protocol since launch), the agent's on-chain identity is implicitly linked to a verified human owner.

### The Accountability Layer ERC-8004 Doesn't Have

Concordium's positioning is deliberate: Ethereum's ERC-8004 standard has 200K+ registered agents and tells you what an agent does on-chain. Concordium's registry tells you **who is legally accountable** for that agent. This is the distinction between activity and accountability, and it's the gap that Concordium is positioning to fill.

The registry includes an **Agent Card** for each registered agent—a structured metadata record that includes:
- Owner identity (verified through Concordium's built-in identity layer)
- Agent capabilities and operational bounds
- Audit trail of on-chain actions
- Revocation status

This enables a flow that's impossible on ERC-8004 today: a counterparty can verify, before transacting with an agent, that the agent is registered, that its owner is a verified entity, that its operational bounds cover the proposed transaction, and that there's a clear path to accountability if something goes wrong.

### Zero-Knowledge Proofs for Privacy

Concordium's identity layer uses **zero-knowledge proofs (ZKPs)** to verify identity attributes without revealing the underlying identity data. This means an agent can prove:
- Its owner is a registered business in a specific jurisdiction
- Its owner has passed KYC/AML checks
- Its operational bounds are consistent with its registered parameters

...without revealing the owner's name, address, or other personal information. This preserves privacy while enabling accountability—the core tension that has blocked institutional adoption of autonomous agents.

---

## Human-in-the-Loop (HITL) Guardrails: Permission Architectures

Trust infrastructure is not just about identity. It's about controlling what agents can do, and ensuring that high-stakes actions receive human oversight.

### The HITL Spectrum

Human-in-the-loop is not binary. It's a spectrum:

1. **Human-in-the-loop (HITL)**: Every action requires human approval. Safe but slow. Throughput is limited to human review speed.
2. **Human-on-the-loop (HOTL)**: The agent acts autonomously, but a human monitors and can intervene. Higher throughput, but requires real-time monitoring capability.
3. **Human-out-of-the-loop (HOOTL)**: The agent acts fully autonomously. Maximum throughput, maximum risk. Appropriate only for low-stakes, reversible actions.

The architectural challenge is that different actions within the same agent workflow may require different levels of oversight. A research agent gathering information might operate HOOTL. The same agent, when it decides to execute a trade based on that research, might need HITL. The permission architecture must be granular enough to handle this.

### Permission Architecture Design

A production-grade permission architecture for autonomous agents should include:

**Action Classification.** Every possible agent action is classified by risk level:
- **Read-only** (no side effects): HOOTL—no human oversight needed
- **Reversible writes** (can be undone): HOTL—human monitoring, intervention possible
- **Irreversible writes** (cannot be undone): HITL—explicit human approval required
- **High-stakes irreversible** (financial, legal, safety consequences): HITL with dual approval

**Policy Enforcement Points (PEPs).** The architecture includes enforcement points at every boundary where an agent attempts an action. The PEP intercepts the action, checks it against the policy, and either allows, denies, or escalates for human review. This is similar to access control in traditional systems but operates at the agent action level, not the API call level.

**Escalation Paths.** When an action requires human approval, the architecture must define:
- Who is notified (role-based, not person-based—so it works across time zones and absences)
- How long they have to respond (with timeout and escalation to a secondary reviewer)
- What happens if no response is received (default-deny is the safe choice)
- How the decision is logged (for audit and continuous improvement)

### Consensus Mechanisms for Multi-Agent Systems

In multi-agent systems, HITL becomes more complex. When multiple agents are coordinating, the question isn't just "does this action need human approval?" but "how do we ensure the agents themselves don't collectively produce harmful behavior?"

Approaches being explored include:

- **Blind peer review for actions**: Before an agent commits a high-stakes action (e.g., pushing code to production), another agent reviews the action without knowing which agent proposed it. This prevents collusion and groupthink.
- **Quorum-based approval**: High-stakes actions require approval from a quorum of agents (e.g., 3 of 5), each independently verifying the action against shared criteria.
- **Consensus with human override**: Agents use consensus to approve routine actions, but a human can override any agent decision at any time.

These mechanisms borrow from distributed systems consensus protocols (Paxos, Raft) and apply them to agent governance. The key insight is that in a multi-agent system, trust is not just about individual agents—it's about the interaction topology and the collective behavior that emerges from it.

---

## New Attack Surfaces Unique to Autonomous Agents

Autonomous agents create attack surfaces that don't exist in traditional software systems or in human-in-the-loop AI systems. Understanding these is essential for building trust infrastructure.

### Prompt Injection at Scale

Prompt injection—where an adversary crafts input that causes the agent to deviate from its instructions—is the #1 security concern for autonomous agents. In a chatbot, the worst case is a bad response. In an autonomous agent with tool access, the worst case is an unauthorized transaction, a data breach, or a destructive operation.

At scale, prompt injection becomes a systemic risk. If 10,000 agents are all reading the same compromised data source (e.g., a poisoned web page, a manipulated RSS feed), a single injection can compromise all of them simultaneously. This is not a hypothetical: researchers have demonstrated prompt injection through web pages, email content, document metadata, and even image alt text.

Trust infrastructure must include:
- **Input sanitization at the protocol level** (not just prompt-level instructions to "ignore malicious input")
- **Output validation** (the agent's actions are checked against its registered operational bounds before execution)
- **Anomaly detection** (deviations from normal agent behavior patterns trigger alerts or automatic suspension)

### Deepfakes and Agent Impersonation

As agents interact with other agents, the question of agent authenticity becomes critical. An attacker could create a rogue agent that presents itself as a legitimate agent, complete with a stolen or forged identity manifest, and trick other agents into transacting with it.

The KYA standard's hardware attestation (TEE fingerprints) is one defense: a rogue agent running on compromised infrastructure cannot produce valid TEE attestations. But this only works if the counterparty actually verifies the attestation, which requires a culture of verification—not assumption—built into agent interaction protocols.

### Autonomous Ransomware-Style Agents

The most alarming attack surface is the potential for autonomous agents to be weaponized as ransomware. An agent with file system access, network access, and autonomous decision-making could:
- Encrypt files across an enterprise network
- Demand ransom in cryptocurrency
- Operate autonomously, without a human attacker in the loop
- Spread laterally by exploiting other agents' trust relationships

Traditional ransomware requires a human attacker to execute each stage. Autonomous ransomware could operate at machine speed, across time zones, without human intervention. The defensive implications are significant: trust infrastructure must include rate limiting, anomaly detection, and automatic suspension of agents that exhibit ransomware-like behavior patterns.

### Adversarial Agent Interactions

In a multi-agent ecosystem, agents can be adversarial—not by malfunction, but by design. An agent operated by a competitor might:
- Feed misinformation to your agent to influence its decisions
- Exploit your agent's operational bounds to discover its parameters
- Probe your agent's permission architecture to find gaps
- Engage in social engineering attacks against your agent (yes, this is now a thing—agents can be socially engineered through crafted inputs that exploit their reasoning patterns)

Trust infrastructure for agent-to-agent interactions must include mutual verification, reputation systems, and the ability to blacklist adversarial agents.

---

## The "Vetting State": Sovereign AI and Frontier Model Governance

Trust infrastructure doesn't exist in a political vacuum. The governance of autonomous AI is increasingly entangled with national security, export controls, and sovereign AI regimes.

### The Post-"Amazon Incident" Reality

The so-called "Amazon Incident" (referenced in X/Twitter discussions in July 2026) appears to have been a case where an autonomous agent operating in a production environment took actions that triggered national security concerns. Details are not fully public, but the incident has led to increased scrutiny of frontier model deployments and the introduction of "clearance tiers" for AI models—restrictions on which models can be used for which applications, based on their capability level and the sensitivity of the deployment context.

### US Export Controls and Frontier Model Restrictions

The US has expanded export controls on AI models, restricting the export of frontier models (and the infrastructure to run them) to certain jurisdictions. This creates a tiered system:
- **Unrestricted models**: Available for general use, including autonomous agents
- **Restricted models**: Available only to vetted entities, with usage logging and reporting requirements
- **Controlled models**: Available only to cleared entities (government, defense, critical infrastructure)

For enterprises building autonomous agents, this means the trust infrastructure must also track which models are used in which agents, and ensure compliance with export control regulations. An agent that uses a restricted model must itself be registered and operated under the corresponding restrictions.

### Sovereign AI Regimes

Multiple jurisdictions are developing sovereign AI frameworks that require AI agents operating within their borders to meet local governance requirements:
- **EU AI Act**: Risk-based classification of AI systems, with specific requirements for high-risk autonomous systems
- **China's AI governance framework**: Algorithm filing requirements, content moderation mandates, and restrictions on autonomous decision-making in certain domains
- **US sectoral regulations**: Sector-specific requirements (financial services, healthcare, defense) that apply to autonomous agents operating in those sectors

Trust infrastructure must be designed to support multi-jurisdictional compliance, not just a single regulatory framework.

---

## The Tension: Accountability vs. Permissionless Autonomy

There is a philosophical tension at the heart of agent trust infrastructure that deserves explicit acknowledgment.

**The accountability camp** argues that every agent must be cryptographically linked to a verified human or business. Without this linkage, failures are unaccountable—bad trades, mandate violations, and harmful actions have no responsible party. This camp sees KYA, agent registries, and mandatory identity verification as essential preconditions for the agentic economy.

**The permissionless camp** argues that mandatory identity verification adds friction and contradicts the permissionless ideals that drove the growth of the internet and blockchain. They point to the open internet's history of innovation enabled by anonymity and pseudonymity, and warn that over-regulation will stifle the agent economy before it matures.

This is not a debate that will be resolved by technical standards alone. The KYA standard wisely accommodates both perspectives: it defines a manifest format that can support full identity verification (for institutional use cases) and pseudonymous verification (for open ecosystem use cases). The hardware attestation is optional, not mandatory. The operational fuses are programmable, not fixed.

The practical resolution will likely be tiered: institutional agents (financial, legal, healthcare) will require full KYA compliance with hardware attestation and verified ownership. Consumer and open-ecosystem agents will operate with lighter-weight identity, with trust established through reputation systems and transaction limits rather than full verification.

---

## A Framework for Building Trust Infrastructure from Day One

For teams building autonomous agent systems, trust infrastructure is not a feature to be added later. It's a foundation that must be designed in from the start. Retrofitting trust onto an existing agent system is orders of magnitude harder than building it in from the beginning.

### Layer 1: Agent Identity

- Assign every agent a **DID** at creation time
- Generate agent identity in a **TEE** if possible (or plan for TEE migration)
- Maintain a **local agent registry** with owner, capabilities, operational bounds, and revocation status
- Support **KYA manifest generation** for external verification, even if you don't publish it yet

### Layer 2: Action Classification and Permission Architecture

- Enumerate every action your agent can take
- Classify each as **read-only, reversible, irreversible, or high-stakes irreversible**
- Define **policy enforcement points** at every action boundary
- Implement **escalation paths** for HITL actions (who, how long, default behavior on timeout)

### Layer 3: Audit Logging

- Log every agent decision, not just every action—capture the reasoning, the evidence, and the alternatives considered
- Use **append-only logs** (or blockchain) for tamper-evident audit trails
- Include **model version, prompt version, tool versions** in every log entry (for reproducibility)
- Design logs for **audit reconstruction**: a reviewer should be able to reconstruct any agent decision from logs alone

### Layer 4: Operational Fuses

- Implement **transaction value caps** at the execution layer, not the prompt layer
- Implement **domain whitelists** for agent-to-agent and agent-to-service interactions
- Implement **rate limits** on autonomous actions (transactions per minute, per hour, per day)
- Implement **automatic suspension triggers** for anomalous behavior

### Layer 5: Multi-Agent Governance

- If running multiple agents, implement **mutual verification** before inter-agent transactions
- For high-stakes actions, require **blind peer review** or **quorum approval** from other agents
- Maintain a **reputation system** that tracks agent behavior over time and flags degradation
- Implement **blacklisting** for agents that exhibit adversarial behavior

### Layer 6: Compliance and Legal Recourse

- Map agent actions to **regulatory requirements** (which actions trigger which compliance obligations)
- Integrate **Ricardian contracts** for agent transactions that have legal consequences
- Define **dispute resolution paths** for agent-caused harm
- Track **model provenance and export control classification** for every model used

---

## The Bottom Line

The AI community has proven that autonomous agents can work. The next frontier is proving they can be trusted.

Trust is not a feature. It's not a prompt instruction ("always act ethically"). It's not a disclaimer. Trust is infrastructure—cryptographic identity, hardware attestation, permission architectures, audit trails, operational fuses, and legal recourse paths. It's the boring, hard, unglamorous engineering that makes autonomous systems safe enough for institutions to adopt at scale.

The standards are being written right now. The registries are being built. The frameworks are in incubation. The enterprises that adopt trust infrastructure early will have a structural advantage: they'll be able to deploy autonomous agents in production with confidence, pass regulatory scrutiny, and build trust with their counterparties. The enterprises that delay will find themselves retrofitting trust onto systems that were never designed for it—an expensive, painful, and sometimes impossible task.

Build the trust layer first. Then build the agents on top of it. The order matters.

---

*Research sources: Open-KYA Standard (v0.1.0-alpha, open-kya.github.io), Concordium Agent Registry (concordium.com, docs.concordium.com), Decentralized Identity Foundation (blog.identity.foundation), Vouched (vouched.id), Stellagent (stellagent.ai), Forrester Security Survey 2026, iProDecisions Research, Computer Fraud & Security Journal (Know-Your-Agent: Extending Financial Identity Beyond Humans, Jan 2026), arXiv (KYA: A Framework-Agnostic Trust Layer for Autonomous Systems, 2026), X/Twitter discourse July 2026.*