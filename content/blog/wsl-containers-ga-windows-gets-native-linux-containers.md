---
slug: "wsl-containers-ga-windows-gets-native-linux-containers"
title: "WSL Containers Goes GA: Windows Gets a First-Party Linux Container Runtime"
excerpt: "Microsoft shipped WSL Containers as generally available on September 29. With wslc.exe, a Containers API, Intune governance, and a new networking stack, Windows now has a first-party Linux container runtime - no Docker Desktop required. Here is what full-stack developers need to know."
date: "2026-10-02"
author: "Wesley Williams"
authorKey: "wesley"
series: "clearinghouse"
categories: ["Windows", "Containers", "Developer Tooling"]
tags: ["wsl", "wslc", "containers", "windows", "docker", "devcontainers"]
readTime: 14
image: "/images/blog/wsl-containers-ga-windows-gets-native-linux-containers.png"
---

On September 29, 2026, Microsoft announced that WSL Containers is now generally available. A simple `wsl --update` gets you `wslc.exe` — a first-party CLI for building, running, and managing Linux containers on Windows — plus the WSL Containers API for programmatic control from native Windows applications. This is not a preview or a roadmap promise. It shipped.

For full-stack developers who have been installing Docker Desktop or hand-configuring Docker Engine inside a WSL distro, this is a meaningful change. Microsoft has put a container runtime directly into WSL, managed by the same Windows team that maintains the subsystem, with enterprise governance via Intune and Defender for Endpoint. Let us break down what actually shipped, how the architecture differs from regular WSL, and where the gaps still are.

## What Shipped: wslc CLI and the Containers API

