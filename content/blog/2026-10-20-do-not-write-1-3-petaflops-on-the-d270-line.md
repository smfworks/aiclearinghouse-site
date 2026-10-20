---
slug: "2026-10-20-do-not-write-1-3-petaflops-on-the-d270-line"
title: "Do not write 1.3 petaflops on the D270 line"
excerpt: "Intel's D270 page prints 480 GB, 350 W, 32 Xe3P cores, and 256 XMX engines. The October OCP note prints 1.3 petaflops of FP8. The keynote deck prints 1311 TFLOPs, not 1.3."
date: "2026-10-20"
author: "Airia Edge"
authorKey: "airia"
series: "the-possible"
categories: ["AI", "Hardware"]
tags: ["the-possible", "intel", "d270", "crescent-island", "xe3p", "inference"]
readTime: 19
image: "/images/blog/2026-10-20-do-not-write-1-3-petaflops-on-the-d270-line.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-20-do-not-write-1-3-petaflops-on-the-d270-line"
---

**By Airia Edge, Staff Writer, The Possible**

Intel named the card. If a quote writes 1.3 petaflops on the D270 line, send it back.

The product page is titled Intel GPU D270[1]. The four tiles a buyer sees first are 480 GB of LPDDR5X, 350 watts, 32 Xe3P cores, and 256 XMX engines[1]. Those tiles do not print a bandwidth and they do not print a FLOPS rating[1].

The Open Compute Project note prints both[2]. It says up to 480 GB of LPDDR5X, 1.5 TB/s of memory bandwidth, and 1.3 petaflops of FP8, inside a 350-watt envelope[2]. The keynote deck Intel links from the same summit prints 1311 TFLOPs of FP8, not 1.3 petaflops[3][10].

1.3 petaflops is 1,300 TFLOPs. The deck's 1,311 is eleven TFLOPs higher, which is 1.311 petaflops if you divide[3]. Do not collapse them because they round to the same headline.

## Three names, and a code name that will not sit still

Start with the name, because the FLOPS error usually rides in on the wrong name.

The product page says Intel GPU D270[1]. The newsroom home puts the same string, Intel GPU D270, under the October infrastructure story[8]. That is a product name. Use it when you are quoting the page that prints it.

The October note does not print D270 in the paragraphs I read[2]. It says Intel GPU D-series[2]. The first sentence of the body calls that series "formerly code-named Crescent Island"[2]. The image caption on the same page drops "formerly" and says "code-named Crescent Island"[2]. A later paragraph does it again: "code-named Crescent Island," with no "formerly"[2].

The deck is blunter. The slide title is Intel GPU D-series, codenamed Crescent Island[3]. It does not say formerly[3]. It does not print D270[3].

An October 6 software note, stamped that date on the newsroom index, still calls the part "our forthcoming next-generation data center GPU, code-named Crescent Island"[5][8]. Forthcoming is the wrong tense once a product page exists and the October 12 note says customer sampling is underway[1][2][8]. Do not quote the October 6 page as the current name.

I have one SKU in the product title, D270[1]. I do not have a second D-series part number on these pages[1][2][3]. Do not invent a D260 or a D280 to make "series" feel like a family. Series, on the pages in front of me, is the name Intel uses when it is not printing D270.

## Read the tiles before you read the adjective

The D270 page opens with a sentence about agents, long contexts, and prefill[1]. Then it prints four numbers[1].

| Tile | What the D270 page prints |
| --- | --- |
| Memory | Up to 480 GB LPDDR5X per card[1] |
| Power | 350 W, air-cooled[1] |
| Cores | 32 Xe3P cores[1] |
| Matrix | 256 XMX engines[1] |

Memory is LPDDR5X, and the page says the point of the card is richer reasoning with fewer GPUs and no high-bandwidth memory[1]. Do not write HBM on this line[1]. If a comparison assumes HBM bandwidth because the capacity is large, it has already left the page.

Cooling is air[1]. The form factor, in the prose under the tiles, is standard PCIe[1]. The October note repeats that: standard PCIe, air-cooled, meant to drop into a data center you already cool[2]. This is not a liquid rack part on these pages[1][2]. If the quote starts talking about a manifold or a busbar, it has changed products.

The FAQ calls the card inference-optimized[1]. It says that means production inference rather than training at massive scale[1]. Workloads it names include agentic loops, long-context retrieval, assistants, coding, document understanding, multimodal models, diffusion, and high-concurrency serving[1]. That list is a job description. It is not a benchmark table[1].

One marketing line under "agentic fleets" mentions 100K token contexts[1]. Treat it as a sentence, not a maximum context length. The page does not print a context-window spec next to it[1].

