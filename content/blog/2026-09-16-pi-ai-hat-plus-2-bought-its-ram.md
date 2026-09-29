---
slug: "2026-09-16-pi-ai-hat-plus-2-bought-its-ram"
title: "The Pi's generative AI HAT bought its own RAM"
excerpt: "Raspberry Pi AI HAT+ 2 pairs a Hailo-10H (40 TOPS INT4) with 8GB of on-board LPDDR4X. Launch was $130. The store now prints $200. The upgrade is memory, not a bigger TOPS number."
date: "2026-09-16"
author: "Airia Edge"
authorKey: "airia"
series: "the-possible"
categories: ["AI", "Hardware"]
tags: ["the-possible", "raspberry-pi", "hailo", "edge-ai", "ai-hat", "sbc"]
readTime: 14
image: "/images/blog/2026-09-16-pi-ai-hat-plus-2-bought-its-ram.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-16-pi-ai-hat-plus-2-bought-its-ram"
---

**By Airia Edge, Staff Writer, The Possible**

Monday's column was a Jetson you flash. Today's board is the one already on the bench: a Raspberry Pi 5 with a HAT that stopped borrowing the host's RAM.

Raspberry Pi AI HAT+ 2 is the official generative-AI add-on for Raspberry Pi 5. It carries a Hailo-10H accelerator rated at 40 TOPS of INT4 inference and 8GB of dedicated on-board RAM.[1][2] Raspberry Pi released it on 15 January 2026.[6][9] The launch post priced it at $130.[2] The April 2026 product brief lists $180.[5] The store this morning prints $200.[1] The number that moved is DRAM, not TOPS.

## The upgrade is not a bigger TOPS sticker

The first AI HAT+ (2024) put a Hailo-8L or Hailo-8 on the PCB and ran vision. Raspberry Pi sold a 13 TOPS board at $70 and a 26 TOPS board at $110.[11] Those SKUs are still on the product page from $70.[10] They accelerate object detection, pose estimation, and scene segmentation through `libcamera`, `rpicam-apps`, and Picamera2.[2][10] They do not run large language models.[3]

HAT+ 2 is the first Raspberry Pi AI product built for generative models.[2] The Hailo-10H adds a direct DDR interface so the accelerator can hold LLMs and vision-language models without paging them through the Pi's LPDDR4X.[8] Raspberry Pi's own comparison table is blunt: AI HAT+ "uses the memory on a Raspberry Pi 5"; AI HAT+ 2 "has its own 8 GB onboard memory, allowing it to run LLMs and VLMs up to ~6 billion parameters."[3]

The 40 TOPS figure is INT4.[1][5] Hailo's chip page prints the same silicon as 40|20 TOPS (INT4|8).[8] The predecessor Hailo-8 was sold as 26 TOPS of INT8.[10][11] Do not subtract 26 from 40 and call it a 54 percent upgrade. Raspberry Pi says computer-vision performance on HAT+ 2 is "broadly equivalent" to the 26 TOPS HAT+, "thanks to the on-board RAM."[2] The product brief says "equivalent or superior."[5] The TOPS sticker is a different datatype. The new work is generative, and the new part is the 8GB sitting next to the NPU.

| Board | Accelerator | Published TOPS | On-board model RAM | GenAI | List / launch price as printed |
|---|---|---|---|---|---|
| AI Kit (EOL) | Hailo-8L | 13 TOPS | Host RAM | No | Replaced by AI HATs[13] |
| AI HAT+ | Hailo-8L | 13 TOPS INT8 | Host RAM | No | From $70; launch $70[10][11] |
| AI HAT+ | Hailo-8 | 26 TOPS INT8 | Host RAM | No | Launch $110[11] |
| AI HAT+ 2 | Hailo-10H | 40 TOPS INT4 | 8GB | Yes | Launch $130; brief $180; store $200[1][2][5] |
| AI Camera | Sony IMX500 on-module | (on-sensor NPU) | On-module | No | $70[17] |

The AI Kit is the same Hailo-8L as the 13 TOPS HAT+, in M.2 2242 on an M.2 HAT+.[13] Raspberry Pi stopped production and points new designs at the HATs.[4][13] The AI Camera is a different architecture: a 12.3 MP Sony IMX500 Intelligent Vision Sensor with its own neural-network accelerator, $70, production until at least January 2028, and it works on every Raspberry Pi with a camera connector.[17] HAT+ 2 is Pi 5 only. It talks PCIe.[2][12]

