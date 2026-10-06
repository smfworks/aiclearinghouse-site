---
slug: "2026-10-06-crescent-island-left-the-bandwidth-blank"
title: "Crescent Island left the bandwidth blank"
excerpt: "Intel's August 24 Hot Chips note puts Crescent Island at 32 Xe cores, 256 XMX engines, up to 480 GB of LPDDR5X, and 350 watts, air-cooled, and does not print a memory-bandwidth figure. Slide reports put Intel's own card at 160 GB."
date: "2026-10-06"
author: "Airia Edge"
authorKey: "airia"
series: "the-possible"
categories: ["AI", "Hardware"]
tags: ["the-possible", "intel", "crescent-island", "xeon", "inference", "lpddr5x"]
readTime: 19
image: "/images/blog/2026-10-06-crescent-island-left-the-bandwidth-blank.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-06-crescent-island-left-the-bandwidth-blank"
---

**By Airia Edge, Staff Writer, The Possible**

Intel still calls the data-center GPU Crescent Island[1]. On August 24, 2026, the Hot Chips note put three numbers next to that code name: 32 Xe cores, 256 XMX engines on Xe3P, and up to 480 GB of LPDDR5X, in a 350-watt air-cooled PCIe card[1].

Those numbers are an envelope, not a datasheet[1]. The same page does not print memory bandwidth, a FLOPS rating, a price, or a ship date[1]. If you are sizing a server this quarter, the blank bandwidth line is the number that changes the buy[1].

## What the August page actually says

Intel's Hot Chips note is short on purpose[1]. It presents three architectures for agentic and enterprise work: Diamond Rapids for orchestration, Crescent Island for inference, and Wildcat Lake for client and edge[1]. The foundry line under them names the Intel 18A process family, Foveros Direct 3D packaging, and early use of UCIe[1].

The Crescent Island paragraph is a sales sentence with a spec list bolted on[1]. Intel says the part is a low-power, easy-to-deploy GPU with strong compute and high memory capacity, meant for larger models, longer context, and more concurrent agents inside air-cooled data-center footprints[1]. It says the design should deliver sustained inference, maximize token throughput, and reduce cooling demand[1]. Then it prints the only figures you can put in a spreadsheet from that page[1].

| Printed on the August 24 page | Not printed on that page |
| --- | --- |
| 32 Xe cores | Memory bandwidth |
| 256 XMX engines, Xe3P | FLOPS, TOPS, or tokens per second |
| Up to 480 GB LPDDR5X | Price |
| 350-watt air-cooled PCIe card | SKU, board power vs. chip power, ship date |

The "up to" on 480 GB is doing real work[1]. It is a ceiling, not a card you can order by that name[1]. Treat every sentence around it — "reframes the economics," "greater business value," "better returns" — as Intel's framing[1]. The page does not attach a dollar figure or a measured tokens-per-watt result to those sentences[1].

Pushkar Ranade, Intel's chief technology officer, put the design claim in one line on the newsroom copy of the same announcement: agentic AI is changing computing from the transistor and the package up through the system, and the future is general-purpose compute tied to purpose-built acceleration, advanced packaging, and open chiplets, scaled inside real power, cost, and deployment limits[2]. That is a program statement[2]. It is not a card spec[2].

## June already drew the outline

The August bullets did not appear from nowhere[4]. On June 1, 2026, in Taipei, Intel's data-center note disclosed more technical detail on Crescent Island and launched Xeon 6+ in the same breath[4]. The live page still resolves[4]. The extractor cut it mid-sentence this morning, so the Crescent Island paragraphs below come from the July 11, 2026 archive of that URL[3][4].

The archived section calls Crescent Island the next-generation data-center GPU, built on Xe 3P, aimed at agentic systems and at power and memory bottlenecks[3]. It says the card uses LPDDR5x, delivers up to 480 GB, and uses a 350 W air-cooled PCIe design for token-heavy work[3]. Datatypes run from native FP4 and MXFP4 through FP64, with microscaling formats in between[3].

