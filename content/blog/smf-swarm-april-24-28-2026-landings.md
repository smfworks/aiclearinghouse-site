---
slug: "smf-swarm-april-24-28-2026-landings"
title: "SMF Swarm: From v1.4.1 to v1.7.2 — Five Releases in Five Days"
excerpt: "Five releases. Conformal prediction. FastAPI server mode. Benchmark harness. MAPIE v1.3 fixes. Full Windows support. What we shipped in the last five days, and what it means for SMF Swarm users."
date: "2026-04-28"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["SMF Swarm", "Release Notes"]
tags: []
readTime: 8
originalUrl: "https://smfworks.com/blog/smf-swarm-april-24-28-2026-landings"
canonicalUrl: "https://www.smfclearinghouse.com/blog/smf-swarm-april-24-28-2026-landings"
---
# SMF Swarm: From v1.4.1 to v1.7.2 — Five Releases in Five Days

If you've been watching the SMF Swarm repo, you know it's been a productive week. Five releases in four days. Each one adds something material. None of them are cosmetic.

Here's the changelog nobody asked for but everyone gets.

---

## v1.4.1 — LangGraph Stability (Apr 24)

The LangGraph backend (introduced in v1.4.0) hit a breaking change: `StateGraph.compile()` dropped the `retry=` kwarg. SMF Swarm's `pipeline_langgraph.py` was still passing it, which meant the LangGraph path was dead on arrival for anyone on the latest version.

**Fix:** Removed the deprecated kwarg. Also patched four auto-generated test bugs (missing `import pytest`, wrong `draw_mermaid()` call, a MagicMock attribute collision, and an incorrect unknown-node timing assertion). Test suite went green.

This is the kind of release that doesn't look impressive on a feature list but is exactly what you want your engineering team to prioritize when a dependency breaks behavior. Ship clean, ship fast.

---

## v1.5.0 — The Benchmark Release (Apr 25)

This was the first release that let SMF Swarm prove its own predictive performance against ground-truth data.

### What's New

- **Benchmark Harness** — `smf-swarm benchmark` CLI command. Runs SMF Swarm against canonical JSONL datasets and produces:
  - Brier score, Expected Calibration Error (ECE), Maximum Calibration Error (MCE)
  - Accuracy, precision, recall, F1 per prediction mode
  - Naïve baselines (Always 50%, historical base rate, LogReg TF-IDF)
  - Matplotlib reliability diagrams
  - JSON + Markdown report export

- **Dataset Fetcher** (`scripts/fetch_benchmark_data.py`) — Pulls resolved binary questions from:
  - Metaculus API v2 (with auth token support)
  - FiveThirtyEight MLB Elo CSVs (multi-URL fallback)
  - `--dummy` flag for synthetic test data

- **Hardware Environment Logger** (`scripts/log_hw_env.py`) — Records CPU, RAM, GPU, OS, Python version, and package manifest to JSON for reproducible benchmarking.

- **New extras**: `[benchmark]` (`matplotlib>=3.8.0`, `scikit-learn>=1.3.0`)

- **New tests**: 14 for `BenchmarkHarness`, 4 for CLI integration.

### Why It Matters

Without ground-truth validation, a prediction pipeline is indistinguishable from speculation. The benchmark harness gives SMF Swarm the ability to measure calibration — not just confidence scores, but whether those scores actually correspond to accuracy. This is the foundation for everything that follows.

---

## v1.6.0 / v1.7.0 — Conformal Prediction + FastAPI Server (Apr 27–28)

These two arrived back-to-back because they were developed on parallel branches and reconciled at HEAD.

### Conformal Prediction (`smf_swarm/conformal.py`)

Implemented split conformal prediction (Angelopoulos & Bates, 2023):

- `ConformalPredictor` class with `fit()`, `predict()`, and `predict_interval()`
- `ConformalInterval` dataclass: `low`, `high`, `margin`, `coverage_target`, `prediction_set`, `label`
- `coverage_score()` — empirical marginal coverage validation
- `adaptive_binning()` — per-bin local `q̂` with underpopulation fallback (min 5 samples)
- Optional MAPIE wrapper (`fit_mapie()`, `predict_mapie()`) via `[conformal]` extras

Conformal prediction gives SMF Swarm statistical guarantees on prediction intervals. Instead of "70% confident this resolves Yes," the model now produces: "Given our calibrated history, we expect 95% of predictions in this bin to fall within [55%, 82%]." That's a fundamentally different kind of output.

### FastAPI Server (`smf_swarm/server/`)

A full headless REST API for SMF Swarm:

- `POST /api/v1/predict` — async prediction queue (returns `job_id`)
- `POST /api/v1/batch` — parallel batch up to 100 items
- `POST /api/v1/benchmark` — queue benchmark runs
- `POST /api/v1/calibrate` — conformal calibration endpoint
- `GET /api/v1/jobs/{job_id}` — status & results
- `GET /api/v1/jobs` — list active jobs
- `DELETE /api/v1/jobs/{job_id}` — cancel queued/running job
- `GET /api/v1/health` — liveness probe (public)
- `GET /api/v1/config` — safe config subset
- `GET /api/v1/predict/stream/{job_id}` — SSE streaming

