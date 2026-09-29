---
slug: "2026-09-18-igx-thor-is-the-industrial-thor"
title: "The industrial Thor is not a Jetson"
excerpt: "IGX Thor is generally available: 2,070 FP4 TFLOPS on the iGPU, 5,581 with an RTX PRO 6000 Max-Q, and a 10-year support contract through April 2036. Same pinout as Jetson T5000. Different product."
date: "2026-09-18"
author: "Airia Edge"
authorKey: "airia"
series: "the-possible"
categories: ["AI", "Hardware"]
tags: ["the-possible", "nvidia", "igx", "thor", "holoscan", "halos", "industrial-ai", "medical-devices"]
readTime: 16
image: "/images/blog/2026-09-18-igx-thor-is-the-industrial-thor.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-18-igx-thor-is-the-industrial-thor"
---

**By Airia Edge, Staff Writer, The Possible**

Monday's column was a Jetson you flash. Thursday's was the humanoid that computer is supposed to walk around in. Friday's machine is the one a factory or a hospital is allowed to keep for a decade.

NVIDIA IGX Thor is generally available.[1][8] It is the same Blackwell SoC family as Jetson Thor.[1][2] It is not the same product. NVIDIA's own FAQ draws the line in one table: Jetson is the embedded edge market with up to five years of best-effort forum support. IGX is the industrial enterprise edge, with a 10-year option, a signed kernel, CVE patches on a support cycle, a Functional Safety Island, a safety MCU, a BMC, and NVIDIA Certified Systems.[3]

This column covers published architecture and specs. It is not medical advice, and it is not a claim that any named system is cleared for clinical use.

## Same pinout. Different contract.

Jetson T5000 and IGX T5000 are pin-, form-factor-, and function-compatible, so the same carrier board works for both.[2] Kernel, user space, and AI libraries share versions.[2] You can even run JetPack on IGX T5000 if you want the rolling stack on industrial silicon.[2][3]

That compatibility is the trap. Buy the Jetson if you are flashing robots in a lab and can live with forum support. Buy IGX if a regulator, an insurer, or a plant manager will ask who patches the box in 2032.

NVIDIA dates hardware availability for IGX T5000 and IGX T7000 through April 2036.[3] IGX Orin stays on the list until 2033.[1][3] NVIDIA AI Enterprise–IGX is optional on T5000 and mandatory on T7000 and the IGX Orin family.[3] The developer kits are for development; NVIDIA says the Mini "is not intended to be used as a scale production system."[3]

The GTC 2026 live blog called IGX Thor generally available and then hedged: developer kits from distributors now, "the IGX T5000 module for embedded systems with functional safety and IGX 7000 board kit for high-performance workstations will be available later."[8] The product page already lists IGX T5000 and IGX T7000 as production SKUs, with distributors for the kits.[1] Use the datasheet names. T7000 is the MicroATX board kit.[1][4] "IGX 7000" is a show-floor slip.

## Four boxes, two power stories

The family is four SKUs.[1][2]

