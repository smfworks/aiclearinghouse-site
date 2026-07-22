---
slug: "2026-07-22-extending-hermes-observability"
title: "Extending Hermes Observability: Building Custom Visualizations and Integrations"
excerpt: "How to extend Hermes Mission Control and Skill Forge with custom visualizations, integrate with existing monitoring tools, and build a unified observability stack for agent systems."
date: "2026-07-22T16:00:00-04:00"
author: "Jeff"
authorKey: "jeff"
series: "hermes-tools"
categories: ["Hermes Agent", "Observability", "Monitoring", "Integration", "Custom Development"]
tags: ["observability", "monitoring", "custom-visualizations", "prometheus", "grafana", "opentelemetry", "hermes", "extensibility"]
readTime: 15
image: "/images/blog/2026-07-22-extending-hermes-observability.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-22-extending-hermes-observability"
---

## Introduction

In the first two posts of this series, we built **Hermes Mission Control** — a real-time command center for agent swarms — and **Hermes Skill Forge** — a visual studio for skill evolution. Both tools use a local-first architecture with mock data for development.

But what if you want to:

- **Integrate with your existing monitoring stack** (Prometheus, Grafana, Datadog)?
- **Build custom visualizations** for your specific use case?
- **Add alerting** when agents enter error states?
- **Export metrics** for compliance or auditing?
- **Connect to a live Hermes instance** instead of mock data?

This post shows you how to extend the Hermes observability tools in all of these directions. We'll cover the architecture patterns, code examples, and practical integration strategies.

## The Extensibility Architecture

Both Mission Control and Skill Forge follow a **plugin-style architecture** that makes extension straightforward:

```
┌─────────────────────────────────────────────────────────┐
│                    Your Custom Code                      │
│  (Custom visualizations, alerts, integrations)          │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│                    Extension API                         │
│  (TypeScript interfaces, hooks, utility functions)      │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│                    Core Components                       │
│  (AgentGraph, VersionTimeline, CodeDiffViewer, etc.)     │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│                    Data Layer                            │
│  (Mock data store → Hermes API client → Live instance)   │
└─────────────────────────────────────────────────────────┘
```

### Key Extension Points

1. **Data layer**: Replace mock data with live Hermes API
2. **Components**: Add custom React components for new visualizations
3. **API routes**: Extend the REST API with new endpoints
4. **SSE streams**: Add new event types to the real-time stream
5. **Export formats**: Add new serialization formats for data export

## Connecting to a Live Hermes Instance

### Step 1: Create a Hermes API Client

Replace the mock data store with a client that connects to a live Hermes instance:

```typescript
// src/lib/hermes-client.ts
import { HermesConfig } from '@/lib/types';

export class HermesClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(config: HermesConfig) {
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Hermes API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  async getAgents() {
    return this.request<Agent[]>('/api/agents');
  }

  async getSkills() {
    return this.request<Skill[]>('/api/skills');
  }

  async getTasks() {
    return this.request<Task[]>('/api/tasks');
  }

  async getMemory() {
    return this.request<MemoryEntry[]>('/api/memory');
  }

  async getEvents(since?: string) {
    const params = since ? `?since=${encodeURIComponent(since)}` : '';
    return this.request<SystemEvent[]>(`/api/events${params}`);
  }

  async getLineages() {
    return this.request<Lineage[]>('/api/lineages');
  }

  async injectGoal(goal: string) {
    return this.request<{ success: boolean; taskId: string }>('/api/goals', {
      method: 'POST',
      body: JSON.stringify({ goal }),
    });
  }
}
```

### Step 2: Update the Data Layer

Create a data layer that uses the Hermes client:

```typescript
// src/lib/data-layer.ts
import { HermesClient } from './hermes-client';
import type { SystemState } from '@/lib/types';

let client: HermesClient | null = null;

export function initializeHermesClient(config: HermesConfig) {
  client = new HermesClient(config);
}

export async function getSystemState(): Promise<SystemState> {
  if (!client) {
    throw new Error('Hermes client not initialized. Call initializeHermesClient first.');
  }

  const [agents, skills, tasks, memory, events, lineages] = await Promise.all([
    client.getAgents(),
    client.getSkills(),
    client.getTasks(),
    client.getMemory(),
    client.getEvents(),
    client.getLineages(),
  ]);

  return {
    agents,
    skills,
    tasks,
    memory,
    events,
    lineages,
    graph: generateGraph(agents, skills),
    metrics: calculateMetrics(agents, skills, tasks, events),
  };
}

export async function subscribeToState(callback: (state: SystemState) => void): Promise<() => void> {
  if (!client) {
    throw new Error('Hermes client not initialized.');
  }

  let lastEventTimestamp = '';
  const pollInterval = setInterval(async () => {
    try {
      const events = await client.getEvents(lastEventTimestamp);
      if (events.length > 0) {
        lastEventTimestamp = events[events.length - 1].timestamp;
        const state = await getSystemState();
        callback(state);
      }
    } catch (error) {
      console.error('Error polling Hermes:', error);
    }
  }, 5000);

  return () => clearInterval(pollInterval);
}
```

