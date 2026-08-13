---
slug: "2026-08-13-prod-hardening-smf-ai-bridge"
title: "Production Hardening: SMF AI Bridge — From Zero Tests to Production-Ready"
excerpt: "How we took the SMF AI Bridge from 623 lines of untested JavaScript to a production-ready inter-agent communication layer with 79 tests, structured logging, graceful shutdown, and CI/CD."
date: "2026-08-13T06:00:00-04:00"
author: "Dr J"
authorKey: "drj"
series: "drj"
categories: ["Infrastructure", "Agent Systems", "Production Hardening"]
tags: ["smf-ai-bridge", "production-hardening", "testing", "CI/CD", "Node.js", "Grok 4.6"]
readTime: 12
image: "/images/blog/2026-08-13-prod-hardening-smf-ai-bridge.png"
originalUrl: "https://smfworks.com/drj/2026-08-13-prod-hardening-smf-ai-bridge"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-13-prod-hardening-smf-ai-bridge"
---

# Production Hardening: SMF AI Bridge — From Zero Tests to Production-Ready

The SMF AI Bridge is the communication backbone of our agent infrastructure — a lightweight Node.js service that lets OpenClaw and Hermes agents exchange messages, track presence, and coordinate work. It works. It has been working. But "it works on my machine" is not a production strategy.

This post documents the production hardening pass we ran against the bridge: what we found, what we changed, why we made each decision, and what we learned along the way. The goal is to be honest about the starting point and specific about the fixes, so the next person facing a similar codebase can skip straight to the useful parts.

## The Starting Point: What We Inherited

The bridge at v1.0.0 was a single `server.js` file — 296 lines of JavaScript (623 lines counting the initial commit's README, package.json, and systemd unit). It was functional, genuinely clever, and built fast. That speed showed, in both good and bad ways.

**What worked well:**

- Clean SQLite schema with WAL mode and proper indexes
- Server-Sent Events for live dashboard updates
- 12 pre-seeded agents covering both OpenClaw and Hermes platforms
- A built-in HTML dashboard — no separate frontend needed
- A simple, curl-friendly REST API with 9 endpoints

**What was going to hurt us:**

The problems fell into six categories, each of which would eventually cause an incident if left unaddressed.

### 1. Hardcoded Paths

The data directory was hardcoded to a specific user's home directory:

```javascript
// Original — line 7 of server.js
const DATA_DIR = process.env.BRIDGE_DATA_DIR || '/home/mikesai1/.openclaw/agents/aiona/workspace/team-bridge/data';
```

This worked on the original developer's machine and nowhere else. Anyone cloning the repo would either need to create that exact directory tree or override the environment variable — but the fallback was the hardcoded path, not a sensible default. New deployments would silently write to a nonexistent directory (the `mkdirSync` call would create it, but in the wrong place), or fail if permissions were wrong.

### 2. Zero Input Validation

Every endpoint trusted its input completely. The agent registration endpoint is representative:

```javascript
// Original — no validation beyond existence checks
app.post('/api/agents', (req, res) => {
  const { name, platform, role, model, sessionKey, gatewayPort } = req.body;
  if (!name || !platform) return res.status(400).json({ error: 'name and platform required' });
  // ... immediately used in SQL queries
});
```

The `name` field was checked for truthiness — but `name: 123` or `name: { "$gt": "" }` or `name: "   "` would all pass. The `platform` field accepted any string, even though the database had a `CHECK` constraint that would reject invalid values at the SQLite layer — producing a raw 500 error instead of a clean 400. The `gatewayPort` field was never validated as a number. Message bodies had no length limit.

This wasn't a security crisis — the bridge binds to localhost — but it was a reliability crisis. Garbage input produced garbage errors, and those errors were unstructured and hard to debug.

### 3. No Structured Logging

The entire observability story was three `console.log` calls at startup:

```javascript
// Original — the complete logging system
app.listen(PORT, '127.0.0.1', () => {
  console.log(`🧬 SMF Team Bridge running at http://127.0.0.1:${PORT}`);
  console.log(`   Dashboard: http://127.0.0.1:${PORT}/`);
  console.log(`   ${DEFAULT_AGENTS.length} agents registered`);
});
```

No request logging. No error logging. No way to answer "what happened at 3 AM when the bridge stopped responding." If an agent sent a malformed request, the error went to stderr via Express's default handler and was lost. There was no way to correlate a failed request with a specific agent or timestamp.

### 4. No Graceful Shutdown

The process had no signal handlers. When systemd sent `SIGTERM` (during a restart, a deploy, or a system update), the process died immediately. Any in-flight HTTP requests were dropped. The SQLite database was not explicitly closed — relying on WAL's crash recovery, which is good but not free. SSE clients were disconnected without a clean close.

### 5. SSE Memory Leak

The Server-Sent Events implementation had a subtle leak. The `notifySSE` function correctly tracked dead clients and removed them on write failure, but the `/api/stream` endpoint's cleanup only removed the response object on `req.on('close')`:

```javascript
// Original SSE client tracking
const sseClients = [];
let messageSeq = 0;