## What 8GB next to the NPU actually buys

The Pi 5 already has LPDDR4X-4267 in 1GB, 2GB, 4GB, 8GB, and 16GB SKUs.[12] That pool runs the OS, the camera stack, Docker if you install it, and whatever else you left running. A 1.5B–7B language model that has to live in the same pool fights the desktop. HAT+ 2 puts 8GB on the accelerator so the host stays a host.[1][5]

Raspberry Pi's launch post is honest about scale. Cloud LLMs "range from 500 billion to 2 trillion parameters." Models sized for the HAT "typically run at 1–7 billion parameters."[2] The documentation table tightens that to "~6 billion."[3] Launch-day installable models were smaller still:

| Model | Parameters / size at launch |
|---|---|
| DeepSeek-R1-Distill | 1.5 billion |
| Llama3.2 | 1 billion |
| Qwen2.5-Coder | 1.5 billion |
| Qwen2.5-Instruct | 1.5 billion |
| Qwen2 | 1.5 billion |

Source: Raspberry Pi launch post.[2]

Those are constrained models. Raspberry Pi says they are not built to match a frontier knowledge set; they are built to operate inside a dataset you can fine-tune.[2] Vision models still retrain through Hailo's Dataflow Compiler. Language models on HAT+ 2 add LoRA adapters, compiled the same way, with most base weights frozen.[2][5]

Hailo, writing on the Raspberry Pi blog, measured time-to-first-token for QWEN2.5-1.5B-4int at 96 prefill tokens on llama.cpp: 2039 ms on the Raspberry Pi 5 CPU, 320 ms on the Hailo-10H.[6] That is the workload the board is for: a heavy encoder or prefill, then a short reply. Hailo says the HAT is strongest on fast encoders, short TTFT, large prefill relative to output, and multi-stage pipelines.[6][9] Token-by-token generation of a long essay is not the pitch. Hailo's line is the right one: "Don't ask your toaster for history lessons."[6][9]

## The $50 that followed the DRAM

Raspberry Pi did not hide the price path. The January launch said $130.[2] The April 2026 product brief, document RP-009655, prints list price $180.[5] A later company post on memory-driven increases named the AI HAT+ 2 explicitly: plus $50.[15] That arithmetic matches $130 to $180. The storefront now says $200.[1] I do not have a primary page that explains the last $20. Treat $200 as the live list price and $180 as the last numbered brief.

The same memory post is the industrial context. Raspberry Pi says the LPDDR4 DRAM used on Pi 4 and 5 rose seven-fold over the prior year.[15] Pi 5 4GB went up $25, 8GB $50, 16GB $100.[15] Compute Module 5 16GB went up $100.[15] The company held 1GB and 2GB Pi 4 and Pi 5 between $35 and $65, and held the 4GB Pi 400 at $60.[15] The HAT that exists to carry 8GB of LPDDR4X could not be held.

BBC reported Raspberry Pi raising its first-half 2026 adjusted-earnings floor to at least $38 million, with more than four million units expected in the half, on "robust demand" tied to AI devices, and shares up as much as 25 percent that morning.[14] The same piece notes repeated price increases after a global memory-chip shortage driven in part by AI data centres.[14] Demand for the small computer and the cost of the DRAM inside it are the same story.

The HAT+ 2 production promise is long: in production until at least January 2036.[1][5] Original AI HAT+ is promised through at least January 2030.[10] Pi 5 itself is promised through at least January 2036.[12] The RAM price is the short-term variable. Raspberry Pi says it will reverse the increases when memory prices abate.[15]

## The host is still a Pi 5, and the slot is still one lane

HAT+ 2 does not make a new computer. It sits on Raspberry Pi 5.[1][12] The SoC is Broadcom BCM2712, quad-core 64-bit Arm Cortex-A76 at 2.4 GHz, 512KB per-core L2, 2MB shared L3, VideoCore VII, dual 4Kp60 HDMI, LPDDR4X-4267, dual-band 802.11ac, Bluetooth 5.0/BLE, two USB 3.0 ports at simultaneous 5 Gbps, Gigabit Ethernet, two 4-lane MIPI camera/display transceivers, a 40-pin header, RTC, and a power button.[12] Power is 5V/5A USB-C with Power Delivery; Raspberry Pi recommends the 27W USB-C supply.[12] The 16GB SKU is $305 on the product page.[12] Related-product copy on the HAT page still says Pi 5 is "Available from $45."[1]

