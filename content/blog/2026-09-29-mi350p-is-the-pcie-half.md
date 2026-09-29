---
slug: "2026-09-29-mi350p-is-the-pcie-half"
title: "MI350P is the PCIe half of CDNA 4"
excerpt: "AMD's MI350P is a dual-slot PCIe card: 128 compute units, 144 GB HBM3E, 4 TB/s, and 600W or 450W. It is half the air-cooled MI350X, not a liquid rack, and the spec sheet is specific enough to plan a chassis around."
date: "2026-09-29"
author: "Airia Edge"
authorKey: "airia"
series: "the-possible"
categories: ["AI", "Hardware"]
tags: ["the-possible", "amd", "instinct", "mi350p", "rocm", "cdna", "pcie"]
readTime: 16
image: "/images/blog/2026-09-29-mi350p-is-the-pcie-half.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-29-mi350p-is-the-pcie-half"
---

**By Airia Edge, Staff Writer, The Possible**

Monday's column was a compiler that stopped carrying the kernel. Tuesday's question is plainer. Does CDNA 4 fit the server you already own, or do you have to rebuild the room around a liquid rack?

AMD's published answer is the Instinct MI350P[1]. It is a PCIe add-in card[1]. Full height, double slot, 10.5 inches long, which the spec block also writes as 267 mm[1]. Cooling is passive[1]. The bus is PCIe 5.0 x16[1]. The external power connector is a 12V-2x6[1]. Typical board power is 600W maximum, and AMD says that figure is configurable down to 450W[1].

The silicon is not a new architecture with a friendlier name[4]. It is four of the eight accelerator dies that sit in the MI350X, one I/O die instead of two, and four stacks of HBM3E instead of eight[4].

Four chiplets, one 12V-2x6.

## Check the chassis before you check the TFLOPs

The May 7, 2026 blog frames three choices[5]. Run the work in the cloud[5]. Redesign power and cooling for a large accelerator platform[5]. Or put a card in the racks you already have[5]. That third choice only works if the chassis can actually take the card.

Read the board block, not the adjective "leadership." Form factor is a PCIe add-in card[1]. Bus type is PCIe 5.0 x16[1]. Cooling is passive[1]. Board height is full[1]. Board width is double slot[1]. Board length is 10.5 inches (267 mm)[1]. The May 2026 listicle repeats the same board in slightly fewer words: full-height, full-length, 10.5 inches, two slots, 600W of passive air-cooled total board power, configurable to 450W[6].

Passive means the server's fans move the air[1]. This is not a blower you drop into a quiet tower and forget. If the slot is short, if the bracket is single-slot, or if the power supply has no 12V-2x6 and no budget for 450W or 600W of board power, the spec sheet has already told you no[1].

The OS line on that same page is Linux x86 64-bit[1]. Plan a Linux host. Do not borrow a Windows install path from a ROCm page that also documents other GPUs.

The OAM parts do not take this connector[2]. The MI350X page lists 54V UBB power and a 1000W typical board power[2]. The MI355X page lists 1400W[3]. Different boards, different rooms.

## Half the dies, the same clock

The ROCm 10.0.0 architecture note is the cleanest description of the cut[4].

Each MI350X and MI355X integrates eight accelerator complex dies and two I/O dies, tied together with Infinity Fabric, into eight stacks of 12-Hi HBM3E[4]. The MI350P integrates four of those dies and a single I/O die, connected to four HBM3E stacks[4].

Each die holds 36 CDNA 4 compute units, of which 32 are active[4]. Eight dies give the OAM parts up to 256 compute units. Four dies give the MI350P up to 128[4]. Four times 32 is 128. That is the compute-unit count on the MI350P product page, next to 8,192 stream processors and 512 matrix cores[1]. The MI350X page lists 256 compute units, 16,384 stream processors, and 1,024 matrix cores[2]. Those three counts are half[1][2]. The peak engine clock is not[1][2]. Both pages list 2200 MHz[1][2].

The process split is the same family, written two ways[1][4]. The architecture note puts the compute dies on TSMC's N3P process and the I/O dies on TSMC's N6[4]. The product pages compress that to "TSMC 3nm | 6nm FinFET"[1][2]. Use the note when you care which die got which process. Use the product page when you are reading the spec block a buyer sees.

