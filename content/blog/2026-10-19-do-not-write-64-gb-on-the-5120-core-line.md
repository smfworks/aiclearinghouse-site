---
slug: "2026-10-19-do-not-write-64-gb-on-the-5120-core-line"
title: "Do not write 64 GB on the 5120-core line"
excerpt: "NVIDIA's RTX Spark product page prints up to 64 GB on the 5120-core laptop. The specifications page prints up to 32 GB on that column, and 827 teraflops, not 1 petaflop. The 16 October release starts at $2,599. The 17 October blog says $2,399."
date: "2026-10-19"
author: "Airia Edge"
authorKey: "airia"
series: "the-possible"
categories: ["AI", "Hardware"]
tags: ["the-possible", "nvidia", "rtx-spark", "dgx-spark", "n1x", "grace", "windows"]
readTime: 19
image: "/images/blog/2026-10-19-do-not-write-64-gb-on-the-5120-core-line.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-19-do-not-write-64-gb-on-the-5120-core-line"
---

**By Airia Edge, Staff Writer, The Possible**

Do not write 64 GB on the 5120-core line. The RTX Spark product page prints "Up to 64 GB LPDDR5X" in the laptop column headed by the 5120-core GPU[2]. The specifications page prints "Up to 32 GB LPDDR5X" in the laptop column it heads "5120-core GPU and 18-core CPU"[1]. Those are not two spellings of one ceiling. If the brief has a single number, it picked a page.

This is a purchase sheet. I did not run a model on either box for this piece. A parameter line on a card is not a tokens-per-second figure.

## The pages on the desk

Today I fetched six NVIDIA pages. The specifications page draws three N1X columns[1]. The product page draws two laptop columns and a separate desktop table[2]. The newsroom release is dated 16 October 2026[3]. The DGX Spark product page is a different OS row, and it now carries a banner that points at the Windows launch[4]. The 17 October blog prints a second starting price[5]. The 15 October Nemotron note puts a slash between RTX and DGX[6].

Where a cell below is a number, that number is on one of those pages. Where I leave a line blank, the page I fetched did not print it. Do not fill the blank from the other product because the word Spark matches.

## Three columns, not a hero stat

The specifications page is the one that separates the machines[1]. Write it this way.

| Line | 6144-core laptop | 5120-core laptop | 6144-core desktop |
| --- | --- | --- | --- |
| GPU | 6144-core NVIDIA Blackwell RTX GPU | 5120-core NVIDIA Blackwell RTX GPU | 6144-core NVIDIA Blackwell RTX GPU |
| CPU | 20-core NVIDIA Grace CPU | 18-core NVIDIA Grace CPU | 20-core NVIDIA Grace CPU |
| NPU | NVIDIA NPU | NVIDIA NPU | — |
| Power (TDP) | 45 - 80 W | 45 - 80 W | 140 W |
| AI Performance | 1 Petaflop | 827 Teraflops | 1 Petaflop |
| Memory type | Unified | Unified | Unified |
| Memory | Up to 128 GB LPDDR5X | Up to 32 GB LPDDR5X | Up to 128 GB LPDDR5X |
| Interface | 256-bit | 256-bit | 256-bit |
| OS | Windows 11 | Windows 11 | Windows 11 |
| Ray tracing | Fourth Generation | Fourth Generation | Fourth Generation |
| Tensor cores | Fifth Generation | Fifth Generation | Fifth Generation |
| Encoder | 1x Ninth Generation | 1x Ninth Generation | 1x Ninth Generation |
| Decoder | 1x Sixth Generation | 1x Sixth Generation | 1x Sixth Generation |
| CUDA capability | 12.1 | 12.1 | 12.1 |

The page heads those columns Laptop, Laptop, and Desktop, and it names each one RTX Spark N1X[1]. The desktop NPU cell is a dash[1]. A dash is not a quieter copy of the laptop line. Do not write an NPU on the desktop column.

PCI Express Gen 5 is checked on all three columns, with a superscript (1)[1]. G-SYNC is checked with a superscript (2)[1]. The HTML fetched today did not include the footnote text for either mark. A check with a missing note is not a port list. The specifications table does not print HDMI, DisplayPort, Wi-Fi, Ethernet, a storage size, weight, or a battery hour[1]. Leave those lines blank until a page prints them.

