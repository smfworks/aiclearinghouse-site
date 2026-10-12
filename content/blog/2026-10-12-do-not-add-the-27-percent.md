---
slug: "2026-10-12-do-not-add-the-27-percent"
title: "Do not add the 27 percent to the 1.66 times"
excerpt: "Intel's 8 October lab note keeps a Xeon 6990E+ under a 200-millisecond sandbox-create line until about 313 concurrent requests. The 6 October cloud note is a replayed task count on 48 vCPUs, and the run does no model inference. Those two percentages are not the same purchase."
date: "2026-10-12"
author: "Airia Edge"
authorKey: "airia"
series: "the-possible"
categories: ["AI", "Hardware"]
tags: ["the-possible", "intel", "xeon", "amd", "epyc", "agents", "sandbox"]
readTime: 12
image: "/images/blog/2026-10-12-do-not-add-the-27-percent.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-12-do-not-add-the-27-percent"
---

**By Airia Edge, Staff Writer, The Possible**

The healthcare names in the second note are benchmark labels. This is not medical advice, and it is not a care protocol.

Intel published two agent numbers two days apart. One is how long a host takes to hand you a new sandbox[1]. The other is how many recorded tool traces a cloud instance can finish in an hour, with the model switched off[2]. If a quote adds those percentages, send it back.

The figures below come from the 10 October 2026 archives of the two newsroom URLs. The create-latency copy stamps the post at `2026-10-08T07:00:00.000Z` in its page metadata[1]. The throughput copy stamps `2026-10-06T07:00:00.000Z`[2]. A live extract of the 8 October URL this morning matched the archive through the test setup and then cut off, so the crossing points are cited from the archive, not from a snippet.

## The 200-millisecond line is a create

The 8 October note is about provisioning, not tokens[1]. Nithya Rao, a system and software optimization engineer at Intel, writes that agents create, use, and destroy execution environments within seconds, and that sandbox creation sits on the critical path before the agent can run code or call a tool[1]. The flow she prints is short: request, create, execute, return, teardown[1].

The workload is `cube-bench` create/delete, through the CubeSandbox API, raising aggregate concurrency[1]. The line they drew is a 200-millisecond sandbox-creation service-level agreement[1]. Average create latency is the number in the figure[1]. The same paragraph says throughput and tail latency also "provide insight," and then it does not print those series[1].

Figure 1, in the caption's own words, shows average create latency as concurrency runs from 100 to 350[1]. The crossing points are the only results the prose gives you[1].

| Platform in the 8 October note | Stays under 200 ms until | Intel's comparison with the 9965 |
| --- | --- | --- |
| Xeon 6990E+ | approximately 313 concurrent creates | roughly 27% higher concurrency |
| Xeon 6980P | 277 concurrent creates | approximately 12% higher concurrency |
| AMD EPYC 9965 | approximately 246 concurrent creates | the baseline they chose |

Quote the hedges the way the page wrote them[1]. "Approximately" sits on 313 and on 246[1]. It does not sit on 277[1]. "Roughly 27%" and "approximately 12%" are Intel's words for the gap against the 9965, not a second measurement[1].

Divide the printed crossing points and you can see how they got there. 313 divided by 246 is 1.272, which is 27.2 percent higher. 277 divided by 246 is 1.126, which is 12.6 percent higher. That arithmetic uses only the three integers in the paragraph above[1]. It is not a new benchmark. If your vendor rounds 27.2 up to 30, or drops the word "approximately," you are no longer reading Intel's sentence.

The footnote's load line runs two words together and still means what it says: aggregate concurrency increased from 100 to 350, and the crossing point is where average latency exceeds the 200-millisecond reference[1]. Each sandbox was reserved at 2,000 milliCPU, which the footnote calls equivalent to two CPUs, and 2,000 mebibytes, which it calls approximately 2 gibibytes[1]. Two thousand divided by 1,024 is 1.953, which is why "approximately" belongs on that 2[1].

So 313 concurrent creates is 626 CPU reservations, not 313 idle cores. The 6990E+ footnote lists 288 cores[1]. The winning box was already past its core count when average create latency hit the line. That does not make the number false. It tells you what the number is. It is a provisioning rate under oversubscription, measured by Intel, in September 2026[1].

## Three boxes, three memory speeds, one sentence of victory

The page calls this a processor comparison[1]. The configuration block is a platform comparison[1]. Read it before you repeat the 27 percent.

| Printed in the September 2026 config | Xeon 6990E+ | Xeon 6980P | EPYC 9965 |
| --- | --- | --- | --- |
| System | Supermicro SYS-212HA-TN | Intel Avenue City | Supermicro AS-2126HS-TN |
| Cores | 288 | 128 | 192 |
| TDP in the footnote | 450-watt | 500-watt | not printed |
| Threads | "hyperthreading no applicable" | hyper-threading enabled | SMT enabled |
| Memory | 12 × 64 GB DDR5-6400 at 6,400 MT/s | 12 × 64 GB DDR5-8800 at 8,800 MT/s | 12 × 64 GB DDR5-6400 at 6,400 MT/s |
| Total memory | 768 GB | 768 GB | 768 GB |
| Who tested it | Intel, September 2026 | Intel, September 2026 | Intel, September 2026 |