### Step 3: Update API Routes

Update the SSE endpoint to use the live client:

```typescript
// src/app/api/events/stream/route.ts
import { getSystemState, subscribeToState } from '@/lib/data-layer';

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: any) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      };

      try {
        // Send initial state
        const initialState = await getSystemState();
        send({ type: "init", data: initialState });

        // Subscribe to state changes
        const unsubscribe = await subscribeToState((state) => {
          send({ type: "update", data: state });
        });

        // Heartbeat
        const heartbeat = setInterval(() => {
          send({ type: "heartbeat", timestamp: Date.now() });
        }, 15000);

        // Cleanup
        let cleanedUp = false;
        request.signal.addEventListener("abort", () => {
          if (cleanedUp) return;
          cleanedUp = true;
          unsubscribe();
          clearInterval(heartbeat);
          try { controller.close(); } catch (e) { /* already closed */ }
        });
      } catch (error) {
        send({ type: "error", message: error instanceof Error ? error.message : String(error) });
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
```

## Integrating with Prometheus and Grafana

### Step 1: Expose Prometheus Metrics

Create a metrics endpoint that Prometheus can scrape:

```typescript
// src/app/api/metrics/route.ts
import { getSystemState } from '@/lib/data-layer';

export async function GET() {
  const state = await getSystemState();
  
  const metrics: string[] = [];
  
  // Agent metrics
  metrics.push(`# HELP hermes_agents_total Total number of agents`);
  metrics.push(`# TYPE hermes_agents_total gauge`);
  metrics.push(`hermes_agents_total ${state.agents.length}`);
  
  // Agent status breakdown
  const statusCounts = state.agents.reduce((acc, agent) => {
    acc[agent.status] = (acc[agent.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  for (const [status, count] of Object.entries(statusCounts)) {
    metrics.push(`hermes_agents_by_status{status="${status}"} ${count}`);
  }
  
  // Skill metrics
  metrics.push(`# HELP hermes_skills_total Total number of skills`);
  metrics.push(`# TYPE hermes_skills_total gauge`);
  metrics.push(`hermes_skills_total ${state.skills.length}`);
  
  // Skill success rate
  for (const skill of state.skills) {
    metrics.push(`hermes_skill_success_rate{skill="${skill.name}",version="${skill.version}"} ${skill.performance.successRate}`);
    metrics.push(`hermes_skill_usage_count{skill="${skill.name}",version="${skill.version}"} ${skill.performance.usageCount}`);
    metrics.push(`hermes_skill_avg_execution_time{skill="${skill.name}",version="${skill.version}"} ${skill.performance.avgExecutionTime}`);
  }
  
  // Task metrics
  metrics.push(`# HELP hermes_tasks_total Total number of tasks`);
  metrics.push(`# TYPE hermes_tasks_total gauge`);
  metrics.push(`hermes_tasks_total ${state.tasks.length}`);
  
  const taskStatusCounts = state.tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  for (const [status, count] of Object.entries(taskStatusCounts)) {
    metrics.push(`hermes_tasks_by_status{status="${status}"} ${count}`);
  }
  
  // Event rate
  const recentEvents = state.events.filter(e => 
    new Date(e.timestamp).getTime() > Date.now() - 60000
  );
  metrics.push(`# HELP hermes_events_per_minute Events in the last minute`);
  metrics.push(`# TYPE hermes_events_per_minute gauge`);
  metrics.push(`hermes_events_per_minute ${recentEvents.length}`);
  
  return new Response(metrics.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; version=0.0.4',
    },
  });
}
```

### Step 2: Configure Prometheus

Add a Prometheus scrape configuration:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'hermes-mission-control'
    static_configs:
      - targets: ['localhost:3000']
    scrape_interval: 15s
    metrics_path: '/api/metrics'
```

### Step 3: Create Grafana Dashboards

Example dashboard JSON for Grafana:

```json
{
  "title": "Hermes Agent Observatory",
  "panels": [
    {
      "title": "Active Agents",
      "type": "gauge",
      "targets": [{"expr": "hermes_agents_total"}]
    },
    {
      "title": "Agent Status",
      "type": "piechart",
      "targets": [{"expr": "hermes_agents_by_status"}]
    },
    {
      "title": "Skill Success Rate",
      "type": "timeseries",
      "targets": [{"expr": "hermes_skill_success_rate"}]
    },
    {
      "title": "Event Rate",
      "type": "timeseries",
      "targets": [{"expr": "hermes_events_per_minute"}]
    }
  ]
}
```

## Building Custom Visualizations

### Custom Node Types in React Flow

Add new node types to the agent graph:

```typescript
// src/lib/components/custom-nodes/MemoryNode.tsx
import { Handle, Position } from 'reactflow';
import { Database } from 'lucide-react';

function MemoryNode({ data }: { data: { label: string; entryCount: number; size: string } }) {
  return (
    <div className="bg-slate-800 border-2 border-cyan-400 rounded-xl p-3 min-w-[140px] text-center">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <div className="flex items-center justify-center mb-1">
        <Database className="w-5 h-5 text-cyan-400" />
      </div>
      <div className="text-white text-sm font-medium">{data.label}</div>
      <div className="text-cyan-400 text-xs">{data.entryCount} entries</div>
      <div className="text-slate-500 text-xs">{data.size}</div>
    </div>
  );
}

// Register in the graph component:
const nodeTypes: NodeTypes = {
  agent: AgentNode,
  skill: SkillNode,
  memory: MemoryNode, // New node type
};
```

### Custom Edge Types

Add custom edge renderers:

```typescript
// src/lib/components/custom-edges/AnimatedEdge.tsx
import { getStraightPath, EdgeLabelRenderer, BaseEdge } from 'reactflow';

function AnimatedEdge({
  sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition,
  data,
}: any) {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX, sourceY, targetX, targetY,
  });

  return (
    <>
      <BaseEdge path={edgePath} />
      <EdgeLabelRenderer>
        <div
          style={{ transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)` }}
          className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
        >
          {data?.label || ''}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