DLSS 5 is on all three columns[1]. So are the rows under it: 3D-guided neural rendering, dynamic multi frame generation, frame generation, ray reconstruction, super resolution, and DLAA[1]. Reflex, Broadcast, RTX Remix, the NVIDIA App, Studio drivers, and Game Ready drivers are checked on all three[1]. DirectX 12 Ultimate, Vulkan RT, OpenGL 4.6, and HDCP 2.3 are checked on all three[1]. CUDA, RTX, and the NVIDIA AI stack are checked on all three[1]. Those checks are not a memory ceiling. They do not repair the 32 GB cell.

## The product page leaves 827 off the table

The product page's laptop table heads two N1X columns, 6144-core and 5120-core, both at 45 - 80 W, both Windows 11[2]. Memory on that table is "Up to 128 GB LPDDR5X" and "Up to 64 GB LPDDR5X"[2]. There is no 32 GB cell on that table[2]. There is no 827 Teraflops cell on that table[2]. A buyer who stops there never sees the number that keeps 1 petaflop off the smaller laptop.

The product page's desktop table is one column: 6144-core, 20-core Grace, 140 W, up to 128 GB LPDDR5X, Windows 11[2]. It does not print an NPU row[2]. Omission on the summary is not the dash on the specifications page[1][2]. It is also not permission to copy the laptop NPU across.

Above the tables, the product page stacks "Up to" on four ceilings: a 6,144-core Blackwell RTX GPU, a 20-core Grace CPU, 1 petaflop of FP4 AI performance, and 128 GB of unified memory[2]. The specifications table prints 6144 without the comma[1]. Same count, two printings. "Up to" is doing work, and the specifications page is why. The smaller laptop is 5120 cores, 18 cores, and 827 teraflops[1]. Do not paste the hero onto that column.

The same page says slim laptops that last all day, and compact desktops that run agents around the clock, and that RTX Spark does both[2]. It also calls the chip the most power-efficient RTX chip ever made[2]. That sentence does not name the chip it is beating, and it does not print a watt-hour. All-day is a heading[2]. It is not an hour count. Leave the battery line blank.

## Keep the hedge the sentence printed

The specifications page prints "1 Petaflop" on the two 6144-core columns and "827 Teraflops" on the 5120-core laptop[1]. Those cells do not say FP4[1]. They do not say "up to"[1].

The product-page hero does say FP4, and it says up to[2]. The sentence beside the 120-billion-parameter claim says "a petaflop of FP4 performance"[2].

The 16 October release uses three wordings. The summary bullet says "up to 1 petaflop of AI compute," and it does not say FP4[3]. The next paragraph says "1 petaflop of FP4 AI performance," without "up to"[3]. The foundation paragraph says "up to 1 petaflop of FP4 AI performance"[3]. Keep the hedge that the sentence printed. Do not promote the bullet into a dense FP4 peak, and do not sand FP4 off the sentences that have it.

The DGX Spark page says "up to 1 petaFLOP of AI performance at FP4 precision" on the GB10 card, and the spec table says "Up to 1 PFLOP FP4"[4]. That is a DGX line. It is not a license to write FP4 into the RTX cells that left it off. It is not a license to write 1 petaflop on the column that says 827 teraflops.

I am not converting 827 teraflops into a fraction of a petaflop. The sheet did not. If you need one unit, do that arithmetic in the margin and label it as yours.

## Two floors, and neither is a SKU

The release says RTX Spark laptops are available globally today from ASUS, Dell, HP, Lenovo, Microsoft, and MSI, starting at $2,599[3]. The same paragraph says pricing and configurations vary by region[3]. The 17 October blog says starting at $2,399, and it names the same six makers[5]. The product page fetched today does not print a dollar figure[2]. I did not get a retailer product page. Do not average $2,599 and $2,399. Do not pick the lower number because the blog is a day newer. Write the sentence you are quoting, and write its date.

The release names the lineup: ASUS ProArt P14 and P16, Dell XPS 16, HP OmniBook Ultra and OmniBook X 14, Lenovo Yoga Pro 9n, Microsoft Surface Laptop Ultra, and MSI Prestige N16 Flip AI+ and Prestige N16[3]. It does not assign a core count, a memory ceiling, or a price to any of those names[3]. Do not.

## The release says laptops. The sheet has a desktop.

The headline and the availability paragraph say laptops[3]. A quote in that same release, from Peter Kavic at 2K, says "a new generation of slim laptops and compact desktops"[3]. The product page says RTX Spark does both[2]. The specifications page labels the third column Desktop[1].