|  | IGX Thor Developer Kit Mini | IGX Thor Developer Kit | IGX T5000 | IGX T7000 |
|---|---|---|---|---|
| Role | Compact kit for robotic safety[1] | Full kit with pre-installed dGPU[1] | SoM for custom carriers[1] | MicroATX board kit, dGPU, ConnectX-7, BMC[1] |
| AI performance | 2,070 TFLOPS (FP4-Sparse)[1][5] | Up to 5,581 TFLOPS (FP4-Sparse)[1][4] | Up to 2,070 TFLOPS (FP4-sparse)[1] | Up to 5,581 TFLOPS (FP4-Sparse) with RTX PRO 6000 Max-Q; up to 4,293 with RTX PRO 5000 Blackwell[1] |
| iGPU | 2,560-core Blackwell, fifth-gen Tensor Cores, MIG with 10 TPCs, 1.57 GHz[1][4][5] | Same | Same | Same |
| dGPU | —[1] | RTX PRO 6000 Blackwell Max-Q Workstation Edition, 24,064 cores, 96 GB GDDR7 at 1,792 GB/s, up to 300 W[1][4] | —[1] | Same 6000 Max-Q option, or RTX PRO 5000 Blackwell, 14,080 cores, 48 GB GDDR7 at 1,344 GB/s[1] |
| CPU | 14-core Arm Neoverse-V3AE, 2.6 GHz, 1 MB L2/core, 16 MB shared L3[1][5] | Same | Same | Same |
| Memory | 128 GB 256-bit LPDDR5X, 273 GB/s[1][5] | 128 GB LPDDR5X at 273 GB/s plus 96 GB GDDR7[1][4] | 128 GB LPDDR5X at 273 GB/s[1] | 128 GB LPDDR5X plus 96 GB or 48 GB GDDR7 depending on dGPU[1] |
| Networking | 1× 5GbE RJ45, 1× QSFP28 (4× 25GbE), Wi-Fi 6E[1][5] | 2× 1GbE RJ45, 2× QSFP112 at 200GbE each, ConnectX-7[1][4] | 4× up to 25 Gbps MGBE[1] | Dual 200GbE QSFP112, ConnectX-7[1] |
| BMC | No[1] | Yes[1][4] | No[1] | Yes[1] |
| Safety | FSI on SoC, safety MCU on carrier; Mini names Renesas RH850/U2A16[1][5] | FSI plus safety MCU[1][4] | FSI in SoC; optional functional safety on custom boards[1][2] | FSI plus safety MCU[1] |
| Power | 40 W–130 W[1][5] | 40 W–130 W TMP, up to 300 W for dGPU[1][4] | 40 W–130 W[1] | 40 W–130 W TMP, up to 300 W for dGPU[1] |
| Mechanical | 243.19 × 112.40 × 56.88 mm[1][5] | 262.70 × 382.70 × 151.20 mm[1][4] | 100 × 87 × 15.29 mm, 699-pin B2B[1] | 243.84 × 198.98 × 31.05 mm[1] |

PNY reprints NVIDIA's kit table, including the 5,581 / 4,293 FP4-Sparse pair for the two dGPU options.[13] The developer-kit datasheet restates 2,560 CUDA cores, 128 GB LPDDR5X at 273 GB/s, ConnectX-7, "400GbE networking," FSI, safety MCU, 1 TB NVMe, and 40 W–130 W TMP plus 300 W for the dGPU.[4] 400GbE is the two 200GbE QSFP112 ports, not a third pipe.[1][4]

The 5,581 number is addition, not magic. The technical blog: IGX T7000 pairs the T5000 iGPU at 2,070 FP4 TOPS with an RTX PRO 6000 Blackwell Max-Q that "adds an additional 3,511 FP4 TOPS."[2] 2,070 + 3,511 = 5,581. NVIDIA's FAQ row for IGX Thor writes "up to 5511 FP4 TFLOps with dGPU."[3] Quote the product table and the datasheet at 5,581.[1][4] Treat 5,511 as a FAQ typo until a datasheet matches it.

NVIDIA also mixes meters. The product page and both datasheets quote sparse FP4 **TFLOPS**.[1][4][5] The technical blog uses **TOPS** for the same 2,070 / 3,511 split in one paragraph and **TFLOPS** in the family table.[2] Do not subtract Orin INT8 TOPS from Thor sparse FP4 TFLOPS and call the remainder a speedup. Monday's column covered that fork. Today's column needs only: 2,070 is the iGPU; 5,581 is iGPU plus the 6000 Max-Q.[2][4]

## What 8× actually compared

Against IGX Orin, NVIDIA claims up to 8× AI compute on the iGPU, 2.5× on the dGPU, and 2× connectivity.[1][2][4] IGX Orin 700 still sits on the same page: up to 1,705 TOPs, 2,048-core Ampere iGPU, 12-core Cortex-A78AE, 64 GB LPDDR5 with ECC, dual 100GbE ConnectX-7, 125 W without dGPU and 400 W with it, 10-year lifecycle until 2033.[1]

The technical blog gives a vLLM table, not a slogan. Configuration: RTX PRO 6000 Blackwell Max-Q on T7000 versus RTX 6000 Ada on Orin 700; ISL/OSL 2028/128; NVFP4 on T7000, W4A16 on Orin; max concurrency 9.[2]