**Auth & Rate Limiting:** Optional Bearer token auth. Per-IP sliding-window rate limiting (default: 30 req/60s). CORS and TrustedHost middleware.

**CLI integration:** `smf-swarm server --host 0.0.0.0 --port 8080 --workers 4 --token <secret>`

**Job runner:** `ServerJobRunner` wraps existing `JobRunner` with batch, list, and cancel APIs.

**Tests:** 21 structural tests covering health, config, predict, batch, calibrate, benchmark, jobs, and rate limiting.

### What Changed

The server is production-grade. It's not a toy demo. It has proper Pydantic models, structured error codes, and dependency injection via FastAPI's `dependency_overrides`. The SSE streaming endpoint means you can connect a frontend and watch predictions resolve in real time. The auth layer means you can expose this to untrusted consumers without building a proxy.

The MAPIE v1.3 compatibility fix (tagged v1.7.0) updated conformal imports to use the new `SplitConformalClassifier`/`SplitConformalRegressor` classes with `prefit=True` + `conformalize()`, while falling back to legacy `MapieClassifier`/`MapieRegressor` for older installations. Also handled the new `(y_pred, y_ps)` return shape with 3D→2D squeeze.

---

## v1.7.1 — Version String Audit (Apr 28)

Six hardcoded `1.6.0` version strings were still in the codebase (server startup banner, lifespan log, health response, test assertions). Fixed to `1.7.0`. Minor, but in a library, version drift between the package metadata and runtime strings is the kind of bug that breaks integration tests and confuses users.

---

## v1.7.2 — Full Windows Support (Apr 28)

The missing piece of the platform puzzle.

### New Files

- **`install.ps1`** — PowerShell one-line installer. Auto-detects Python via `python`/`python3`/`py`. Handles `pip`/`pipx`. Suggests Ollama for Windows.
- **`install.bat`** — `cmd.exe` fallback for environments without PowerShell.

### Cross-Platform Paths

New module: `smf_swarm/platform_paths.py`

- `default_cache_dir()` → `%LOCALAPPDATA%\SMF-Swarm\Cache` (Windows) or `~/.cache/smf-swarm`
- `default_config_dir()` → `%APPDATA%\SMF-Swarm` (Windows) or `~/.config/smf-swarm`
- `default_data_dir()` → `%LOCALAPPDATA%\SMF-Swarm\Data` (Windows) or `~/.local/share/smf-swarm`

Every module that previously hardcoded Unix paths (cache, backtest, RAG, config, benchmark fetcher, CLI) now routes through `platform_paths.py`.

### Windows Hardware Detection

- `_win32_mem()` — `ctypes.windll.kernel32.GlobalMemoryStatusEx()` for RAM detection (no `psutil` dependency)
- `_win32_vram()` — `wmic path Win32_VideoController get AdapterRAM` for GPU memory
- `_win32_gpu_name()` — `wmic path Win32_VideoController get Name` for GPU identification
- `_win32_cpu_name()` — `wmic cpu get Name` for CPU model name

`detector.py`, `log_hw_env.py`, and the profiler pipeline all now handle Windows natively.

### Documentation

README and all four docs files (SETUP, ARCHITECTURE, USAGE, ADAPTIVE_SCALING) updated to reference platform-appropriate paths and include the Windows PowerShell install one-liner.

### Verification

Full test suite: **102 passed, 13 skipped, 0 failures.**

---

## What This Sequence Means

Looking at the trajectory from v1.4.1 to v1.7.2, there's a clear progression:

1. **Stability** — Fix the LangGraph regression. Green tests.
2. **Measurement** — Add benchmarking. Know whether the pipeline actually works.
3. **Rigor** — Add conformal prediction. Statistical guarantees, not just confidence scores.
4. **Connectivity** — Add FastAPI server. Turn the pipeline into a service.
5. **Accessibility** — Add Windows support. Make it installable anywhere.

Each layer builds on the previous. You can't calibrate what you can't measure. You can't serve what you can't calibrate. You can't scale what you can't install.

SMF Swarm is now a cross-platform, benchmarked, conformally-calibrated, API-servable prediction engine. The pipeline that started as a single-threaded Python script in April is now something you can deploy to a server cluster, benchmark against real data, and trust on Windows workstations.

Next: SMF Predict commercial licensing. Benchmark the benchmark harness against real resolved questions. And keep making it faster.

If you're building with SMF Swarm, pull `v1.7.2` and run `smf-swarm test`. Everything else is downstream.

—Liam Hermes  
Chief Development Officer, The SMF Works Project  
April 28, 2026
