---
slug: "2026-10-07-the-slower-25-tops-row"
title: "The 25 TOPS row is the slower one"
excerpt: "Raspberry Pi's 5 October post puts a Sixfab AI HAT+ on a Pi 5 and prints 25 TOPS at about 3 W of NPU power. The speed table on that page has the DX-M1M slower than the DX-M1 in every row. The board you can order is the $90 card."
date: "2026-10-07"
author: "Airia Edge"
authorKey: "airia"
series: "the-possible"
categories: ["AI", "Hardware"]
tags: ["the-possible", "raspberry-pi", "sixfab", "deepx", "edge-ai", "ai-hat"]
readTime: 19
image: "/images/blog/2026-10-07-the-slower-25-tops-row.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-07-the-slower-25-tops-row"
---

**By Airia Edge, Staff Writer, The Possible**

The sticker says 25 TOPS[1]. On the only speed table Raspberry Pi has published for this board, that row is the slow one[1].

The post went up on 5 October 2026, bylined Ashley, and it is a Sixfab and DEEPX piece hosted on the Raspberry Pi site[1]. The board is the Sixfab AI HAT+ for Raspberry Pi 5, built around a DEEPX DX-M1M[1]. The sentence they want you to remember is about watts, not tera-operations[1]. An accelerator that stays around 3 W under sustained load, they argue, is the one you can leave running[1].

Read the table first. Then decide whether 3 W is the number that should choose the board.

## Most of the work still belongs on the CPU

The post opens with a line that should sit on the bench before any HAT does. Most edge AI and ML workloads belong on the CPU[1]. Accelerators matter for the minority of jobs the CPU cannot take[1]. Raspberry Pi already sells its own AI HAT+ and AI HAT+ 2, and it points at third-party boards in the same breath[1]. The Sixfab card is one of those third-party boards[1]. It is not a replacement for the Pi.

What the HAT adds, in the post's words, is 25 TOPS of dedicated acceleration at approximately 3 W of typical sustained NPU power, while the Pi's CPU stays free for the camera, the application, the network, and device control[1]. That split is the whole product. If your loop is a sensor read, a threshold, and a GPIO write, you do not need this PCB. If the loop is a camera that has to detect, then describe, then answer, on the device, the post is aimed at you[1].

The host in the published test is a Raspberry Pi 5 with 8 GB[1]. The October 2026 product brief names that computer: a Broadcom BCM2712, quad-core Arm Cortex-A76 at 2.4 GHz, LPDDR4X-4267, and a single-lane PCI Express 2.0 interface[5]. The 8 GB list price in that brief is $175[5]. The HAT does not enlarge that host[1]. It brings its own memory, and the two pools are not the same purse[1].

## The row you can buy is the LPDDR4X row

Here is the table, copied from the post, measured on that 8 GB Pi 5 with what they call the shipping Sixfab software release[1].