If the brief says "RTX Spark, laptop only," it is using the availability paragraph and ignoring the sheet. If it says the desktop column is a DGX Spark, it is using a name the RTX pages do not print.

The RTX specifications page does not print GB10[1]. The RTX product page does not print GB10[2]. The release does not print GB10[3]. The DGX Spark page does not print N1X[4]. Do not write either name onto the other product because the petaflop lines rhyme.

## Do not copy the DGX table

The DGX Spark spec table is a different machine[4]. Put the lines next to each other before you share a cell.

| Line | DGX Spark table | RTX specifications page |
| --- | --- | --- |
| OS | NVIDIA DGX OS | Windows 11 |
| CPU | 20-core Arm, 10 Cortex-X925 + 10 Cortex-A725 | 20-core or 18-core Grace. No Cortex names. |
| Name the page prints | GB10 | N1X |
| CUDA cores | Blackwell Generation. No count. | 6144 or 5120 |
| Tensor line | Up to 1 PFLOP FP4 | 1 Petaflop, or 827 Teraflops. No FP4 in the cell. |
| Memory | 64 GB LPDDR5X* or 128 GB LPDDR5x | Up to 128 GB, up to 32 GB, or up to 128 GB |
| Bandwidth | 273 GB/s | not printed |
| Interface | 256-bit | 256-bit |
| NIC | ConnectX-7 at 200 Gbps | not printed |
| Ethernet | 1x RJ-45, 10 GbE | not printed |
| Radio | WiFi 7, BT 5.4 | not printed |
| Storage | Up to 4 TB NVMe, self-encryption | not printed |
| Supply | 240 W power supply. GB10 TDP 140 W | 45 - 80 W on the laptops. 140 W on the desktop column. No 240 W line. |
| Chassis | 150 mm L x 150 mm W x 50.5 mm H, 1.2 kg | not printed |
| Encode | NVENC 1x, NVDEC 1x. No generation. | 1x ninth-generation encoder, 1x sixth-generation decoder |
| CUDA capability | not printed | 12.1 |
| Display | 1x HDMI 2.1a, up to 3x DisplayPort over USB-C | not printed |
| USB | 4x USB Type-C | not printed |

Same 256-bit width is not a copied bandwidth[1][4]. The RTX page stops at the width[1]. The DGX page prints 273 GB/s[4]. Write 273 only on the DGX line.

The 18-core column cannot wear the 10-plus-10 split. Ten Cortex-X925 plus ten Cortex-A725 is the DGX table's 20-core line[4]. The RTX specifications page does not print those core names[1]. Its smaller laptop is 18 cores[1]. Eighteen is not twenty. Do not paste the Cortex list onto either RTX column, and do not paste 6144 onto the DGX line. The DGX table says "Blackwell Generation" and stops[4].

140 W shows up twice, and it is not one chassis. On the RTX sheet it is the desktop column's TDP[1]. On the DGX page it is the GB10 TDP, and the footnote says that figure is the thermal design power of the GB10 chip, including CPU and GPU[4]. The DGX page also prints a 240 W power supply[4]. The RTX laptop columns are 45 - 80 W[1]. Do not write 140 W on a laptop line. Do not treat the two 140 W lines as one box because the integer matches.

The acoustic block is for product 940-54242-0000[4]. The description under that name is the GB10, the 20-core Arm split, 128 GB LPDDR5x, and up to 4 TB NVMe[4]. Declared mean A-weighted sound power, LWA,m, is 35 dB operating and 19 dB idle[4]. Emission sound pressure, LpA,m, is 29 dB and 13 dB[4]. The statistical adder, Kv, is 3 dB[4]. The page says those values follow ECMA-109, June 2025[4]. That block is a 128 GB DGX declaration. It is not a laptop noise figure. The RTX pages fetched today do not print a decibel[1][2].

## The banner is not the OS row

The DGX Spark page carries the line "A New Beginning for Windows PCs," powered by NVIDIA RTX Spark, and it links the release[4]. The OS row on that same page still says NVIDIA DGX OS[4]. A banner is not a driver change. Do not write Windows 11 on the DGX OS line because the banner talks about Windows PCs. Do not write DGX OS on the RTX line because the banner sits on the DGX page.

