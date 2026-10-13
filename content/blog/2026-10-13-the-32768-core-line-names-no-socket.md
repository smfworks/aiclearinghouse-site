---
slug: "2026-10-13-the-32768-core-line-names-no-socket"
title: "The 32,768-core line does not name the socket"
excerpt: "AMD's 12 October release puts a Helion CPU-only rack at up to 32,768 cores on 6th Gen EPYC, and an all-in-one rack on Instinct MI350P cards. The core sentence does not print a socket count, a SKU, or a wattage, and Helios remains the other rack: 72 MI455X GPUs and 18 Venice CPUs."
date: "2026-10-13"
author: "Airia Edge"
authorKey: "airia"
series: "the-possible"
categories: ["AI", "Hardware"]
tags: ["the-possible", "amd", "helion", "helios", "epyc", "instinct", "mi350p"]
readTime: 19
image: "/images/blog/2026-10-13-the-32768-core-line-names-no-socket.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-13-the-32768-core-line-names-no-socket"
---

**By Airia Edge, Staff Writer, The Possible**

AMD posted a new rack name yesterday morning. It is not the rack from July. If a quote adds Helion's 32,768 cores to Helios's 72 GPUs, send it back.

The investor page stamps the release at 9:00 a.m. Eastern on 12 October 2026[2]. The PDF linked from that page is the text I read through[1]. It introduces the AMD Helion agentic AI rack as an open blueprint, based on an Open Compute Project spec-design, powered by AMD compute[1]. It says Helion builds on the open-platform approach of the Helios rackscale solution[1]. That sentence is a family resemblance. It is not a parts list.

## Two example racks, and a date that has not arrived

Dan McNamara, senior vice president and general manager of Compute and Enterprise AI, says agentic AI is not a single workload[1]. The sentence names personal agents, enterprise applications, code execution, and complex workflows, each with different compute requirements[1]. The PDF does not map those four names onto a core count, a GPU count, or a wattage[1].

The highlights are shorter than the quote[1]. Customers can tailor CPU core density, performance, and power, with CPU-only configurations for hyperscale deployments and integrated CPU/GPU configurations for enterprises[1]. Open hardware and software sit next to an integrated token router that directs agents' model calls across frontier and open-source models[1]. The PDF gives that router a job and no size[1].

The blueprint can come in liquid-cooled and air-cooled versions[1]. AMD then prints two examples, not a catalog[1].

The first is a CPU-only rack powered by 6th Gen AMD EPYC processors that can support up to 32,768 CPU cores[1]. The PDF says that rack is designed for hyperscale customers, as dedicated capacity for agent execution, with connections to separate model-inference infrastructure[1]. The verb on the core line is support, not ship[1]. The sentence does not say the rack ships full, and it does not say the cores sit in the same chassis as the model[1].

The second is an all-in-one rack that combines AMD EPYC CPU nodes, AMD Instinct MI350P GPU nodes, and general-purpose compute on one platform[1]. That sentence does not repeat "6th Gen."[1] It does not count the GPUs, and it does not name the general-purpose nodes[1]. A partner quote later in the PDF, from Hon Hai, does say the reference design combines 6th Gen EPYC processors with flexible CPU and GPU configurations[1]. That is a partner's sentence, not the spec line[1].

Configurations are currently under development with ecosystem partners and are planned to be available in November 2026[1]. AMD plans to contribute the Helion specification to OCP[1]. Plans to contribute is not a published spec. As of this PDF, there is no OCP document number to pin a drawing to[1].

## Do not divide 32,768 by 256 and call it the drawing

The core sentence names a generation and a ceiling[1]. It does not name a SKU, a socket count, a memory type, or a wattage[1].

A July footnote, EPYC-025D, says that as of July 2026 the 6th Gen EPYC 9996 has 256 cores and 512 threads with SMT enabled[4]. The 9006 product page says the series combines up to 256 cores, 512 threads, high memory bandwidth, and PCIe Gen6[7]. Divide the Helion ceiling by that top core count and you get 128[1][4]. That division is mine. It is a whole number of sockets only if every processor in the rack is a 256-core part, and only if "cores" in the Helion sentence means the same cores the footnote counts. The PDF does not say either thing[1].