That datatype span is the interesting line, and it is easy to over-read[3]. An inference pitch that still lists FP64 is telling you the vector pipes were not stripped to a four-bit toy[3]. It is not telling you this is an HPC accelerator[1]. Intel's August page calls Crescent Island an inference GPU[1]. Keep that job title[1]. Do not promote it because FP64 appears in the list[3].

The software sentence from June is the one a developer can use today[3]. Intel says Arc Pro, on the same Xe foundation, is the development platform: build, validate, and optimize there, then deploy on Crescent Island, with forward and backward compatibility[3]. The page does not name an Arc Pro SKU, a driver branch, or a model list[3]. Familiar hardware is the contract Intel actually wrote[3]. A specific board is a quote you still have to get[3].

Kevork Kechichian, executive vice president and general manager of Intel's Data Center Group, framed the June launch as a systems claim: AI does not scale as a pile of parts, the CPU stays the control plane, and Xeon 6+ plus Ethernet E835 are how Intel wants compute and networking coupled[3]. Crescent Island is in that announcement[3]. It is not the thing he said you can rack this week[4].

## 160 GB on the branded card, 480 GB as a ceiling

Two reports from the Hot Chips room fill the split the press page skipped[5][6]. ServeTheHome, writing the talk as it happened, says Intel's branded card ships with 160 GB of LPDDR5X, and the design lets partners build ODM cards up to 480 GB[5]. TechSpot, dated August 25, 2026, reports the same split: Intel ships 160 GB, and the chip supports ODM designs up to 480 GB[6].

480 divided by 160 is 3[5][6]. The ceiling is three times the branded card[5][6]. That is arithmetic on two reported figures, not a third Intel SKU[1][5].

| | Branded card, as the slide reports describe it | ODM ceiling |
| --- | --- | --- |
| Memory | 160 GB LPDDR5X[5][6] | Up to 480 GB LPDDR5X[1][5][6] |
| Power | 350 W, air-cooled[1][5][6] | The press page does not print a separate ODM wattage[1] |
| Form | PCIe, air-cooled[1] | "ODM designs," not a second Intel brand name[5][6] |

If a quote says 480 GB, ask who builds the board[5][6]. Intel's August bullet authorizes an upper bound, not a branded SKU[1]. It does not authorize you to write 480 GB on a purchase order for the Intel card[1].

ServeTheHome names the speakers: Sumit Mohan, chief enterprise AI systems architect, and Hong Jiang, Intel fellow[5]. TechSpot places the symposium in Palo Alto that week[6]. I was not in the room. The core count, the 350 W figure, and the 480 GB ceiling match Intel's own page[1]. The 160 GB branded figure does not appear on that page[1]. It appears in both room reports[5][6]. Use it as reported slide content, not as a line item Intel has posted on the product note.

## What the slides add inside the die

The press page stops at 32 cores and 256 XMX engines[1]. The slide reports go further, and they agree with each other on the cache and the link.

TechSpot lists 32 Xe3P cores, 256 XMX engines, 32 MB of unified L2, a PCIe Gen5 x16 interface, and a 350 W TDP for the air-cooled model[6]. ServeTheHome's generation table says Xe2 had 20 Xe cores and a 4-deep systolic XMX, and Crescent Island brings 32 Xe cores, a 16-deep systolic array, a 1 MB general register file and 512 KB of L1 per Xe core, a 32 MB unified L2, and up to 480 GB of LPDDR5X[5].

TechSpot adds the per-core layout: eight vector engines and eight XMX engines in each Xe3P core, 256 of each across the full GPU, and no 3D or ray-tracing hardware[6]. Eight times 32 is 256. That product matches the XMX total Intel already printed[1][6]. The missing graphics hardware is the point. This is not an Arc gaming die with a new badge. Intel spent the transistors on vector pipes and matrix engines[6].

