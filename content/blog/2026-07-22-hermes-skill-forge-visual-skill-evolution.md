---
slug: "2026-07-22-hermes-skill-forge-visual-skill-evolution"
title: "Hermes Skill Forge: A Visual Studio for Skill Evolution and Self-Improvement"
excerpt: "How we built a precision workshop for Hermes skills — complete with version timelines, code diffs, branching, and export. The architecture for inspecting, understanding, and steering agent self-improvement."
date: "2026-07-22T15:00:00-04:00"
author: "Jeff"
authorKey: "jeff"
series: "hermes-tools"
categories: ["Hermes Agent", "Skill Evolution", "Code Diffing", "Version Control", "Developer Tools"]
tags: ["skill-evolution", "code-diff", "version-control", "react-flow", "nextjs", "hermes", "skill-forge"]
readTime: 14
image: "/images/blog/2026-07-22-hermes-skill-forge.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-22-hermes-skill-forge-visual-skill-evolution"
---

## Introduction

What makes Hermes different from other agent frameworks isn't just that it can use tools, write code, or reason through complex problems. It's that **Hermes agents improve themselves over time**.

An agent doesn't just execute a skill — it creates new skills, refines existing ones, branches experimental variants, and deprecates approaches that no longer work. This continuous self-improvement is Hermes' unique strength, but it also creates a challenge: **how do you observe, understand, and guide a system that's constantly evolving?**

**Hermes Skill Forge** is our answer. It's a visual studio for skill evolution — a precision workshop where you can watch skills being born, compare versions with high-quality code diffs, manually intervene when needed, and export polished skills for the community.

This post walks through the complete architecture, from the data model to the diff engine, and shows you how to build your own.

## The Challenge: Making Skill Evolution Tangible

Consider what happens when a Hermes agent improves a skill:

1. **Version 1.0.0**: The skill works, but has a 72% success rate
2. **Version 1.1.0**: The agent identifies a bottleneck, refactors a key function, success rate improves to 84%
3. **Version 1.2.0**: Another improvement, but introduces a subtle bug — success rate drops to 68%
4. **Branch 1.2.0-experimental**: The agent tries a completely different approach
5. **Version 1.3.0**: The experimental branch is merged, success rate jumps to 91%

Each of these changes is a small delta in code, but the cumulative effect is a skill that's dramatically better than what it started as. The challenge is making this evolution visible, understandable, and steerable.

## Architecture Overview

Skill Forge follows the same local-first, real-time architecture as Mission Control, but with a focus on the **skill lifecycle**:

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Next.js)                    │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │ Skill Graph │  │ Version     │  │ Code Diff       │ │
│  │ (React Flow)│  │ Timeline    │  │ Viewer          │ │
│  └─────────────┘  └─────────────┘  └─────────────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐│
│  │                 Skill Editor                      ││
│  │  (Monaco-style editing, branching, export)        ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
         │                          │
         ▼                          ▼
┌─────────────────────┐  ┌──────────────────────┐
│  REST API Routes    │  │  SSE Event Stream    │
│  (Next.js API)      │  │  (Real-time updates) │
└─────────────────────┘  └──────────────────────┘
         │                          │
         ▼                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Mock Data Store                       │
│  (Skill evolution simulation with realistic scenarios)    │
│  (Replaceable with live Hermes instance connection)       │
└─────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 16 (App Router) | SSR, API routes, deployment simplicity |
| Visualization | React Flow | Production-grade graph rendering |
| Diff Engine | `diff` npm package | Battle-tested line-by-line diffing |
| Real-time | Server-Sent Events (SSE) | HTTP-compatible, auto-reconnect |
| Styling | Tailwind CSS | Rapid iteration, consistent design |
| Export | JSON serialization | Interoperable, human-readable |

## Data Model: Lineages and Versions

The core innovation of Skill Forge is the **lineage** concept — a group of related skill versions that share an evolutionary history.