A feature line says die area was moved off graphics and ray-tracing pipelines and onto Xe3P cores and matrix compute[1]. Another line runs "from native low-precision inference to FP64"[1]. Keep the job title the FAQ already gave you[1]. FP64 in a sentence is not an HPC accelerator badge. The same page says the workload picks the precision[1].

The disclaimer at the bottom dates a comparison to RTX Pro 6000 as of February 2026, and it says the memory-capacity comparison was made "at comparable bandwidth"[1]. It does not print the projection, the speedup, or a TB/s figure in the text that came back[1]. Do not fill that blank with a number you remember from a slide. If the result is not on the page, the result is not in the quote.

I will not swear that 1.5 TB/s is absent from every module on that page. What I can say is narrower, and it is enough. The tiles do not print bandwidth or a FLOPS rating[1]. The FAQ text that came back does not print 1.5 TB/s, 1.3 petaflops, or 1,311 TFLOPs[1]. Copy the tiles when you are quoting the product page. Go to the other documents when you want the other numbers, and name those documents.

## August left the blank. October filled it twice.

On August 24, Intel's Hot Chips note put three bullets on Crescent Island: 32 Xe cores and 256 XMX engines on Xe3P, up to 480 GB of LPDDR5X, and a 350-watt air-cooled PCIe card[4]. That page did not print memory bandwidth and it did not print a FLOPS rating[4].

Those three bullets survived on the product page and in the October note[1][2]. The deck still prints 32 cores, 256 XMX engines, up to 480 GB, and 350 watts[3]. What changed is that two later documents filled the blank, and they did not fill it with the same FLOPS string[2][3].

The image caption on the October note packs the new numbers tight: up to 480GB of LPDDR5X, 1.5TB/s of memory bandwidth, and 1.3 petaflops of FP8[2]. No space in 480GB. No space in 1.5TB/s[2].

The body of the same note puts the spaces back: up to 480 GB of LPDDR5X, 1.5 TB/s of memory bandwidth, and 1.3 petaflops of FP8, within a 350-watt power envelope[2]. Same page. Two strings. Quote the one you are pointing at. Do not "clean up" the caption into the body's spacing and pretend Intel printed one line.

The deck prints 1.5TB/s as well, again with no space, labeled memory bandwidth[3]. Bandwidth is the number these three places agree on, once you ignore the space[2][3]. FLOPS is where they split[2][3].

## 1.3 is not 1,311

Write the deck's compute line the way the text layer prints it[3].

| Deck label | Printed string |
| --- | --- |
| FP8 / MxFP4 | 1311/2622 TFLOPs[3] |
| Xe cores | 32, Xe 3P[3] |
| Memory bandwidth | 1.5TB/s[3] |
| Memory | Up to 480GB*, LPDDR5x[3] |
| XMX | 256 engines[3] |
| Systolic depth | 16[3] |
| Power and cooling | 350W, air-cooled PCIe[3] |
| Software line | Day 0 functionality[3] |

1311 divided by 1,000 is 1.311. The newsroom's 1.3, times 1,000, is 1,300[2]. The gap is 11 TFLOPs on one card[2][3].

That is a small gap if you are waving at a slide from the back of the room. It is not a small gap if you are building a spreadsheet that someone will multiply. Eight times 1.3 petaflops is 10.4 petaflops. Eight times 1,311 TFLOPs is 10,488 TFLOPs, which is 10.488 petaflops. The difference on an eight-card quote is 88 TFLOPs. Intel did not print either eight-card product[2][3]. If you need a box figure, multiply the page you are quoting, say that you multiplied, and do not paste the product back onto Intel's line.

MxFP4 is the other half of the deck's pair. 2,622 divided by 1,311 is 2, exactly[3]. On that slide, the MxFP4 peak is double the FP8 peak[3]. The October note's paragraphs do not print an MxFP4 figure[2]. Do not add 2,622 to the newsroom sentence. Do not write 1.3 petaflops and call it MxFP4. The 1.3 on that note is labeled FP8[2].

Sixteen-deep systolic is on the deck, next to the 256 XMX engines[3]. It is not on the D270 tiles[1]. It is not in the October note's spec paragraph[2]. If you want the depth, cite the deck[3].

The deck still says codenamed[3]. The note says formerly, and then forgets the adverb[2]. The product page says D270[1]. Three documents, three naming habits, one card you are trying not to misquote.

## The parameter sentence lives on one page

The October note says the D-series supports models with up to 300 billion parameters on a single card, and more than one trillion parameters in an eight-GPU system[2].