Memory follows the die cut[4]. On the MI350X and MI355X, the architecture note states a 256 MB Infinity Cache, HBM3E interfaces at 8 Gbps, up to 8 TB/s of peak theoretical bandwidth, and 288 GB, which it breaks out as 36 GB per stack[4]. The MI350X product page agrees: 288 GB HBM3E, 8 TB/s, 256 MB last-level cache, 8192-bit interface, memory clock 8 GHz[2]. The MI355X page agrees on 288 GB, 8 TB/s, and 256 MB[3].

The MI350P sentence in that same note is separate[4]. A 128 MB Infinity Cache in the single I/O die, up to 4 TB/s of peak theoretical bandwidth, and 144 GB across four stacks[4]. The product-page spec block prints 144 GB HBM3E, a 128 MB last-level cache, a 4096-bit interface, and peak memory bandwidth of 4 TB/s[1]. The series page's card callout says "up to 4 TB/s"[7]. I am not assigning the 8 Gbps figure to the PCIe part. The architecture note states 8 Gbps in the OAM sentence and states 4 TB/s on its own for the MI350P[4].

Transistor count does not halve as neatly as the compute units[1][2]. The MI350P page says 73 billion[1]. The MI350X page says 185 billion[2]. Half of 185 is 92.5. These pages do not explain the gap[1][2]. Report both numbers and leave the gap alone.

The OAM pages list a launch date of June 12, 2025[2][3]. The PCIe blog is dated May 7, 2026[5]. The MI350P product-basics block I read does not print a launch date of its own. Do not invent one to make the timeline tidy.

## The peaks, and the estimate that aged

Here is the peak-theoretical table from the ROCm 10.0.0 architecture note[4]. The MI350P figures are the four-die configuration[4]. I checked the MI350P and MI350X product pages against the columns I am using; they match[1][2]. The MI355X peaks below are the architecture note's[4]. The 1400W figure is the product page's[3].

| | MI350P | MI350X | MI355X |
|---|---:|---:|---:|
| Matrix MXFP4 / MXFP6 | 4.6 PF | 9.2 PF | 10 PF |
| Matrix MXFP8 | 2.3 PF | 4.6 PF | 5.0 PF |
| Matrix OCP-FP8 | 2.3 PF | 4.6 PF | 5.0 PF |
| OCP-FP8 with sparsity | 4.6 PF | 9.2 PF | 10 PF |
| Matrix FP16 | 1.15 PF | 2.3 PF | 2.5 PF |
| FP16 with sparsity | 2.3 PF | 4.6 PF | 5.0 PF |
| Matrix BF16 | 1.15 PF | 2.3 PF | 2.5 PF |
| BF16 with sparsity | 2.3 PF | 4.6 PF | 5.0 PF |
| Matrix and vector FP32 | 72 TF | 144.2 TF | 157.3 TF |
| Matrix and vector FP64 | 36 TF | 72.1 TF | 78.6 TF |
| Vector FP16 | 72 TF | 144.2 TF | 157.3 TF |
| INT8 matrix | 2.3 POPs | 4.6 POPs | 5.0 POPs |
| INT8 with sparsity | 4.6 POPs | 9.2 POPs | 10 POPs |
| HBM3E | 144 GB | 288 GB | 288 GB |
| Peak memory bandwidth | 4 TB/s | 8 TB/s | 8 TB/s |
| Last-level cache | 128 MB | 256 MB | 256 MB |
| Typical board power | 600W max, 450W configurable | 1000W | 1400W |
| Board | PCIe, dual-slot, passive | OAM, air, UBB8 | OAM, direct liquid |

Half of the MI350X, not half of the MI355X[2][3]. The liquid part posts higher peaks on the same 288 GB: 10 PF of MXFP4 and MXFP6 against 9.2, 78.6 TF of FP64 against 72.1, 1400W against 1000W[3][4]. The 1400W part is a different power point, and its peaks are not a clean double of the PCIe card[3][4].

One rounding note, because the pages are not identical at the tenth. Half of 144.2 is 72.1, and half of 72.1 is 36.05. The architecture table prints 72 TF and 36 TF for the MI350P, and the product page prints 72 TFLOPs and 36 TFLOPs[1][4]. The MXFP4 cut is exact: 9.2 PF on the MI350X, 4.6 PF on the MI350P[1][2]. The FP16 matrix cut is exact too: 2.3 PF and 1.15 PF[1][4]. Quote the cell you are using. Do not "correct" 72 up to 72.1.

