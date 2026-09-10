---
slug: "2026-09-10-dont-wrap-the-cli-hermes-api-server"
title: "Don't Wrap the CLI: The Hermes API Server Is an Agent Runtime"
excerpt: "subprocess.run(['hermes', 'chat', '-q', prompt]) is not an integration. The API server on :8642 is an agent runtime with sessions, steer, stop, approvals, and idempotent runs. Here is the client I actually ship, and the traps that make OpenAI-shaped requests lie to you."
date: "2026-09-10T09:00:00-04:00"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Liam's Landing", "Hermes AI", "Hermes API", "Tutorial"]
tags: ["hermes", "api-server", "openai-compatible", "runs-api", "idempotency", "sse", "tutorial"]
readTime: 10
image: "/images/blog/liam-dont-wrap-the-cli-hermes-api-server-hero.png"
originalUrl: "https://smfworks.com/liams-landing/2026-09-10-dont-wrap-the-cli-hermes-api-server"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-10-dont-wrap-the-cli-hermes-api-server"
---


Last month I reviewed a FastAPI service that "integrated Hermes." The integration was `subprocess.run(["hermes", "chat", "-q", prompt], timeout=120)`. Cold start was six to eight seconds. There was no session. There was no way to cancel a run that had gone off the rails. Approvals dumped to stdout and hung. When the timeout fired, the agent kept working in a leaked child.

The API server was listening on `127.0.0.1:8642` the whole time. Nobody had pointed the app at it.

The rule I now write at the top of every programmatic integration: don't wrap the CLI. Hit the HTTP surface. The CLI is a TTY. Your app is not.

## The API server is an agent runtime

This is the part people miss. `POST /v1/chat/completions` looks like OpenAI. It is not a model proxy. For each request, Hermes creates a server-side `AIAgent` on the machine running the gateway. Terminal, file tools, browser, MCP, memory, skills — they all execute on that host.

If your laptop points Open WebUI at a Hermes API server on a remote box, `pwd` is the remote box. That is the product, not a bug. A split-runtime ("remote brain, local hands") is tracked upstream. It is not the current behavior.

`GET /v1/models` advertising `hermes-agent` (or the profile name) is a compatibility alias. OpenAI clients need a model name to send back. It does not enumerate every provider you can route to. For that, call `GET /api/model/options` with the bearer key.

## Bring it up correctly

`.env` wins over `config.yaml` for the port. Always. I have watched a clone inherit `API_SERVER_PORT=8642` and then crash-loop because the parent already owned that port, while `config.yaml` claimed 8644. `hermes config set` is invisible here.

```bash
# unique key per profile
KEY=$(openssl rand -hex 32)

# default profile: ~/.hermes/.env
# named profile: ~/.hermes/profiles/<name>/.env
cat >> ~/.hermes/.env << EOF
API_SERVER_ENABLED=true
API_SERVER_HOST=127.0.0.1
API_SERVER_PORT=8642
API_SERVER_KEY=${KEY}
EOF

hermes gateway start
# log line you want: [API Server] API server listening on http://127.0.0.1:8642
```

Bind to `127.0.0.1` unless you have a reason not to. `0.0.0.0` plus a weak key is how you donate a shell to the LAN. CORS stays off unless a browser must call Hermes directly; Open WebUI talks server-to-server and does not need `API_SERVER_CORS_ORIGINS`.

Health before chat:

```bash
curl -sS http://127.0.0.1:8642/health
# {"status":"ok"}  — liveness only. does not mean the model is up.

curl -sS -H "Authorization: Bearer $API_SERVER_KEY" \
  http://127.0.0.1:8642/health/detailed
# HTTP 200 even when degraded. read status + readiness.checks, not the status code.

curl -sS -H "Authorization: Bearer $API_SERVER_KEY" \
  http://127.0.0.1:8642/v1/capabilities | python3 -m json.tool
```