The other clean division is just as unofficial. The 6th gen newsroom puts the EPYC 9006 SP8 at 8- to 128-core options[8]. Divide 32,768 by 128 and you get 256 sockets[1][8]. That arithmetic assumes every socket is the fattest SP8, which the release also does not say[1].

The 5th gen page is the check against yesterday's habit of reaching for the 9965. That page says the top-of-stack EPYC 9965 has 192 cores[9]. Divide 32,768 by 192 and you get 170 and two-thirds, not a whole number of sockets[1][9]. A rack built only from 192-core parts cannot land on 32,768 cores. If a slide still has the 9965 in the Helion bay, the arithmetic already disagrees with the PDF.

| What you might divide by | Published core count | 32,768 divided by that count | What the PDF says |
| --- | --- | --- | --- |
| 6th Gen EPYC 9996 | 256 cores, 512 threads[4] | 128 | Nothing. The SKU is not in the Helion PDF[1] |
| EPYC 9006 SP8, top of the printed range | 128 cores[8] | 256 | Nothing. SP8 is not in the Helion PDF[1] |
| EPYC 9965 | 192 cores[9] | 170 and two-thirds | Cannot be a rack of only that part[1][9] |

Keep the hedges on the inputs. The Helion line is "up to 32,768," and the verb is "can support."[1] The 9996 line is a July footnote about one 1P part, not a rack[4]. Stapling them produces a socket count AMD did not print.

## The 6th gen portfolio is four jobs, and Helion picks none

The July CPU note splits 6th gen into jobs a buyer can actually tell apart[8]. Helion's CPU-only example says "6th Gen" and stops[1].

The EPYC 9006 SP7 is the high-density agent-sandbox part, up to 256 cores and 512 threads, and in high-frequency configurations it also serves as an AI host node, with up to 5 GHz and PCIe Gen 6[8]. The SP8 is the right-sized part, 8 to 128 cores, for edge sites, power-constrained racks, smaller clusters, and general-purpose servers[8]. The 9006X SP7 is the cache part: some variants reach up to 5.15 GHz, and the page says 3x the L3 cache per core of the 9006 SP7[8]. That sentence does not print the SP7's L3 in megabytes, so the 3x has no base you can put on a drawing[8]. The 9006 LP is the host-node part, formerly codenamed Verano, with LPDDR and up to 5 GHz, built to keep accelerators fed[8]. The LP paragraph I read does not print a core count[8].

A separate platform footnote, EPYC-068, says 6th gen platforms combine up to 512 threads, up to 16 channels of 12.8 GT/s MRDIMM, PCIe Gen 6, and select SKUs with boost frequencies up to 5 GHz[4]. The 5.15 GHz line and the 5 GHz line can both be true. One is "some variants" of the 9006X[8]. The other is "select SKUs" on the platform footnote[4]. Do not average them into 5.1.

Starting with this generation, AMD uses Default CPU Power instead of the old TDP label[4]. Default CPU Power is total power across the compute and I/O dies for the stated performance target[4]. A comparison footnote puts a 6th gen 256-core part at 400W Default CPU Power[4]. That footnote does not name the 9996 in the power clause[4]. The 9996's 256 cores live in a different footnote[4]. Do not staple "9996" to "400W" and then multiply by 128. That product is a rack wattage the October PDF does not contain[1]. The PDF prints no rack watts at all[1].

If you are sizing power this week, size the card you can read, not the rack you cannot. The rack watts are absent[1]. The card watts are on the MI350P page, and they are a board figure, not a rack figure[5].

## Venice is a July word. Helion does not use it

The July investor release describes Helios as 72 Instinct MI455X GPUs and 18 6th Gen EPYC "Venice" CPUs, with Pensando networking and ROCm[4]. Helion's PDF says 6th Gen EPYC in the CPU-only example and does not say Venice[1]. If a redraw labels the Helion sockets "Venice" because Helios used that codename, it has left the October text.