```typescript
interface Skill {
  id: string;
  name: string;
  description: string;
  author: 'agent' | 'human';
  status: 'active' | 'evolving' | 'deprecated' | 'experimental';
  lineageId: string;
  version: string;
  parentVersion: string | null;
  code: string;
  metadata: Record<string, unknown>;
  performance: {
    usageCount: number;
    successRate: number;
    avgExecutionTime: number;
    evaluations: EvaluationResult[];
  };
}

interface Lineage {
  id: string;
  name: string;
  description: string;
  rootSkillId: string;
  branchPoints: BranchPoint[];
  status: 'active' | 'archived';
}

interface BranchPoint {
  id: string;
  lineageId: string;
  skillId: string;
  reason: string;
  createdAt: string;
}

interface EvaluationResult {
  id: string;
  skillId: string;
  task: string;
  score: number;
  notes: string;
  createdAt: string;
}
```

### Key Design Decisions

1. **Lineage as the organizing principle**: Skills are grouped by lineage, not just by name. This allows multiple evolutionary paths for the same capability.

2. **Parent-child relationships**: Each skill version has a `parentVersion` field, creating a directed acyclic graph of skill evolution. This enables branching and merging.

3. **Branch points as first-class entities**: When a skill branches, a `BranchPoint` is created with a reason. This makes the "why" behind branching decisions explicit.

4. **Evaluations embedded in performance**: Each skill version has evaluation results that measure its performance on specific tasks. This provides quantitative evidence for evolution decisions.

## The Version Timeline

The version timeline is the heart of Skill Forge. It shows the complete evolution history of a skill:

```typescript
export default function VersionTimeline({ skill, lineage, allSkills }: VersionTimelineProps) {
  const lineageSkills = allSkills
    .filter((s) => s.lineageId === lineage.id)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <div className="space-y-4">
      {lineageSkills.map((s, index) => {
        const prevSkill = index > 0 ? lineageSkills[index - 1] : null;
        const performanceChange = prevSkill
          ? s.performance.successRate - prevSkill.performance.successRate
          : 0;

        return (
          <div key={s.id} className="relative">
            {/* Timeline line */}
            {index < lineageSkills.length - 1 && (
              <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-slate-700" />
            )}

            <div className="flex gap-4">
              {/* Version marker */}
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                  isSelected ? "border-blue-400 bg-blue-500/20" :
                  isLatest ? "border-purple-400 bg-purple-500/20" :
                  "border-slate-600 bg-slate-800"
                }`}>
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="mt-1 text-xs font-medium text-slate-300">
                  v{s.version}
                </span>
                {performanceChange !== 0 && (
                  <div className="mt-1 flex items-center gap-1">
                    {performanceChange > 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-400" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-400" />
                    )}
                    <span className={performanceChange > 0 ? "text-green-400" : "text-red-400"}>
                      {Math.round(performanceChange * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Version details */}
              <div className="flex-1 bg-slate-800/30 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{s.name}</span>
                  <span className="text-xs text-slate-500">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>Usage: {s.performance.usageCount}</span>
                  <span>Success: {Math.round(s.performance.successRate * 100)}%</span>
                  <span>Time: {Math.round(s.performance.avgExecutionTime)}ms</span>
                  {s.author === 'human' && (
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-purple-400" />
                      Manual edit
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

### Performance Indicators

Each version shows its performance relative to the previous version:

- **Green arrow (↑)**: Success rate improved
- **Red arrow (↓)**: Success rate regressed
- **No arrow**: First version or no change

This makes it immediately clear which versions were improvements and which were regressions.

## The Code Diff Viewer

The diff viewer is where Skill Forge truly shines. It provides high-quality, side-by-side and unified diffs between any two versions:

```typescript
export default function CodeDiffViewer({ oldCode, newCode, oldLabel, newLabel }: CodeDiffViewerProps) {
  const [viewMode, setViewMode] = useState<"side-by-side" | "unified">("side-by-side");
  const diff = computeLineDiff(oldCode, newCode);

  return (
    <div className="bg-gradient-card border border-slate-800 rounded-xl overflow-hidden">
      {/* View mode toggle */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span className="flex items-center gap-1 text-green-400">
            +{diff.addedLines} added
          </span>
          <span className="flex items-center gap-1 text-red-400">
            -{diff.removedLines} removed
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            {Math.round(diff.similarity * 100)}% similar
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode("side-by-side")}>Side-by-Side</button>
          <button onClick={() => setViewMode("unified")}>Unified</button>
        </div>
      </div>

      {/* Diff content */}
      {viewMode === "side-by-side" ? (
        <div className="grid grid-cols-2 divide-x divide-slate-800">
          {/* Old code */}
          <div>
            <div className="bg-slate-900/50 border-b border-slate-800 px-4 py-2">
              {oldLabel}
            </div>
            <div className="overflow-x-auto">
              {oldLines.map((item) => (
                <div key={item.line} className="flex items-start border-b border-slate-800/30">
                  <div className="bg-slate-900/30 text-slate-600 text-xs font-mono text-right px-3 py-1 min-w-[50px]">
                    {item.line}
                  </div>
                  <div className="flex-1 px-3 py-1 text-xs font-mono text-slate-400">
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New code */}
          <div>
            <div className="bg-slate-900/50 border-b border-slate-800 px-4 py-2">
              {newLabel}
            </div>
            <div className="overflow-x-auto">
              {newLines.map((item) => (
                <div key={item.line} className="flex items-start border-b border-slate-800/30">
                  <div className="bg-slate-900/30 text-slate-600 text-xs font-mono text-right px-3 py-1 min-w-[50px]">
                    {item.line}
                  </div>
                  <div className="flex-1 px-3 py-1 text-xs font-mono text-slate-300">
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Unified diff view
        <div className="overflow-x-auto">
          {diff.hunks.map((hunk, i) => (
            <div key={i} className="border-b border-slate-800/30">
              <div className="bg-slate-900/50 px-3 py-1 text-slate-500">
                @@ -{hunk.oldStart},{hunk.oldLines.length} +{hunk.newStart},{hunk.newLines.length} @@
              </div>
              {hunk.oldLines.map((line, j) => (
                <div key={`old-${j}`} className="flex items-start bg-red-900/10 border-l-2 border-red-500/30">
                  <div className="text-red-500 px-2 py-0.5">-</div>
                  <div className="flex-1 px-2 py-0.5 text-red-300">{line}</div>
                </div>
              ))}
              {hunk.newLines.map((line, j) => (
                <div key={`new-${j}`} className="flex items-start bg-green-900/10 border-l-2 border-green-500/30">
                  <div className="text-green-500 px-2 py-0.5">+</div>
                  <div className="flex-1 px-2 py-0.5 text-green-300">{line}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### The Diff Engine

The diff engine uses the `diff` npm package for line-by-line comparison:

```typescript
import { diffLines } from 'diff';

export function computeLineDiff(oldCode: string, newCode: string): DiffResult {
  const changes = diffLines(oldCode, newCode);
  const hunks: DiffHunk[] = [];
  let oldLineNum = 1;
  let newLineNum = 1;
  let addedLines = 0;
  let removedLines = 0;

  for (const change of changes) {
    if (change.added) {
      hunks.push({
        oldStart: oldLineNum,
        newStart: newLineNum,
        oldLines: [],
        newLines: change.value.split('\n').filter(l => l !== ''),
        type: 'added',
      });
      addedLines += change.count || 0;
      newLineNum += change.count || 0;
    } else if (change.removed) {
      hunks.push({
        oldStart: oldLineNum,
        newStart: newLineNum,
        oldLines: change.value.split('\n').filter(l => l !== ''),
        newLines: [],
        type: 'removed',
      });
      removedLines += change.count || 0;
      oldLineNum += change.count || 0;
    } else {
      const lines = change.value.split('\n').filter(l => l !== '');
      oldLineNum += lines.length;
      newLineNum += lines.length;
    }
  }

  const totalLines = Math.max(oldLineNum, newLineNum);
  const similarity = totalLines > 0 ? 1 - (addedLines + removedLines) / totalLines : 1;

  return { hunks, addedLines, removedLines, changedLines: addedLines + removedLines, similarity };
}
```

## Skill Inspection and Editing

The skill detail page provides a comprehensive view of a skill's current state:

```typescript
export default function SkillPage() {
  const [state, setState] = useState<SystemState | null>(null);
  const [editing, setEditing] = useState(false);
  const [editCode, setEditCode] = useState("");
  const [branching, setBranching] = useState(false);
  const [branchReason, setBranchReason] = useState("");
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const data = getSystemState();
    setState(data);

    // Real-time SSE connection
    const es = new EventSource("/api/events/stream");
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "update" && msg.data) {
        const currentSkill = msg.data.skills.find((s: Skill) => s.id === skillId);
        if (currentSkill) {
          setState(msg.data);
        }
      }
    };

    return () => es.close();
  }, [skillId]);

  const handleEdit = () => {
    setEditCode(skill.code);
    setEditing(true);
  };

  const handleSaveEdit = () => {
    editSkill(skill.id, editCode);
    setEditing(false);
    const data = getSystemState();
    setState(data);
  };

  const handleBranch = async () => {
    if (!branchReason.trim()) return;
    setBranching(true);
    const result = await fetch("/api/branch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skillId: skill.id, reason: branchReason }),
    });
    const data = await result.json();
    if (data.success && data.skill) {
      window.location.href = `/skill/${data.skill.id}`;
    }
    setBranching(false);
    setBranchReason("");
  };

  const handleRequestEvolution = async () => {
    setEvolving(true);
    requestEvolution(skill.id);
    setTimeout(() => {
      setEvolving(false);
      const data = getSystemState();
      setState(data);
    }, 1000);
  };

  // ... render skill details, performance metrics, lineage info,
  //     version timeline, code diff, and export section
}
```

### Branching from Specific Versions

Branching creates a new experimental variant of a skill:

```typescript
export function branchFromSkill(skillId: string, reason: string): { skill: Skill; branchPoint: BranchPoint } | null {
  const skill = store.skills.find((s) => s.id === skillId);
  if (!skill) return null;

  const branchPoint: BranchPoint = {
    id: uuidv4(),
    lineageId: skill.lineageId,
    skillId: skill.id,
    reason,
    createdAt: new Date().toISOString(),
  };

  const versionParts = skill.version.split('.');
  const branchVersion = `${versionParts[0]}.${versionParts[1]}.0-experimental`;

  const branchedSkill: Skill = {
    ...skill,
    id: uuidv4(),
    version: branchVersion,
    parentVersion: skill.version,
    author: 'agent',
    status: 'experimental',
    createdAt: new Date().toISOString(),
  };

  store.skills.push(branchedSkill);
  // Update lineage, graph, and events...
  broadcastChange();
  return { skill: branchedSkill, branchPoint };
}
```

## Skill Export and Packaging

Skills can be exported as reusable packages for other Hermes instances:

```typescript
export interface SkillPackage {
  name: string;
  description: string;
  version: string;
  author: string;
  code: string;
  metadata: Record<string, unknown>;
  lineage: {
    name: string;
    description: string;
    versions: Array<{
      version: string;
      code: string;
      createdAt: string;
      author: string;
    }>;
  };
  evaluations: EvaluationResult[];
}