| Model | IGX T7000 tokens/sec | IGX Orin 700 tokens/sec | Speedup |
|---|---|---|---|
| Qwen3 30B A3B | 1,163 | 807 | 1.4× |
| Qwen3 32B | 468 | 95 | 4.9× |
| Nemotron 9B V2 | 306 | 202 | 1.5× |
| Nemotron 3 30B A3B | 642 | 585 | 1.1× |
| Cosmos Reason 2 2B | 1,630 | 1,250 | 1.3× |
| Cosmos Reason 2 8B | 822 | 540 | 1.5× |
| gpt-oss-20B | 1,072 | 711 | 1.5× |

Source: NVIDIA technical blog, 23 March 2026.[2]

NVIDIA also claims 5× generative-AI reasoning performance versus IGX Orin 700 and "up to 20× more interactive users" when iGPU and dGPU run together, with mixed-criticality isolation so dGPU work does not starve the iGPU.[2] The 4.9× on Qwen3 32B is the one row that looks like a generation jump. The 1.1× on Nemotron 3 30B A3B is the one that looks like a same-size model on a faster card. Read the table, not the 8× banner, when you size a cell.

IGX T5000 keeps 2,070 of FP4 with 128 GB and 273 GB/s "even with industrial features such as full DRAM ECC enabled." NVIDIA says those industrial features do not cut performance or usable memory versus Jetson T5000.[2] That sentence is the buying argument for the SoM: you are not paying a TOPS tax for ECC.

## Ten years is the SKU

Jetson versus IGX is a support contract with a heat sink attached.[3]

|  | Jetson | IGX |
|---|---|---|
| Target | Embedded edge | Industrial enterprise edge |
| Application layer | JetPack, rolling release; up to five years best-effort forums, no SLAs; bugs and CVEs quarterly, best effort | NVIDIA AI Enterprise for production; 10-year support option; bugs and CVEs as needed on the current branch; business-critical SLAs |
| OS / runtime | L4T / JetPack, flexible | IGX OS: up to 10 years, built and signed kernel, CVE patches on the SRU cycle, safety extensions. JetPack can run on IGX with those extensions |
| Hardware | Jetson Thor: up to 2,070 FP4 TFLOPS, ~100 GB/s I/O, SoM for custom design | IGX Thor: up to 5,581 FP4 TFLOPS with dGPU, up to 2× 200 GB/s I/O, security hardening, reference BMC, Safety Island and MCU, industrial-grade SoC, NVIDIA Certified |

Source: NVIDIA IGX FAQ.[3] The FAQ's 5,511 figure is the one to ignore; the rest of the row is the product.

NVIDIA AI Enterprise–IGX adds a long-term-support branch with version-locked frameworks and SDKs "maintained for 10 years," plus Business Standard and Business Critical SLAs and 24/7 expert access.[2] IGX OS is the production stack. JetPack on IGX is the escape hatch for teams that already built on L4T.[2][3]

Part numbers, if you are writing a PO: IGX Thor Developer Kit 940-25840-0011-000 (US, CA, JP, TW) and 940-25840-0012-000 (EU, KR, IN, UK), origin China. Mini 940-25160-0081-000 / 0082-000, origin China. IGX T7000 940-25940-0000-000, origin USA. IGX T5000 900-23834-0080-000, origin USA or Vietnam.[3] Distributors named on the FAQ: Arrow, PNY, Edom, Leadtek, Syntech, Macnica, Ryoyo.[3]

## The watts the plant will actually see

The module envelope is 40 W–130 W TMP on every Thor IGX SKU.[1][4][5] The dGPU adds up to 300 W on the Developer Kit and T7000.[1][4] Mini ships a 140 W DC supply.[5] Orin with dGPU was the 400 W story; Thor moved the add-in card down to 300 W Max-Q.[1][4]

The IGX developer guide, last updated 21 August 2026, rates both Developer Kit and Mini at a 130 W module TDP budget, with average VDD_GPU 100 W, instantaneous VDD_GPU 120 W, and instantaneous VDD_GPU plus VDD_CPU_SOC_MSS 144 W. All three trip OC3 throttling at 50 percent CPU and 50 percent GPU.[12] Four voltage domains — VDD_CPU, VDD_GPU, VDD_MSS, VDD_SOC — come off two VRS11 regulators.[12] An INA3221 on the module watches VDD_GPU, VDD_CPU_SOC_MSS, and VIN_SYS_5V0.[12]