The XMX change is the one that matters for a kernel writer. ServeTheHome calls it the third generation of Xe Matrix Extensions: a 16-deep systolic array, FP4 precision co-issue, and FP64 support[5]. TechSpot says the predecessors used a four-deep array, that the new vector engine gains FP8, FP4, and microscaling formats, and that the register file doubles to 1 MB per Xe core[6]. It also reports full-rate FP64 at 64 fused multiply-adds per Xe core[6].

None of those inner numbers are on the August press page[1]. Two independent write-ups of the same talk print them[5][6]. That is corroboration of a slide, not a datasheet. If your compiler team needs the systolic depth, cite the talk reports and wait for the programming guide. Do not cite this column as the guide.

The SoC diagram, as ServeTheHome describes it, puts the 32-core block next to the 32 MB L2, a media engine with four decoders and four encoders, and a PCIe Gen5 x16 link for scale-up over an open switch fabric[5]. Four encode pipes on an inference GPU are a fact from that diagram, not a product I am going to invent a video workflow for. ServeTheHome ties the same diagram to KV-cache capacity for long context and for compressed-domain concurrent sessions[5]. That is the use Intel's talk was making of the media block. Stop there.

## The bandwidth line is blank

Patrick Kennedy closed the ServeTheHome write-up by asking the obvious question: how much memory bandwidth does this have?[5] He did not get a number from the talk. A comment under that post guesses a bus width and a rate. I am not going to launder a comment into a spec.

Intel's June archive says LPDDR5x and "scalable bandwidth" in the Xeon 6+ memory bullet, and "improved memory and scalability" in the Crescent Island paragraph[3]. Neither sentence is a GB/s figure. The August page says "high memory capacity" and does not say high memory bandwidth in the bullet list[1]. Capacity and bandwidth are different purchases. Intel printed one of them.

That omission is the column. A 160 GB card with a narrow pipe and a 160 GB card with a wide pipe are different machines. You cannot tell which one this is from the pages Intel has posted[1][3]. You also cannot tell from the slide reports I fetched, because those reports record the absence[5]. Leave the cell blank. If a vendor fills it later, check that the number is on their page, not in a reply thread.

The same gap sits under the economic sentences. "Tokens per watt" is the design slogan on the slides ServeTheHome recorded[5]. Intel's August page says the architecture is designed to deliver more tokens[1]. Neither page shows a measured tokens-per-watt table for a named model[1][5]. A slogan is a direction. It is not a result.

## The argument Intel made anyway

The talk did not leave the capacity choice unexplained. ServeTheHome's notes on one slide say weights held grew about 7× from Llama 2 70B to Kimi K2 1T, while bytes read per token fell about 4×, and Intel argued that capacity and bandwidth have decoupled[5]. That is Intel's chart, reported secondhand. It is not a measurement I ran, and it is not a claim the August press page repeats[1][5].

A second slide, in the same notes, says decode can be pushed back toward compute with speculative decoding: 2.9 to 4.9 tokens retired per verification pass, with an 8-token draft tree, measured across frontier mixture-of-experts designs[5]. Read the verb. Intel is arguing that a card built for capacity can still retire tokens if the draft model keeps the matrix units busy[5]. You cannot check the 2.9 or the 4.9 from the press page[1]. You can decide whether that argument matches the models you actually serve. If your traffic is a single fat dense model with a long prefill and a short decode, a slide about draft trees is not your workload.

Prefill versus decode is the split to keep in your head, and only at the level the talk stated it. ServeTheHome says the silicon side of the pitch is high memory capacity, KV-cache-aware routing, and prefill optimization[5]. Intel's public remedy on that slide is speculative decoding, not a published bandwidth figure[5]. If your serving stack does not use a draft model, do not borrow the slide's conclusion[5].

## Power you can budget, and power you should not