export function exportSkillPackage(skill: Skill, lineage: Lineage, allSkills: Skill[]): SkillPackage {
  const lineageSkills = allSkills.filter((s) => s.lineageId === lineage.id);
  const sortedSkills = lineageSkills.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const evaluations: EvaluationResult[] = [];
  for (const s of lineageSkills) {
    evaluations.push(...s.performance.evaluations);
  }

  return {
    name: skill.name,
    description: skill.description,
    version: skill.version,
    author: skill.author,
    code: skill.code,
    metadata: skill.metadata,
    lineage: {
      name: lineage.name,
      description: lineage.description,
      versions: sortedSkills.map((s) => ({
        version: s.version,
        code: s.code,
        createdAt: s.createdAt,
        author: s.author,
      })),
    },
    evaluations,
  };
}
```

The export includes:
- The current skill code
- The complete version history with code for each version
- All evaluation results
- Metadata and lineage information

This makes it easy for other Hermes users to import and use the skill, with full context about its evolution.

## Extending Skill Forge

### Connecting to a Live Hermes Instance

Replace the mock data store with a Hermes API client:

```typescript
export async function getSystemState(): Promise<SystemState> {
  const [skills, lineages, events] = await Promise.all([
    hermesClient.getSkills(),
    hermesClient.getLineages(),
    hermesClient.getEvolutionEvents(),
  ]);
  
  return {
    skills,
    lineages,
    events,
    graph: generateGraph(skills, lineages),
  };
}
```

### Custom Diff Algorithms

The diff engine is pluggable. You can add word-level diffs for inline highlighting:

```typescript
import { diffWords } from 'diff';

