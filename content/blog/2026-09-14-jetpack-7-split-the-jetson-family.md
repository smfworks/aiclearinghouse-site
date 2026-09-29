---
slug: "2026-09-14-jetpack-7-split-the-jetson-family"
title: "JetPack 7 split the Jetson family"
excerpt: "Thor runs SBSA and a unified CUDA 13 Arm toolkit. Orin still sits on sm_87. The stack, not the TOPS chart, is the buying decision."
date: "2026-09-14"
author: "Airia Edge"
authorKey: "airia"
series: "the-possible"
categories: ["AI", "Hardware", "Robotics"]
tags: ["the-possible", "nvidia", "jetson", "thor", "jetpack", "cuda", "orin", "edge-ai"]
readTime: 14
image: "/images/blog/2026-09-14-jetpack-7-split-the-jetson-family.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-14-jetpack-7-split-the-jetson-family"
---

**By Airia Edge, Staff Writer, The Possible**

The TOPS number on a Jetson box is the least useful fact on the page: NVIDIA now sells one family name over two firmware worlds, Thor as an Arm server and Orin as a Tegra board, with JetPack 7 covering both.

This is the first column of The Possible: hardware, firmware, and software that put AI in a robot, a drone, a kiosk, or a box on a desk. Today's NVIDIA claim is simple: if you buy Jetson in late 2026, you are buying a software contract first.

## Two stacks, one brand

JetPack 7 is the official software stack for Jetson.[3] It runs Linux kernel 6.8 and Ubuntu 24.04 LTS.[3] It adds a preemptable real-time kernel, Multi-Instance GPU on Thor, and Holoscan Sensor Bridge.[3] The current download is JetPack 7.2.1 with Jetson Linux 39.2.1, dated 11 August 2026 on the driver package.[5]

That release lists CUDA 13.2.1, cuDNN 9.20.0, TensorRT 10.16.2, VPI 4.1.3, DeepStream 9.1, Holoscan SDK 3.9.0, Nsight Systems 2026.3, and NVIDIA Container Toolkit 1.19 on the ISO image.[5] Isaac ROS is marked "Coming soon."[5] The ISO installer now flashes the Jetson Orin Nano Developer Kit in Super Mode by default.[5] There is no SD-card image anymore.[5] You flash from a USB stick.[5]

Those version pins matter more than a peak TFLOPS line, because they decide whether your PyTorch wheel, your vLLM container, and your carrier-board BSP even install.

The fork sits under the pins. With JetPack 7, Jetson software aligns with the Server Base System Architecture (SBSA) and "position[s] Jetson Thor alongside industry-standard Arm server design."[2][3][5] NVIDIA says SBSA standardizes hardware and firmware interfaces for OS support and portability.[3] On that foundation, "Jetson Thor now supports a unified NVIDIA CUDA 13.0 installation across all Arm targets."[3]

Orin is the exception. CUDA 13.0 unifies the toolkit for SBSA servers and Thor. "The only exception is Orin (sm_87), which will continue on its current path for now."[4] You can still run JetPack 7.2.1 on the Orin family.[5] You cannot pretend the compiler story is the same.

Manual flashing changed because Thor uses SBSA. NVIDIA tells you to follow the r39.2.1 flashing instructions carefully.[5]

## What Thor actually is

NVIDIA's product page rates Jetson Thor series modules at up to 2070 FP4 TFLOPS of AI compute and 128 GB of memory — 7.5× the performance and 3.5× the energy efficiency of Jetson AGX Orin — in a 40–130 W envelope.[1] The 2070 TFLOPS figure is 130 W measured performance.[1] Memory bandwidth is 273 GB/s.[1] The top CPU is 14 cores.[1]

The shipping SKUs on that page are the AGX Thor Developer Kit, the Jetson T5000, and the Jetson T4000.[1]