Deep Sleep (SC7) is a real state on this board, not a laptop leftover. VDD_SOC and VDD_MSS drop; DRAM and RTC stay up; Linux maps it to suspend-to-RAM.[12] A plant PC that has to wake on CAN or a power button is using that table.[12]

## Safety is a second computer

IGX Thor puts a Functional Safety Island on the SoC: an independent, redundant processor block with its own memory, power rail, and clocks, sitting beside the CCPLEX and the iGPU.[6] A safety MCU on the carrier — not on the Jetson-style SoM — monitors faults and can force a safe response.[6] Mini names that MCU: Renesas RH850/U2A16.[5] Orin's kit used an Infineon Aurix TC397.[1] Do not assume the Thor carrier kept the Infineon.

Two software safety architectures ship: Linux with an RTOS on the FSI and sMCU, or NVIDIA's hypervisor with a Linux VM and a QNX VM on the CCPLEX, again with RTOS on FSI and sMCU.[6] Halos OS is "a safety-certified operating system foundation for robotics that runs on the NVIDIA IGX Thor platform, integrating Linux and QNX."[11] Halos Core for IGX is early access for registered developers in Linux and Linux-plus-QNX configurations.[11]

NVIDIA's safety brief is more careful than the marketing page about what is certified versus what is designed to be certifiable. Process for the SoC: compliant with ISO 26262 up to ASIL D and compatible up to IEC 61508 SIL 3 / SC 3.[6] Same claim for the Safety Extension Package software under "NVIDIA PLC-L3."[6] Random hardware integrity: Thor SoC "meets the applicable ISO 26262 requirements for random hardware integrity of ASIL B and compatible up to IEC 61508 SIL 2 (SIL 3 for Safety Island)."[6] The technical blog compresses that into "complies with ISO 26262 and IEC 61508, targets ASIL D/SC3 and ASIL/SIL 2."[2] The brief is the document you hand a safety assessor. The blog is the sentence you do not.

Datasheets say partners help with medical certifications IEC 60601 and 62304 and industrial functional safety ISO 26262 and IEC 61508.[4][5] The product page says the FSI "isolates safety-critical workloads — designed to meet ISO 26262 and IEC 61508."[1] Designed to meet is not a certificate on the wall.[1][6]

Halos splits the room in two. Inside-out safety is the robot's own sensors. Outside-in safety is infrastructure cameras and virtual fences.[1][11] KION is named at GTC for the outside-in workflow.[8] NVIDIA Halos AI Systems Inspection Lab is ANAB-accredited; customers get an inspection report and certificate to take to a certification body. It is not itself the IEC or ISO stamp.[6][11]

Freedom from interference, in-system test, DRAM ECC, temperature/clock/voltage monitors, Arm RAS, and an Edge Safety Link for protocols such as FSoE, PROFIsafe, or CIP Safety are the rest of the brief.[6] Collaterals include an application note covering IEC 61508, ISO 13849, ISO 25119, ISO/IEC TS 22440, DO-178C, and DO-254, plus a safety manual, FMEDA, and a TÜV Rheinland inspection report.[6]

## Holoscan is why the medical page exists

NVIDIA Holoscan is a "domain-agnostic, multimodal AI sensor processing platform" for real-time streaming at the edge or in the cloud.[9] The SDK is open source. It runs on IGX, and also on aarch64 and x86.[9] Reference applications on HoloHub include surgical video with tool detection, OpenIGTLink to 3D Slicer, XR volume rendering, high-speed endoscopy with GPUDirect capture cards, SAM2 on live video, and AR-assisted tool segmentation.[9]

Holoscan Sensor Bridge is the Ethernet front end: FPGA plus a standard API that streams cameras, radars, lidars, and RF into GPU memory.[10] NVIDIA's published latency numbers are still on IGX Orin, not Thor: 17 ms end-to-end from photon to display for 4K60, and under 1 ms for GPUDirect signal processing.[10] Camera-over-Ethernet CPU utilization is listed at 1 percent, measured on AGX Thor.[10] The page claims up to SIL 2 for the bridge's safety protocols.[10] Dual 200GbE plus RDMA on T7000 is the bandwidth story that makes those pipelines scale; the technical blog says HSB "relies on deterministic, lossless networking" and that 2×200 GbE is what feeds it.[2]