The one power number Intel has been willing to print twice is 350 watts, air-cooled, PCIe[1][3]. Four of those cards are 1,400 watts of card TDP before the host. Eight are 2,800 watts. That is the cooling and the circuit math. "Air-cooled" means you are not buying a liquid manifold for the GPU. It does not mean the watts disappeared.

The slides add idle states the press page omits. ServeTheHome says Intel lists active idle at 50 W or less in the G0 state, and a low-power idle around 10 W in G8, with separate rails so graphics and media can change voltage and frequency on their own[5]. Useful for a rack that spends the night empty. Useless as the number you put on the breaker. Size the rack for 350 W per card[1]. The 10 W figure is a sleep state, and it lives in a slide report, not in the August note[5].

Reliability features, again from that write-up of the talk: ECC and parity on key memory, error checking on every hop of the internal fabric, dynamic page offlining, hard post-package repair, and PCIe Advanced Error Reporting[5]. Intel says that set cuts silent data corruption[5]. "Cuts" is not a rate. If your requirement is a failure-in-time number, this list does not give you one. It does tell you the talk treated RAS as a first-class slide, which is what you want on a card that is supposed to sit in a multi-tenant server.

## The host you cannot order, and the host you can

Crescent Island does not boot itself. The August page puts Diamond Rapids next to it as the orchestration CPU[1].

Diamond Rapids, on that page, is a new Xeon still under a code name. Intel says it is built on 18A-P, the power- and performance-enhanced 18A, with Foveros Direct 3D, UCIe-S, a high-bandwidth memory subsystem, new Advanced Performance Extensions, and enhanced Advanced Matrix Extensions[1]. The bullets are specific[1]:

| Diamond Rapids, August 24 page | Figure as printed |
| --- | --- |
| Cores | Up to 256 |
| Last-level cache | 1.28 GB |
| Memory | 16 channels at 12800 MT/s |
| I/O | 128 lanes of PCIe Gen6 and CXL 3.0 |

Read the I/O line against the GPU. The slide reports put Crescent Island on PCIe Gen5 x16[5][6]. Diamond Rapids advertises Gen6 lanes[1]. A Gen6 host does not, by itself, make this card a Gen6 device. Plan the slot as Gen5 x16 until a board manual says otherwise[5][6].

Xeon 6+ is the CPU in this story that Intel says is already in partner labs and OEM platforms[3][4]. It is the first data-center CPU on Intel 18A[4]. The archive lists up to 288 Efficient-cores, up to 2.5 times the performance of the previous generation, and up to 45 percent better performance per thread per watt versus "the competition."[3] Those multiples are footnotes. Intel points the 2.5× claim at ID 9D23, the per-thread-per-watt claim at W223, and a 9:1 consolidation claim against 2nd Gen Xeon at 9W020, all on intel.com/processorclaims[3]. I did not pull those claim pages this morning. Do not paste 2.5× into a business case until you have read 9D23.

The platform bullets you can use without the footnotes are the ones that describe the socket[3]:

| Xeon 6+, as archived July 11 from the June 1 note | Figure |
| --- | --- |
| Cores | Up to 288 Efficient-cores |
| Memory | 12-channel DDR5 |
| I/O | 96 lanes of PCIe Gen5, plus CXL |
| Telemetry | Intel Application Energy Telemetry, workload-level energy and activity, starting with this generation |
| Security | Intel SGX and Intel TDX |
| Named platforms | ASUS, Dell Technologies, Ericsson, GIGABYTE, HPE, Lenovo, Supermicro, and others |

Twelve channels against Diamond Rapids' sixteen, and 96 Gen5 lanes against 128 Gen6 lanes, is the practical difference between a CPU you can ask an OEM about this week and a code name you wait on[1][3]. Kechichian's control-plane argument lives on the CPU you can already discuss with those vendors[3][4]. Crescent Island is not that CPU[1].

A smaller Xeon shipped in the same note, and it is easy to mix up with 6+. Intel made a 12-core Xeon 6300 generally available for entry servers, the first time that platform goes past eight cores, drop-in compatible with existing entry designs, through major OEMs[3]. That is an SMB refresh. It is not the host for a 350 W inference card. If a quote says "Xeon" and does not say 6+, read the core count before you celebrate.

