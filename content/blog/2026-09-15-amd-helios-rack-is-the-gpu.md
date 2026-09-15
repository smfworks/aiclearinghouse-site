---
slug: "2026-09-15-amd-helios-rack-is-the-gpu"
title: "AMD Helios made the rack the GPU"
excerpt: "Seventy-two MI455X accelerators, 31 TB of HBM4, and 260 TB/s of UALoE scale-up in one Open Rack Wide chassis. Helios is a blueprint OEMs build, not a card you drop in."
date: "2026-09-15"
author: "Airia Edge"
authorKey: "airia"
series: "the-possible"
categories: ["AI", "Hardware"]
tags: ["the-possible", "amd", "helios", "instinct", "mi455x", "cdna", "rocm", "epyc"]
readTime: 13
image: "/images/blog/2026-09-15-amd-helios-rack-is-the-gpu.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-15-amd-helios-rack-is-the-gpu"
---

**By Airia Edge, Staff Writer, The Possible**

Monday's column was a Jetson you can flash. Today's AMD claim is larger and more inconvenient: the GPU you are buying is a double-wide rack.

AMD Helios is 72 Instinct MI455X accelerators, 18 sixth-generation EPYC "Venice" CPUs, and Pensando networking in one Open Rack Wide chassis.[3][6] Peak numbers on the product page are 2.9 exaFLOPS of OCP MXFP4, 1.4 exaFLOPS of FP8, 31 TB of HBM4, 260 TB/s of scale-up bandwidth, and 43 TB/s of scale-out.[6] Those figures describe a system, not a card.[6]

The FAQ on the same page is the sentence procurement teams skip: Helios "is a reference design, not a product for sale."[6] OEMs and ODMs build the branded box.[6] Volume deployments were expected in the second half of 2026.[6] OpenAI told AMD it expects Helios online beginning in the fourth quarter of 2026.[3] That is the buying window this column is written for.

## The unit of engineering moved up a level

For a decade the AI purchase was an accelerator SKU. You counted cards, then nodes, then NVLink domains. Helios inverts the order. AMD's own planning note from Advancing AI 2026 says the rack itself is the unit of engineering: compute, networking, cooling, and software designed as one system from the start.[4]

That is not poetry. A Helios compute tray carries four MI455X modules, a Venice host CPU, Pensando "Vulcano" AI NICs, Infinity Fabric between CPU and GPU, and a Pensando Salina DPU for front-end offload.[6] Four scale-up cartridges stitch 72 GPUs into one UALoE domain.[6] Liquid coolant arrives through quick-disconnects.[6] Power rides a vertical busbar.[6] You do not cable this together from a parts list after the PO clears.[6]

Meta submitted the Open Rack Wide form factor to the Open Compute Project in 2025.[11] Earlier OCP racks were single-wide and aimed at general-purpose servers.[6][11] ORW is double-wide, built for high-density AI, higher power, liquid cooling, and wider trays.[6][11] AMD says Helios is the first full rack built on that standard.[6]

Open standards do not make the rack cheap. They make the rack copyable. UALink, UALink over Ethernet, Ultra Ethernet Consortium scale-out, and ORW are the names AMD puts on that bet.[6] The competing closed stack is NVIDIA's Vera Rubin NVL72, which AMD cites throughout its Helios math.[2] Treat those comparisons as AMD Performance Labs calculations on peak theoretical figures and modeled token rates, not as a bake-off you can reproduce in a lab this morning. AMD's own Helios launch footnotes say some measurements used pre-production or reference hardware and "do not represent a commitment regarding final specifications."[2]

## What sits on each tray

The engine is the Instinct MI455X, launched 23 July 2026, built on CDNA 5.[7] AMD's spec sheet is unusually complete. Quote it as written.

| Spec | MI455X |
|---|---|
| Architecture | CDNA 5 |
| Lithography | TSMC 2 nm \| 3 nm FinFET |
| Transistors | 320 billion |
| Work Group Processors | 256 |
| Peak engine clock | 2400 MHz |
| Peak OCP MXFP4 | 40.3 PFLOPs |
| Peak OCP MXFP6 / MXFP8 / FP8 | 20.1 PFLOPs |
| Peak matrix FP16 / BF16 | 5 PFLOPs |
| Peak matrix FP16 / BF16 with structured sparsity | 10.1 PFLOPs |
| Peak vector FP16 / FP32 | 315 TFLOPs |
| Peak matrix / vector FP64 | 5 TFLOPs |
| Peak INT8 matrix | 5 POPs |
| HBM4 | 432 GB, 12 stacks |
| Peak memory bandwidth | 23.3 TB/s |
| L2 cache | 192 MB |
| Form factor | Enhanced Accelerator Module |
| Scale-up (UALoE, bidirectional) | 3.6 TB/s |
| Scale-out (UALink, bidirectional) | 600 GB/s |
| Cooling | Direct liquid cooling |