The PCIe fact that bites: Raspberry Pi 5 exposes "PCIe 2.0 x1" for fast peripherals, and that interface needs a HAT or adapter.[12] AI HAT+, AI HAT+ 2, and M.2 HAT+ all use that port.[3] Staff on the launch thread: you cannot run an M.2 HAT+ and an AI HAT at the same time.[2] If the box needs NVMe boot and Hailo-10H, this official stack does not give you both. Hailo sells a separate Hailo-10H M.2 module (Key M, 2242 or 2280, PCIe Gen-3.0 x4, 4GB or 8GB on-module LPDDR4/4X) for hosts that have an M.2 socket.[7] That is a different product, not a Raspberry Pi SKU.

AI Kit still needed a manual PCIe Gen 3.0 enable; HAT+ and HAT+ 2 apply it automatically.[4] Original HAT+ launch copy said the board "automatically switches to PCIe Gen 3.0 mode" to use the Hailo-8.[11]

## Mechanical, thermal, and the 2.5W that is not a HAT wattage

Both HATs are about 66 mm × 56.5 mm.[3] On HAT+ 2 the Hailo package is about 15 mm × 15 mm and the SDRAM about 14.5 mm × 10 mm.[3] The supplied heatsink is about 42.5 mm × 64 mm. With push pins the stack is about 14 mm high; without them, about 3.2 mm.[3] Ambient rating is 0°C to 50°C.[5] The brief tells you to install the heatsink for benchmarks and "very intensive AI workloads" to avoid thermal throttling, and not to remove it once fitted.[5] Raspberry Pi also recommends the Active Cooler on the Pi 5 itself.[3]

Hailo's Hailo-10H pages print 2.5W typical for the accelerator, with industrial −40°C to 85°C and automotive −40°C to 105°C grades on the chip.[7][8] That 2.5W is the Hailo silicon, not a measured wall figure for a Pi 5 plus HAT plus camera plus Active Cooler. The Pi brief does not publish a HAT wattage. Do not treat 2.5W as the system budget. The host still wants a 5V/5A supply.[12]

## Software: two metapackages that refuse to share a disk

Raspberry Pi OS Trixie, 64-bit, current firmware, then the Hailo stack.[4] Vision on AI Kit or HAT+ installs `hailo-all`. HAT+ 2 installs `hailo-h10-all`. The docs say those packages cannot co-exist.[4] Existing HAT+ camera apps should run on HAT+ 2, but they need model files compiled for the Hailo-10 NPU; `picamera2` / `rpicam-apps` demos now pull the H10 models Raspberry Pi supports.[2]

Vision demos on `rpicam-hello` include YOLOv6, YOLOv8, YOLOX, and YOLOv5 JSON post-process files under `/usr/share/rpi-camera-assets/`, plus segmentation and 17-point pose.[4] That path is the same camera stack the first HAT used.

Generative AI is a second stack. Official docs run LLMs through a Hailo Ollama server that loads models from Hailo's Gen-AI Model Zoo, talks to the Hailo-10H, and exposes a REST API.[4] Raspberry Pi's install path at documentation time was Hailo Model Zoo GenAI Debian package version 5.1.1 (`hailo_gen_ai_model_zoo_5.1.1_arm64.deb`).[4] Pull and chat go to `http://localhost:8000` with Ollama-style JSON.[4] Open WebUI is optional and runs in Docker because it is incompatible with Python 3.13 on Trixie.[4]

Hailo's `hailo-apps` repository is the applications layer Raspberry Pi points to: GStreamer pipelines, GenAI assistants, standalone C++/Python, Raspberry Pi / Ubuntu / Windows, Hailo-8 / 8L / 10H.[1][18] The v26.03.0 notes on that README include Windows support, YOLO26 models, and a Voice2Action demo.[18] Hailo still flags Frigate and Home Assistant integrations as upcoming, not done.[6][9] If NVR is the job, do not buy this HAT on a promise in a blog comment thread.

## What the board is for

Hailo and Raspberry Pi agree on the jobs that fit.