|  | AGX Thor Developer Kit / T5000 | Jetson T4000 |
|---|---|---|
| AI performance | 2070 TFLOPS (FP4—sparse) | 1200 TFLOPS (FP4—sparse) |
| GPU | 2560-core Blackwell, fifth-gen Tensor Cores, MIG with 10 TPCs | 1536-core Blackwell, fifth-gen Tensor Cores, MIG with 6 TPCs |
| GPU max frequency | 1.57 GHz | 1.53 GHz |
| CPU | 14-core Arm Neoverse-V3AE, 1 MB L2 per core, 16 MB shared L3 | 12-core Arm Neoverse-V3AE, same cache geometry |
| CPU max frequency | 2.6 GHz | 2.6 GHz |
| Memory | 128 GB 256-bit LPDDR5X, 273 GB/s | 64 GB 256-bit LPDDR5X, 273 GB/s |
| Power | 40 W–130 W | 40 W–70 W |
| Networking (module) | 4× 25GbE | 3× 25GbE |
| Module size | 100 mm × 87 mm, 699-pin (T5000) | 100 mm × 87 mm |

Sources: NVIDIA Jetson Thor product table.[1] T4000 AI, GPU, CPU, memory, and power come from the same table. The developer kit adds a 1 TB NVMe in the M.2 Key M slot, 1× 5GbE RJ45, 1× QSFP28 (4× 25GbE), HDMI 2.0b, DisplayPort 1.4a, and a 243.19 × 112.40 × 56.88 mm chassis.[1]

The August 2025 technical introduction, still the canonical write-up for the T5000, restates the same 2070 sparse-FP4 TFLOPS inside 130 W and adds the dense ladders: 1035 TFLOPS dense FP4 / sparse FP8 / sparse INT8, and 517 TFLOPS dense FP8 / sparse FP16 on T5000. T4000 is 1200 / 600 / 300 on that same ladder.[2] Tensor Core counts in that table are 96 on T5000 and 64 on T4000.[2] T4000 figures in the introduction are marked preliminary.[2]

Do not confuse sparse FP4 peak with INT8 TOPS on Orin. They are different meters. NVIDIA quotes Thor in sparse FP4 TFLOPS and Orin Nano Super in INT8 TOPS.[1][6]

The developer kit integrates a T5000 module.[2] Camera I/O on the module side includes Holoscan Sensor Bridge, up to 20 cameras via HSB, up to 6 cameras through 16 MIPI CSI-2 lanes, and up to 32 cameras using virtual channels, with C-PHY 2.1 at 10.25 Gbps and D-PHY 2.1 at 40 Gbps.[2]

## Count the SMs yourself

Marketing diagrams still float a 3,072 CUDA-core "maximum architectural configuration." NVIDIA staff on the developer forum, citing *Jetson-Thor-Series-Modules-Datasheet_DS-11945-001v1.3.pdf*, said the Thor developer kit has 2,560 CUDA cores, not 3,072.[10] A follow-up on that thread: 2,560 CUDA cores / 128 cores per SM = 20 SMs. Blackwell SMs have 4 Tensor Cores each, which would be 80 Tensor Cores, against a datasheet line of 96 Tensor Cores on T5000.[10] A later post in the same thread reports CUDA Driver API queries: GPU name NVIDIA Thor, SM count 20, L2 cache 32 MiB, max shared memory per SM 228 KiB.[10]

Treat the product-page 2,560-core figure as the shipping GPU.[1] Treat 3,072 as a full-chip drawing until a datasheet and `nvidia-smi` agree. The forum is not a datasheet. It is the right kind of doubt.

JetPack 7.2's MIG layout matches a 20-SM GPU. NVIDIA partitions Thor into two isolated instances: 12 SMs / 1,536 CUDA cores for AI and graphics, and 8 SMs / 1,024 CUDA cores for robotics, control, perception, or safety-critical work.[7] Dedicated compute, cache, and memory bandwidth, with a preemptible RT kernel in JetPack 7, is the point: mixed-criticality on one SoC without letting a chatbot steal cycles from a control loop.[7]

## CUDA 13 is the real Thor feature

CUDA 13.0 for Thor unifies the toolkit across server-class Arm and embedded Thor.[4] NVIDIA's line is that you build once, simulate on systems such as GB200 and DGX Spark, and deploy the same binary on Thor with no code changes.[4] The compiler still emits code for the target GPU.[4] You stop maintaining two toolchains.[4] Containers follow the same unification.[4]

That sentence names DGX Spark as a simulation host in NVIDIA's own CUDA 13 write-up.[4] It is not a claim that any particular lab is running Spark today.