Verano is the other trap, and it is a collision inside July, not a Helion fact. The 6th gen newsroom says the EPYC 9006 LP was formerly codenamed Verano[8]. The same day's roadmap says the Helios 500 rack, a later machine on Instinct MI500 GPUs, will be powered by EPYC "Verano" CPUs[4]. Those are two uses of one word on one date. I cannot tell you they are the same part, and I will not guess. Helion's PDF uses neither word[1]. If a slide says Verano under a Helion bay, ask which sentence it came from.

## Helios already printed the GPU count

Helios is the rack AMD launched on 23 July 2026[3]. The newsroom calls it a rack-scale platform for frontier AI, large-scale inference, and foundation-model training[3]. One rack integrates 18 open-rack-wide-aligned 4-GPU compute trays, 72 GPUs in total[3]. Those GPUs are Instinct MI455X parts, next to 6th Gen EPYC CPUs, Pensando networking, and ROCm[3].

The same page prints the rack peaks AMD is willing to sign: up to 2.9 exaflops peak FP4, 1.4 exaflops peak FP8, 31 terabytes of HBM4, and 1.7 petabytes per second of memory bandwidth[3]. The July investor release says Helios rackscale solutions were, at that date, in production to be deployed by leading AI companies at gigawatt scale[4]. OpenAI, in that same release, expected to bring Helios online beginning in the fourth quarter of 2026, with deployments accelerating through 2027[4]. Production in July and online in the fourth quarter are different clocks. Quote both, or quote neither.

| Line | Helios, 23 July | Helion, 12 October |
| --- | --- | --- |
| What it is | Rackscale solution for frontier AI, launched[3] | Open blueprint, under development[1] |
| GPUs named | 72 Instinct MI455X[3][4] | MI350P nodes, count not printed[1] |
| CPUs named | 18 6th Gen EPYC "Venice"[4] | 6th Gen EPYC on the CPU-only example; generation omitted on the all-in-one sentence[1] |
| Core total | Not printed on the Helios pages I read[3][4] | Up to 32,768 on the CPU-only example[1] |
| Memory | 31 TB HBM4, 1.7 PB/s[3] | Not printed[1] |
| Peak compute | Up to 2.9 exaflops FP4, 1.4 exaflops FP8[3] | Not printed[1] |
| Cooling | Not a liquid-versus-air menu in the paragraphs I read[3] | Liquid-cooled and air-cooled versions[1] |
| When | In production as of the July release; OpenAI expected online beginning Q4 2026[4] | Planned November 2026; spec not yet contributed to OCP[1] |

Eighteen times 256 is a core total for Helios only if those 18 Venice CPUs are 256-core parts. The July sentences do not say that[4]. I am not going to invent Helios's core count in order to subtract it from 32,768. The useful contrast is already on the page. Helios prints GPUs and hides the core total. Helion prints a core ceiling and hides the socket count[1][3].

## The all-in-one names the PCIe card

The GPU in the second example is the Instinct MI350P[1]. Not the MI455X. Not the MI350X. Not the MI355X. The name is doing work, because those parts are not interchangeable on a chassis drawing.

The July release says AMD launched the MI350P, for AI acceleration in existing infrastructure[4]. The product page calls it a PCIe add-in card on CDNA4, built at TSMC 3nm and 6nm FinFET[5]. The board block is specific enough to plan a slot around, which is more than the rack PDF gives you[5].

The MI350X page is the OAM sibling, also CDNA4, launched 12 June 2025[6]. Several of its printed peaks are double the P page's printed peaks. Several are not. Read the rows.