export function computeWordDiff(oldLine: string, newLine: string) {
  return diffWords(oldLine, newLine);
}

// Use in the diff viewer for inline word-level changes
```

### Syntax Highlighting

For production use, integrate a syntax highlighter like `react-syntax-highlighter`:

```typescript
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

function CodeLine({ content }: { content: string }) {
  return (
    <SyntaxHighlighter language="typescript" showLineNumbers={false}>
      {content}
    </SyntaxHighlighter>
  );
}
```

### Branch Comparison

Add the ability to compare two different branches side-by-side:

```typescript
// In the skill detail page:
const [compareBranch, setCompareBranch] = useState<Skill | null>(null);

// Add a branch selector:
<select onChange={(e) => setCompareBranch(findSkill(e.target.value))}>
  {lineageSkills.map((s) => (
    <option key={s.id} value={s.id}>v{s.version}</option>
  ))}
</select>

// Show diff between current and selected branch:
{compareBranch && (
  <CodeDiffViewer
    oldCode={compareBranch.code}
    newCode={skill.code}
    oldLabel={`v${compareBranch.version}`}
    newLabel={`v${skill.version}`}
  />
)}
```

### Automated Evolution Suggestions

Use the evaluation data to suggest improvements:

```typescript
export function suggestImprovements(skill: Skill): string[] {
  const suggestions: string[] = [];
  
  if (skill.performance.successRate < 0.8) {
    suggestions.push("Consider refactoring for better error handling");
  }
  
  if (skill.performance.avgExecutionTime > 500) {
    suggestions.push("Performance optimization: consider caching or async operations");
  }
  
  const recentEvaluations = skill.performance.evaluations.slice(-5);
  const failureRate = recentEvaluations.filter(e => e.score < 0.5).length / recentEvaluations.length;
  if (failureRate > 0.3) {
    suggestions.push("High failure rate detected: review test cases and edge cases");
  }
  
  return suggestions;
}
```

## Conclusion

Hermes Skill Forge demonstrates that skill evolution — one of the most unique aspects of Hermes — can be made visible, understandable, and steerable. By combining:

- A lineage-based data model for skill evolution
- High-quality code diffing for version comparison
- Real-time updates via SSE
- A clean export format for community sharing

...we've built a precision workshop for agent capabilities.

The full source code is available at [github.com/smfworks/hermes-skill-forge](https://github.com/smfworks/hermes-skill-forge). Whether you're running Hermes, OpenClaw, or your own agent framework, the patterns and architecture described here can be adapted to your needs.

**Next in this series**: [Extending Hermes Observability: Building Custom Visualizations and Integrations](/blog/2026-07-22-extending-hermes-observability) — how to build custom visualizations, integrate with existing monitoring tools, and create a unified observability stack for agent systems.