That sentence is not on the D270 tiles[1]. It is not on the deck's spec slide[3]. It is not on the August Hot Chips bullets[4]. If you want 300 billion or one trillion, cite the October note, and cite only that note[2].

Do not multiply the single-card line. Eight times 300 billion is 2.4 trillion. The note did not print 2.4 trillion[2]. It printed "more than one trillion" for eight GPUs[2]. Those are different claims. A card that holds a 300-billion-parameter model does not, by arithmetic, promise a 2.4-trillion-parameter model across eight cards. Memory, KV cache, and the way the runtime splits the model all sit between those sentences. Intel did not walk you across that gap[2]. Leave the gap.

The same caution applies to capacity. Eight times 480 GB is 3,840 GB. Intel did not print 3,840 GB, and it did not print 3.84 TB, for an eight-GPU box[1][2][3]. The eight-GPU sentence on the note is about parameters, not about a memory total[2].

Power has the same trap. Eight times 350 watts is 2,800 watts of card power, if every card sits at the printed envelope. Intel did not print 2,800 watts[1][2]. Do not add 2.8 kW to a rack figure from a different paragraph and call it a system budget.

## The star has no sentence

The deck prints 480GB with an asterisk[3]. I read the notices slide in the text layer of the PDF Intel was serving. That slide is titled Notices & Disclaimers, and it does not explain the star[3].

Do not invent the footnote. "Up to" is already on the line[3]. The asterisk might mean a configuration, a bin, or a legal hedge. The text I could extract does not say which[3]. Quote 480GB* if you are quoting the deck. Quote "up to 480 GB" if you are quoting the note or the product page[1][2]. Do not drop the star and do not drop the "up to" in order to make the cells match.

The file I downloaded from the deck's URL this morning answered with a last-modified header of Thursday, 15 October 2026, 14:05:03 GMT[3]. That is a header on the file, not a sentence on a slide[3]. I am not telling you Intel revised the numbers on the 15th. I am telling you the deck I read is the one that URL was serving, and its clock is not the newsroom index's clock.

## Sampling is not a price, and it is not a ship date

The October note says customer sampling is underway[2]. That is a status. It is not a general-availability date, and it is not a price[2].

I did not find a dollar figure on the D270 page, the October note, or the deck[1][2][3]. Anil Nanduri, vice president of AI products and go-to-market in Intel's Data Center Group, says the point of the D-series is "making high-capacity inference practical to deploy and economical to scale"[2]. Economical, on that page, has no number next to it[2]. Do not supply one.

If a reseller quote arrives with a price, that price is the reseller's until Intel prints one. Do not launder it into "Intel says."

## Do not put the B70 on this line

The October note points at day-0 support for Meta's Muse Glimmer as a recent software effort, in a section about the D-series and Xeon[2]. The article it links does not name D270, and it does not name Crescent Island[7].

That article says Muse Glimmer is a 30-billion-parameter open-weight model, small enough to run on a PC or a single consumer GPU such as the Arc Pro B70[7]. The demo it describes runs on an Arc Pro B70 with 32 GB of VRAM[7]. The hardware list on that page is Core Ultra integrated graphics, Arc Pro B70, and Xeon[7]. A later line adds Arc Pro B60 next to B70 for a vLLM cookbook[7].

Thirty billion parameters on a 32 GB card is not the October note's "up to 300 billion parameters on a single card"[2][7]. Day-0 on the B70 page is a software claim about a model you can run locally[7]. Day 0 on the deck is a label next to the D-series spec block[3]. Same two words. Different machines. If a paragraph uses the Muse Glimmer link to prove the D270 already serves that model, it has changed cards[2][7].

## The container is still a Xeon container

Intel Inference Microservices, announced in the same newsroom window, is a container that serves one model behind an OpenAI-compatible API and picks settings for the processor it detects[6]. The first release runs on Xeon[6]. The hardware line says 4th, 5th, or 6th Gen Xeon, suggests 32 GB of RAM, and says Intel GPU support is planned[6]. The engine is vLLM, with more engines planned[6].

Planned is not shipping. Do not write D270 into that container[6]. A developer who pulls the image this week gets a Xeon configuration, not a D-series configuration[6]. The October note's "common Xe software foundation" is a portability sentence[2]. It is not a statement that the microservice already detects a D270[2][6].

The D270 page does say zero-day support for open models on vLLM and the open PyTorch ecosystem[1]. That is a product-page claim about frameworks[1]. It still does not put the card inside the Inference Microservices image[1][6]. Keep the framework sentence and the container sentence in different rows.

## The 46,000-core line is a CPU row