`/health` is a cheap liveness probe. `/health/detailed` is the readiness check your monitor should actually parse. A degraded result still returns 200. If you alert on status code, you will never see a dead model.

## Three surfaces, one rule

Pick the surface that matches the job. Don't send a 40-minute coding run through chat completions and hope the HTTP timeout is long enough.

**`POST /v1/chat/completions`** — OpenAI-shaped, stateless. You send the full `messages` array every time. Use this when a frontend already speaks OpenAI and you do not need mid-run control.

**`POST /v1/responses`** — stateful. Pass `previous_response_id` or a `conversation` name and the server reconstructs the chain, including tool calls. Stored responses live in SQLite, survive gateway restarts, and LRU-evict after 100. Use this for multi-turn chat UIs.

**`POST /v1/runs`** — the one I use from apps and CI. You get a `run_id`, then subscribe to SSE, poll status, steer, stop, or resolve an approval. This is the surface that replaces `subprocess.run`.

A one-shot that does not need a session:

```bash
curl -sS http://127.0.0.1:8642/v1/chat/completions \
  -H "Authorization: Bearer $API_SERVER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "hermes-agent",
    "messages": [
      {"role": "user", "content": "Reply with the string PONG and nothing else."}
    ],
    "stream": false
  }'
```

That proves the wire works. It does not prove your app is integrated. The next section is the client I actually ship.

## A client you can paste

Stdlib only. No SDK. The interesting bits are the `Idempotency-Key` header, the SSE loop, and stop.

```python
#!/usr/bin/env python3
"""hermes_client.py — thin HTTP client for the Hermes API server.

Usage:
  export API_SERVER_KEY=...
  python3 hermes_client.py ping
  python3 hermes_client.py run "List files in the current directory. Stop after ls."
"""
from __future__ import annotations

import json
import os
import sys
import time
import urllib.error
import urllib.request
import uuid

BASE = os.environ.get("HERMES_API_BASE", "http://127.0.0.1:8642")
KEY = os.environ["API_SERVER_KEY"]


def _req(method: str, path: str, body=None, headers=None, timeout=60):
    h = {"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}
    if headers:
        h.update(headers)
    data = None if body is None else json.dumps(body).encode()
    r = urllib.request.Request(BASE + path, data=data, headers=h, method=method)
    try:
        with urllib.request.urlopen(r, timeout=timeout) as resp:
            raw = resp.read()
            extra = {k.lower(): v for k, v in resp.headers.items()}
            return resp.status, json.loads(raw) if raw else {}, extra
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", "replace")
        raise RuntimeError(f"{method} {path} -> {e.code}: {raw[:500]}") from e


def health() -> dict:
    status, payload, _ = _req("GET", "/health")
    if status != 200 or payload.get("status") != "ok":
        raise RuntimeError(f"liveness failed: {payload}")
    _, detailed, _ = _req("GET", "/health/detailed")
    return detailed


def chat(text: str) -> str:
    _, payload, _ = _req(
        "POST",
        "/v1/chat/completions",
        {"model": "hermes-agent", "messages": [{"role": "user", "content": text}]},
    )
    return payload["choices"][0]["message"]["content"]


def start_run(prompt: str, idempotency_key: str | None = None) -> str:
    headers = {}
    if idempotency_key:
        headers["Idempotency-Key"] = idempotency_key
    status, payload, extra = _req(
        "POST", "/v1/runs", {"input": prompt}, headers=headers, timeout=30
    )
    run_id = payload["run_id"]
    if extra.get("idempotency-replayed") == "true":
        print(f"replayed existing run {run_id}", file=sys.stderr)
    return run_id


def events(run_id: str, timeout_s: int = 600):
    """Yield SSE JSON payloads until the run hits a terminal status."""
    req = urllib.request.Request(
        f"{BASE}/v1/runs/{run_id}/events",
        headers={"Authorization": f"Bearer {KEY}", "Accept": "text/event-stream"},
    )
    deadline = time.time() + timeout_s
    with urllib.request.urlopen(req, timeout=timeout_s) as resp:
        buf = b""
        while time.time() < deadline:
            chunk = resp.read(256)
            if not chunk:
                break
            buf += chunk
            while b"\n\n" in buf:
                frame, buf = buf.split(b"\n\n", 1)
                for line in frame.split(b"\n"):
                    if line.startswith(b"data:"):
                        data = line[5:].strip()
                        if data and data != b"[DONE]":
                            yield json.loads(data)


def stop(run_id: str) -> dict:
    _, payload, _ = _req("POST", f"/v1/runs/{run_id}/stop", {})
    return payload


def steer(run_id: str, text: str) -> dict:
    # 200 means queued, not consumed. 409 if the run is not running.
    _, payload, _ = _req("POST", f"/v1/runs/{run_id}/steer", {"input": text})
    return payload


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "ping"
    if cmd == "ping":
        print(json.dumps(health(), indent=2)[:800])
        print(chat("Reply with the string PONG and nothing else."))
    elif cmd == "run":
        prompt = sys.argv[2]
        key = f"cli-{uuid.uuid4()}"
        run_id = start_run(prompt, idempotency_key=key)
        print(f"run_id={run_id}", file=sys.stderr)
        for ev in events(run_id):
            kind = ev.get("type") or ev.get("event") or "?"
            if kind in ("tool.start", "tool.complete", "run.completed", "run.failed", "run.cancelled"):
                print(kind, json.dumps(ev)[:200])
            if kind in ("run.completed", "run.failed", "run.cancelled"):
                break
    else:
        sys.exit(f"unknown command: {cmd}")
```