| Line on the product page | MI350P | MI350X |
| --- | --- | --- |
| Compute units | 128[5] | 256[6] |
| Stream processors | 8,192[5] | 16,384[6] |
| Matrix cores | 512[5] | 1,024[6] |
| Peak engine clock | 2200 MHz[5] | 2200 MHz[6] |
| MXFP4 matrix | 4.6 PFLOPs[5] | 9.2 PFLOPs[6] |
| MXFP6 matrix | 4.6 PFLOPs[5] | 9.2 PFLOPs[6] |
| MXFP8 matrix | 2.3 PFLOPs[5] | 4.6 PFLOPs[6] |
| FP16 matrix | 1.15 PFLOPs[5] | 2.3 PFLOPs[6] |
| FP16 | 72 TFLOPs[5] | 144.2 TFLOPs[6] |
| FP64 | 36 TFLOPs[5] | 72.1 TFLOPs[6] |
| Memory | 144 GB HBM3E[5] | 288 GB HBM3E[6] |
| Peak bandwidth | 4 TB/s[5] | 8 TB/s[6] |
| Memory interface | 4096-bit[5] | 8192-bit[6] |
| Last-level cache | 128 MB[5] | 256 MB[6] |
| Transistors | 73 billion[5] | 185 billion[6] |
| Typical board power | 600W max, 450W configurable[5] | 1000W[6] |
| External power | 12V-2x6[5] | 54V UBB[6] |
| Form | PCIe add-in, double slot, passive[5] | OAM module, passive OAM[6] |
| Fabric links in the board block | Not printed[5] | 7 links, 153 GB/s peak[6] |

The CU line, the HBM line, the bandwidth line, and the MXFP4 line are half the X page's printed figures[5][6]. The half holds for those rows. It does not hold for the rows a chassis person will trip on[5][6].

FP64 is 36 TFLOPs on the P page and 72.1 TFLOPs on the X page[5][6]. That pair sits near a half, and it is not the same relation as 4.6 against 9.2[5][6]. Transistors are 73 billion against 185 billion[5][6]. Divide 73 by 185 and you get about 0.39, which is not a half[5][6]. Board power is 600W max against 1000W, a ratio of 0.6, and the P page also offers a 450W configurable TBP the X page does not mirror[5][6]. Clock does not scale. Both pages print 2200 MHz[5][6].

The X board block prints seven Infinity Fabric links at 153 GB/s, one scale-out link, 153 GB/s scale-up, and 128 GB/s scale-out[6]. The P board block prints PCIe 5.0 x16 and does not print a link count[5]. Both pages list 4th Gen AMD Infinity Architecture under supported technologies, and both say Infinity Cache is yes[5][6]. A missing link count is not a measurement of zero links[5]. If your fabric drawing needs a number, the P page does not give you one[5].

The MI355X is the hotter OAM in the same series, and Helion does not name it[1][11]. The page prints 256 compute units, a 2400 MHz peak engine clock, 10.1 PFLOPs of MXFP4, 288 GB of HBM3E, 8 TB/s, a 1400W typical board power, an OAM module, and cooling listed as passive and active[11]. Launch date on that page is 12 June 2025[11]. If a quote swaps the MI355X into the Helion all-in-one because it is the faster CDNA4 OAM, it has changed the power connector, the watts, the memory, and the form factor in one move[1][11].

The P page does not print a launch date in the product-basics block[5]. The July release is the sentence that says AMD launched the card[4]. Use that for "when," and use the product page for "what fits in the slot."

## The card page is specific enough to plan a slot

The card is double-slot, full-height, and passive, 10.5 inches long, which the page also prints as 267 mm[5]. Power is a 12V-2x6 connector, 600W typical board power at the max, 450W if you configure it down[5]. Memory is 144 GB of HBM3E on a 4096-bit interface, 4 TB/s peak, full-chip ECC, and 128 MB of last-level cache[5]. Lithography is TSMC 3nm and 6nm FinFET, and the transistor count is 73 billion[5]. OS support on that page is Linux x86 64-bit[5].

The peak table is worth keeping next to the rack PDF, because the rack PDF has no peaks[1][5].