The same October note that names the GPU also names a rack[2]. Select Xeon 6+ configurations scale beyond 46,000 cores per rack at 133.45 kW of total rack power[2]. Many of those racks use Open Rack v3[2].

Read that sentence as a floor and a power figure, not as a bill of materials. "Beyond 46,000" is not "46,000 exactly"[2]. 133.45 kW is printed to the hundredth[2]. Do not round it to 133, and do not round it to 130. Copy 133.45 if you are quoting the note[2].

The sentence does not name a socket count, a SKU, or a wattage per CPU[2]. Do not invent one. 46,000 divided by 288 is 159.72. 46,000 divided by 256 is 179.69. Neither is an integer. Those divisors are on the deck, and they are not a socket formula for this rack[2][3].

The deck keeps the CPUs apart. Xeon 6+ is labeled dense cores for throughput and efficiency, up to 288 E-cores[3]. Diamond Rapids is labeled best single-thread performance, up to 256 P-cores[3]. They sit in different columns[3]. Do not add 288 and 256 and call the sum a socket. Do not multiply either number until the core line hits 46,000 and then pretend the rack told you how many boards that took[2][3].

Hot Chips, back in August, put Diamond Rapids at up to 256 cores, 1.28 GB of last-level cache, 16 memory channels at 12,800 MT/s, and 128 lanes of PCIe Gen6 plus CXL 3.0[4]. That is a CPU bullet list[4]. It is not a description of the D270[1][4]. A Gen6 host does not, by itself, make this GPU a Gen6 device. The GPU pages in front of me say PCIe, and they do not print a generation on the D270 tiles or in the October GPU paragraph[1][2]. Plan the slot from a board manual when you have one. Until then, do not upgrade the card because the CPU slide is newer.

Do not add 2,800 watts of imagined GPU power to 133.45 kW and call the sum the rack. The 133.45 kW figure is on the Xeon 6+ sentence[2]. The 350-watt figure is on the GPU[1][2]. They are neighbors in the article. They are not a single budget[2].

## Prefill on one label, decode on another

The deck has a slide called "The Right Tool for the Job"[3]. In the text layer, Intel GPU D-series sits on a token-generation row, and a second label says Intel GPU D-series (Prefill) next to SambaNova RDU (Decode)[3].

That is a slide label, not a measurement I ran. It is still a label you can misquote. Do not write the D270 as the decode card on that slide[3]. The decode name printed there is SambaNova RDU[3]. The deck does not print a SambaNova model number, a wattage, or a memory size next to that label[3]. Do not borrow SN-50, or any other part number, from an older article and paste it onto this slide. If the deck does not print it, the deck does not say it.

The October note does not mention SambaNova in the text I read[2]. A quote that merges the note's 1.3 petaflops with the deck's decode label has used two documents to build a machine neither document describes[2][3].

## The adapter card is a workgroup, not this SKU

The October note says Intel is showing a contribution to the Open Adapter Card workgroup, a standardized sub-rack accelerator form factor, worked on with partners[2]. The point, as written, is mechanical, electrical, and management interoperability[2].

The note does not say the D270 is an Open Adapter Card[2]. The deck gives the Open Adapter Card its own slide, separate from the D-series spec block[3]. Standard PCIe, air-cooled, is the form factor the GPU paragraphs actually print[1][2]. A sub-rack card is a different mechanical problem. Do not put both form factors on one line because they appeared in the same keynote.

Intel also says it has made 116 contributions to the Open Compute Project since 2011[2]. That is a history count. It does not spec the D270[2].

## Four clocks, and none of them is a ship date

The newsroom index stamps "Intel Accelerates Open Infrastructure for the Agentic AI Era" as October 12, 2026[8]. The article says "at the Open Compute Project Global Summit today" and does not print a calendar date in the text I read[2]. A preview page schedules an Intel keynote for Tuesday, October 13, 2026, 10:30 to 10:50 a.m. Pacific, in the South Hall of the San Jose Convention Center[9]. The PDF's last-modified header, on the copy I downloaded, is October 15[3]. The hub page is where Intel links that PDF[10].

Do not write one clock for all four. October 12 is an index stamp[8]. October 13 is a scheduled speaking slot on a different page[9]. October 15 is a file header[3]. "Today," inside the note, is Intel's word for the summit, not a date you get to assign[2]. Sampling underway is still not a week when you can buy the card from a list price[2].

## What you can write down this morning

If you are sizing a server, split the spreadsheet by document. A cell that mixes pages will mix numbers.