Run it against a live gateway:

```bash
export API_SERVER_KEY  # already in the profile .env
python3 hermes_client.py ping
python3 hermes_client.py run "Create /tmp/hermes-api-smoke.txt containing the ISO date. Then cat it."
```

If `ping` prints `PONG` and the run creates the file, you have an integration. If `ping` hangs, you wrapped the wrong thing — check that the gateway is the process bound to 8642, not a leftover dashboard.

## Traps that make the OpenAI shape lie

**Bare `model` is ignored on the OpenAI endpoints.** Generic clients hardcode `gpt-4o`. Existing deployments rely on that falling through to the gateway default. On `/v1/chat/completions` and `/v1/responses`, a `model` value sent without `provider` is ignored unless you set:

```yaml
gateway:
  platforms:
    api_server:
      direct_model_requests: true
```

Requests that include an explicit `provider` — and the Hermes-native `/v1/runs` and session-chat endpoints — honor the requested model regardless. If you need MiniMax for one turn:

```json
{
  "model": "MiniMax-M3",
  "provider": "minimax",
  "model_options": {"reasoning_effort": "high"},
  "messages": [{"role": "user", "content": "Summarize the repo status."}]
}
```

A `provider` that conflicts with a configured `model_routes` alias returns 400. Hermes will not silently remix route credentials.

**System prompts layer. They do not replace.** A frontend `system` message (chat completions) or `instructions` field (responses) sits on top of the core agent prompt. The agent keeps its tools. "You are a Python expert" does not strip `terminal`.

**Idempotency is a header, not a body field.** `Idempotency-Key` on `POST /v1/runs` is 1–255 visible ASCII. Hermes reserves the key before starting work. An identical retry returns the original `run_id` with HTTP 202 and `Idempotency-Replayed: true`, including after a gateway restart and after the run has completed, failed, or been cancelled. Reusing the same key with a different JSON payload returns 409 `idempotency_key_conflict`. Keys are isolated per authenticated profile and retained 24 hours after the last status update. Requests without the header always create a new run. If your CI retries on network blips, send the key.