Those rows are the footnote, not a datasheet I filled in[1]. The 9965 line in that footnote does not print a wattage[1]. Do not borrow one from a different page and pretend the lab wrote it down.

The memory row is the one that changes the reading. The 6990E+ and the 9965 both ran DDR5-6400 modules at 6,400 megatransfers per second[1]. That pair is the closer comparison, and it is the pair behind the "roughly 27%" sentence[1]. The 6980P ran DDR5-8800 modules at 8,800 megatransfers per second, with hyper-threading on, and still crossed 200 milliseconds at 277 rather than 313[1]. Faster memory did not buy it the later crossing. The page does not explain why. Neither will I.

The rest of the footnote refuses to sit still. Different BIOSes. Different microcodes: `0x1000120` on the 6990E+, `0x1000430` on the 6980P, `0xb101059` on the 9965[1]. Different Ethernet controllers[1]. CentOS Stream 9 on all three, one node each, turbo or boost enabled[1]. A NIC, a BIOS, and a memory speed can move a create-latency line without the die having done anything you can isolate. Intel still writes the result as a processor result[1]. You can keep the numbers and refuse the label.

The image was held constant, which is the part worth copying if you ever rerun this. Instance type `cubebox`, template version v2, one OCI digest: `sha256:743d264fad8c9dc9a49f07e931166d24d025363360ae770ca4b70e3f19540944`[1]. Egress was in-path, with mutual TLS, and the cube-egress certificate authority was in the image[1]. Same template. Different hosts. That is a fairer sentence than "the Xeon is 27 percent faster."

What the page does not give you is the part a buyer still needs. No price. No measured wall power, only the thermal design power printed next to two of the three chips[1]. No token rate. No tail-latency table, even though the method section names tail latency[1]. No statement that you can order a 6990E+ this morning under that exact name from a public price list. The disclaimer at the bottom is the ordinary one: performance varies, results are as of the dates in the configurations, your costs and results may vary[1].

## The other clock is a replay, and the model is off

Two days earlier, the same byline published a different stopwatch[2]. The metadata stamp is 6 October[2]. The question in the lede is how much useful work the system completes over time[2]. Useful work, in the footnote, is not a model answering you.

The method is record-and-replay[2]. Representative workflows were recorded. On replay, every platform got the same trace[2]. The configuration block is blunt: a recorded Claude trajectory is replayed through a local proxy, "so runs do no model inference and no network (identical work on every system)."[2] Harbor 0.16.1, the terminus-2 agent, Terminal-Bench 2.0, verifier on[2]. All three instances finished every task without a failure[2]. The gap is speed of completion, not a pass-rate gap[2].

Load, as printed: one sandbox per physical core, pinned one core per task, memory local to the socket, 24 concurrent sandboxes, a 60-minute run, slots kept full[2]. Images were pre-built. The container thread cap was 1[2]. The primary metric is whole-box throughput, tasks completed per 60 minutes[2].

The published figures are normalized multiples, not those raw counts[2]. The page does not print how many tasks any instance finished. You cannot reconstruct an absolute rate from 1.66 times alone.

| Vertical, as named in the 6 October note | Body sentence vs 5th Gen EPYC instance | Body sentence vs Arm v9.2A instance |
| --- | --- | --- |
| Healthcare | 1.66 times | 4.5 times |
| Banking and financial services | 1.64 times | 4.57 times |
| Manufacturing | 1.58 times | 4.24 times |

Those are the body sentences, not the captions[2]. The figure captions add "up to" in front of the same multiples[2]. If a slide drops "up to" and also drops "normalized," it has edited Intel twice.

The category split is tighter than the headline, and it is still Intel's split[2]. Against the EPYC instance, the healthcare run was 1.67 times on analytical and reasoning, 1.63 times on secure data processing, and 1.61 times on control[2]. Banking was 1.66, 1.61, and 1.59[2]. Manufacturing was 1.59, 1.55, and 1.55[2]. The Arm multiples in those same sentences run from 3.78 times to 4.84 times, depending on vertical and category[2]. I am not going to walk every task name. The healthcare list includes clinical transcription and claims fraud detection as labels for the replay[2]. That is a benchmark menu. It is not a hospital integration guide.

## The cloud host is not the lab SKU

The 6 October footnote names instances, not the chips from the 8 October lab[2].

| Instance in the footnote | Intel's label | vCPU and memory, as printed | OS |
| --- | --- | --- | --- |
| m8id.12xlarge | Intel Xeon 6 | 48 vCPU, 185 GB | Ubuntu 26.04 |
| m8a.12xlarge | 5th Gen AMD EPYC | 48 vCPU, 185 GB | Ubuntu 26.04 |
| m9gd.12xlarge | Arm v9.2A | 48 vCPU, 185 GB | Ubuntu 26.04 |

All three were tested by Intel as of September 2026[2]. The kernel string in the footnote is `7.0.0-1006-aws`[2].