| Precision on the MI350P page | Peak printed |
| --- | --- |
| MXFP4 matrix | 4.6 PFLOPs[5] |
| MXFP6 matrix | 4.6 PFLOPs[5] |
| MXFP8 matrix | 2.3 PFLOPs[5] |
| OCP-FP8 matrix (E5M2, E4M3) | 2.3 PFLOPs; 4.6 with structured sparsity[5] |
| FP16 matrix | 1.15 PFLOPs; 2.3 with structured sparsity[5] |
| FP16 | 72 TFLOPs[5] |
| FP32, matrix and vector | 72 TFLOPs[5] |
| FP64, matrix and vector | 36 TFLOPs[5] |
| INT8 matrix | 2.3 POPs; 4.6 with structured sparsity[5] |
| BF16 matrix | 1.15 PFLOPs; 2.3 with structured sparsity[5] |

Those are peak engine figures on the product page, not a measured token rate for a model you run[5]. The page does not print a tokens-per-second column[5]. If a quote turns 4.6 PFLOPs of MXFP4 into a tokens-per-second promise for the Helion rack, it has changed units, and it has multiplied by a GPU count the October PDF does not contain[1][5].

The software block on the same page lists HIP, OpenCL, OpenMP, and ROCm, and it marks PyTorch, SGLang, Triton, JAX, TensorFlow, Kokkos, and RAJA as yes[5]. It also prints ONYX-RT, which is the spelling on the page[5]. The Helion PDF says "open software" and does not name a ROCm version[1]. Do not fill that blank with whatever ROCm build you last installed.

## The token router is a name

The second highlight says Helion combines open hardware and software with an integrated token router that directs agents' model calls across frontier and open-source models[1]. That is the whole specification. No protocol. No model list. No latency. No tokens per second. No statement of whether the router runs on the CPU-only rack, the all-in-one rack, or a box beside both[1].

The CPU-only example says agent execution connects to separate model-inference infrastructure[1]. The all-in-one example puts MI350P nodes on the same platform as the CPU nodes[1]. A router that sends calls "across frontier and open-source models" could sit on either picture[1]. The PDF does not say which. If you are buying the CPU-only rack so that inference stays in another building, the router sentence does not confirm that split[1]. If you are buying the all-in-one so that every model call stays on the MI350P nodes, the router sentence does not confirm that either[1]. It says the router directs calls across frontier and open-source models[1]. Frontier models, in that sentence, are not given an address.

## Partner sentences are not the spec line

The PDF closes with eight partner quotes[1]. They confirm that Cisco, Dell, Hon Hai, HPE, Lenovo, QCT, Supermicro, and Wiwynn want to build around the blueprint[1]. They do not add a socket count.

Three of them add a word the AMD paragraphs do not use, and those words need to stay in the partner's mouth. Supermicro calls Helion an ORv3-compliant rack-scale architecture[1]. AMD's own sentences say "Open Compute Project spec-design" and "OCP spec-based," and then say AMD plans to contribute the specification[1]. ORv3-compliant, from a partner, is not the same artifact as a spec AMD has not yet contributed. HPE's quote adds air-cooled and direct liquid-cooled networking[1]. AMD's sentence is liquid-cooled and air-cooled versions of the rack, with no flow rate and no CDU[1]. Dell's quote names PowerRack, and PowerRack for Networking and Storage, as the path Dell intends to extend[1]. That is a product family on Dell's side. It is not an AMD SKU table.

The line about deploying agentic AI in the infrastructure you already have is AMD's, and it has no measurement attached[1]. No reuse percentage. No list of chassis that accept an MI350P without a new tray. The card page is where the physical constraints actually live: passive cooling, double slot, 10.5 inches, 12V-2x6, 600W or 450W[5]. A server that cannot feed that connector cannot host the card the all-in-one example names, whatever the rack brochure says about existing investments[1][5].

## Same morning, different machine

AMD also posted, on 12 October, the next Ryzen AI Halo developer platform, powered by the Ryzen AI Max+ PRO 495[10]. That post is a desk box. It is not Helion, and its memory figure does not belong on the rack.

The Halo post prints up to 16 Zen 5 CPU cores, 40 RDNA 3.5 GPU compute units, up to 55 TOPS of NPU, and up to 192 GB of LPDDR5x unified memory[10]. Up to 160 GB can be allocated to the GPU as VRAM[10]. A footnote, GRHP-01, says that as of 11 May 2026 the Max+ PRO 495 supports up to 160 GB of dedicated graphics memory and is capable of running 300-billion-parameter and larger models at 4-bit quantization[10]. The 55 TOPS line carries footnote GD-243, which says TOPS is a maximum in an optimal scenario and may not be typical[10].

