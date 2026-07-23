---
slug: "linux-cgroups-resource-budgets-local-ai-agents"
title: "Put Your AI Agents in cgroups: Resource Budgets for Local LLM Workloads on Linux"
excerpt: "A coding agent, test runner, and local model server should not compete as unrestricted peers. This guide uses cgroup v2 and systemd user units to give Hermes profiles and one-shot agent jobs explicit CPU, memory, and process budgets—without pretending resource controls are a security sandbox."
date: "2026-07-23"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Engineering", "AI Agents", "Local LLMs", "Linux", "Open Source", "Architecture"]
tags: []
readTime: 17
image: "/images/blog/linux-cgroups-resource-budgets-local-ai-agents-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/linux-cgroups-resource-budgets-local-ai-agents"
---

A local coding agent starts `pytest -n auto`. A second profile launches a TypeScript build. A third recursively indexes the repository. Ollama is already serving a model with a large context window. Nothing is technically broken, but the machine becomes unusable: prompt evaluation stalls, SSH feels sticky, the kernel starts reclaiming memory, and one unlucky process is killed after the host crosses the real limit.

The usual response is to lower agent concurrency. That helps, but concurrency is only a count. It does not describe the size of each job, the number of threads it can create, or what should happen when the local inference server and a compiler want the same last gigabyte of memory.

On Linux, the right primitive already exists: **cgroup v2**, usually managed through systemd. Put the local model server in one resource domain. Put agent runtimes and their child processes in another. Give one-shot builds a smaller envelope inside the agent pool. Then make those limits observable and test them before the 3 a.m. cron run.

This is not container theater. You do not need Kubernetes, and you do not need to rewrite Hermes. A pair of `.slice` units, one service policy, and a small `systemd-run` wrapper are enough to stop cooperative workloads from taking the host down together.

The critical caveat comes first:

> **cgroups are resource isolation, not a security boundary.**

They control CPU time, memory, process counts, and—when delegated—block I/O. They do not decide which files an agent may read, which network destinations it may reach, or whether a shell command is authorized. Keep Hermes tool approvals, filesystem scoping, containers, AppArmor/SELinux, and least-privilege credentials as separate controls.

## The architecture: reserve capacity by workload class

Do not put every process under one undifferentiated “AI” bucket. Inference and agent execution fail differently.

```text
Linux host / cgroup v2
│
├── local-inference.slice
│   └── ollama.service
│       ├── model weights / runtime threads
│       └── prompt evaluation + generation
│
├── agent-work.slice
│   ├── hermes-builder.service
│   │   ├── Hermes planner / gateway
│   │   └── terminal-tool children
│   │       ├── pytest
│   │       ├── npm build
│   │       └── git
│   │
│   └── agent-job-*.service
│       └── bounded one-shot build, test, or migration
│
└── everything else
    ├── SSH and desktop session
    ├── monitoring
    └── operating-system services
```

The layout creates three useful properties:

1. A runaway build can hit its own cap without taking Ollama with it.
2. The inference server can receive a higher CPU weight under contention while still having a hard memory ceiling.
3. Every process spawned by a service stays in that service's cgroup by default, so a Hermes profile and ordinary terminal-tool descendants share one accountable budget.

The third point matters. A limit on the Python parent process is not enough if its test runner creates 64 workers. A cgroup accounts for the whole process tree.

## Step 1: confirm the kernel and user manager can enforce limits

Modern Ubuntu, Fedora, Debian, Arch, and similar distributions normally boot with cgroup v2. Verify instead of assuming:

```bash
# Expect: cgroup2fs
stat -fc %T /sys/fs/cgroup

# Expect a path under /user.slice/...
systemctl --user show -p Version -p ControlGroup

# Check whether the user manager survives logout
loginctl show-user "$USER" -p Linger

# See which controllers are available to user services
user_cgroup=$(systemctl --user show -p ControlGroup --value)
cat "/sys/fs/cgroup${user_cgroup}/cgroup.controllers"
cat "/sys/fs/cgroup${user_cgroup}/cgroup.subtree_control"
```

On one Ubuntu 24.04 host with systemd 255, the filesystem reported `cgroup2fs`; the user manager lived under `/user.slice/user-1000.slice/user@1000.service`; and the delegated controllers were:

```text
cpu memory pids
```

Notice what is absent: `io`. An `IOWeight=` line in a user unit is not useful if the I/O controller has not been delegated to that user manager. Check the live controller list before promising disk isolation. CPU, memory, and task limits are still enough to prevent the most common agent-host failures.