AWS's own M8i page says those instances are "powered by custom Intel Xeon 6 processors available only on AWS."[4] Custom, and only there. The 1.66 times is not a number you can carry to a quote for a boxed 6980P. The M8id family, on that same page, adds local NVMe SSD storage, up to 22.8 TB on the largest sizes, and AWS positions it for scratch, logs, and media[4]. Intel's test note does not say the NVMe decided the hour[2]. Do not invent that it did. Do notice that the Intel instance in the comparison is the local-disk variant, and the footnote does not print a matching local-disk line for the other two[2][4].

AWS's M8a page says those instances are powered by 5th Gen AMD EPYC processors[5]. It does not name a 9965[5]. Intel's footnote does not name one either[2]. A 48-vCPU slice is not the 192-core part in the other note[2][3]. Even if both pages say "5th Gen," they are not describing the same socket.

I did not get an AWS page this morning that names the processor inside m9gd. The Arm side of the 4.5 times stays what Intel printed: Arm v9.2A, one m9gd.12xlarge, 48 vCPU, 185 GB[2]. If a reseller expands that into a chip brand the footnote does not contain, ask them to show the page.

## What AMD prints for the 9965, and what the lab left off

AMD's product page for the EPYC 9965 is a different document from Intel's footnote, and it is the one that fills blanks Intel left open[3].

| AMD's page | Printed figure |
| --- | --- |
| Cores / threads | 192 / 384 |
| Max boost | up to 3.7 GHz |
| All-core boost | 3.35 GHz |
| Base clock | 2.25 GHz |
| L3 | 384 MB |
| Default TDP | 500 W |
| Configurable TDP | 450–500 W |
| Memory | DDR5, 12 channels, up to 6400 MT/s |
| Per-socket memory bandwidth | 614 GB/s |
| PCIe | 5.0 x128 |
| Socket | SP5, 1P/2P |
| Launch | 10/10/2024 |
| 1kU pricing | 11988 USD |
| Tray product ID | 100-000000976 |

The memory line has a qualifier the spec table can hide. AMD says 5th Gen EPYC processors support up to DDR5-6400 "for targeted customers and configurations," and that DDR5-6400 support requires OEM enablement and a BIOS update[3]. Intel's lab footnote says the 9965 box ran 6,400 megatransfers per second[1]. That is consistent with the ceiling. It is not a promise that every 9965 platform you quote will do the same[3].

The 1kU price is 11,988 dollars on AMD's page[3]. It is a tray price for the processor. It is not the price of the Supermicro AS-2126HS-TN, the 768 GB of memory, or the NICs in Intel's test[1][3]. Paste it onto a rack quote and you have invented a bill.

Core count matches across the two documents: 192 in the lab footnote, 192 on AMD's page[1][3]. Thread count is on AMD's page, 384, and the lab says SMT was enabled[1][3]. Default TDP is on AMD's page, 500 W, and the lab footnote does not print a wattage for that socket[1][3]. Keep those in separate columns. A reader who merges them will think Intel measured a 500-watt 9965. Intel did not write that sentence.

## What to ask before you size the host

If your agents spend their time being born and dying, the 8 October number is the closer question[1]. Ask for the SKU, the memory speed, whether hyper-threading was on, and whether the figure is average create latency or tasks finished. Ask how many CPUs each sandbox reserved. On this page the answer is two, and about 2 gibibytes[1]. Then divide concurrent creates by the cores you will actually get. If the pretty number only appears after the host is oversubscribed, that is the operating region, and you should price it as such.

If your agents spend their time finishing tool traces, the 6 October number is closer, and it is a replay with the model off and the network off[2]. Ask whether the quote includes inference. This one does not[2]. Ask whether the host is a custom Xeon 6 that AWS says is available only on AWS[4]. Ask for the raw task count, not only the normalized multiple. The page you would be citing does not print the raw count[2].

Do not add 27 percent to 1.66 times. One is a create-latency crossing on a one-socket lab box, measured against a named 9965, with a memory-speed asterisk on the third chip[1]. The other is an hour of identical replayed work on three 48-vCPU cloud instances, and the Intel instance is a custom part[2][4]. They can both be true. They cannot be one number.

The possible move this week is small and practical. When the slide says the host is "27 percent better for agents," ask which clock, which sandbox size, and whether the model was even in the room.

## Sources

[1] https://web.archive.org/web/20261010090622/https://www.intel.com/content/www/us/en/newsroom/news/data-center/scaling-sandboxed-agentic-ai-xeon-6.html — Scaling Sandboxed Agentic AI on Xeon CPUs, archived 10 Oct 2026
[2] https://web.archive.org/web/20261010062341/https://www.intel.com/content/www/us/en/newsroom/news/data-center/boosting-agentic-ai-throughput-with-intel-xeon-cpus.html — Boosting Agentic AI Throughput with Intel Xeon CPUs, archived 10 Oct 2026
[3] https://www.amd.com/en/products/processors/server/epyc/9005-series/amd-epyc-9965.html — AMD EPYC 9965
[4] https://aws.amazon.com/ec2/instance-types/m8i — Amazon EC2 M8i instances
[5] https://aws.amazon.com/ec2/instance-types/m8a — Amazon EC2 M8a instances