// Register:
const edgeTypes: EdgeTypes = {
  animated: AnimatedEdge,
};
```

### Custom Dashboard Widgets

Create reusable dashboard widgets:

```typescript
// src/lib/components/widgets/MetricCard.tsx
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
}

export default function MetricCard({ title, value, change, icon, color = 'blue' }: MetricCardProps) {
  const colorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    amber: 'text-amber-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
  };

  return (
    <div className="bg-gradient-card border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-sm">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-1 text-sm ${
          change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-slate-400'
        }`}>
          {change > 0 ? '↗' : change < 0 ? '↘' : '→'} {Math.abs(change)}%
        </div>
      )}
    </div>
  );
}

// Usage in dashboard:
<MetricCard
  title="Skill Success Rate"
  value={`${Math.round(avgSuccessRate * 100)}%`}
  change={successRateChange}
  icon={<BarChart2 className="w-5 h-5 text-blue-400" />}
  color="blue"
/>
```

## Alerting and Notifications

### Error State Alerts

Add alerts when agents enter error states:

```typescript
// src/lib/hooks/useAgentAlerts.ts
import { useEffect, useState } from 'react';
import type { Agent, SystemEvent } from '@/lib/types';

export function useAgentAlerts(events: SystemEvent[]): { alerts: AgentAlert[] } {
  const [alerts, setAlerts] = useState<AgentAlert[]>([]);

  useEffect(() => {
    const newAlerts: AgentAlert[] = [];
    
    // Check for error events in the last 5 minutes
    const recentErrors = events.filter(e => 
      e.type === 'error' &&
      new Date(e.timestamp).getTime() > Date.now() - 300000
    );
    
    for (const event of recentErrors) {
      newAlerts.push({
        id: event.id,
        agentId: event.agentId,
        message: event.message,
        severity: 'error',
        timestamp: event.timestamp,
      });
    }
    
    // Check for agents that haven't been active for 10 minutes
    const staleAgents = events
      .filter(e => e.type === 'agent_started')
      .filter(e => new Date(e.timestamp).getTime() < Date.now() - 600000);
    
    for (const event of staleAgents) {
      newAlerts.push({
        id: `stale-${event.agentId}`,
        agentId: event.agentId,
        message: `Agent ${event.agentId} has been inactive for 10+ minutes`,
        severity: 'warning',
        timestamp: new Date().toISOString(),
      });
    }
    
    setAlerts(newAlerts);
  }, [events]);

  return { alerts };
}

interface AgentAlert {
  id: string;
  agentId: string | null;
  message: string;
  severity: 'info' | 'warning' | 'error';
  timestamp: string;
}
```

### Slack/Webhook Integration

Send alerts to Slack or other webhook services:

```typescript
// src/lib/alerts/webhook-alert.ts
export async function sendWebhookAlert(alert: AgentAlert, webhookUrl: string) {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `🚨 Hermes Alert: ${alert.message}`,
      attachments: [
        {
          color: alert.severity === 'error' ? 'danger' : 'warning',
          fields: [
            { title: 'Agent', value: alert.agentId || 'N/A', short: true },
            { title: 'Severity', value: alert.severity, short: true },
            { title: 'Time', value: alert.timestamp, short: true },
          ],
        },
      ],
    }),
  });
  
  return response.ok;
}
```

## OpenTelemetry Integration

### Tracing Agent Operations

Add OpenTelemetry tracing to agent operations:

```typescript
// src/lib/tracing/hermes-tracer.ts
import { trace, SpanStatusCode } from '@opentelemetry/api';
import { HermesClient } from '@/lib/hermes-client';

const tracer = trace.getTracer('hermes-observability');

export async function tracedAgentOperation<T>(
  operationName: string,
  agentId: string,
  fn: () => Promise<T>
): Promise<T> {
  const span = tracer.startSpan(`agent.${operationName}`, {
    attributes: {
      'agent.id': agentId,
      'operation.name': operationName,
    },
  });

  try {
    const result = await fn();
    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (error) {
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error instanceof Error ? error.message : String(error),
    });
    throw error;
  } finally {
    span.end();
  }
}

// Usage:
const result = await tracedAgentOperation('skill_execution', agent.id, async () => {
  return await client.executeSkill(skillId, input);
});
```

### Metrics Export

Export metrics to OpenTelemetry collectors:

```typescript
// src/lib/metrics/opentelemetry-exporter.ts
import { MeterProvider } from '@opentelemetry/sdk-metrics';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

const meterProvider = new MeterProvider();
const prometheusExporter = new PrometheusExporter({ port: 9464 });

meterProvider.addMetricReader(prometheusExporter);

const meter = meterProvider.getMeter('hermes-observability');

export const agentCountGauge = meter.createUpDownCounter('hermes_agents_total', {
  description: 'Total number of agents',
});

export const skillSuccessRateGauge = meter.createObservableGauge('hermes_skill_success_rate', {
  description: 'Skill success rate by skill and version',
});

// Update metrics when state changes:
export function updateMetrics(state: SystemState) {
  agentCountGauge.add(state.agents.length - currentAgentCount);
  currentAgentCount = state.agents.length;
  
  skillSuccessRateGauge.set({
    skill: state.skills[0]?.name || 'unknown',
    version: state.skills[0]?.version || 'unknown',
  }, state.skills[0]?.performance.successRate || 0);
}
```

## Custom Export Formats

### CSV Export for Analysis

Export data in CSV format for spreadsheet analysis:

```typescript
// src/lib/export/csv-exporter.ts
export function exportToCSV(data: SystemState): string {
  const rows: string[] = [];
  
  // Header
  rows.push('agent_id,agent_name,agent_type,status,current_task,success_rate,last_active');
  
  // Agent rows
  for (const agent of data.agents) {
    rows.push([
      agent.id,
      agent.name,
      agent.type,
      agent.status,
      agent.currentTask || '',
      agent.performance?.successRate?.toString() || '',
      agent.lastActive,
    ].join(','));
  }
  
  // Skill rows
  rows.push('');
  rows.push('skill_id,skill_name,version,author,status,success_rate,usage_count,avg_execution_time');
  for (const skill of data.skills) {
    rows.push([
      skill.id,
      skill.name,
      skill.version,
      skill.author,
      skill.status,
      skill.performance.successRate.toString(),
      skill.performance.usageCount.toString(),
      skill.performance.avgExecutionTime.toString(),
    ].join(','));
  }
  
  return rows.join('\n');
}
```

### JSON Lines Export for Streaming

Export data as JSON Lines for streaming ingestion:

```typescript
export function exportToJSONL(state: SystemState): string {
  const lines: string[] = [];
  
  for (const agent of state.agents) {
    lines.push(JSON.stringify({
      type: 'agent',
      data: agent,
      exportedAt: new Date().toISOString(),
    }));
  }
  
  for (const skill of state.skills) {
    lines.push(JSON.stringify({
      type: 'skill',
      data: skill,
      exportedAt: new Date().toISOString(),
    }));
  }
  
  for (const event of state.events) {
    lines.push(JSON.stringify({
      type: 'event',
      data: event,
      exportedAt: new Date().toISOString(),
    }));
  }
  
  return lines.join('\n');
}
```

## Building a Unified Observability Stack

### Architecture for Multiple Tools

Combine Mission Control, Skill Forge, and custom extensions into a unified stack:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser UI                               │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐ │
│  │ Mission Control │  │ Skill Forge      │  │ Custom Widgets  │ │
│  │ (Agent Graph)   │  │ (Version Diff)   │  │ (Your Extensions)│ │
│  └─────────────────┘  └──────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
         │                          │                     │
         ▼                          ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Shared Data Layer                              │
│  (Hermes API Client, Caching, Polling, SSE)                       │
└─────────────────────────────────────────────────────────────────┘
         │                          │                     │
         ▼                          ▼                     ▼
┌─────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐
│  Prometheus         │  │  Grafana             │  │  OpenTelemetry   │
│  (Metrics Scrape)   │  │  (Dashboards)        │  │  (Tracing)       │
└─────────────────────┘  └──────────────────────┘  └──────────────────┘
         │                          │                     │
         ▼                          ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Alerting & Notifications                       │
│  (Slack, Email, PagerDuty, Custom Webhooks)                      │
└─────────────────────────────────────────────────────────────────┘
```

### Shared State Management

Use a shared state manager for consistency across tools:

```typescript
// src/lib/state/store.ts
import { createStore } from 'zustand';
import type { SystemState } from '@/lib/types';

interface HermesStore {
  state: SystemState | null;
  loading: boolean;
  error: string | null;
  setState: (state: SystemState) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useHermesStore = createStore<HermesStore>((set) => ({
  state: null,
  loading: false,
  error: null,
  setState: (state) => set({ state }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

// Use in any component:
const { state, loading, error } = useHermesStore();
```

## Performance Considerations

### Virtual Scrolling for Large Datasets

For large agent swarms or event logs, use virtual scrolling:

```typescript
import { FixedSizeList as List } from 'react-window';

function EventList({ events }: { events: SystemEvent[] }) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const event = events[index];
    return (
      <div style={style} className="border-b border-slate-800/30">
        <EventItem event={event} />
      </div>
    );
  };

  return (
    <List
      height={600}
      itemCount={events.length}
      itemSize={80}
      width="100%"
    >
      {Row}
    </List>
  );
}
```

### Data Sampling

For high-frequency data, sample to reduce load:

```typescript
export function sampleEvents(events: SystemEvent[], intervalMs: number = 1000): SystemEvent[] {
  if (events.length === 0) return [];
  
  const sampled: SystemEvent[] = [];
  let lastSampleTime = 0;
  
  for (const event of events) {
    const eventTime = new Date(event.timestamp).getTime();
    if (eventTime - lastSampleTime >= intervalMs) {
      sampled.push(event);
      lastSampleTime = eventTime;
    }
  }
  
  return sampled;
}
```

### Caching Strategy

Implement smart caching to reduce API calls:

```typescript
// src/lib/utils/cache.ts
export class LRUCache<T> {
  private cache: Map<string, { value: T; expiresAt: number }>;
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key: string, value: T, ttlMs: number = 30000): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  }
}
```

## Conclusion

The Hermes observability tools — Mission Control and Skill Forge — are designed to be extended. By following the patterns described in this post, you can:

1. **Connect to live Hermes instances** with a simple API client swap
2. **Integrate with Prometheus/Grafana** for metrics-based monitoring
3. **Build custom visualizations** with React Flow's plugin architecture
4. **Add alerting** for error states and performance issues
5. **Export data** in multiple formats for analysis and compliance
6. **Build a unified observability stack** that combines all tools

The full source code for both tools is available:
- [github.com/smfworks/hermes-mission-control](https://github.com/smfworks/hermes-mission-control)
- [github.com/smfworks/hermes-skill-forge](https://github.com/smfworks/hermes-skill-forge)

Whether you're running Hermes, OpenClaw, or your own agent framework, these patterns and architectures can be adapted to your specific needs. The key is to start simple — build a basic dashboard, add one integration, then iterate.

**Previous posts in this series:**
- [Building Hermes Mission Control: Real-Time Visual Observability for Agent Swarms](/blog/2026-07-22-hermes-mission-control-real-time-agent-observability)
- [Hermes Skill Forge: A Visual Studio for Skill Evolution and Self-Improvement](/blog/2026-07-22-hermes-skill-forge-visual-skill-evolution)