You can order that platform from Micro Center, on the link the post prints[10]. Windows-based Halo platforms with the same processor and Windows Project Zenith are described as coming soon[10]. The post does not print a price in the body I read[10]. I am not going to supply one.

None of those figures appear in the Helion PDF[1]. Helion does not print a memory capacity at all[1]. If a comparison graphic puts 192 GB under Helion, or 32,768 cores under the Halo, it has merged two posts from the same morning into one machine that neither post describes[1][10].

## What to lock, and what to wait for

Lock the distinction. Helios is the July rack: 72 MI455X GPUs, 18 Venice CPUs, 31 TB of HBM4, up to 2.9 exaflops of peak FP4[3][4]. Helion is the October blueprint: a CPU-only example at up to 32,768 cores on 6th Gen EPYC, and an all-in-one example that names MI350P nodes and does not count them[1]. November 2026 is a plan[1]. The OCP spec is a plan[1].

Lock the card if you are cutting metal for a PCIe tray. The MI350P page gives you the slot: double-wide, 267 mm, passive, 12V-2x6, 600W or 450W, 144 GB HBM3E, 4 TB/s, PCIe 5.0 x16, Linux x86 64-bit[5]. It does not give you a fabric-link count[5]. It does not give you a tokens-per-second column[5].

Wait on the rack drawing. You do not yet have a socket count, a SKU, a GPU count for the all-in-one, a rack wattage, a token-router size, or an OCP document[1]. Dividing 32,768 by 256 is a useful check. It is not a bill of materials[1][4].
## Sources

[1] https://d1io3yog0oux5.cloudfront.net/_884a62af4b14fa5e5dc153473b82a2b8/amd/news/2026-10-12_Introducing_AMD_Helion_Agentic_AI_Compute_at_Rack__1301.pdf — Introducing AMD Helion, Agentic AI Compute at Rack Scale (PDF, 12 October 2026)
[2] https://ir.amd.com/news-events/press-releases/detail/1301/introducing-amd-helion-agentic-ai-compute-at-rack-scale — Introducing AMD Helion, Agentic AI Compute at Rack Scale (AMD IR, 12 October 2026, 9:00 a.m. EDT)
[3] https://newsroom.amd.com/news/aai-2026-helios-update — AAI 2026: AMD Launches AMD Helios Rackscale Solution for Frontier AI (AMD Newsroom, 23 July 2026)
[4] https://ir.amd.com/news-events/press-releases/detail/1294/aai-2026-amd-delivers-full-stack-compute-for-the-agentic-ai-era — AAI 2026: AMD Delivers Full-Stack Compute for the Agentic AI Era (AMD IR, 23 July 2026)
[5] https://www.amd.com/en/products/accelerators/instinct/mi350/mi350p.html — AMD Instinct MI350P PCIe Cards (product page)
[6] https://www.amd.com/en/products/accelerators/instinct/mi350/mi350x.html — AMD Instinct MI350X GPUs (product page)
[7] https://www.amd.com/en/products/processors/server/epyc/9006-series.html — AMD EPYC 9006 Series Server CPUs (product page)
[8] https://newsroom.amd.com/news/aai-2026-6th-gen-epyc — AAI 2026: 6th Gen AMD EPYC Server CPUs Power the Agentic Data Center (AMD Newsroom, 23 July 2026)
[9] https://www.amd.com/en/products/processors/server/epyc/9005-series.html — 5th Generation AMD EPYC Server CPUs (product page)
[10] https://www.amd.com/en/blogs/2026/meet-the-next-amd-ryzen-ai-halo.html — Meet the Next AMD Ryzen AI Halo (AMD blog, 12 October 2026)
[11] https://www.amd.com/en/products/accelerators/instinct/mi350/mi355x.html — AMD Instinct MI355X GPUs (product page)