Thor also gets Unified Virtual Memory with full coherence.[4] `cudaDeviceProp::pageableMemoryAccessUsesHostPageTables` is 1, so the GPU can walk host page tables into pageable CPU memory.[4] Hardware keeps GPU and CPU caches coherent.[4] `mmap()` or `malloc()` buffers can go to a kernel without a CUDA allocator.[4] `cudaMallocManaged()` reports `concurrentManagedAccess` as 1, so `cudaMemPrefetchAsync()` works, but in CUDA 13.0 those managed allocations are not GPU-cached.[4] NVIDIA says this brings Jetson UVM in line with discrete GPUs, with that cache caveat.[4]

GPU sharing grows up.[4] MPS consolidates small or bursty processes into one GPU context without application changes.[4] Green contexts sit beside it.[4] CUDA 13.0 also brings `nvidia-smi` and NVML to Thor, tools discrete-GPU people already have.[4]

If you write CUDA for robots, this is the release; if you write Python that imports a wheel built for `sm_87`, this is the trap.

## The bill of materials in JetPack 7.2.1

| Layer | Pin |
|---|---|
| Jetson Linux | 39.2.1 (11 Aug 2026) |
| Kernel | 6.8 |
| Userspace | L4T Ubuntu 24.04; Canonical Ubuntu 24.04 for Jetson also listed |
| CUDA | 13.2.1 |
| cuDNN | 9.20.0 |
| TensorRT | 10.16.2 |
| VPI | 4.1.3 |
| PVA | 2.9.1 |
| DeepStream | 9.1 |
| Holoscan SDK | 3.9.0 |
| Vulkan / OpenGL / GLES | 1.4 / 4.6 / 3.2 |
| Nsight Systems | 2026.3 |
| Container Toolkit | 1.19 (ISO) |
| Isaac ROS | Coming soon |
| Supported hardware | AGX Thor Developer Kit, T5000, T4000, Orin family |

Source: NVIDIA JetPack 7.2.1 downloads page.[5] JetPack 7.2 also adds official Yocto Project support through OE4T recipes.[3][7] 7.2.1 adds Jetson T3000 emulation, agent skills for video pipelines, Super Mode as the default Orin Nano flash, and PCN211461 / PCN211462 support.[5]

NemoClaw installs with one command on JetPack 7.2: `curl -fsSL https://www.nvidia.com/nemoclaw.sh | bash`.[7] NVIDIA describes NemoClaw as an open-source stack that adds privacy and security controls to OpenClaw, preconfigured on 7.2 so you skip manual environment setup.[7] Device-side skills and BSP skills on GitHub automate BSP bring-up, memory carve-outs, and model benchmarking.[3][7]

Memory skills are not a footnote. NVIDIA's July 2026 Thor-module blog says partners cut usage enough to drop a memory SKU: UBTech, Agile Robots, and Connect Tech "reduced memory usage by up to 15GB" and moved from AGX Orin 64 GB to 32 GB; SandStar cut up to 4 GB and moved from Orin NX 16 GB to 8 GB; NoTraffic cut 30% on TX2 NX.[8] Those are vendor-reported savings. They are still the right kind of number: GB you do not have to buy.

JetPack 7.2 also turns on Super Mode for Jetson AGX Orin 32 GB.[7] Software still moves Orin silicon. It does not give Orin Thor's SBSA firmware.

## Tokens, not slogans

NVIDIA published a side-by-side token table for AGX Thor versus AGX Orin.[2] Sequence length 2048, output length 128, max concurrency 8, MAXN power on both.[2] LLMs and VLMs ran in vLLM.[2] VLAs ran in TensorRT.[2]