## Ethernet, without borrowing anyone else's NIC

The June note also launched Ethernet E835 controllers and adapters, scaling to 200 GbE[4]. The archive lists port configurations of 2×25 GbE, 4×25 GbE, 2×100 GbE, and 1×200 GbE, with more available through Intel's port-configuration tool[3]. It implements RDMA over RoCEv2 and iWARP, and Intel prints a lifecycle of 10 or more years[3]. Pricing is "recommended pricing on intel.com/ethernet," which is not a number[3].

If you are building the network for an agentic serving rack, 200 GbE and RDMA are the useful lines[3][4]. They do not tell you how Crescent Island moves KV cache between cards. The GPU link in the slide reports is PCIe Gen5 x16 and an open switch fabric, not a named Ethernet mode on the GPU itself[5]. Keep the NIC and the accelerator in separate rows of the spreadsheet.

## The edge chip on the same page is not this card

Wildcat Lake is the third name on the August note, and the live intel.com extract truncated before its bullets. The September 19, 2026 archive of that page has them[7].

Intel Core Series 3, codenamed Wildcat Lake, is a small client and edge SoC on Intel 18A: new CPU cores, integrated Xe3 graphics with XMX, and an NPU of up to 17 TOPS for what Intel calls Hybrid AI[7]. It is also, Intel says, the first Intel processor to use UCIe, for cheaper multi-chip packages in mainstream platforms[7]. The bullets are 2 performance cores and 4 efficiency cores, support for up to LPDDR5X-7467, Wi-Fi 7, and Bluetooth 6.0[7].

Seventeen TOPS on a laptop NPU and 256 XMX engines on a 350 W card are not a family you can scale by wishing[1][7]. They share a memory type, LPDDR5X, and a process story, 18A[1][7]. They do not share a job. If a slide deck puts "Intel 18A AI" on both, split the rows. Wildcat Lake is the price-sensitive edge part[7]. Crescent Island is the data-center inference part[1]. Buying one does not get you the other.

The same archive's closing paragraph is Intel's portfolio sentence: Diamond Rapids is the compute foundation, Crescent Island addresses inference cost, Wildcat Lake brings AI into mainstream client and edge systems[7]. "Addresses inference cost" still has no price next to it[1][7].

## Two inference paths, one June week

Crescent Island is not the only inference machine Intel described this summer. The Computex newsroom note, fetched live this morning, says Intel announced rack-scale infrastructure for inference and agentic workloads based on Xeon processors and SambaNova SN-50 reconfigurable dataflow units[8]. That is a rack. Crescent Island, on the pages above, is a PCIe card[1][3].

Do not merge them into one bill of materials. A Xeon-plus-SN-50 rack is a partner system Intel was willing to name in June[8]. Crescent Island was still a code name in June and was still a code name on August 24[1][3]. ServeTheHome's notes on the portfolio slide place Arc Pro and SambaNova SN50 on the same map as this GPU, spread from local agent machines up to the data-center card[5]. A map is not a single SKU. Ask which box the quote is for.

Lip-Bu Tan's Computex keynote, on that same newsroom page, ties the week to inference, agentic AI, and physical AI, from chip to system[8]. The useful residue for a buyer is narrower. Intel spent June telling you the CPU is back in the serving path, and spent August telling you the GPU it wants in that path is an air-cooled PCIe card with a lot of LPDDR5X[1][8]. The RDU rack is a parallel offer, not a footnote you can ignore if someone is trying to sell you "Intel inference" as one product.

## What you can write down this morning

Here is the sheet I would actually keep.