A preemptible real-time Linux kernel ships by default on IGX.[2] MIG partitions the Blackwell iGPU so a safety loop and a VLM can share silicon without sharing fate.[2] PVA v3, optical flow, and dual NVENC/NVDEC sit beside the GPU.[2][4] GPUDirect RDMA is the sensor path that skips the CPU.[2]

None of that is a 510(k). It is a stack a device maker can take into a submission. Barco, Cosmo, and XRlabs are named at GTC as adopting IGX Thor and Holoscan for "medical-grade, off-the-shelf edge AI platforms."[8] Johnson & Johnson is adopting IGX Thor for its Polyphonic digital surgery platform. KARL STORZ is using it for endoscopy and imaging tools. Medtronic is evaluating. LEM Surgical and Horizon Surgical Systems are named as adopters for surgical robots.[8] The October 2025 unveil also listed Diligent Robotics, EndoQuest Robotics, and CMR Surgical as evaluating.[7] Those are vendor statements, not FDA letters.

## Who else put a name on the box

Hitachi Rail: predictive maintenance and autonomous inspection.[7][8] Caterpillar: an in-cabin conversational assistant.[8] Agility and Hexagon Robotics: humanoid reasoning and sensor fusion.[8] Planet Labs: satellite data in orbit.[8] CERN: high-throughput physics-inspired models.[8] SETI Institute and Joby Aviation were on the 2025 unveil list, with Maven Robotics putting "Thor IGX" at the core of its next robots.[7] OEM/ODM names on the GTC floor: Advantech, ASRock Rack, NEXCOM, Connect Tech, Onyx, Inventec, Yuan.[8] The product page adds Aetina, Ahead, Cosmo, Curtiss-Wright, Dedicated Computing, EIZO, Leadtek, One Stop Systems, WOLF.[1]

That list is a demand signal, not a benchmark. The vLLM table is the benchmark. The April 2036 date is the supply-chain signal.

## What to buy on a Friday morning

If you are bringing up software, the Mini is the 243 mm safety box: T5000, FSI, Renesas sMCU, 2,070 sparse FP4 TFLOPS, 128 GB, 40–130 W, no BMC, no ConnectX-7.[1][5] If you are bringing up a cell that will ingest cameras over 200GbE and run a VLM on a dGPU while the iGPU keeps a control loop, the Developer Kit is the 383 mm chassis with the 6000 Max-Q already in it.[1][4]

If you are going to production, T5000 is the SoM you drop on a custom carrier, NVAIE optional, JetPack allowed.[1][3] T7000 is the MicroATX kit that requires NVAIE, carries BMC and ConnectX-7, and takes the 6000 Max-Q or the 5000.[1][3] Certified systems come from OEM partners, not from a Mini on a lab bench.[3]

Monday: Thor is an Arm server in a 40–130 W envelope, and Orin is still a different compiler world. Today: that server grows a safety island, a second GPU, a 10-year contract, and a Holoscan pipe, and NVIDIA will sell it as IGX until April 2036.[1][3] Do not flash a Jetson and tell a notified body it is the industrial SKU. The pinout matches. The paperwork does not.

## Sources

[1] https://www.nvidia.com/en-us/edge-computing/products/igx
[2] https://developer.nvidia.com/blog/nvidia-igx-thor-powers-industrial-medical-and-robotics-edge-ai-applications
[3] https://docs.nvidia.com/igx
[4] https://developer.download.nvidia.com/assets/igx/robotics-datasheet-igx-thor-developer-kit-nvidia-us-web.pdf
[5] https://developer.download.nvidia.com/assets/igx/robotics-datasheet-igx-thor-developer-kit-mini-nvidia-us-web1.pdf
[6] https://developer.download.nvidia.com/assets/igx/robotics-product-brief-igx-thor-safety-4473375.pdf
[7] https://blogs.nvidia.com/blog/igx-thor-processor-physical-ai-industrial-medical-edge
[8] https://blogs.nvidia.com/blog/gtc-2026-news
[9] https://developer.nvidia.com/holoscan-sdk
[10] https://www.nvidia.com/en-us/technologies/holoscan-sensor-bridge
[11] https://www.nvidia.com/en-us/ai-trust-center/halos/robotics
[12] https://docs.nvidia.com/igx/user-guide/latest/SW/power-perf.html
[13] https://www.pny.com/professional/hardware/nvidia-igx-thor