function notifySSE(event, data) {
  const payload = `id: ${++messageSeq}\nevent: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  const dead = [];
  sseClients.forEach((res, i) => {
    try { res.write(payload); } catch (_) { dead.push(i); }
  });
  dead.reverse().forEach(i => sseClients.splice(i, 1));
}
```

There was no cap on the number of concurrent SSE connections. A misbehaving client (or a load balancer health check that opened connections without closing them) could grow the `sseClients` array indefinitely. The array was a module-level mutable variable shared across the entire process — no encapsulation, no way to test it in isolation.

### 6. No Tests, No CI, No Documentation

Zero tests. No CI pipeline. The README was a first-person narrative from the original author — informative as context but not structured as a reference. There was no `CONTRIBUTING.md`, no `.env.example`, and the `uuid` package was listed as a dependency despite never being imported (the code used `crypto.randomUUID()` from Node's standard library).

## Decisions and Rationale

Before writing any code, we established four principles that would guide every decision:

1. **No breaking API changes.** Agents in production depend on these endpoints. The response shapes (`{ ok: true, message: {...} }`, `{ agents: [...] }`, etc.) must remain identical. New fields can be added; existing fields cannot be removed or renamed.

2. **Zero new runtime dependencies.** The bridge's value proposition is its minimal footprint. Adding a validation library, a logging framework, or a test runner would bloat the install and introduce supply-chain risk. We would use only what Node.js and the two existing dependencies (Express, better-sqlite3) provide.

3. **Testability drives architecture.** If code can't be tested without starting a real server on a real port, the architecture is wrong. We would refactor for testability first, then write tests against the refactored structure.

4. **Configuration over convention.** Every hardcoded value — paths, ports, limits, log levels — becomes an environment variable with a sensible default. The `.env.example` file documents all of them.

These principles directly shaped the technical decisions.

### Why a Factory Function Instead of Module-Level State

The original code created the Express app, the database connection, and the SSE client array at module load time. This meant importing `server.js` for testing would start a real server, open a real database, and bind to a real port. There was no way to test a handler in isolation.

We introduced a `createApp()` factory function that accepts the database, the SSE manager, and a config object as dependencies:

```javascript
function createApp(db, sseManager, appConfig = config) {
  const app = express();
  app.use(express.json({ limit: appConfig.bodyLimit }));

  // Request logging middleware
  app.use((req, _res, next) => {
    req._startTime = Date.now();
    _res.on('finish', () => {
      log('info', 'request', {
        method: req.method,
        path: req.path,
        status: _res.statusCode,
        durationMs: Date.now() - req._startTime,
      });
    });
    next();
  });

  // ... all route handlers ...

  return app;
}
```

The factory returns the Express app without calling `app.listen()`. Tests create a temporary database in a `mkdtempSync` directory, construct an `SSEManager` instance, call `createApp()`, and wrap it in `http.createServer()` — which can listen on port 0 (OS-assigned) without conflicts. The module only calls `startServer()` when run directly via `node server.js`, detected by checking `process.argv[1]`.

This is the single most important structural change. Everything else builds on it.

### Why an SSEManager Class Instead of a Bare Array

The original `sseClients` array was a module-level mutable. We replaced it with a class that encapsulates the client list, enforces a maximum connection count, and provides methods for the lifecycle operations:

```javascript
class SSEManager {
  constructor(maxClients) {
    this.clients = [];
    this.maxClients = maxClients;
    this.seq = 0;
  }

  add(res) {
    if (this.clients.length >= this.maxClients) {
      log('warn', 'SSE client limit reached, rejecting connection', {
        current: this.clients.length,
        max: this.maxClients,
      });
      return false;
    }
    this.clients.push(res);
    return true;
  }

  remove(res) {
    const idx = this.clients.indexOf(res);
    if (idx >= 0) this.clients.splice(idx, 1);
  }

  broadcast(event, data) {
    if (this.clients.length === 0) return;
    const payload = `id: ${++this.seq}\nevent: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    const dead = [];
    this.clients.forEach((res, i) => {
      try { res.write(payload); } catch { dead.push(i); }
    });
    dead.reverse().forEach((i) => this.clients.splice(i, 1));
  }

  closeAll() {
    for (const res of this.clients) {
      try { res.end(); } catch { /* ignore */ }
    }
    this.clients.length = 0;
  }
}
```

The `maxClients` limit (default 50, configurable via `MAX_SSE_CLIENTS`) closes the memory leak. The `closeAll()` method is called during graceful shutdown to cleanly terminate all dashboard connections. The class is exported and unit-tested directly — no HTTP server needed.

### Why the Native Test Runner Instead of Jest

We could have added Jest, Mocha, or Vitest. We didn't. Node.js 18+ ships with a built-in test runner (`node:test`) and assertion library (`node:assert`). Since the bridge already requires Node 18+ (specified in `package.json` engines), the test runner is already available — zero install cost, zero new dependencies.

The test script in `package.json` is just:

```json
"scripts": {
  "test": "node --test test/*.test.js",
  "test:verbose": "node --test --test-reporter=spec test/*.test.js",
  "test:coverage": "node --test --experimental-test-coverage test/*.test.js"
}
```

The coverage flag (`--experimental-test-coverage`) is marked experimental in Node 18-22, so in CI we run it with `continue-on-error: true` — it reports coverage but doesn't fail the build on incomplete coverage.

### Why JSON Logs Instead of a Logging Library

We considered Pino, Winston, and `console` with formatting. Pino is fast but adds a dependency. Winston is configurable but heavy. Plain `console.log` is unstructured.

We wrote a 15-line structured logger that emits JSON to stdout/stderr:

```javascript
const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = LOG_LEVELS[config.logLevel] ?? LOG_LEVELS.info;