If the agent must survive SSH logout, enable lingering once:

```bash
sudo loginctl enable-linger "$USER"
```

Hermes also exposes `hermes gateway install`, `start`, `stop`, `restart`, and `status` for managing its gateway as a background service. Use that lifecycle when it fits your deployment. The resource-control principle is the same whether you add a drop-in to an installed unit or maintain an explicit profile service: there must be exactly one service definition starting that gateway, not two competing copies.

## Step 2: design a budget instead of copying mine

A resource envelope has four distinct knobs:

| systemd property | cgroup v2 file | What it controls | Operational meaning |
|---|---|---|---|
| `CPUWeight=` | `cpu.weight` | Relative CPU priority during contention | “Let inference win when both are runnable” |
| `CPUQuota=` | `cpu.max` | Hard CPU-time ceiling | `150%` means roughly 1.5 CPU cores of time, not 150% of the machine |
| `MemoryHigh=` | `memory.high` | Reclaim/throttling pressure before the hard cap | Early backpressure; performance degrades before death |
| `MemoryMax=` | `memory.max` | Hard memory ceiling | The cgroup cannot grow without bound |
| `TasksMax=` | `pids.max` | Processes and threads | Stops fork bombs and accidental worker explosions |
| `MemorySwapMax=` | `memory.swap.max` | Swap usage, when supported | Prevents an agent from turning RAM pressure into minutes of disk thrash |

`CPUWeight` and `CPUQuota` are not interchangeable. Weight only matters when cgroups compete for CPU. A weight of 500 does not reserve five cores on an idle machine. A quota is a ceiling even when the rest of the machine is empty.

Likewise, `MemoryHigh` and `MemoryMax` should normally be used together. The high watermark lets the kernel apply reclaim pressure first. The max is the final containment boundary. Setting only a tight hard cap converts ordinary bursts into abrupt failures.

Base memory budgets on **available memory under representative load**, not total installed RAM. Account for model weights, KV cache, filesystem cache, the operating system, and concurrent jobs. On an illustrative host with 64 GiB available at the scheduling point, reserving 28 GiB for inference and 8 GiB for the OS leaves a 28 GiB agent pool. At four-way concurrency, that is 7 GiB maximum per job; an 80% early-pressure mark is 5.6 GiB.

That is sample arithmetic, not a universal profile. Unified-memory GPUs complicate the calculation because CPU and GPU allocations draw from the same physical pool, and accounting behavior varies by driver/runtime. Discrete GPU VRAM is a separate capacity domain. Measure your actual Ollama or llama.cpp process while loading the intended model and context size.

A useful planning formula is:

```text
agent_pool = available_memory
           - measured_inference_working_set
           - operating_system_reserve
           - burst_reserve

per_job_memory_max = agent_pool / maximum_agent_concurrency
per_job_memory_high = per_job_memory_max × 0.80
```

If that calculation produces a tiny job budget, the answer is not to lie to systemd. Lower concurrency, use a smaller model/context, move inference to another GPU host, or route some work to the cloud.

## Step 3: create workload slices

A slice is a parent budget shared by everything placed beneath it. Create `~/.config/systemd/user/agent-work.slice`:

```ini
[Unit]
Description=Resource pool for AI agent execution

[Slice]
CPUWeight=100
CPUQuota=400%
MemoryHigh=22G
MemoryMax=28G
TasksMax=1024
```

Create `~/.config/systemd/user/local-inference.slice`:

```ini
[Unit]
Description=Resource pool for local LLM inference

[Slice]
CPUWeight=500
MemoryHigh=24G
MemoryMax=28G
TasksMax=1024
```

Then load both:

```bash
systemctl --user daemon-reload
systemctl --user start agent-work.slice local-inference.slice
systemctl --user status agent-work.slice local-inference.slice --no-pager
```

The example gives inference five times the CPU weight of agent work when both slices are contending. It caps all agent execution at four cores of CPU time in aggregate and 28 GiB of memory. Replace every number with measurements from your host.

I intentionally left `IOWeight=` out. On a user manager with only `cpu memory pids` delegated, an I/O policy is not part of the enforced contract. If `io` appears in both controller files on your system, add and verify it; otherwise constrain high-I/O tools at the command level—for example, reduce test parallelism and use `nice`/`ionice` only as advisory supplements.

## Step 4: place the local model server in its own slice

If Ollama already runs as a systemd user service, create a drop-in:

```bash
systemctl --user edit ollama.service
```

Add:

```ini
[Service]
Slice=local-inference.slice
CPUWeight=500
MemoryHigh=24G
MemoryMax=28G
TasksMax=1024
OOMPolicy=stop
Restart=on-failure
RestartSec=5s
```

Reload and restart:

```bash
systemctl --user daemon-reload
systemctl --user restart ollama.service
systemctl --user status ollama.service --no-pager
```

Do not treat these numbers as an Ollama tuning recommendation. A model that needs 31 GiB will not become efficient because the unit says 28 GiB; it will fail. Load the exact quantization and context window you intend to serve, inspect the steady-state and peak working set, then put the cap above the measured requirement with explicit headroom.

Also keep the inference runtime's native capacity controls:

```ini
[Service]
Environment="OLLAMA_HOST=127.0.0.1:11434"
Environment="OLLAMA_MAX_LOADED_MODELS=1"
Environment="OLLAMA_NUM_PARALLEL=2"
Environment="OLLAMA_KEEP_ALIVE=30m"
```

Those settings and cgroups solve different problems. Ollama controls model residency and request parallelism. The cgroup controls what the process tree may consume from Linux.

On AMD, `HIP_VISIBLE_DEVICES` can select which GPU devices a process sees. It is not a VRAM quota. Standard CPU cgroups do not prevent one model server from filling an assigned GPU. For multiple GPU workloads, use device placement plus runtime concurrency/model-size limits, and measure with the ROCm tools available on your installation. Resource behavior remains hardware-, driver-, model-, quantization-, and context-dependent.

## Step 5: bound a persistent Hermes profile and its children

A persistent coding profile should have a stable service boundary. If you maintain the unit yourself, this is the shape:

```ini
# ~/.config/systemd/user/hermes-builder.service
[Unit]
Description=Hermes builder profile
After=network-online.target ollama.service
Wants=network-online.target

[Service]
Type=simple
Slice=agent-work.slice
ExecStart=%h/.local/bin/hermes --profile builder gateway run
Restart=on-failure
RestartSec=5s
KillMode=control-group
TimeoutStopSec=30s

# Per-profile ceiling inside the shared agent pool
CPUQuota=200%
MemoryHigh=6G
MemoryMax=8G
TasksMax=384

[Install]
WantedBy=default.target
```

Confirm the Hermes binary path with `command -v hermes` and change `ExecStart` if your installation is elsewhere. Each profile gateway also needs its normal Hermes configuration—enabled messaging/API surfaces, unique ports where applicable, and credentials in the profile's `.env`. The [Hermes profiles documentation](https://hermes-agent.nousresearch.com/docs/user-guide/profiles) and [messaging/gateway documentation](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/) are the source of truth for those application settings.

Enable the unit:

```bash
systemctl --user daemon-reload
systemctl --user enable --now hermes-builder.service
systemctl --user status hermes-builder.service --no-pager
```

`KillMode=control-group` is important for clean shutdown. A compiler, test worker, or browser spawned by the gateway should not become an orphan that survives the agent service. It is systemd's default for services, but writing it down makes the lifecycle contract visible in review.

A service-level cgroup is a broad envelope. Every ordinary descendant remains under it, including terminal-tool subprocesses. There is one important escape hatch: a process with access to the user systemd manager can request a new sibling transient unit. That is another reason not to present cgroups as an adversarial sandbox. If you need to contain a hostile workload, remove that control path and use a real isolation boundary.

## Step 6: give one-shot jobs a smaller transient envelope

Not every build needs a persistent service file. `systemd-run` can create a transient service for one command, attach resource properties, pass its output through, wait, and return the child status.

```bash
unit="agent-test-$(date +%s)"

systemd-run --user \
  --unit="$unit" \
  --slice=agent-work.slice \
  --property=CPUQuota=150% \
  --property=MemoryHigh=4G \
  --property=MemoryMax=6G \
  --property=TasksMax=256 \
  --pipe --wait --collect \
  bash -lc 'python3 -m pytest -q --maxfail=20'
```

This is useful for scheduled maintenance, repository verification, and child-agent work dispatched outside a persistent gateway. It keeps the job inside the shared 28 GiB agent pool while adding a smaller six-gigabyte ceiling for that specific process tree.

For repeatable use, install `~/.local/bin/agent-run`:

```bash
#!/usr/bin/env bash
set -euo pipefail

if (( $# == 0 )); then
  echo "usage: agent-run COMMAND [ARG ...]" >&2
  exit 64
fi

unit="agent-job-$(date +%s%N)-$$"

exec systemd-run --user \
  --quiet \
  --unit="$unit" \
  --slice=agent-work.slice \
  --property="CPUQuota=${AGENT_CPU_QUOTA:-150%}" \
  --property="MemoryHigh=${AGENT_MEMORY_HIGH:-4G}" \
  --property="MemoryMax=${AGENT_MEMORY_MAX:-6G}" \
  --property="TasksMax=${AGENT_TASKS_MAX:-256}" \
  --pipe --wait --collect \
  "$@"
```

Then:

```bash
chmod 0755 ~/.local/bin/agent-run

agent-run python3 -m pytest -q

AGENT_CPU_QUOTA=250% \
AGENT_MEMORY_HIGH=8G \
AGENT_MEMORY_MAX=10G \
  agent-run npm run build
```

Pass the command as arguments, not as an interpolated string from untrusted model output. The wrapper is a resource-control mechanism, not a shell-escaping mechanism. Hermes should still classify and approve tools according to their real-world impact.

`--collect` unloads the transient unit after completion. That keeps the user manager tidy but means `systemctl show` cannot inspect the finished unit state later. Journald retains logs, and your orchestrator should persist its own structured execution record: unit name, command identifier, start/end time, exit status, timeout, and whether a result was produced. During debugging, omit `--collect` until you have inspected the unit.

## Step 7: verify the kernel received the policy

A green `systemctl start` only proves systemd accepted the unit syntax. Read the live control files.

Start a temporary command long enough to inspect:

```bash
systemd-run --user \
  --unit=agent-budget-smoke \
  --property=MemoryMax=512M \
  --property=CPUQuota=50% \
  --property=TasksMax=64 \
  sleep 60

cg=$(systemctl --user show agent-budget-smoke.service \
  -p ControlGroup --value)

systemctl --user show agent-budget-smoke.service \
  -p MemoryMax \
  -p CPUQuotaPerSecUSec \
  -p TasksMax

cat "/sys/fs/cgroup${cg}/memory.max"
cat "/sys/fs/cgroup${cg}/cpu.max"
cat "/sys/fs/cgroup${cg}/pids.max"

systemctl --user stop agent-budget-smoke.service
```

On systemd 255, that exact smoke test produced:

```text
MemoryMax=536870912
CPUQuotaPerSecUSec=500ms
TasksMax=64
memory.max=536870912
cpu.max=50000 100000
pids.max=64
```

That is the proof that matters. `512M` became 536,870,912 bytes, a 50% quota became 50,000 microseconds per 100,000-microsecond period, and the kernel's PID ceiling was 64.

For a persistent profile, inspect its whole tree:

```bash
unit=hermes-builder.service
cg=$(systemctl --user show "$unit" -p ControlGroup --value)
base="/sys/fs/cgroup${cg}"

printf 'memory.current='; cat "$base/memory.current"
printf 'memory.high=';    cat "$base/memory.high"
printf 'memory.max=';     cat "$base/memory.max"
printf 'pids.current=';   cat "$base/pids.current"
printf 'pids.max=';       cat "$base/pids.max"
printf '\nmemory.events\n'; cat "$base/memory.events"
printf '\ncpu.stat\n';      cat "$base/cpu.stat"
```

`memory.events` is especially useful. Rising `high` counts mean the job is repeatedly crossing the early-pressure threshold. A nonzero `oom` or `oom_kill` is not a mysterious model failure; it is an explicit capacity event. In `cpu.stat`, throttling counters show whether a quota is turning into queue latency.

For an interactive view:

```bash
systemd-cgtop "/user.slice/user-$(id -u).slice" \
  --depth=6 --order=memory
```

Monitor both the slice and each child service. A healthy parent total can still hide one profile consuming nearly all of the shared pool.

## Step 8: feed resource pressure back into the agent scheduler

Containment prevents host collapse. Scheduling prevents avoidable failures.

Before dispatching another local agent job, check:

```text
admit job only if:
  active_jobs < concurrency_limit
  AND agent_pool memory headroom > estimated job peak
  AND inference queue is below its latency threshold
  AND no cgroup reports recent oom_kill
```

The scheduler should not use an LLM to make this decision. Use deterministic telemetry and policy. A practical state record can look like:

```json
{
  "agent_slice_memory_current": 11811160064,
  "agent_slice_memory_high": 23622320128,
  "active_jobs": 3,
  "max_jobs": 4,
  "recent_oom_kills": 0,
  "inference_queue_depth": 1,
  "decision": "queue",
  "reason": "estimated 8 GiB job would cross MemoryHigh"
}
```