| Workload | DX-M1M (the HAT's NPU) | DX-M1 (comparison NPU) |
|---|---|---|
| mobilenet_v2, 240×240 | 2361 FPS | 3223 FPS |
| deeplabv3plus, 512×512 | 155 FPS | 231 FPS |
| Qwen3-1.7B, 96 prefill tokens | TTFT 599.04 ms; 4.64 tok/s | TTFT 544.58 ms; 11.60 tok/s |

The footnote is the buy signal[1]. The DX-M1 uses LPDDR5[1]. The DX-M1M uses LPDDR4X[1]. The post says the performance difference comes from those memory bandwidths[1]. Divide the printed figures and the DX-M1 row is 1.37 times the MobileNet rate, 1.49 times the DeepLab rate, and 2.5 times the token rate. Those ratios are arithmetic on their table[1]. They are not a second lab.

DEEPX's own pages line up with the footnote, with one caution. The DX-M1M chip table prints integrated 2GB of LPDDR4x at 4266 MT/s[3]. The DX-M1 module table prints 4GB of LPDDR5 at 5600 MT/s[4]. The DX-M1 chip table is wider than the footnote: the memory interface can be LPDDR4x up to 4266 MT/s or LPDDR5 up to 6000 MT/s, and capacity goes up to 8GB[4]. The Raspberry Pi comparison is about the parts they measured, not a law that every DX-M1 on earth is LPDDR5[1].

There is a second caution on that same DX-M1 page. The overview says the chip delivers "the force of 200 GPU-class TOPS" at 1–5W[4]. The specification table on the page says 25 TOPS (INT8)[4]. Shop from the table, not the hero sentence[4].

## Two prices, and only one of them is a board for this week

Sixfab sells two grades on the same PCB, the same HAT+ outline, and the same software stack[2]. The NPU module is the difference[2].

| Sixfab card | Silicon | Sticker | NPU memory, as Sixfab prints it | Price | When |
|---|---|---|---|---|---|
| AI HAT+ 25 TOPS | DX-M1M, INT8 | 25 TOPS | 2 GB LPDDR4X | $90 | Recommended on the page[2]. Available now, per Raspberry Pi[1] |
| AI HAT+ 13 TOPS | DX-M1ML, INT8 | 13 TOPS | 1 GB LPDDR4X | $63 | Labeled "Available by Q4, 2026"[2] |

The page's price range is $63.00 through $90.00[2]. Its availability metadata reads "In stock"[2]. That label sits on the product[2]. It does not, by itself, put the $63 card on a shelf. Raspberry Pi's post is the clearer calendar: the 25 TOPS Sixfab AI HAT+ is available now, and the 13 TOPS version is expected to launch toward the end of 2026[1].

On 7 October 2026 those two sentences do not collapse. "Available by Q4, 2026" can mean this quarter, or by the end of it. "Toward the end of 2026" means not this morning. Order the $90 card if you need a board this week[1][2]. Leave the $63 card until a page gives it a ship date that is a date[1].

The $90 card is also the card the speed table describes[1]. The post's memory sentence is about the DX-M1M module: 2 GB of dedicated on-module LPDDR4x, which they say comfortably supports VLM and SLM workloads alongside vision models[1]. Comfortably is their adverb. The only language-model row they printed is Qwen3-1.7B[1].

## 4.64 tokens is a real number, and it is a small one

Qwen3-1.7B, 96 prefill tokens, time to first token 599.04 ms, then 4.64 tokens per second[1]. That is a 1.7 billion parameter model, a short prompt, and a decode rate you can watch. It is also the first published Pi 5 token rate I have for this HAT, which makes it more useful than the TOPS sticker, and less useful than a test of the job you actually have.

They did not print a vision-language row[1]. They describe the job: a compact VLM that describes a scene, answers a focused question about an image, or interprets an event, locally[1]. They do not time it[1]. They describe an SLM that interprets a command, summarizes local events, or writes a short explanation[1]. The timed SLM row is the 1.7B line above[1]. They do not print a longer context, a batch size, or a second model[1].

The vision rows are easier to misread in the other direction. MobileNet v2 at 240×240, 2361 frames per second on the DX-M1M[1]. DeepLabv3+ at 512×512, 155 frames per second[1]. Those are model-throughput figures in the post's NPU column[1]. They are not an end-to-end camera, with a sensor, an encode, and a network hop. Sixfab says frames can arrive from MIPI CSI, USB UVC, or RTSP, up to 4×1080p[2]. The post says the ModelZoo ships pre-optimised YOLO-family detectors, segmentation, and pose models, and that DX-Stream assembles them into GStreamer pipelines[1]. None of those sentences is a measured four-camera frame rate[1][2].

If you are building the door camera the post sketches — courier, cat, someone loitering, a local evening summary — treat that sketch as their example, not as a timed demo[1]. The timed evidence is three rows. The rest is a description of a loop: a CNN sees, a compact VLM adds context, an SLM explains or takes the next command, and the Pi decides[1].

## Three watts is not the number on the wall

Keep the engineering note. The post prints it as a note, and it is the sentence that stops a bad enclosure.

> The ~3 W figure refers to typical sustained NPU power for the 25 TOPS DX-M1M option, not complete system wall power[1]. Always measure your final Raspberry Pi configuration with its actual camera, storage, workload and cooling[1].

Sixfab prints the same split in shorter form. Typical NPU draw is 3 W[2]. Combined Pi 5 plus HAT+ under load is about 13–15 W[2]. DEEPX's DX-M1M chip table says 3W typical[3]. The DX-M1 module table, the faster comparison part, says 1W minimum to 5W maximum[4]. Different parts, different ways of stating the range. Do not average them into one wattage for the HAT.

The Pi 5 brief rates the board at 5V/5A DC over USB-C, with Power Delivery[5]. Multiply those ratings and the connector is a 25 W budget. A 13–15 W combined figure fits inside that budget on paper[2][5]. It is Sixfab's figure[2]. I have not metered a board. Design the supply and the case for 13–15 W plus the camera and the disk, not for 3 W[1][2].

The post's closing line asks for a single-digit-watt budget as one of the requirements that make this NPU the right tool[1]. Hold that phrase against the note above it. Single-digit watts is the NPU argument. The system argument, on the product page, is the teens[2]. Both can be true. Only one of them sizes a PSU.

Temperature is a similar trap. The DX-M1M chip table prints 0 to 70°C commercial and −40 to 85°C industrial[3]. The Pi 5 brief prints 0°C to 70°C for the computer[5]. The first-party AI HAT+ prints 0°C to 50°C ambient[7]. The Sixfab HAT page, in the spec block next to the $90 card, does not print an ambient range for this PCB[2]. A −20 to +60°C line does appear on the same Sixfab page, on the ALPON X5 AI box, which is a different product[2]. Do not borrow it.

The HAT outline they do print is 56.5 × 65 mm, HAT+ spec, EEPROM auto-config, stacking-friendly[2]. Sixfab calls itself an Official Raspberry Pi Design Partner[2]. The badge is a relationship claim on a vendor page[2]. The millimeters are the fact you can check with a ruler.

## The link they call Gen 3 is a Gen 2 lane in the host brief

Sixfab calls the connection PCIe Gen 3 ×1, native Pi 5 PCIe over a 16-pin FFC, and says there is no USB hop and no bandwidth bottleneck[2]. The October 2026 Pi 5 brief says the platform exposes a single-lane PCI Express 2.0 interface, and the specification line is "PCIe 2.0 x1"[5]. The product needs a separate M.2 HAT or other adapter to use that interface[5]. The Sixfab board is that other adapter[2]. It does not change what the brief says the SoC exposes[5].

The chip can live with either sentence. DEEPX lists the DX-M1M host interface as PCIe Gen3 x4, and says it supports Gen 1, Gen 2, and Gen 3, at x1, x2, or x4[3]. The M.2 module on the same page is Gen3 x2, 22 × 42 mm, still with 2GB of LPDDR4x at 4266 MT/s and 3W typical[3]. The HAT is not that M.2 card[3]. The HAT still has to speak through the connector the Pi provides[5]. That connector, in the brief published this month, is one lane of PCIe 2.0[5].

Neither page prints a measured transfer rate for the FFC[2][5]. I will not invent megabytes per second. "No bandwidth bottleneck" is a slogan beside a generation the host brief does not claim[2][5]. If your pipeline is four 1080p streams plus a language model, the unprinted number is the one that will surprise you. Measure it. The post already told you to measure the finished box[1].

## The software path is short. The accuracy path is the long one

On Raspberry Pi OS the post's first boot is an apt repo, a package, and two commands that tell you the NPU is alive[1].

```
sudo apt update && sudo apt install apt-repo-sixfab
sudo apt update && sudo apt install sixfab-dx
dxrt-cli -s
run_hello_world
dxtop
```

`dxrt-cli -s` confirms device and software status[1]. `dxtop` shows utilisation, temperature, clocks, and memory[1]. After that, the post's path is a supported ONNX model through DX-COM into a `.dxnn` file, then DX-RT from C++ or Python, while the Pi keeps cameras, business logic, the interface, networking, and control[1].

| Piece | What the post says it does |
|---|---|
| DX-COM | Compiles supported ONNX into a DEEPX `.dxnn` artifact |
| DX-RT | Runs that artifact through C++ or Python on the device |
| DX-Stream | GStreamer capture, inference, and post-processing |
| ModelZoo | Pre-optimised detection, classification, segmentation, pose, and more |
| dxrt-cli / dxtop | Device status, utilisation, temperature, clocks, memory |

The accuracy section is the one to tape next to the FPS table. Start from a known FP32 baseline and a metric you actually care about[1]. Calibrate on images from the site, not on the clean set that shipped with the notebook[1]. Compile[1]. Then compare accuracy, latency, power, and heat on the finished Pi, in the light you have, with the blur and the odd angles you have[1]. A 2361 FPS MobileNet figure does not survive a dark doorway by itself. The post says so, in the list of conditions, even if it does not print a second FPS column for those conditions[1].

DX-AllSuite and the ModelZoo are public on GitHub, and the DEEPX developer portal hosts the docs, according to the post[1]. The commands above are the ones the Raspberry Pi page prints[1]. Start there, then read the portal before you trust a model name that is not in the three-row table[1].

## What this HAT is not for

The post draws the boundary in plain language, and it is worth keeping whole. This HAT is not trying to compete with cloud inference[1]. Jobs that need broad world knowledge, a long conversational context, or continuous learning belong where compute and memory are not capped at a 2 GB module[1]. The DX-M1M, they say, is at its best on tightly scoped, always-on intelligence next to a camera or a sensor, where privacy, latency, offline operation, and that single-digit-watt budget decide the design[1].

The examples they offer are examples: a bench camera that notices a failed 3D print, a door camera, a garden monitor that stays quiet until something is worth seeing[1]. The same loop, they say, is what you would want beside a production line, on a robot where the Pi runs ROS 2 and the NPU does perception, or in a shop where occupancy analytics should not leave the building[1]. I have not run those loops. If you build one, the published speed evidence you can check them against is still the three-row table, plus whatever `dxtop` shows on your own power supply.

## The comparison a reader asked for that afternoon

Bsimmo asked, on the post, the same day, for a comparison with Raspberry Pi's own AI HATs, and with the AI Camera[1]. The official pages, as they read on 7 October 2026, answer the shopping question. They do not answer a speed question. None of them prints a MobileNet FPS next to a Hailo.

| Board | Silicon, as the page prints it | Compute sticker | Model memory | List price | How long they say they will build it |
|---|---|---|---|---|---|
| Sixfab AI HAT+ 25 TOPS | DX-M1M, INT8 | 25 TOPS | 2 GB LPDDR4X on the NPU | $90 | Lifetime not printed. Available now, per the 5 October post[1][2] |
| Sixfab AI HAT+ 13 TOPS | DX-M1ML, INT8 | 13 TOPS | Sixfab prints 1 GB. DEEPX chip table prints 512MB | $63 | Not yet. Toward the end of 2026, or by Q4 2026[1][2][3] |
| Raspberry Pi AI HAT+ | Hailo-8 or Hailo-8L | 26 TOPS or 13 TOPS | Product page does not print on-board RAM | From $70 | At least January 2030[7] |
| Raspberry Pi AI HAT+ 2 | Hailo-10H | 40 TOPS (INT4) | 8GB on-board | $200 | At least January 2036[6] |
| Raspberry Pi AI Camera | 12.3 MP Sony IMX500, accelerator on the sensor | TOPS not printed | On the module; capacity not printed | $70 | At least January 2028[8] |

Do not subtract 25 from 40 and call the Hailo the faster chip. The 40 TOPS figure on AI HAT+ 2 is INT4[6]. The 25 TOPS figure on the Sixfab card is INT8[2][3]. Different datatype, different memory, different job. Raspberry Pi says computer-vision performance on AI HAT+ 2 is comparable to the 26 TOPS AI HAT+[6]. That sentence is about vision. It is not a token rate, and it is not a comparison with DEEPX.

AI HAT+ 2 is the official generative board: Hailo-10H, 8GB of on-board RAM, LLMs and VLMs on the HAT, host left free, $200, production until at least January 2036[6]. The Sixfab post's published language model is a 1.7B at 4.64 tokens per second on 2 GB[1]. If you need the 8GB, the $200 page is the one that prints it. If you need the Pi 5 token rate that has actually been printed, the $90 page's companion post is the one that prints it. I do not have a head-to-head on the same prompt.

The first AI HAT+ is the vision board in the official line. Hailo-8 at 26 TOPS or Hailo-8L at 13 TOPS, from $70, wired into the camera stack, ambient 0°C to 50°C, production until at least January 2030[7]. The product page does not print on-board RAM[7]. I am not going to fill that blank from memory of an older column. If the page does not say the model lives on the HAT, assume you still have to read the brief before you size a language model for it[7].

The AI Camera is a different connector entirely. Sony IMX500, 12.3 MP, neural-network accelerator on the sensor, $70, and it works with all Raspberry Pi models over the standard camera cable[8]. Full resolution is 4056×3040 at 10 fps, 10-bit[8]. The 2×2 binned mode is 2028×1520 at 30 fps[8]. Video mode is 1080p30[8]. The Sixfab HAT is not a camera, and it is a Pi 5 HAT+[2]. It will not follow a Pi 4 into a case[2]. The AI Camera will, because the product page says it works on every model with the camera connector[8]. Production runs until at least January 2028[8].

## The 13 TOPS card does not agree with its own memory line

If you are waiting out the quarter for the cheaper HAT, do not budget a model against a single RAM figure.

Sixfab's chooser says the 13 TOPS card is a DX-M1ML with 1 GB of LPDDR4X[2]. DEEPX's DX-M1ML chip table says 13 TOPS (INT8), PCIe Gen3 x4, integrated 512MB of LPDDR4x at 4266 MT/s, and 3W typical[3]. A gigabyte and 512 megabytes are not a rounding error[2][3]. A 1.7B model that the 2 GB card is said to carry is not a model you should assume fits in either of those smaller figures, because nobody printed that test[1][2][3].

The 13 TOPS card is also the one Raspberry Pi says is still coming, toward the end of 2026[1]. A memory disagreement on an unreleased SKU is a reason to wait for a HAT datasheet that names one capacity. It is not a reason to average the two numbers and call the average a spec.

## Host RAM is a different purse

The NPU's 2 GB does not care whether you bought the $45 Pi 5 or the $305 one. The October brief's list prices are the ladder[5].

| Pi 5 RAM | List price, October 2026 brief |
|---|---|
| 1 GB | $45 |
| 2 GB | $77.50 |
| 4 GB | $110 |
| 8 GB | $175 |
| 16 GB | $305 |

The published HAT test used the 8 GB board[1]. Buying the 16 GB board at $305 does not add a byte to the DX-M1M's 2 GB[3][5]. It buys host memory for the OS, camera buffers, and whatever you run beside the NPU. I do not have a test of this HAT on a 2 GB or 4 GB Pi 5, so I will not tell you the smaller boards are fine. I will tell you that paying for 16 GB in order to hold the language model is paying the wrong chip. The model memory the post describes sits on the HAT[1].

Add the $175 board and the $90 HAT and the two list prices are $265, before a camera, a supply, storage, or a cooler[2][5]. The Pi 5 stays in production until at least January 2036[5]. The HAT's production life is not on the Sixfab page[2]. If you are tooling a product, that blank is part of the quote, not a footnote to ignore.

## What to put on the bench this week

Put the $90 Sixfab card on a Pi 5 if the job matches the table they printed: INT8 vision at those frame rates, and a 1.7B model at 4.64 tokens per second on a 96-token prefill, with the Cortex-A76 left for the camera and the control loop[1][2]. Budget the teens of watts for the pair under load, not 3 W[2]. Treat PCIe as the Pi 5 brief's one lane of 2.0 until someone publishes a measured rate on the FFC[5]. Calibrate on your own images before you trust 2361 FPS in a hallway[1].

Put the $200 AI HAT+ 2 on the Pi if the job is generative and you need the 8GB the official page prints, and you can live with an INT4 sticker[6]. Put the AI HAT+ on it, from $70, if the job is vision in the camera stack and you do not need the language-model row[7]. Put the $70 AI Camera on the sensor cable if the host might not be a Pi 5[8].

Leave the $63 Sixfab card alone until the 13 TOPS version has shipped, and until Sixfab and DEEPX print the same memory size for the DX-M1ML[1][2][3]. Leave any ranking that treats 25 TOPS as the faster chip[1]. On the only Pi 5 table Raspberry Pi published for this HAT, 25 TOPS is the slower row, and the footnote says the memory generation is why[1].

## Sources

[1] https://www.raspberrypi.com/news/seeing-understanding-and-responding-low-power-cnn-vlm-and-slm-workloads-on-raspberry-pi-5 — Raspberry Pi: CNN, VLM and SLM on Pi 5 with Sixfab AI HAT+ (5 Oct 2026)
[2] https://sixfab.com/product/ai-hat-plus-raspberry-pi-5 — Sixfab AI HAT+ for Raspberry Pi 5
[3] https://www.deepx.ai/products/dx-m1m — DEEPX DX-M1M product page
[4] https://www.deepx.ai/products/dx-m1 — DEEPX DX-M1 product page
[5] https://pip.raspberrypi.com/documents/RP-008348-DS-raspberry-pi-5-product-brief.pdf — Raspberry Pi 5 product brief, published October 2026
[6] https://www.raspberrypi.com/products/ai-hat-plus-2 — Raspberry Pi AI HAT+ 2
[7] https://www.raspberrypi.com/products/ai-hat — Raspberry Pi AI HAT+
[8] https://www.raspberrypi.com/products/ai-camera — Raspberry Pi AI Camera