Source: AMD Instinct MI455X product specifications.[7]

CDNA 5 is the architecture under that table. AMD lists eight CDNA 5 compute chiplets, Wave32 execution, MXFP8 / MXFP6 / MXFP4 with block-scale 16/32, two I/O dies with PCIe 6 or three AMD AI NICs, Infinity Fabric at 256 GB/s bidirectional on-package, 36 UALoE links (×2) per GPU EAM, and two fabric-and-cache dies with a 192-channel HBM4 interface.[5] Packaging is CoWoS-L with 3D hybrid-bonded compute dies.[5]

Two numbers on AMD's own pages disagree if you read carelessly. The dedicated MI455X sheet and the Helios rack table both list 23.3 TB/s of peak memory bandwidth per GPU.[6][7] The Helios compute-tray blurb still prints 19.6 TB/s, and the October 2025 OCP blog used 19.6 TB/s for the then-named MI450 series as an engineering projection.[6][11] Use 23.3 TB/s from the current spec sheet.[7] Treat 19.6 as a leftover projection unless a later datasheet restores it.[11]

The 260 TB/s scale-up figure is a rack aggregate, not a per-GPU miracle.[6][7] Each MI455X advertises 3.6 TB/s bidirectional UALoE.[7] Seventy-two times 3.6 TB/s is 259.2 TB/s, which is the 260 TB/s AMD prints on the Helios page.[6] The switch tray carries two 512-lane 200G UALoE switch ASICs, 216 UALoE (×2) active links per ASIC, and 21.6 TB/s bidirectional per switch.[6]

## The rack, as a bill of materials

| Helios rack | AMD's published figure |
|---|---|
| GPUs | 72 × Instinct MI455X |
| Host CPUs | 18 × 6th Gen EPYC "Venice" 9006 |
| Peak OCP MXFP4 | 2.9 exaFLOPS |
| Peak FP8 | 1.4 exaFLOPS |
| HBM4 | 31 TB |
| Memory bandwidth (per GPU) | 23.3 TB/s |
| Aggregate HBM bandwidth | up to 1.67–1.7 PB/s (AMD pages print both 1.67 and 1.7) |
| Scale-up | 260 TB/s UALoE |
| Scale-out | 43 TB/s Ethernet / Pensando |
| Scale-up cartridges | 4 |
| GPUs per compute tray | 4 |
| Cooling | Liquid, quick-disconnect |
| Power distribution | Vertical busbar |
| Rack standard | OCP Open Rack Wide (double-wide) |

Sources: Helios product page and MI400 series page.[1][6]

72 × 432 GB is 31,104 GB, which is the 31 TB AMD advertises.[6] 72 × 40.3 PFLOPs MXFP4 is 2.90 exaFLOPS.[6][7] The arithmetic is clean. The workload is not. Those are peak theoretical matrix rates on OCP MX datatypes.[1][6] AMD's Helios-versus-Vera-Rubin claim of "up to 15% more AI compute, 50% more HBM capacity and 50% more scale-out bandwidth" is an AMD Performance Labs calculation dated June–July 2026, not a third-party measurement.[2]

On DeepSeek-V4-Flash, AMD says MI455X delivers up to 34× higher token throughput at high interactivity and up to 18× lower token cost versus MI355X.[2] On Kimi K2 Thinking with a 32K input and 8K output, modeled Helios throughput per GPU is up to 15% higher at low interactivity, 12% at medium, and 10% at high interactivity than modeled Vera Rubin NVL72.[2] The tokens-per-dollar headline is "up to 30% more" versus that same NVIDIA rack, again from AMD estimates using projected hourly GPU pricing.[2][3] Read the footnotes before you put any of those ratios in a budget.

## The CPU is no longer a host footnote

Helios pairs those 72 GPUs with 18 Venice CPUs.[3] AMD's Helios tray copy lists Venice as Zen 6, up to 256 cores, 1.6 TB/s of memory bandwidth, and PCIe Gen 6 to the GPUs.[6] The Helios launch infographic also prints "96 high-frequency cores" on the host layer.[2] Those are different SKUs in the same 9006 family, not a contradiction you should flatten.[10]

The 9006 series is split on purpose. EPYC 9006 SP7 is the density part: up to 256 cores and 512 threads, with high-frequency configurations up to 5 GHz that AMD also sells as AI host nodes.[10] EPYC 9006 SP8 is the efficiency part: 8 to 128 cores for edge sites, power-constrained racks, and general-purpose servers.[10] EPYC 9006X SP7 triples L3 cache per core versus SP7 and reaches 5.15 GHz on some variants for HPC and in-memory work.[10] EPYC 9006 LP, formerly "Verano," is the LPDDR host-node CPU AMD describes as purpose-built for accelerator-rich racks.[10]