Vision-language models: the image encoder is the expensive stage; a ~2B VLM that was "prohibitively slow" on the Pi CPU becomes usable for event triggering, captioning, and free-text search over a camera.[6] Voice-to-action: Whisper-class speech-to-text, then a small LLM for intent, then a local command, all on-device.[6][9] Advanced vision: CNNs and transformer vision including CLIP and zero-shot detection; Hailo claims "as much as 100% faster" than the previous AI HAT+ on demanding vision.[6] Raspberry Pi's launch post does not repeat that 100% figure for CV; it says "broadly equivalent" to 26 TOPS.[2] Weight Hailo's 100% as Hailo's claim on selected vision workloads, and Raspberry Pi's "broadly equivalent" as the vendor of the HAT talking about the YOLO-class stack people already run.

The use-case table Hailo published on raspberrypi.com is the buying filter: offline home automation and robotics; home security with short captions on live vision; air-gapped summarisation of logs and sensors; kiosks that take spoken questions without a queue to the cloud.[6]

Raspberry Pi Press shipped *AI Projects with Raspberry Pi* as the long-form lab manual: computer vision, speech, Pico sensor inference, local LLMs on the CPU and on AI HAT+ 2, Stable Diffusion-style image generation, MobileNet retraining.[16] That book is how the company wants the HAT used: GPIO in, actuator out, model on the desk.

## What to buy this morning

If the job is bounding boxes, poses, and masks on a Pi 5 camera, AI HAT+ from $70 still exists, is promised until 2030, and shares the camera stack.[10][11] If the job is a camera that infers on the module and must plug into a Pi that is not a 5, the AI Camera at $70 is the official answer.[17]

If the job is a small local LLM or VLM next to GPIO, HAT+ 2 is the official board. Pay the live $200.[1] Budget a Pi 5, Active Cooler, 27W supply, and the fact that the PCIe slot is spent.[3][12] Expect 1B–6B class models, Hailo-compiled weights, and a software split (`hailo-h10-all`, hailo-ollama, optional Docker) that does not dual-boot with the old `hailo-all` metapackage.[3][4] Do not expect NVMe on the same official HAT stack.[2] Do not expect a 70B chat model. Do not expect the 40 TOPS INT4 sticker to outrun a 26 TOPS INT8 HAT on the vision demos you already have.[2]

The possible, on this board, is a Pi that keeps the camera, the pins, and a small language model in the same box without sending the frames to a GPU rack. The tax is 8GB of LPDDR4X that the Cortex-A76 never sees as system RAM, billed at whatever DRAM costs this quarter.

## Sources

[1] https://www.raspberrypi.com/products/ai-hat-plus-2
[2] https://www.raspberrypi.com/news/introducing-the-raspberry-pi-ai-hat-plus-2-generative-ai-on-raspberry-pi-5
[3] https://www.raspberrypi.com/documentation/accessories/ai-hat-plus.html
[4] https://www.raspberrypi.com/documentation/computers/ai.html
[5] https://pip.raspberrypi.com/documents/RP-009655-MM-raspberry-pi-ai-hat-plus-2-product-brief.pdf
[6] https://www.raspberrypi.com/news/when-and-why-you-might-need-the-raspberry-pi-ai-hat-plus-2
[7] https://hailo.ai/products/ai-accelerators/hailo-10h-m-2-ai-acceleration-module
[8] https://hailo.ai/products/ai-accelerators/hailo-10h-ai-accelerator
[9] https://hailo.ai/blog/bringing-on-device-generative-ai-to-the-pi-when-and-why-youll-need-the-raspberry-pi-ai-hat-2
[10] https://www.raspberrypi.com/products/ai-hat
[11] https://www.raspberrypi.com/news/raspberry-pi-ai-hat
[12] https://www.raspberrypi.com/products/raspberry-pi-5
[13] https://www.raspberrypi.com/documentation/accessories/ai-kit.html
[14] https://www.bbc.com/news/articles/czx2x3yl9rgo
[15] https://www.raspberrypi.com/news/a-new-3gb-raspberry-pi-4-for-83-75-and-more-memory-driven-price-increases
[16] https://www.raspberrypi.com/news/ai-projects-with-raspberry-pi-out-now
[17] https://www.raspberrypi.com/products/ai-camera
[18] https://github.com/hailo-ai/hailo-apps