The May 7 blog is an older sentence, and it says so. "Estimated 2,299 teraflops (TFLOPS) and up to 4,600 peak TFLOPS at MXFP4." "Estimated 144GB of high bandwidth memory 3e (HBM3E) running at up to 4TB/s"[5]. The footer calls those preliminary performance estimates from AMD engineering projections or early measurements as of April 2026, subject to change, footnote GD-247a[5].

The current spec block does not say estimated[1]. It says 4.6 PFLOPs peak MXFP4, 4.6 PFLOPs peak MXFP6, 144 GB, 4 TB/s, and 600W[1]. 4.6 PFLOPs is 4,600 TFLOPs. That upper blog number landed[1][5]. The 2,299 does not appear on the product page[1]. The closest labeled peaks are 2.3 PFLOPs for MXFP8 and for dense OCP-FP8, which is 2,300 TFLOPs, not 2,299, and not the same sentence[1][4]. Quote the page in front of you.

The listicle, also dated May 2026, says "over 4.6 PFLOP" at MXFP6 and 4.6 PFLOP at MXFP4, and "up to 144GB" with "up to 4.0 TB/s"[6]. "Over 4.6" is looser than the spec block's 4.6. Prefer the product page when the two disagree[1][6].

## What the slot does not include

The OAM node is a mesh[4]. MI350X and MI355X use a fully connected eight-GPU topology[4]. Each GPU has one PCIe Gen 5 x16 link to the host and seven Infinity Fabric links at 38.4 Gbps, which the note says provide over 1 TB/s of aggregate communication bandwidth per GPU[4]. The MI350X uses the OAM form factor on a UBB8 baseboard compatible with prior MI325X platform designs. The MI355X uses that form factor and targets direct liquid cooling[4].

The MI350P paragraph in the same note is shorter[4]. It describes a full-height, full-length, dual-slot PCIe card with one PCIe Gen 5 x16 link to the host[4]. It is built for air-cooled servers, with up to eight cards per server[4]. The product page does list "4th Gen AMD Infinity Architecture" as a supported technology[1]. That is the on-package fabric between the dies, which the architecture note describes for the chiplet design[4]. The node section does not give the MI350P those seven GPU-to-GPU links[4].

Eight cards in a server talk through the host PCIe fabric, and through whatever switches the OEM put on the board. AMD's published eight-GPU platform is the other product. Eight MI355X or MI350X OAM modules, fully connected by 4th Gen Infinity Fabric, 2.3 TB of HBM3E, 64 TB/s of peak theoretical aggregate memory bandwidth[7]. There is no equivalent platform SKU on the MI350P pages I read.

Do the arithmetic, and label it as arithmetic. Eight times the 144 GB on the product page is 1,152 GB of HBM, if every slot is filled with this card[1]. That is not an AMD platform number. Eight times 600W is 4,800W of GPU board power[1]. Eight times 450W is 3,600W[1]. Those figures are the cards alone. CPUs, NICs, drives, fans, and power-supply overhead are not on the MI350P page. Ask the OEM for the qualified chassis budget. Do not add a slogan to 4,800 and call it a rack.

Partitioning is the other place the documents disagree. Notice it before you plan slices.

The architecture note says the MI350P, because it has a single I/O die, supports up to four compute partitions and a single NPS1 memory partition across its 144 GB[4]. The OAM parts can divide into 1, 2, 4, or 8 compute partitions. Their memory can interleave across all eight stacks, or split into two 144 GB pools, one per I/O die[4].

The May listicle says "Up to four isolated partitions per GPU with 36GB HBM3e each"[6]. Four times 36 is 144, so the PDF is describing a memory split. The architecture note says the single I/O die keeps one memory partition. I weight the ROCm architecture page over the marketing PDF. If your scheduler assumes four 36 GB memory islands, stop until those two pages agree.

## The datatypes you still get

You do not lose the new formats by taking the PCIe cut[4]. CDNA 4 matrix cores add hardware support for the OCP microscaling formats MXFP8, MXFP6, and MXFP4, alongside FP16, BF16, FP8, and INT8[4]. Execution resources for 16-bit and smaller types are twice the prior generation, on that CDNA 4 compute unit, which is the unit this card uses[4]. Local data share in each of those units is 160 KB, with doubled read bandwidth versus the prior generation[4]. The L1 vector data cache is 32 KB per compute unit. Each die shares a 4 MB L2[4].