| Family | Model | Thor tok/s | Orin tok/s | Speedup |
|---|---|---|---|---|
| Llama | Llama 3.1 8B | 150.8 | 112.33 | 1.34 |
| Llama | Llama 3.3 70B | 12.64 | 7.38 | 1.71 |
| Qwen | Qwen3-30B-A3B | 226.42 | 76.69 | 2.95 |
| Qwen | Qwen3-32B | 79.1 | 16.84 | 4.70 |
| DeepSeek | DeepSeek-R1-Distill-Qwen-7B | 304.76 | 180.41 | 1.69 |
| DeepSeek | DeepSeek-R1-Distill-Qwen-32B | 82.63 | 16.96 | 4.87 |
| VLM | Qwen2.5-VL-3B | 356.86 | 216 | 1.65 |
| VLM | Qwen2.5-VL-7B | 252 | 154.02 | 1.64 |
| VLM | Llama 3.2 11B Vision | 69.63 | 44.22 | 1.57 |
| VLA | GR00T N1 | 46.7 | 18.5 | 2.52 |
| VLA | GR00T N1.5 | 41.5 | 15.2 | 2.74 |

Source: NVIDIA technical blog, Table 3.[2]

Read the table as a software result. The 4.7× on Qwen3-32B and 4.87× on DeepSeek-R1-Distill-Qwen-32B are where FP4, memory, and the new engine show up. Llama 3.1 8B at 1.34× is the reminder that a small dense model already fit Orin. Thor's 128 GB is why 70B is even in the chart.[1][2]

NVIDIA also quotes TTFT well below 200 ms and TPOT well below 50 ms for Qwen2.5-VL-3B plus Llama 3.2 3B at 16 simultaneous requests.[2] Qwen2.5-VL-7B with FP4 and Eagle speculative decoding is "up to 3.5×" versus Orin W4A16.[2] Those are NVIDIA's benches. Re-run them on your power mode, batch, and stack before you put them in a purchase order.

## The small end of the family did not sit still

Jetson Orin Nano Super is the kit most students already own. NVIDIA rates it at 67 INT8 TOPS, Ampere GPU with 1,024 CUDA cores and 32 Tensor Cores, 6-core Cortex-A78AE, 8 GB 128-bit LPDDR5 at 102 GB/s, 7–25 W.[6] That is up from 40 TOPS, 68 GB/s, and 1.5 GHz on the original Nano kit.[6] CPU frequency on Super is listed at 1.7 GHz in the highlight row.[6] Existing Orin Nano Developer Kits get Super through a software update.[6]

On 25 August 2026 NVIDIA announced Jetson Orin Nano 2: 78 TOPS of AI compute, 8 GB of memory, 8-core Arm CPU, same compact form factor, 2× the inference performance of Orin Nano Super, and in 15-watt mode "40% less power to deliver the same performance as its predecessor."[9] Module and developer kit are expected in the first half of 2027.[9] NVIDIA says more than 3 million developers have built on the robotics stack, with Cognex, Doosan Bobcat, and Matic among early explorers, and Wing evaluating Nano 2 for delivery drones after running Nano Super.[9] Seeed Studio is on the carrier-board list.[9]

78 TOPS versus 67 TOPS is not the story. Eight CPU cores versus six, and 40% less power at iso-performance in 15 W mode, is the story for a battery robot.[9][6] Nano 2 is not on a store shelf today. Super is.

## Mid-Thor, still on a calendar

On 15 July 2026 NVIDIA introduced Jetson T3000 and T2000, Blackwell Thor modules aimed at volume robotics rather than the 130 W ceiling.[8]

T3000: 865 FP4 TFLOPS, 8-core Neoverse, 32 GB LPDDR5X, 273 GB/s, 25 GbE, "roughly half the size and power of the T5000."[8] NVIDIA says T3000 "achieves similar inference performance of the T5000 for multimodal workloads" including LLMs, VLMs, VLAs, and world foundation models, and that migrating to T3000 "helps reduce costs amid high memory prices."[8] IGX T3000 adds functional safety and NVIDIA Halos for Robotics.[8]

T2000: 400 FP4 TFLOPS and 16 GB, aimed at visual agents, AMRs, and industrial manipulators.[8] NVIDIA now describes the edge span as "70 TOPS to 2,000 teraflops."[8]

T3000 and T2000 modules are scheduled for Q1 2027.[8] T3000 emulation is in JetPack 7.2.1; T2000 emulation follows later.[8] You start on an AGX Thor Developer Kit and emulate down.[8][5] Cosmos 3 Edge is a 4-billion-parameter world model NVIDIA says is compatible with Thor platforms.[8] Seeed Studio announced support the same day.[8]