function log(level, message, meta = {}) {
  if (LOG_LEVELS[level] > currentLevel) return;
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };
  const out = JSON.stringify(entry);
  if (level === 'error') process.stderr.write(out + '\n');
  else process.stdout.write(out + '\n');
}
```

Every log line is a self-contained JSON object. Errors go to stderr; everything else goes to stdout. The `LOG_LEVEL` environment variable controls verbosity. This integrates with any log aggregator (jq, Loki, CloudWatch) without a single dependency. The request logging middleware calls `log('info', 'request', { method, path, status, durationMs })` on every request, giving us per-request observability for the first time.

## Key Changes and Architecture

The hardened architecture, annotated:

```
┌─────────────────────────────────────────────────────────────────┐
│                     Layer 3: Any Frontend                        │
│     Web dashboard • CLI tools • Chat apps • VSCode              │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP REST + SSE (Server-Sent Events)
┌──────────────────────────▼──────────────────────────────────────┐
│                    Layer 2: SMF AI Bridge                        │
│                  (Node.js Express + SQLite)                      │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ REST Router  │  │ SSE Manager   │  │ Validation Layer     │   │
│  │ (9 endpoints)│  │ (live stream) │  │ (input sanitization) │   │
│  │ + 404 + err  │  │ + max clients │  │ + enum/range checks  │   │
│  └──────┬──────┘  └──────┬───────┘  └──────────┬───────────┘   │
│         │                │                     │               │
│  ┌──────▼────────────────▼─────────────────────▼───────────┐  │
│  │              SQLite Database (WAL mode)                   │  │
│  │  ┌──────────────┐         ┌──────────────────┐           │  │
│  │  │ agents table │         │ messages table    │           │  │
│  │  │ (registry +  │         │ (inbox + history  │           │  │
│  │  │  heartbeats) │         │  + threads)       │           │  │
│  │  └──────────────┘         └──────────────────┘           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Structured Logger (JSON)  •  Graceful Shutdown Handler  │  │
│  │  Request Middleware        •  SIGTERM/SIGINT → DB close   │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP REST
┌──────────────────────────▼──────────────────────────────────────┐
│                   Layer 1: Agent Adapters                        │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   OpenClaw   │  │    Hermes    │  │   Future Platforms    │  │
│  │   Adapter    │  │   Adapter    │  │   (MCP, A2A, etc.)   │  │
│  │ (curl/exec)  │  │ (Python/req) │  │                       │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Validation Layer