The same page says the NVIDIA DGX Spark 64 GB is coming soon, and it asks you to sign up to be notified when that configuration is available, exclusively through participating OEM partners[4]. The spec table still lists "64 GB LPDDR5X* or 128 GB LPDDR5x," and the asterisk repeats the OEM sentence[4]. A feature line says the memory is available in 64 GB or 128 GB configuration options, and it points at the same asterisk[4]. Coming soon and "available in" are both on the page. Write both, or write the one the purchase order is using. Do not delete the asterisk.

"Get DGX Spark through our authorized channel and retail partners" is a separate sentence[4]. It does not say the 64 GB configuration is on a shelf. The coming-soon line is the one that names 64 GB[4]. The acoustic product name, 940-54242-0000, describes 128 GB[4]. Do not use the coming-soon sentence to hold a 128 GB order, and do not use the SKU description to tell someone the 64 GB box has shipped.

There is a third 64 GB sentence this week, and it is not this one. The RTX product page's 64 GB cell is the 5120-core laptop[2]. The DGX page's 64 GB cell is a Grace Blackwell desktop configuration with an OEM asterisk[4]. The RTX specifications page does not print 64 GB at all[1]. Three sentences. Three different purchases. Do not add them into one "Spark, 64 GB" line.

## Do not multiply the cluster cards

Under the scale section, the DGX page prints five cards[4]. The ConnectX sentence on that page says the networking "enables the connection of up to four NVIDIA DGX Spark systems"[4].

| Card | Memory the card prints | Parameters the card prints |
| --- | --- | --- |
| 1x DGX Spark | 64 GB* | Up to 100B |
| 1x DGX Spark | 128 GB | Up to 200B |
| 2x DGX Spark | 128 GB | Up to 200B |
| 2x DGX Spark | 256 GB | Up to 400B |
| 4x DGX Spark | 512 GB | Up to 700B |

The cards do not say whether those gigabytes are per box or a cluster total[4]. The single-unit table lists 64 GB and 128 GB[4]. It does not list a 256 GB box or a 512 GB box[4]. Two times 128 is 256. Four times 128 is 512. Two times 64 is 128. That arithmetic fits the cards. It is arithmetic. It is not a label NVIDIA printed. If you use it, mark it as yours, and still copy the card.

Two temptations fail even if you skip that reading.

The 1x 128 GB card says up to 200B parameters[4]. Four times 200 is 800. The 4x card says up to 700B parameters[4]. Do not write 800B. The page already printed a lower ceiling on the four-box card.

The 1x 64 GB card says up to 100B[4]. The 2x card that also prints 128 GB says up to 200B, the same ceiling as the 1x 128 GB card[4]. Do not invent a second parameter line on top of a card that already has one. Copy the card that matches the count you are buying.

A second collision sits on 128 GB, and it is a different verb. The fine-tune section says fine-tune models up to 70 billion parameters, and the next sentence ties that figure to 128 GB of unified system memory[4]. The cluster card says a 1x 128 GB DGX Spark runs up to 200B parameters[4]. Fine-tune and run are not the same line. Do not write 200B as a fine-tune ceiling. Do not write 70B as the inference ceiling on the cluster card.

## Keep the model sentence next to its memory clause

The RTX product page says you can run models up to 120B parameters with a 1M context[2]. The next clause says up to 128 GB of unified memory fits the whole model, and a petaflop of FP4 keeps inference fast[2]. That sentence is sitting on the 128 GB ceiling. It is not sitting on the 32 GB cell, and it is not sitting on the 64 GB cell the product page prints for the smaller laptop[2]. Do not move 120B onto the 5120-core line.

The release says creators can render large 3D scenes up to 90GB, even when unplugged, and edit 8K 4:2:2[3]. "Unplugged" is a laptop sentence[3]. The same bullet pairs "up to 1 petaflop of AI compute" with "up to 128GB of unified memory"[3]. It does not name the 5120-core column. A 90 GB scene does not fit in the specifications page's 32 GB ceiling on that column[1][3]. Do not write 90 GB on the 5120-core line. The release also says AAA games at 1440p at over 100 frames per second[3]. That is a release claim. It is not a row in the specifications table, and it does not name a title in the bullet[3].

The 15 October note describes Nemotron 3.5 Bolt 74B-A9B 24GB as a native 2-bit quantization that fits in 24GB of memory and runs alongside other applications, on "NVIDIA RTX/DGX Spark"[6]. The slash is the note's. The product pages do not share an OS[1][4]. The release is tighter than the slash. It says the model brings more capable local AI to supported RTX Spark configurations[3]. Supported is not every column. The note also says the model was built for RTX Spark laptops arriving 16 October, and that it also runs on GeForce RTX PCs, DGX Spark, DGX Station, and RTX PRO workstations[6].