**Steer is queued, not applied.** `POST /v1/runs/{id}/steer` is `/steer` over HTTP. It does not create a new user turn. The text becomes visible after the next tool boundary. 200 means queued. If the agent finishes with no later tool call, the undelivered text comes back as `pending_steer` on `run.completed`. Replay it as the next user turn or you lose it. Queued, paused, stopping, cancelled, failed, and completed runs return 409 `run_not_accepting_steer`.

**Stop is cooperative.** `POST /v1/runs/{id}/stop` returns `{"status": "stopping"}` immediately. The run stays `stopping` until the executor exits, then settles as `cancelled`. Requesting stop never hides a worker that is still running. If you `kill` the HTTP client, the agent keeps going. That is the whole point of runs over `subprocess`.

**Session key is not session id.** `X-Hermes-Session-Id` is the transcript. It rotates on `/new`. `X-Hermes-Session-Key` is the long-term memory scope for multi-user frontends (Honcho and friends), independent of the transcript. Max 256 chars, no control characters. Without the key, per-session memory produces a different scope every new chat. Pass both if you have users.

**Unconsumed SSE buffers expire in five minutes.** Detach and come back via `GET /v1/runs/{id}` for status. The run itself keeps running. The event buffer does not.

## A project for tonight: CI that cannot leak a child

Put this in `.github/workflows/hermes-smoke.yml` against a self-hosted runner that already has a gateway and an API key in the environment. The job fails if the agent does not write the receipt file. It also fails if you forget the idempotency key and the workflow re-runs.

```bash
#!/usr/bin/env bash
# scripts/hermes-api-smoke.sh
set -euo pipefail

: "${API_SERVER_KEY:?set API_SERVER_KEY}"
BASE="${HERMES_API_BASE:-http://127.0.0.1:8642}"
RECEIPT="/tmp/hermes-api-smoke-${GITHUB_RUN_ID:-local}.txt"
KEY="smoke-${GITHUB_RUN_ID:-local}-${GITHUB_RUN_ATTEMPT:-1}"

code=$(curl -sS -o /tmp/health.json -w "%{http_code}" "$BASE/health")
test "$code" = "200"

run_id=$(curl -sS -X POST "$BASE/v1/runs" \
  -H "Authorization: Bearer $API_SERVER_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $KEY" \
  -d "{\"input\": \"Write the ISO-8601 UTC datetime into ${RECEIPT}, then cat the file. Do not do anything else.\"}" \
  | python3 -c "import json,sys; print(json.load(sys.stdin)['run_id'])")

echo "run_id=$run_id"

# poll. SSE is nicer in a real client; CI just needs a terminal status.
for i in $(seq 1 60); do
  body=$(curl -sS -H "Authorization: Bearer $API_SERVER_KEY" "$BASE/v1/runs/$run_id")
  status=$(printf '%s' "$body" | python3 -c "import json,sys; print(json.load(sys.stdin).get('status',''))")
  echo "tick $i status=$status"
  case "$status" in
    completed) break ;;
    failed|cancelled) echo "$body"; exit 1 ;;
  esac
  sleep 5
done

test -s "$RECEIPT"
echo "receipt: $(cat "$RECEIPT")"
```

That is the red loop for an API integration: a command that fails when the agent did not do the thing, and passes only when the file exists. Wrapping `hermes chat -q` cannot give you this, because you don't have a `run_id` to poll or stop.

## When the CLI is still the right tool

Interactive chat. `/steer` from a keyboard. `hermes --tui`. ACP inside an IDE. Those are TTY jobs.

If you are writing a host that needs slash commands, clarify, sudo, session branch, and rewind, the TUI gateway JSON-RPC is the full protocol and the API server is the thin one. I am not covering RPC in this post. If you are writing an IDE plugin and the IDE already speaks ACP, use ACP. Zero protocol work.

If you are calling Hermes from Python, CI, a webhook, a dashboard, or another agent: HTTP. Bearer key. Runs. Idempotency key. Read the receipt back.

The CLI wrapper will keep showing up in code review. Kill it on sight.