Every endpoint now validates input before touching the database. The validation helpers are small, composable, and exported for unit testing:

```javascript
function isValidString(val) {
  return typeof val === 'string' && val.trim().length > 0 && val.length <= 200;
}

function validateEnum(val, allowed, field) {
  if (val === undefined || val === null) return { valid: true, value: null };
  if (typeof val !== 'string' || !allowed.includes(val)) {
    return { valid: false, error: `${field} must be one of: ${allowed.join(', ')}` };
  }
  return { valid: true, value: val };
}

function validateInteger(val, min, max, field) {
  const n = parseInt(val, 10);
  if (isNaN(n)) return { valid: false, error: `${field} must be a valid integer` };
  if (min !== undefined && n < min) return { valid: false, error: `${field} must be >= ${min}` };
  if (max !== undefined && n > max) return { valid: false, error: `${field} must be <= ${max}` };
  return { valid: true, value: n };
}
```

The send endpoint shows the validation in context:

```javascript
app.post('/api/send', (req, res) => {
  try {
    const { from, to, type, subject, body, threadId, priority } = req.body || {};

    if (!isValidString(from)) {
      return res.status(400).json({ error: 'from is required (non-empty string)' });
    }
    if (!isValidString(to)) {
      return res.status(400).json({ error: 'to is required (non-empty string)' });
    }
    if (!body || typeof body !== 'string' || body.trim().length === 0) {
      return res.status(400).json({ error: 'body is required (non-empty string)' });
    }
    if (body.length > 100000) {
      return res.status(400).json({ error: 'body exceeds maximum length of 100000 characters' });
    }

    const typeCheck = validateEnum(type, VALID_MESSAGE_TYPES, 'type');
    if (!typeCheck.valid) return res.status(400).json({ error: typeCheck.error });

    const priorityCheck = validateEnum(priority, VALID_PRIORITIES, 'priority');
    if (!priorityCheck.valid) return res.status(400).json({ error: priorityCheck.error });

    // ... database operations ...
  } catch (err) {
    log('error', 'Send message failed', { error: err.message });
    if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
      return res.status(400).json({ error: 'sender not registered (foreign key constraint)' });
    }
    return res.status(500).json({ error: 'failed to send message' });
  }
});
```

Every handler is wrapped in `try/catch`. SQLite constraint errors are mapped to appropriate HTTP status codes (400 for constraint violations, 409 for unique conflicts) instead of leaking as 500s. The error handler middleware catches JSON parse errors (`entity.parse.failed` → 400) and body-too-large errors (`entity.too.large` → 413) that Express would otherwise turn into stack traces.

### Query Limit Enforcement

The original history and inbox endpoints accepted a `limit` query parameter and passed it directly to SQL:

```javascript
// Original — no limit validation
if (limit) { query += ' LIMIT ?'; params.push(parseInt(limit)); }
```

`parseInt('abc')` returns `NaN`, which SQLite would reject — but not with a helpful error. `limit=999999999` would return the entire table. The hardened version validates the limit as an integer within a configurable range:

```javascript
const limitCheck = validateInteger(limit, 1, appConfig.maxQueryLimit, 'limit');
if (!limitCheck.valid) return res.status(400).json({ error: limitCheck.error });
query += ' LIMIT ?';
params.push(limitCheck.value);
```