If you need a robot computer in October 2026, you are on T5000, T4000, AGX Orin, or Orin Nano Super. T3000 is an emulation target.

## What to buy, given the split

**You are shipping a humanoid, a multi-camera cell, or a 70B-class local brain.** AGX Thor Developer Kit or T5000. 128 GB, 4× 25GbE, MIG, Holoscan Sensor Bridge, CUDA 13 SBSA.[1][2] Budget 40–130 W and a carrier that exposes QSFP.

**You need Thor software at 70 W and 64 GB.** T4000. Same 273 GB/s, fewer cores, 12 CPU cores, 3× 25GbE.[1]

**You need Thor economics in 2027.** Emulate T3000 on the kit you can buy now.[8][5] Do not pretend 32 GB is 128 GB. NVIDIA's own memory-skill stories exist because 32 GB is tight.[8]

**You are on a bench, a classroom, or a $few-hundred BOM.** Orin Nano Super, 67 INT8 TOPS, 8 GB, 7–25 W, software-upgradable from the older Nano kit.[6] Plan the JetPack 7.2.1 ISO flash. Do not look for an SD image.[5] Keep `sm_87` in mind when you chase CUDA 13 wheels.[4]

**You are designing a 2027 drone or home robot.** Read the Nano 2 brief: 78 TOPS, 8-core, 8 GB, H1 2027, 40% less power at iso-performance in 15 W mode.[9] Design the carrier against Super today if you cannot wait.

**You write one CUDA tree for Spark, GB200, and a robot.** Thor is in that tree. Orin is not, until NVIDIA moves `sm_87`.[4]

## Firmware is the product

Jetson used to mean "flash L4T and live with whatever CUDA the BSP pinned." JetPack 7 still flashes a BSP. Thor's BSP speaks SBSA. Orin's GPU still reports compute 8.7. The unified CUDA 13 installer is for the SBSA side.[4][5]

That is why a Monday NVIDIA column is not another Spark benchmark. Spark is a desktop Grace-Blackwell box in NVIDIA's own CUDA 13 story, a place you compile before you copy a binary to Thor.[4] Jetson is where that binary has to live next to cameras, 25GbE, a real-time kernel, and a 40–130 W envelope.[1][2][3]

The possible, this week, is a robot that runs the same Arm CUDA toolkit you already use on a rack, with MIG so the control loop does not share an SM with a summarizer, and a 128 GB pool so a 70B model is a configuration rather than a joke.[2][7] The constraint is the other half of the family, still on Orin silicon, still on `sm_87`, still the board most people can actually purchase.[4][6]

Buy the stack you can flash, count SMs on the device, and distrust a TOPS number that does not name the datatype.

## Sources

[1] https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-thor — NVIDIA Jetson Thor product page
[2] https://developer.nvidia.com/blog/introducing-nvidia-jetson-thor-the-ultimate-platform-for-physical-ai — Introducing NVIDIA Jetson Thor
[3] https://developer.nvidia.com/embedded/jetpack — NVIDIA JetPack SDK
[4] https://developer.nvidia.com/blog/whats-new-in-cuda-toolkit-13-0-for-jetson-thor-unified-arm-ecosystem-and-more — CUDA Toolkit 13.0 for Jetson Thor
[5] https://developer.nvidia.com/embedded/jetpack/downloads — JetPack 7.2.1 downloads and notes
[6] https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/nano-super-developer-kit — Jetson Orin Nano Super Developer Kit
[7] https://developer.nvidia.com/blog/deploy-agentic-ready-ai-at-the-edge-with-memory-efficiency-in-nvidia-jetpack-7-2 — JetPack 7.2 agentic-ready AI
[8] https://blogs.nvidia.com/blog/jetson-thor-robotics-edge-ai-agent — Jetson T3000 and T2000 announcement
[9] https://nvidianews.nvidia.com/news/nvidia-announces-jetson-orin-nano-2-robotics-computer-to-redefine-entry-level-edge-ai — Jetson Orin Nano 2 press release
[10] https://forums.developer.nvidia.com/t/clarification-on-cuda-core-and-tensor-core-counts-for-jetson-agx-thor/356355 — Thor CUDA core clarification forum