The GA release delivers two primary components ([Windows Developer Blog, Sept 29 2026](https://blogs.windows.com/windowsdeveloper/2026/09/29/wsl-containers-now-generally-available/)):

**WSL Containers CLI (`wslc.exe`):** A command-line tool for end-to-end container workflows. It ships with an alias `container.exe`, and if you know Docker, the commands feel familiar:

```bash
wslc run --rm -it ubuntu:latest
wslc image ls
```

The GA release added several commands since public preview:

- `wslc container restart` — restart a running container
- `wslc container cp` — copy files in and out via tar archive
- `wslc system info` — see the state of your container environment at a glance
- `wslc network connect` and `wslc network disconnect` — attach and detach containers from networks
- `wslc events` — stream real-time container activity
- Container health checks
- `--stop-timeout` on `wslc create` and `wslc run` (including `-1` for infinite timeout)
- `--mount` support during `wslc create` and `wslc run`
- A configurable storage path for the default session

**WSL Containers API:** A NuGet package (`Microsoft.WSL.Containers`) with C# and C++/WinRT projections that lets native Windows apps create and control Linux containers programmatically. It supports stdin/stdout, file mounts, networking, and GPU access. This opens up scenarios like embedding Linux container workloads — including local AI inference — directly into Windows applications without the user ever needing to know Linux is involved ([Microsoft Learn: WSL container](https://learn.microsoft.com/en-us/windows/wsl/wsl-container)).
## How WSL Containers Differ from Regular WSL

This is where it gets architecturally interesting. Pierre Boulay, a Senior Software Engineer at Microsoft, published an [architecture deep dive](https://devblogs.microsoft.com/commandline/wslc-architecture-deep-dive/) on the same day as the GA announcement. The key difference is in process ownership.

In regular WSL, applications talk to `wslservice.exe`, a privileged Windows service that creates and manages the virtual machine. For WSL Containers, `wslservice.exe` creates the VM but does not keep ownership. Instead, it spawns a child process called `wslcsession.exe` that runs on behalf of the user and handles container creation, directory mounting, and network port binding ([WindowsLatest, Oct 1 2026](https://www.windowslatest.com/2026/10/01/microsofts-then-ceo-called-linux-a-cancer-and-now-windows-11-ships-linux-containers-with-upgraded-wsl/)).

This gives each session stronger isolation (sessions live in separate processes) and tighter security (session operations run with fewer privileges than `wslservice.exe`). Each session gets its own VHD, stored under `%AppData%\\Local\\wslc\\sessions`.

### File System Performance: virtiofs vs Plan9

One of the most common WSL pain points has been cross-OS file performance — accessing Windows files from Linux. Regular WSL distros use the Plan9 protocol to share your C: drive into the VM. WSL Containers uses virtiofs instead, and Boulay claims it is “about twice as fast” as Plan9 ([WindowsLatest](https://www.windowslatest.com/2026/10/01/microsofts-then-ceo-called-linux-a-cancer-and-now-windows-11-ships-linux-containers-with-upgraded-wsl/)). Containers that need a native Linux filesystem or a size limit can use VHD-backed volumes. Microsoft also notes up to 2x faster performance accessing Windows files from Linux environments with wslc ([Windows Developer Blog](https://blogs.windows.com/windowsdeveloper/2026/09/29/wsl-containers-now-generally-available/)).

### Networking: Consomme Mode

The GA release introduces a new networking mode called “Consomme.” Under Consomme, all traffic from the Linux VM goes as Ethernet frames into a virtio queue. A Windows process running as the user handles DNS queries, TCP/UDP routing, and port mapping. Because the traffic leaves the system as if a regular Windows process sent it, it plays far better with VPNs and firewalls — a long-standing headache for WSL users ([WindowsLatest](https://www.windowslatest.com/2026/10/01/microsofts-then-ceo-called-linux-a-cancer-and-now-windows-11-ships-linux-containers-with-upgraded-wsl/)).

WindowsLatest tested this during the preview in July 2026: a Flask service running in a container was reachable at `127.0.0.1:5000` from Windows with no extra networking setup. Consomme is enabled by default for container workflows.
## What “Native” Actually Means

Let me be precise here, because the research brief’s suggested headline (“WSL Ditches the Hyper-V Layer”) would have been misleading. Craig Loewen, Principal Product Manager at Microsoft, clarified on X that “native” does not mean these containers run on the Windows kernel. They run on a Linux kernel inside WSL’s virtual machine infrastructure ([WindowsLatest](https://www.windowslatest.com/2026/10/01/microsofts-then-ceo-called-linux-a-cancer-and-now-windows-11-ships-linux-containers-with-upgraded-wsl/)). The architecture change is about process ownership and session isolation, not about removing the virtualization layer. The VM is still there — what changed is how the container session is managed and secured within it.

## Enterprise Readiness: Intune and Defender

The GA release brings container workflows under the same governance frameworks that enterprises already use for WSL:

**Microsoft Intune** can now enable or disable the WSL Containers feature and restrict image pulls to an approved registry allow list. New Intune settings include “Allow WSL containers access” and “WSL containers registry allow list” ([Windows Developer Blog](https://blogs.windows.com/windowsdeveloper/2026/09/29/wsl-containers-now-generally-available/)).

**Microsoft Defender for Endpoint** (MDE) has extended its WSL plugin to cover containers. It can surface process, file, and network activity from WSL containers and connect that activity back to the Windows host, so security teams investigate suspicious container activity without a separate workflow ([Windows Developer Blog](https://blogs.windows.com/windowsdeveloper/2026/09/29/wsl-containers-now-generally-available/)).

## Editor and Tooling Integration

The ecosystem is moving quickly. At GA, the following integrations are live:

- **VS Code Dev Containers** — `wslc` can be used as the container driver ([devcontainers/cli changelog](https://github.com/devcontainers/cli/blob/main/CHANGELOG.md#0880))
- **Aspire** — Microsoft’s .NET orchestration framework can use WSL Containers as a first-class container runtime ([aspire.dev](https://aspire.dev/))
- **VS Code Containers extension** — the popular container management extension now supports `wslc` ([v1.1.0 release](https://github.com/microsoft/vscode-containers/releases/tag/microsoft-vscode-container-client-v1.1.0))
- **Lazywslc** — a TUI dashboard for managing WSL containers ([GitHub](https://github.com/craigloewen-msft/lazywslc))
- **WSL Container Desktop** — a WinUI 3 desktop app for managing containers, k3s, and registries ([GitHub](https://github.com/mhackermsft/wslcontainerdesktop))

There are rough edges. WindowsLatest reported that even after switching from the pre-release to release version of the Dev Containers extension, a user hit a “docker command not found” error. Loewen said setup “should be as simple as just setting ‘wslc’ as your chosen binary in your settings,” but some troubleshooting may still be needed ([WindowsLatest](https://www.windowslatest.com/2026/10/01/microsofts-then-ceo-called-linux-a-cancer-and-now-windows-11-ships-linux-containers-with-upgraded-wsl/)).
## What is Still Missing

GA does not mean feature parity with Docker. The gaps that matter for full-stack developers:

**No `wslc compose` yet.** This is the top feature request. Microsoft’s goal is for `wsl compose up` to work with existing `compose.yaml` files unchanged. It is actively in development and tracked in [GitHub issue #40948](https://github.com/microsoft/WSL/issues/40948). Until it lands, you are starting containers one at a time, which is painful for multi-service projects (web frontend, API, database, cache).

**No `--privileged` support.** A user reported this forced them back to Docker for `kind` and `k3d` Kubernetes clusters. Loewen confirmed it is coming soon and already in the main branch, heading to preview ([WindowsLatest](https://www.windowslatest.com/2026/10/01/microsofts-then-ceo-called-linux-a-cancer-and-now-windows-11-ships-linux-containers-with-upgraded-wsl/)).

**Building/pushing from inside a WSL distro.** Loewen pointed to `wslc-remote`, a community wrapper he wrote, but noted there are “a lot of nasty edge cases” so it remains a community project rather than a first-party feature ([GitHub: wslc-remote](https://github.com/craigloewen-msft/wslc-remote)).

## Platform Availability

WSL Containers works anywhere WSL is supported, including Windows 10 and Windows Server. Loewen confirmed on X that it is supported in production on Windows Server ([WindowsLatest](https://www.windowslatest.com/2026/10/01/microsofts-then-ceo-called-linux-a-cancer-and-now-windows-11-ships-linux-containers-with-upgraded-wsl/)). This matters: it is not gated to Windows 11 26H2.

## What This Means for Full-Stack Developers

Here is my practical read as someone who develops on Windows every day:

**For single-container dev workflows**, `wslc` is now a viable first-party option. If you are running a single service or a dev container, `wsl --update` and `wslc run` may be all you need. The Consomme networking mode solves the VPN/firewall issues that have plagued WSL networking, and virtiofs materially improves cross-OS file performance.

**For multi-container projects**, you still need Docker Desktop or Docker Engine in a WSL distro. The lack of `wslc compose` is the blocker. When `wsl compose up` ships and runs existing compose files unchanged, that is the day many developers can consider uninstalling Docker Desktop. That day is not today, but it is visibly on the roadmap.

**For embedding Linux containers in Windows apps**, the Containers API is the interesting piece. A .NET application can now programmatically spin up a Linux container — for local AI inference, for example — without the user installing Docker. That is a genuinely new capability that was not available before.

**For enterprise teams**, the Intune and Defender integration is the story. Registry allow lists and Defender monitoring mean WSL Containers can be deployed under the same governance as the rest of your Windows fleet. This removes a real adoption barrier for organizations that could not allow Docker Desktop but can allow a Microsoft-managed container runtime.

## The Broader Picture

Microsoft’s framing is that Linux on Windows is evolving “beyond a development environment into a strategic execution platform for AI and cloud-native workloads” ([Windows Developer Blog](https://blogs.windows.com/windowsdeveloper/2026/09/29/wsl-containers-now-generally-available/)). The data supports this: WindowsLatest reports that Ubuntu is growing faster on Windows 11 than on native Linux PCs, and Google is bringing native Windows 11 and WSL support to its new AI tools ([WindowsLatest](https://www.windowslatest.com/2026/10/01/microsofts-then-ceo-called-linux-a-cancer-and-now-windows-11-ships-linux-containers-with-upgraded-wsl/)).

WSL Containers at GA is not a Docker Desktop replacement today — but it is a credible first-party foundation that will get there. The architecture decisions (per-user session processes, virtiofs, Consomme networking, Intune governance) are sound. The roadmap (compose, privileged) targets the right gaps. For now, `wsl --update` and try it on your next single-container project. The multi-container switch will come when compose does.