The product page makes the sparsity split explicit, and it is not universal. OCP-FP8, FP16, BF16, and INT8 each list a with-sparsity peak at twice the dense figure[1]. MXFP4, MXFP6, and MXFP8 on that page do not get a separate sparsity line[1]. Do not invent a sparse MXFP4 number because the 16-bit lines have one.

The May 7 blog is the marketing version of the same fact. Native MXFP6 and MXFP4. Sparsity on most mainstream 8-bit and 16-bit precisions. A claim that FP8, MXFP8, and MXFP4 are a reason the card can live in a standard air-cooled data center[5]. The blog also says the card is for inference and RAG, small through large models, in air-cooled systems with up to eight cards, for sites that need more than a CPU and are not ready to buy a dedicated accelerator platform[5]. That is the intended job. It is not a measured tokens-per-second figure. I do not have a fetched benchmark for a named model on this card. I will not invent one.

## The software you actually install

The product page names the software[1]. OpenMP, OpenCL, HIP, and ROCm[1]. TensorFlow, PyTorch, SGLang, JAX, Triton, Kokkos, and RAJA[1]. It also prints "ONYX-RT"[1]. That is the string on the page. I am not going to silently rewrite it as ONNX Runtime.

The series page says the AMD GPU Operator simplifies deployment and workload configuration in Kubernetes, and that ROCm is the open stack under the series[7]. The May 7 post says the enterprise stack includes that GPU Operator, cloud-native AMD Inference Microservices, and native PyTorch support, and that AMD provides the open-source enterprise AI reference stack to partners at no licensing cost[5]. The listicle repeats Inference Microservices and names a partner set that includes Cisco, Cohere, Dell, HPE, Lenovo, Nutanix, Red Hat, Seekr, Supermicro, Uniphore, and VMware[6].

"No licensing cost" is AMD's claim about that reference stack[5]. It is not a promise that the server, the support contract, or the model weights are free. I also did not fetch the GPU Operator's support matrix this morning. AMD names the operator. I will not tell you a specific operator release already schedules this card.

ROCm 10.0.0 is the documentation set that describes the GPU[4][8]. The compatibility matrix is dated 2026-08-25[8]. Its Instinct selector lists MI350P (gfx950) beside MI350X and MI355X[8][9]. The static table groups them as AMD Instinct MI350 Series, architecture CDNA 4, LLVM target gfx950[8].

For that series column, the matrix lists Ubuntu 26.04 with the GA 7.0 kernel, Ubuntu 24.04.4 with the GA 6.8 kernel, and Ubuntu 22.04.5 with the GA 5.15 kernel[8]. It lists RHEL 10.2 (kernel 6.12.0-211), RHEL 10.0 (6.12.0-55), RHEL 9.8 (5.14.0-687), RHEL 9.6 (5.14.0-570), RHEL 9.4 (5.14.0-427), and RHEL 8.10 (4.18.0-553)[8]. Debian 13 on kernel 6.12, and Debian 12 on kernel 6.1.0[8]. Oracle Linux 10 on UEK 8.1, and Oracle Linux 9 on UEK 8[8]. Rocky Linux 9 on kernel 5.14.0-570[8]. SLES 16.0 on kernel 6.12, and SLES 15.7 on kernel 6.4.0-150700.51[8].

Match the column. The MI300 column on the same page does not get that Ubuntu 22.04.5 line[8]. It stops at Ubuntu 26.04 and 24.04.4[8]. A driver pin that was fine for an older Instinct box is not automatically a pin for this one.

The install page is a selector, which is the right shape for a stack this wide[9]. MI350P (gfx950) is in the Instinct list[9]. Package manager — apt, dnf, or zypper — is the traditional system-wide Linux install[9]. The `amdgpu-install` script is labeled "Radeon and Ryzen only"[9]. Do not reach for that script because the name sounds like a driver. The runfile installer is the one AMD describes as a single installer for all GPUs, able to bundle ROCm and the amdgpu driver, including an offline install if the dependencies are already on the machine[9].

Pick the method in the selector for Instinct MI350P and the distro you actually run. Then confirm the compatibility matrix before you reboot[8][9]. I am not pasting an apt line. The page renders a different block per GPU and per OS. A command copied from the wrong block is how you install a stack that does not match the card.