AMD's infrastructure note is the useful one: size the CPU layer to the workflow first, then size the GPU layer to the model.[4] An agent that plans, calls tools, hits a database, and loops still spends a lot of that loop on general-purpose cores.[4][10] A Helios rack that starves 72 MI455X modules for host bandwidth is an expensive heater.[4]

## Three GPUs, three buying problems

The MI400 series is not one chip sold three ways. AMD split the family by job.[1][4]

**MI455X** is the Helios GPU. Frontier training, fine-tuning, and high-volume inference. 432 GB HBM4, 40.3 PFLOPs MXFP4, direct liquid cooling, EAM form factor.[7] It is not a PCIe card you drop into last year's 8-GPU box.[7]

**MI430X** is the HPC and sovereign-AI GPU. Same 432 GB HBM4 and 23.3 TB/s, but the headline number is 288 TFLOPS of hardware FP64, with 9.2 PFLOPs of FP4 on the side.[8] AMD estimates 8.7× the peak hardware FP64 of NVIDIA Vera Rubin on that vector number, as an engineering projection dated July 2026.[8] Availability is 2027.[8] The next U.S. DOE / Oak Ridge Discovery system and two European machines, Alice Recoque and Herder, are expected to ship with it.[8]

**MI350P** is the enterprise retrofit. AMD positions it as air-cooled silicon that fits existing server power and cooling, and claims up to 4.2× more tokens per second per dollar than "the competition" on a Llama 3.3 70B Instruct FP8 serving test against an NVIDIA H200 NVL, with a separate RTX PRO 6000 configuration in the same footnote.[3][4] That is a different purchase from Helios. Do not let a rack-scale brochure talk you out of a PCIe refresh if your floor cannot take ORW and a busbar.

A fourth name appears on older AMD pages: MI440X, in die photography next to MI430X and MI455X.[1] AMD has not published a standalone MI440X spec sheet comparable to the MI455X page. Do not assign it TOPS.

## Firmware, fabric, and the software you actually run

Helios scale-up is UALink over Ethernet.[6] Helios scale-out is Ethernet with Pensando "Vulcano" AI NICs at 800 Gbps, PCIe Gen 6, OCP form factors, and UALink toward CPU and GPU.[6] The Salina DPU on the tray is P4-programmable, with 16 Arm N1 cores, and AMD assigns it networking, storage, and security offload for front-end connectivity.[6] Hardware root of trust, continuous attestation, encrypted memory and interconnects, and multi-tenant isolation are on the Helios feature list.[6] Those are claims about the reference design.[6] What an OEM ships is the OEM's problem.

The software contract is ROCm.[9] AMD says PyTorch, TensorFlow, JAX, ONNX Runtime, vLLM, SGLang, and Triton have Day-0 support on Helios, and that PyTorch, Hugging Face, vLLM, and SGLang were already enabled on MI455X at Advancing AI.[3][6][9] Distributed execution uses RCCL, with KV-cache work and compute/communication overlap called out for exaFLOP-class scale.[1]

ROCm 10 is the current named stack. AMD released it as the tenth year of the software, and made ROCm.AI generally available: Hyperloom for agentic kernel and host optimization, AMD Skills for Claude Code / Cursor / Codex, and a ROCm CLI as a technology preview.[12] On MI355X hardware, AMD reports an average 3.3× inference improvement and 2.4× training improvement for a ROCm.AI-configured system versus ROCm 7 — measured on GLM-5, Kimi-K2.5, and DeepSeek-R1-0528 for inference, and on Megatron-LM models for training.[12] That uplift is not an MI455X number.[12] Do not paste it onto Helios.

ROCm CLI, as previewed, is a prebuilt binary for Windows and Linux that does not require an existing ROCm install and manages side-by-side runtimes.[12] Adapters today support Lemonade on select client systems and vLLM on Instinct.[12] Official ROCm 10 support for that CLI is "coming soon"; the preview starts at ROCm 7.13.[12] If you are standing up a Helios-class cluster in Q4, pin the ROCm version your OEM validated, not the blog post.

## Who is actually taking a rack

The July 23 press release lists OpenAI, Anthropic, Meta, Microsoft, Oracle, HUMAIN, Tensorwave, Vultr, Cirrascale, and others as Helios choosers.[3] Systems are supposed to come from Bull, HPE, Lenovo, and Supermicro, with Sanmina and Wiwynn as infrastructure partners; Dell appears on the later takeaway list.[3][4]

Three named deployments matter more than the logo wall.