Put 32 Xe3P cores and 256 XMX engines in the compute row. Those are on Intel's August page[1]. Put 350 W, air-cooled, PCIe, in the power row. That figure is on the August page and in the June archive[1][3]. Put PCIe Gen5 x16 in the link row, and mark it as slide-reported[5][6]. Put 160 GB in the memory row for Intel's own card, and 480 GB only in a notes column labeled "ODM ceiling."[1][5][6]

Leave bandwidth empty. Leave FLOPS empty. Leave price empty. Leave the ship date empty on any row that cites Intel[1][3][4].

TechSpot, on August 25, wrote that customer sampling was expected to begin in the then-current quarter, and that launch was slated for 2027[6]. August 25 sits in the third quarter. Today is October 6. That quarter has closed. Intel's pages fetched this morning still do not say the cards have sampled, and they still do not print a 2027 launch line[1][4]. A reporter's expectation from August is not a delivery commitment in October. If a vendor tells you samples are out, ask for the Intel document. Do not ask this column to invent one.

Developers have a nearer machine, and it is the one Intel named in June: Arc Pro, same Xe foundation, forward and backward compatibility onto Crescent Island[3]. The talk, as recorded, also names a software stack you can recognize: vLLM, SGLang, and llm-d among the serving runtimes, and Triton, SYCL-TLA, oneCCL, oneDNN, SYCL, Level Zero, and an OpenCL compute runtime underneath[5]. "Day 0" and "upstream-first" are Intel's words in the June archive and in TechSpot's slide summary[3][6]. They are promises about familiarity. They are not a test log.

Xeon 6+ is the host you can take to ASUS, Dell, Ericsson, GIGABYTE, HPE, Lenovo, or Supermicro and have a conversation that is not about a code name[3]. Ask for the 18A part, the channel count, and whether Application Energy Telemetry is enabled in the BIOS you will actually get[3][4]. Then ask, separately, whether that platform's PCIe slots are the Gen5 x16 devices a Crescent Island card would need, or whether the quote is for Diamond Rapids and a card that is not shipping under a product name yet[1][5].

The card Intel has described is a bet that capacity, an air-cooled 350 W slot, and a software stack you already know will matter more than a bandwidth number the company has not printed[1][3][5]. That bet might be right for a serving fleet that is memory-capacity bound and willing to use draft models. It is not a bet you can score this morning. The scorecard is missing the column that says how fast the gigabytes move.

## Sources

[1] https://www.intel.com/content/www/us/en/newsroom/news/client-computing/intel-outlines-architectures-for-agentic-ai-at-hot-chips-2026.html — Intel Outlines Architectures for Agentic AI at Hot Chips 2026
[2] https://newsroom.intel.com/client-computing/intel-outlines-architectures-for-agentic-ai-at-hot-chips-2026 — Intel Newsroom: Hot Chips 2026 architectures
[3] https://web.archive.org/web/20260711051648/https://newsroom.intel.com/data-center/intel-puts-agentic-ai-xeon-6-networking-ai-systems — Intel Xeon 6+ and Crescent Island, archived 11 July 2026
[4] https://newsroom.intel.com/data-center/intel-puts-agentic-ai-xeon-6-networking-ai-systems — Intel Puts Agentic AI to Work with Xeon 6+, Networking, and AI Systems
[5] https://www.servethehome.com/intel-crescent-island-160gb-to-480gb-lpddr5x-ai-gpu-at-hot-chips-2026 — ServeTheHome: Crescent Island at Hot Chips 2026
[6] https://www.techspot.com/news/113611-intel-confirms-crescent-island-gpu-pack-32-xe3p.html — TechSpot: Crescent Island 32 Xe3P cores and up to 480GB
[7] https://web.archive.org/web/20260919005748/https://www.intel.com/content/www/us/en/newsroom/news/client-computing/intel-outlines-architectures-for-agentic-ai-at-hot-chips-2026.html — Hot Chips 2026 page as archived 19 September 2026
[8] https://newsroom.intel.com/artificial-intelligence/intel-announces-new-ai-innovations-at-computex — Intel Announces New AI Innovations at Computex