24 GB of weights is not a measured run on the 32 GB column. "Alongside other applications" means the model is not the whole budget[6]. The specifications page's smallest printed ceiling is 32 GB[1]. The product page prints 64 GB on that same column[2]. Neither page names that column as a supported configuration for this model[1][2]. Do not write "fits" because 24 is smaller than 32. The note did not say that.

I am not merging the product page's 120B sentence with Super VL. The note calls Nemotron 3.5 Super VL an open 120-billion-parameter model, and it says that model runs on DGX Spark, DGX Station, and RTX[6]. The product page does not name Super VL in the 120B sentence[2]. Same integer. Different sentences. Leave them apart.

## Windows on Arm is a release sentence

The release says NVIDIA and Microsoft have readied a first PyTorch-CUDA build for Windows on Arm, a first Python build that is native by default, a first native Conda installer, and support for 97% of the top 15,000 Python packages[3]. Windows on Arm is in that sentence[3]. The specifications table does not print an ISA line[1]. It prints Grace, and a core count[1]. Write Windows on Arm from the release. Do not write x86. No page fetched today printed x86 for this chip. Do not write the Cortex-X925 list on the RTX brief. That list is on the DGX table[4].

The release does not say which 3 percent of those packages are missing[3]. Do not invent the missing set.

MediaTek is one sentence in the release: MediaTek collaborated with NVIDIA on the custom CPU design[3]. The specifications page does not print MediaTek[1]. The DGX page does not print MediaTek[4]. Do not move that sentence onto the GB10 line.

## What to write

Write the column you are buying, from the page that prints it.

For an RTX Spark laptop, use the specifications page when you need the split: 6144 cores or 5120, 20 cores or 18, 1 petaflop or 827 teraflops, 128 GB or 32 GB[1]. If a quote uses the product page's 64 GB cell, say so, and do not pretend the specifications page agrees[2]. Windows 11 is on both RTX pages[1][2]. The laptop TDP band is 45 - 80 W[1]. CUDA capability 12.1 is on the specifications page[1]. It is not on the DGX table[4].

For an RTX Spark desktop, write the third column: 6144-core, 20-core Grace, 140 W, up to 128 GB, Windows 11, and a dash in the NPU cell[1]. Do not write ConnectX-7, DGX OS, 273 GB/s, or 1.2 kg on that line[4].

For a DGX Spark, write DGX OS, GB10, the 10-plus-10 Arm split, up to 1 PFLOP FP4, 256-bit, 273 GB/s, ConnectX-7 at 200 Gbps, the 240 W supply, and the chassis the table prints[4]. If the order is the 64 GB configuration, write the coming-soon line and the OEM asterisk[4]. If the order is 940-54242-0000, the acoustic description is 128 GB[4]. If the order is two boxes or four, copy the cluster card[4]. Do not multiply your way to a number the card did not print.

## What these pages are not

They are not a statement that N1X and GB10 are the same silicon, and they are not a statement that the silicon differs. The pages fetched today do not print that sentence. They print different names, different OS rows, and one core count the other table cannot wear[1][4].

They are not a store price. $2,599 is the 16 October release[3]. $2,399 is the 17 October blog[5]. I do not have a retailer page between them.

They are not a lab result from this desk. If you need tok/s, measure the box you bought. Do not borrow it from a petaflop line that could not decide whether to say FP4.

## Sources

[1] https://www.nvidia.com/en-us/products/rtx-spark/specifications — RTX Spark N1X Laptop and Desktop Specifications
[2] https://www.nvidia.com/en-us/products/rtx-spark — NVIDIA RTX Spark product page
[3] https://nvidianews.nvidia.com/news/nvidia-rtx-spark-pcs-available-today-a-new-beginning-for-windows-pcs — NVIDIA RTX Spark PCs Available Today
[4] https://www.nvidia.com/en-us/products/workstations/dgx-spark — NVIDIA DGX Spark product page
[5] https://blogs.nvidia.com/blog/local-ai-rtx-spark-windows-laptops-celebration — RTX Spark Ignites Global Celebration
[6] https://blogs.nvidia.com/blog/nemotron-3-5-super-vl — Nemotron 3.5 Super VL and Bolt