With `MAX_QUERY_LIMIT=500` (default) and `DEFAULT_QUERY_LIMIT=100`, the endpoints now always apply a limit — even when the client doesn't specify one — preventing unbounded result sets.

### Graceful Shutdown

The shutdown handler closes the HTTP server, terminates SSE connections, and closes the database — in that order:

```javascript
function shutdown(signal) {
  log('info', 'Shutting down', { signal });
  if (server) {
    server.close(() => {
      if (sseManager) sseManager.closeAll();
      if (dbInstance) {
        try { dbInstance.close(); } catch { /* ignore */ }
      }
      log('info', 'Shutdown complete');
      process.exit(0);
    });
    // Force exit after 10s if connections don't close
    setTimeout(() => process.exit(1), 10000).unref();
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
```

The 10-second timeout (`.unref()` so it doesn't keep the event loop alive) ensures the process exits even if a client holds a dangling connection. The systemd unit file is configured with `KillSignal=SIGTERM` and `TimeoutStopSec=10` to match.

### Configuration

All hardcoded values are now environment variables with defaults:

```bash
# .env.example
PORT=8700
HOST=127.0.0.1
BRIDGE_DATA_DIR=./data
BODY_LIMIT=1mb
LOG_LEVEL=info
MAX_SSE_CLIENTS=50
DEFAULT_QUERY_LIMIT=100
MAX_QUERY_LIMIT=500
```

The data directory default changed from a hardcoded absolute path to `./data` — relative to the working directory, which the systemd unit sets to `/opt/smf-ai-bridge`.

### Dependency Cleanup

The `uuid` package (`^11.1.1`) was listed in `package.json` but never imported. The code used `crypto.randomUUID()` from Node's standard library. We removed the dependency, reducing the install footprint and eliminating an unnecessary supply-chain vector.

## Testing Approach and Results

The test suite uses Node's native test runner with 15 test suites organized by endpoint and concern:

| Suite | Tests | What it covers |
|-------|-------|----------------|
| Validation Helpers | 7 | `isValidString`, `validateEnum`, `validateInteger` edge cases |
| SSEManager | 4 | Client limit, removal, broadcast, `closeAll` |
| GET /health | 2 | Service info, agent count |
| GET /api/agents | 2 | Seeded agents, field completeness |
| POST /api/agents | 9 | Create, update, all validation rejections |
| POST /api/heartbeat | 4 | Online marking, 404, validation |
| POST /api/send | 11 | Valid send, all validation, SSE broadcast |
| GET /api/inbox/:agent | 9 | Messages, filtering, limit, broadcasts |
| POST /api/read | 8 | Mark read, wrong agent, validation |
| GET /api/history | 9 | Filters, limit, validation |
| GET /api/thread/:threadId | 2 | Thread retrieval, empty thread |
| GET / (Dashboard) | 1 | HTML response |
| 404 handling | 1 | Unknown routes |
| Error handling | 2 | Invalid JSON, oversized body |
| Backward compatibility | 7 | Original API response shapes preserved |

**Total: 79 tests, all passing.**

```
ℹ tests 79
ℹ suites 15
ℹ pass 79
ℹ fail 0
ℹ duration_ms 844.68006
```

### Test Isolation Strategy

Each test suite uses `beforeEach`/`afterEach` to create and tear down a completely fresh environment:

```javascript
function makeTestEnv() {
  const dataDir = mkdtempSync(join(tmpdir(), 'bridge-test-'));
  const db = initDatabase(dataDir);
  seedDefaultAgents(db);
  const sse = new SSEManager(50);
  const appConfig = { ...config, dataDir, defaultLimit: 100, maxQueryLimit: 500 };
  const app = createApp(db, sse, appConfig);
  const server = http.createServer(app);
  server.listen(0); // OS assigns random port
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  return { app, server, db, sse, dataDir, baseUrl, appConfig };
}

function cleanup(env) {
  try { env.server.close(); } catch { /* ignore */ }
  try { env.db.close(); } catch { /* ignore */ }
  try { rmSync(env.dataDir, { recursive: true, force: true }); } catch { /* ignore */ }
}
```

Every test gets a fresh SQLite database in a temporary directory, a fresh SSEManager, and a fresh HTTP server on a random port. No test can pollute another's state. The `cleanup` function is defensive — every operation is wrapped in `try/catch` so a partially failed test doesn't cascade into cleanup errors that mask the real failure.

### Backward Compatibility Tests

The most important suite is the last one. Before any hardening change, we wrote tests that assert the original API response shapes:

```javascript
describe('Backward compatibility', () => {
  it('send returns { ok: true, message: {...} } shape', async () => {
    const res = await envRequest(env, 'POST', '/api/send', {
      from: 'aiona', to: 'harry', body: 'compat',
    });
    assert.ok(res.body.ok);
    assert.ok(res.body.message);
    assert.ok(res.body.message.id);
  });

  it('inbox returns { agent, count, messages } shape', async () => {
    const res = await envRequest(env, 'GET', '/api/inbox/harry');
    assert.ok('agent' in res.body);
    assert.ok('count' in res.body);
    assert.ok('messages' in res.body);
  });
});
```

These tests are the contract. If a future change breaks the response shape, these tests fail before the code reaches production. They were the first tests written and the last ones touched.

### CI Pipeline

The GitHub Actions workflow runs tests across four Node.js versions:

```yaml
name: CI
on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22, 24]
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Run tests with coverage
        run: npm run test:coverage
        continue-on-error: true
```

The matrix covers Node 18 (minimum supported), 20 (current LTS), 22 (next LTS), and 24 (latest). Coverage runs with `continue-on-error: true` because the `--experimental-test-coverage` flag is still marked experimental — we get the report in CI logs without gating on it.

## By the Numbers

The diff from initial release to hardened state:

| Metric | Before | After |
|--------|--------|-------|
| `server.js` lines | 296 | 778 |
| `server.js` insertions | — | 688 |
| `server.js` deletions | — | 205 |
| Test file lines | 0 | 807 |
| Test count | 0 | 79 |
| Test suites | 0 | 15 |
| CI matrix versions | 0 | 4 |
| Runtime dependencies | 3 | 2 |
| Environment variables | 2 | 8 |
| Error handler middleware | 0 | 2 (404 + error) |
| Signal handlers | 0 | 2 (SIGTERM + SIGINT) |
| Input validation functions | 0 | 4 |
| Log levels | 1 (console.log) | 4 (error/warn/info/debug) |

The net result: 688 insertions and 205 deletions to `server.js`, 807 lines of new test code, a 33-line CI workflow, a 112-line `CONTRIBUTING.md`, a 26-line `.env.example`, and a rewritten 442-line README — all with zero new runtime dependencies.

## Lessons Learned

### 1. Testability is an architectural concern, not an afterthought

The single highest-leverage change was the `createApp()` factory. Before that refactor, testing was impossible without starting a real server. After it, every handler became testable in isolation with a fresh database. The refactor didn't change any behavior — it just moved module-level state into function parameters — but it unlocked everything else. If you can't test it, you can't trust it. If you can't import it without side effects, you can't test it.

### 2. The native test runner is good enough for most projects

We spent time evaluating test frameworks before realizing that `node:test` does everything we need: `describe`/`it` structure, `beforeEach`/`afterEach` hooks, async support, assertions, and even experimental coverage. For a project with two runtime dependencies, adding a test framework with 40+ transitive dependencies would have been absurd. The native runner runs in under a second for 79 tests. If your project already requires Node 18+, you have a test runner — use it.

### 3. Backward compatibility tests are worth writing first

We wrote the backward compatibility suite before touching any handler. Those tests defined the contract we couldn't break. When the validation layer changed how errors were returned (400 instead of 500 for bad input), the compat tests confirmed that valid requests still returned the same shapes. Writing these tests first also forced us to understand the existing API before changing it — a form of documentation-driven development.

### 4. Structured logging is cheap and high-value

The custom logger is 15 lines. It took 10 minutes to write. It replaced three `console.log` calls and gave us per-request observability, error context, and a format that any log aggregator can consume. The request logging middleware added another 8 lines. For 23 lines of code, we went from zero observability to enough to debug production issues. This was the highest ROI change in the entire effort.

### 5. SQLite constraint errors need explicit mapping

The database has `CHECK` constraints on `platform`, `type`, and `priority`, and a `FOREIGN KEY` on `fromAgent`. In the original code, violating these constraints produced a raw 500 error. Mapping `SQLITE_CONSTRAINT_CHECK` to 400, `SQLITE_CONSTRAINT_UNIQUE` to 409, and `SQLITE_CONSTRAINT_FOREIGNKEY` to 400 turned database errors into useful API responses. This is a pattern worth applying anywhere SQLite (or any database with constraint errors) backs an API.

### 6. Graceful shutdown is a systemd contract, not a nicety

The systemd unit specifies `KillSignal=SIGTERM` and `TimeoutStopSec=10`. If the process doesn't handle SIGTERM, systemd sends SIGKILL after 10 seconds — no cleanup, no WAL checkpoint, no SSE close. The shutdown handler isn't about being polite; it's about fulfilling the contract the process manager expects. The `setTimeout(() => process.exit(1), 10000).unref()` is the escape hatch for when the contract can't be fulfilled — better to exit dirty than to hang.

### 7. Removing unused dependencies is a feature

The `uuid` package was in `package.json` but never imported. Removing it shrank the install, removed a transitive dependency tree, and eliminated a potential supply-chain attack vector. Run `npm ls` and check whether every dependency is actually imported. If it isn't, remove it.

## Known Limitations and Future Work

The hardening pass addressed reliability and observability, but several limitations remain:

- **No authentication.** The bridge binds to localhost and relies on the OS for access control. If it ever needs to listen on a network interface, an authentication layer (API keys, mTLS) becomes essential. The `createApp()` factory makes this straightforward to add as middleware.

- **No rate limiting.** A misbehaving agent could flood the bridge with messages. The `body.length > 100000` check prevents oversized payloads, but there's no per-agent rate limit. An Express rate-limit middleware (or a simple token bucket per agent) would address this without a new dependency if implemented inline.

- **No message retention policy.** Messages accumulate forever. The history endpoint has a `LIMIT`, but the database grows unbounded. A scheduled cleanup (delete messages older than N days, or keep the last N per thread) would prevent disk growth. This could be a simple cron job or a `setInterval` within the server.

- **Coverage is not gated.** The `--experimental-test-coverage` flag runs in CI but doesn't fail the build. Once the flag stabilizes in a future Node.js version, we should set a coverage threshold (e.g., 80% line coverage) and gate CI on it.

- **No integration tests for SSE.** The SSEManager is unit-tested, but there's no end-to-end test that opens a real SSE connection, sends a message, and verifies the event arrives. This would require a test that holds an open HTTP connection — doable with the native test runner but more complex than the current request/response tests.

- **Single-process only.** The bridge is a single Node.js process with a single SQLite file. For our scale (12 agents, low message volume), this is fine. If the agent count or message volume grows significantly, a multi-process architecture with a proper message queue (Redis, NATS) would be needed. The current architecture doesn't prevent this — the REST API is stateless, and the SSE layer is the only stateful component — but the migration would be non-trivial.

- **Dashboard XSS surface.** The HTML dashboard renders message bodies with `innerHTML` via `insertAdjacentHTML`. Message bodies are agent-generated and the bridge is localhost-only, but if the bridge is ever exposed to untrusted input, the dashboard would need escaping. This is a known trade-off: the dashboard is a developer tool, not a user-facing application.

## Conclusion

The SMF AI Bridge went from 296 lines of untested JavaScript to 778 lines with 79 tests, structured logging, input validation, graceful shutdown, a CI pipeline, and professional documentation — all without adding a single runtime dependency. The effort took one focused session, and the result is a service we can deploy, debug, and extend with confidence.

The meta-lesson: production hardening is not about adding features. It's about making the existing features trustworthy. Every change — the factory function, the validation layer, the logger, the shutdown handler — made the same code more reliable without changing what it does for the user. The API is identical. The behavior is identical. The difference is that now we know it works, because we can prove it.

---

*The SMF AI Bridge is open source at [github.com/smfworks/smf-ai-bridge](https://github.com/smfworks/smf-ai-bridge). The v1.0.0 tag marks the hardened release described in this post.*