The exact estimate will be imperfect. Start by recording peak memory per command class: Python unit suite, browser test suite, Next.js build, Rust compile, repository index. Use a conservative percentile plus headroom. A known-wrong estimate that gets updated from telemetry is better than pretending every job has the same size.

The fallback policy should distinguish urgency:

```text
Is the job interactive?
├─ yes
│  ├─ local capacity available → run now in bounded unit
│  └─ unavailable
│     ├─ approved cloud path exists → route model call to cloud
│     └─ no cloud path → fail fast with queue/capacity evidence
└─ no, batch/cron
   ├─ capacity available → run in bounded unit
   └─ unavailable → queue with deadline; do not start optimistically
```

A cron job can wait for the local model. A chat request usually cannot. Resource controls should support an SLO, not become an excuse for unpredictable latency.

## What cgroups do not solve

The cleanest way to deploy this architecture is to be precise about its boundary.

| Failure or threat | cgroups help? | Required companion control |
|---|---:|---|
| Build consumes every CPU core | Yes | `CPUQuota`, `CPUWeight` |
| Test workers exhaust RAM | Yes | `MemoryHigh`, `MemoryMax`, scheduler estimate |
| Recursive subprocess creation | Yes | `TasksMax` |
| Agent reads `~/.ssh/id_ed25519` | No | filesystem sandbox, account separation, permissions |
| Prompt-injected tool contacts attacker URL | No | URL policy, egress allowlist, SSRF protection |
| Destructive command is authorized incorrectly | No | tool risk classes and approval gate |
| One Ollama request fills GPU VRAM | Usually no | model/context sizing, runtime concurrency, device placement |
| Agent asks user systemd to create a sibling scope | Not adversarially | remove manager access or use a stronger sandbox |
| Unavailable user I/O controller | No | delegate `io` correctly or use another boundary |

There is also no universal “safe” `TasksMax`. Python, Java, browsers, BLAS libraries, and model runtimes create threads aggressively. A low value can fail with `Resource temporarily unavailable` even when only a few Unix processes are visible. Measure task counts during a successful representative run, then add headroom.

Swap policy requires the same care. `MemorySwapMax=0` can protect latency but makes the hard boundary less forgiving. Allowing large swap can preserve completion while making an interactive agent miss every deadline. Choose based on workload class and monitor the result.

## A production rollout sequence

Do not apply tight limits to every profile at once. Roll out in stages:

1. **Inventory the process trees.** Map which Hermes profile launches which test/build/browser children and which local model endpoint it uses.
2. **Measure a representative week or build cycle.** Capture peak memory, task count, CPU time, inference working set, queue delay, and OOM events.
3. **Create slices with high ceilings first.** Confirm placement and accounting without changing behavior.
4. **Set `MemoryHigh` before a tight `MemoryMax`.** Observe reclaim pressure and latency.
5. **Add per-job transient units.** Start with noisy builds and parallel test suites.
6. **Add admission control.** Queue jobs that cannot fit instead of relying on the kernel to arbitrate.
7. **Tighten ceilings gradually.** Change one resource dimension at a time.
8. **Test failure reporting.** Force a harmless timeout or nonzero exit and verify the agent reports the real unit/command status rather than retrying blindly.
9. **Keep security controls separate.** Review filesystem, network, credential, and tool-approval boundaries independently.
10. **Re-measure after model or context changes.** A new quantization, larger context, browser upgrade, or test-worker count invalidates the old envelope.

The operational objective is not “no job ever hits a limit.” A limit that never constrains anything may be decorative. The objective is that overload becomes **local, explicit, and recoverable**: one job is throttled, queued, or failed with evidence while SSH, monitoring, inference, and the rest of the agent fleet remain alive.

## The engineering conclusion

Local AI infrastructure is a distributed system compressed into one Linux box. The planner, shell tools, test workers, browser processes, model server, GPU runtime, and operating system all share failure domains unless you deliberately separate them.

Agent concurrency limits are necessary but incomplete. Put workload classes in cgroup v2 slices. Give persistent Hermes profiles service-level ceilings. Launch one-shot work through bounded transient units. Verify the actual `cpu.max`, `memory.max`, and `pids.max` files. Feed pressure back into deterministic admission control. Keep GPU capacity and security policy as separate, explicit concerns.

The result is not glamorous. It is better: a machine that stays responsive when the agent makes an expensive decision, a local model that keeps serving when a build misbehaves, and an incident report with a unit name and a kernel counter instead of “the AI got weird.”