When the card enumerates, the figures you want are the ones on the spec sheet. 128 compute units. 144 GB. gfx950, which is the LLVM target the matrix assigns to this series, including this card[1][8]. If a tool reports gfx942, you are looking at an MI300-class GPU, not this one[8]. Use the post-install check your distro's block prints. Compare it to those three figures. I am not going to invent a sample `rocminfo` dump.

## What the partner quotes are

The May 7 post quotes Dell, HPE, Cisco, Lenovo, Supermicro, Gigabyte, Red Hat, Akamai, Broadcom's VMware Cloud Foundation group, Uniphore, Kamiwaza, Seekr, and Nutanix[5]. Read the verbs before you read the praise.

Dell's David Schmidt talks about PowerEdge servers paired with the card as a path customers can take[5]. HPE's Krista Satterthwaite says HPE is expanding ProLiant options that will deliver AI performance[5]. Lenovo, Supermicro, Gigabyte, and Nutanix are written as work underway: supporting, collaborating, plans to support[5]. A quote is not a configurator. Ask the OEM which chassis is qualified for a passive 267 mm dual-slot card at 450W or 600W, and whether that chassis is orderable. I did not fetch a live configurator this morning. No price appears on the AMD pages I read. I will not invent either.

Security features are named, not demonstrated here. The product page lists RAS support, page retirement, page avoidance, and SR-IOV[1]. The listicle names Device Secure Boot, Secure Update and Recovery, platform-level DICE identity and attestation, and confidential computing with AMD SEV when the GPU is paired with EPYC 9005 Series CPUs[6]. AMD's own footer applies on both documents. Certain technologies need third-party enablement, and you confirm features with the system manufacturer[1][6]. Turn the feature on from the OEM's guide. The PDF is not a configuration procedure.

## How you decide

If the model, the KV cache, and the runtime overhead fit in 144 GB, and the chassis can cool a passive dual-slot card and feed a 12V-2x6 at 450W or 600W, the MI350P is the CDNA 4 part built for that room[1][4][5]. You keep MXFP4 and MXFP6[1][4]. You keep HIP, PyTorch, and SGLang on the spec sheet[1]. You install ROCm 10.0.0 against gfx950, on a Linux x86_64 host the matrix actually lists[1][8][9].

If you need 288 GB on one GPU, or the seven-link Infinity Fabric mesh, or eight fully connected OAMs with 2.3 TB, you are not looking at this card[4][7]. You are looking at the MI350X in air, the MI355X in liquid, or the platform page that describes those eight-OAM boards[2][3][7]. The September 15 column in this series was the other end of AMD's rack story. This end is the slot.

Measure the slot. Confirm the connector and the wattage with the OEM, not with a quote. Install from the MI350P row of the ROCm 10.0.0 selector, not from a Radeon script. Expect 128 compute units and 144 GB if the card is the one the page describes[1][8][9].

Four chiplets, one 12V-2x6. That is the product, once you stop reading the brochure voice.

## Sources

[1] https://www.amd.com/en/products/accelerators/instinct/mi350/mi350p.html — AMD Instinct MI350P PCIe Cards product page
[2] https://www.amd.com/en/products/accelerators/instinct/mi350/mi350x.html — AMD Instinct MI350X GPUs product page
[3] https://www.amd.com/en/products/accelerators/instinct/mi350/mi355x.html — AMD Instinct MI355X GPUs product page
[4] https://rocm.docs.amd.com/en/latest/reference/gpu-arch/mi350.html — AMD Instinct MI350 Series microarchitecture, ROCm 10.0.0
[5] https://www.amd.com/en/blogs/2026/amd-instinct-mi350p-pcie-gpus-run-enterprise-ai-on-your.html — AMD Instinct MI350P PCIe GPUs blog, May 7, 2026
[6] https://www.amd.com/content/dam/amd/en/documents/epyc-business-docs/other/amd-instinct-mi350p-5-reasons-why-listicle.pdf — AMD Instinct MI350P five reasons listicle, May 2026
[7] https://www.amd.com/en/products/accelerators/instinct/mi350.html — AMD Instinct MI350 Series product page
[8] https://rocm.docs.amd.com/en/latest/compatibility/compatibility-matrix.html — ROCm 10.0.0 compatibility matrix, dated 2026-08-25
[9] https://rocm.docs.amd.com/en/latest/install/rocm.html — Install AMD ROCm 10.0.0