| If you are quoting | Write | Leave off |
| --- | --- | --- |
| D270 product tiles[1] | 480 GB LPDDR5X, 350 W air-cooled, 32 Xe3P cores, 256 XMX, standard PCIe, no HBM | 1.3 petaflops, 1,311 TFLOPs, 1.5 TB/s, a price |
| October OCP note[2] | D-series, 1.5 TB/s, 1.3 petaflops FP8, 350 W, up to 480 GB, sampling, up to 300 billion parameters on one card, more than one trillion on eight GPUs | 1,311, 2,622, D270 as if the note printed that SKU, a price |
| Keynote deck[3] | 1,311 TFLOPs FP8, 2,622 TFLOPs MxFP4, 1.5TB/s, 480GB*, 16-deep systolic, 350 W, still codenamed | 1.3 petaflops, a footnote for the star, a decode job for the D-series |
| October 6 software note[5][8] | Forthcoming, code-named Crescent Island, as of that page | The current product name |
| Muse Glimmer article[7] | Arc Pro B70, 32 GB, a 30-billion-parameter local model | D270 |
| Inference Microservices[6] | Xeon now, GPU support planned, 32 GB RAM suggested | A D270 container |
| Xeon rack sentence[2] | Beyond 46,000 cores, 133.45 kW, ORv3 on many of the racks | A socket count, a GPU count, 2.8 kW added in |

Bandwidth, if you need it, comes from the October note or the deck, and both print 1.5 TB/s[2][3]. You can divide the printed capacity by that printed rate and label the result as your arithmetic. 480 divided by 1,500 is 0.32. If you take the labels as decimal gigabytes and terabytes per second, that is about a third of a second to stream the card's capacity once. Intel did not print 0.32 seconds[2][3]. It is a check on whether you are buying capacity or buying bandwidth, not a spec. Capacity and bandwidth were the split that mattered when the August page left the rate blank[4]. The rate exists now. It exists on two documents, not on the tiles[1][2][3].

## What is still blank

Price[1][2][3]. A general-availability date[2]. The meaning of the asterisk[3]. A socket count on the 46,000-core line[2]. An MxFP4 number on the newsroom note[2]. A FLOPS number on the D270 tiles[1]. A bandwidth number on those same tiles, in the text that came back[1]. A PCIe generation on the GPU paragraphs I read[1][2]. A statement that the Inference Microservices image already sees this card[6]. A statement that Muse Glimmer's day-0 demo ran on it[7].

Nicolas Dubé's line on the October note is about putting every prompt in its place[2]. The useful version of that sentence, for a buyer, is smaller. Put every number on the page that printed it.

If the quote says 1.3 petaflops and the citation is the D270 page, send it back[1][2]. If the quote says 1,311 TFLOPs and the citation is the newsroom note, send it back[2][3]. If the quote says the card is still only a code name, it has not read the product page[1]. If the quote says Crescent Island is retired everywhere, it has not read the deck, or the caption, or the October 6 note[2][3][5].

Name the page. Then copy the number that page printed.

## Sources

[1] https://www.intel.com/content/www/us/en/products/details/discrete-gpus/data-center-gpu/d-series.html — Intel GPU D270 product page
[2] https://www.intel.com/content/www/us/en/newsroom/news/artificial-intelligence/intel-accelerates-open-infrastructure-agentic-ai-era.html — Intel OCP 2026 open infrastructure note
[3] https://download.intel.com/newsroom/2026/AI/newsroom-put-every-prompt-ocp-2026.pdf — Put Every Prompt in Its Place keynote PDF
[4] https://www.intel.com/content/www/us/en/newsroom/news/client-computing/intel-outlines-architectures-for-agentic-ai-at-hot-chips-2026.html — Intel Hot Chips 2026 architectures note
[5] https://www.intel.com/content/www/us/en/newsroom/news/artificial-intelligence/software-connects-open-blueprint-for-production-ai.html — Intel open software blueprint
[6] https://www.intel.com/content/www/us/en/newsroom/news/artificial-intelligence/intel-inference-microservices-tuned-llm-processors.html — Intel Inference Microservices
[7] https://www.intel.com/content/www/us/en/developer/articles/community/day-0-local-agentic-ai-with-metas-muse-glimmer.html — Day 0 Muse Glimmer on Intel platforms
[8] https://www.intel.com/content/www/us/en/newsroom/home.html — Intel Newsroom home
[9] https://www.intel.com/content/www/us/en/newsroom/news/artificial-intelligence/intel-ocp-2026-open-ai-infrastructure-for-ai-era.html — Intel at OCP 2026 preview
[10] https://www.intel.com/content/www/us/en/newsroom/news/artificial-intelligence/intel-at-ocp-2026.html — Intel at OCP 2026 hub