Anthropic and AMD described a partnership to deploy up to 2 gigawatts of MI455X GPUs in Helios racks, plus a multiyear engineering collaboration that uses Claude to accelerate ROCm development.[3]

OpenAI is optimizing GPT-class work on MI455X and Helios through Triton and ROCm, and "expects to bring Helios online beginning in the fourth quarter of 2026, with deployments accelerating throughout 2027."[3]

Meta is validating 6th Gen EPYC platforms in its labs and "has begun testing and validating workloads on AMD Helios racks" ahead of gigawatt-scale deployment.[3] The Helios product page also lists a Meta partnership to deploy 6 gigawatts of AMD GPUs.[6]

Those are customer statements on an AMD press page.[3] They are not a utilization report. Helios "now in production to be deployed … at gigawatt scale" is AMD's July 23 language.[3] The Helios FAQ still calls the thing a blueprint for partners, with volume in 2H 2026.[6] Both can be true: AMD is shipping the reference and silicon; the floor-ready rack has an OEM badge.

The roadmap behind Helios is annual. Instinct MI500 series and Helios 500 (EPYC "Verano" CPUs, Pensando "Como" and "Monza") are listed for 2027. Instinct MI600 and Helios 600 follow in 2028 with EPYC "Ferrara" and Pensando "Palma" / "Levanzo."[3] Zen 7 EPYC parts ("Florence," "Ferrara," "Fidenza") are 2028; Zen 8 "Ravenna" is 2030.[3] Plan a Helios buy as a generation, not a forever SKU.[3]

## What to do with this on a Tuesday

**You are a lab or a neocloud that already speaks ROCm on MI300X / MI350.** Treat Helios as the next scale-up domain, not as a new programming model.[6][9] Confirm UALoE, ORW floor loading, liquid cooling, and the OEM's ROCm pin.[6] Do not buy 72 GPUs as 72 PCIe cards.[6]

**You need FP64 and a national lab story.** Wait for MI430X in 2027, or stay on the MI300 / MI350 HPC path you already qualified.[8] Helios is the wrong brochure.

**You have air-cooled enterprise racks and a token bill.** Look at MI350P and the 9006 SP8 / SP7 split before you ask facilities for a double-wide liquid plant.[4][10]

**You write CUDA for NVIDIA and HIP for AMD.** The port is real and older than Helios. The new work is the fabric: RCCL over UALoE inside the rack, Ethernet scale-out between racks, and a host CPU that is doing agent sandbox work rather than idling.[1][9][10]

**You are comparing NVL72 and Helios on a slide.** Use AMD's own caveats. Peak MXFP4 versus dense NVFP4 is not the same datatype. Token-per-dollar uses projected hourly prices. Some Helios figures are modeled.[2] Ask the OEM for a measured ISL/OSL point on the model you serve.

Yesterday's Jetson column ended on firmware. This one ends the same way at a different scale. CDNA 5, UALoE, ORW, and ROCm 10 are the product. The 40.3 PFLOPs line is the advertisement. If you cannot name the switch ASIC, the busbar, and the ROCm pin, you are not buying Helios. You are buying a rendering of a rack.

## Sources

[1] https://www.amd.com/en/products/accelerators/instinct/mi400.html — AMD Instinct MI400 Series GPUs
[2] https://www.amd.com/en/blogs/2026/amd-launches-helios-the-highest-performing-rackscale-ai-infrastructure-solution.html — AMD Launches Helios rackscale AI
[3] https://ir.amd.com/news-events/press-releases/detail/1294/aai-2026-amd-delivers-full-stack-compute-for-the-agentic-ai-era — AAI 2026 AMD full-stack compute press release
[4] https://www.amd.com/en/solutions/data-center/insights/7-takeaways-from-amd-advancing-ai-2026.html — 7 Takeaways from AMD Advancing AI 2026
[5] https://www.amd.com/en/technologies/cdna.html — AMD CDNA Architecture
[6] https://www.amd.com/en/products/rackscale-solutions/helios.html — AMD Helios product page
[7] https://www.amd.com/en/products/accelerators/instinct/mi400/mi455x.html — AMD Instinct MI455X GPU specs
[8] https://www.amd.com/en/products/accelerators/instinct/mi400/mi430x.html — AMD Instinct MI430X GPUs
[9] https://www.amd.com/en/products/software/rocm.html — AMD ROCm Software
[10] https://newsroom.amd.com/news/aai-2026-6th-gen-epyc — AAI 2026 6th Gen EPYC newsroom
[11] https://www.amd.com/en/blogs/2025/amd-helios-ai-rack-built-on-metas-2025-ocp-design.html — Helios built on Meta 2025 OCP Open Rack
[12] https://newsroom.amd.com/news/rocm-10-software-ai-native-developer-experiences — AMD ROCm 10 newsroom
