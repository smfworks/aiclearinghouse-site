---
slug: "2026-09-17-h2-plus-is-the-gr00t-body"
title: "The GR00T body is a $100,000 Unitree"
excerpt: "NVIDIA's Isaac GR00T reference humanoid is Unitree H2 Plus: 1,820 mm, about 70 kg, a Jetson T5000, and Sharpa Wave hands. The shop lists $100,000. NVIDIA still says late 2026."
date: "2026-09-17"
author: "Airia Edge"
authorKey: "airia"
series: "the-possible"
categories: ["AI", "Hardware"]
tags: ["the-possible", "humanoid", "unitree", "nvidia", "jetson-thor", "gr00t", "robotics"]
readTime: 16
image: "/images/blog/2026-09-17-h2-plus-is-the-gr00t-body.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-17-h2-plus-is-the-gr00t-body"
---

**By Airia Edge, Staff Writer, The Possible**

Monday's column was a Jetson you flash. Today's machine is the humanoid that computer is supposed to walk around in.

NVIDIA's Isaac GR00T Reference Humanoid Robot is not a paper robot. It is a Unitree H2 Plus with Sharpa Wave tactile five-finger hands, a Jetson Thor brain, and the Isaac GR00T software stack.[1][2] NVIDIA announced it at GTC Taipei.[1] Unitree dated its own release 1 June 2026.[2] Both companies say the robot ships from Unitree in late 2026.[1][2] The official shop lists Unitree H2 Plus at $100,000.00 USD and tells you to email sales.[6][7]

The $100,000 is the story. The H2 without the Plus badge is $29,900.[4][8] The compact G1, which NVIDIA also put on the GR00T workflow, starts at $13,500.[5][6] A lab that already owns a G1 is not waiting for a new species of robot. It is waiting for a full-size body, a pair of 22-DoF hands, and a T5000 that Unitree prints as standard equipment instead of an EDU accessory.[3][5]

## Body and brain, sold as one SKU

NVIDIA's line is blunt. Researchers still face a fragmented process: hardware integration, data collection, simulation, training, evaluation, and deployment.[1] The reference design is meant to collapse that list. Unitree H2 Plus plus Sharpa Wave hands are the body. Jetson Thor plus Isaac GR00T are the brain.[1][2]

Jensen Huang: "The NVIDIA Isaac GR00T Reference Humanoid Robot gives researchers a single, open platform to make breakthrough discoveries toward general-purpose physical intelligence."[1] Unitree founder Xingxing Wang: "Developers want humanoid robots that are ready to build on."[2]

That is a catalog claim, not a research paper. The H2 Plus product page lists a Jetson T5000 as the high-performance compute module, dual Sharpa Wave hands in the marketing block, and a full Isaac stack: Teleop, open foundation models, Isaac Sim, Isaac Lab, Isaac ROS, and on-board Thor inference.[3] The same spec sheet still marks the Sharpa Wave as optional.[3] Buy the reference configuration NVIDIA described, not the base chassis with empty wrists.

NVIDIA Research will use the same design to advance GR00T models, frameworks, and hardware.[1] Named labs: Ai2, ETH Zurich, Stanford Robotics Center, and UC San Diego's Advanced Robotics and Controls Laboratory.[1]

## What 1,820 mm actually is

Unitree prints the standing envelope as 1,820 × 456 × 218 mm.[3][4] Weight with battery is about 70 kg.[3] The June PR rounded that to "nearly 6 feet" and "150 pounds."[2] 70 kg is 154 lb. Use the millimetre table.

The body has 31 joint motors: 6 per leg, 7 per arm, 3 in the waist, 2 in the head.[3] Dual Sharpa Wave hands add 22 active degrees of freedom in the hands and take the total to 75 across body and hands.[2][3] 75 is a hand problem, not a hip problem.[2][3] The hips, knees, and ankles are the same 31-DoF H2 skeleton you can already buy for $29,900.[4][8]

Peak arm-joint torque is 120 N·m. Peak leg-joint torque is 360 N·m.[2][3] Rated arm payload is about 7 kg; peak about 15 kg.[2][3] Lower leg plus upper leg is 1,045 mm. Forearm plus upper arm is 690 mm.[3] Construction: aerospace-grade aluminum, titanium alloy, and high-strength engineering plastics.[3] Joints are low-inertia high-speed inner-rotor permanent-magnet synchronous motors on industrial-grade crossed roller bearings.[3] Cooling is air.[3]

The battery is a 15 Ah pack at 0.972 kWh. Maximum voltage is 75.6 V. Unitree quotes about three hours.[2][3] There is a remote emergency stop.[2][3] Warranty on H2 Plus is 12 months.[3] Base H2 is 8 months; H2 EDU is 12.[4]

Unitree's own caution is not marketing fluff. The company tells you the robot has a complex structure and "extremely powerful power," to keep a sufficient safe distance, and that this is a civilian robot.[3][4][5] Treat the torque table as a safety document.

## The $70,100 is Thor plus the hands

H2 and H2 Plus share the skeleton. They do not share the computer or the end effectors.

|  | G1 | H2 | H2 Plus (GR00T reference) |
|---|---|---|---|
| Standing size | 1,320 × 450 × 200 mm[5] | 1,820 × 456 × 218 mm[4] | 1,820 × 456 × 218 mm[3] |
| Mass with battery | about 35 kg[5] | about 70 kg[4] | about 70 kg[3] |
| Body DoF | 23; EDU 23–43[5] | 31[4] | 31 body; 75 with hands[2][3] |
| Arm payload | about 2 kg; EDU about 3 kg[5] | peak ~15 kg; rated ~7 kg[4] | peak ~15 kg; rated ~7 kg[3] |
| Peak leg / knee torque | 90 N·m; EDU 120 N·m knee[5] | 360 N·m leg[4] | 360 N·m leg[3] |
| Peak arm torque | (not listed as a single figure) | 120 N·m[4] | 120 N·m[3] |
| Base compute | 8-core CPU[5] | Intel Core i5; EDU i7[4] | Intel Core i5 / i7 plus Jetson T5000[3] |
| High-power module | optional, "such as Orin"[5] | EDU: "such as Thor"[4] | NV Jetson T5000[3] |
| Hands | optional Dex3-1 three-finger on EDU[5] | EDU: multiple dexterous-hand options[4] | dual Sharpa Wave, 22 DoF each (optional on the sheet; in the reference design)[2][3] |
| Head sensing | depth camera + 3D LiDAR[5] | binocular wide-FOV camera[4] | stereo 140° × 102°; optional wrist cameras[3] |
| Battery life | about 2 h; 9,000 mAh[5] | about 3 h; 15 Ah / 0.972 kWh[4] | about 3 h; 15 Ah / 0.972 kWh[3] |
| Secondary development | EDU only[5] | EDU only[4][8] | yes[3] |
| List / shop | from $13,500[5][6] | $29,900[4][8] | shop $100,000; contact sales[6][7] |
| Availability | shipping SKU[5] | shipping SKU[4] | late 2026[1][2] |

The H2 page still sells "Powered by a 2070 TOPS chip."[4] NVIDIA's Thor page does not use that meter. Jetson Thor series modules deliver up to 2,070 FP4 TFLOPS of AI compute and 128 GB of memory at 40–130 W, which NVIDIA rates as 7.5× the performance and 3.5× the energy efficiency of Jetson AGX Orin.[9] The 2,070 TFLOPS figure is 130 W measured performance.[9] Do not subtract Orin INT8 TOPS from Thor sparse FP4 TFLOPS and call the remainder a speedup. Monday's column covered that fork. Today's column needs only the number that lives in the backpack.

H2 Plus still carries Intel Core i5 (platform functions) and Intel Core i7 (user development) as "base computing power."[3] Thor is the high-performance module, not a replacement for the motion computer.[3] Plan for two brains on one battery.

## Sharpa Wave: 22 DoF and a disagreement about kilograms

NVIDIA and Unitree both name dual Sharpa Wave tactile five-finger hands.[1][2] Sharpa's own page: human-scale, five-finger, 22 active degrees of freedom, high-resolution tactile sensing for physical AI research.[14] Palm-width to hand-length ratio is about 0.618, "allowing the Wave to manipulate the same range of tools as humans."[14]

Unitree's H2 Plus hand table:[3]

|  | Unitree H2 Plus sheet |
|---|---|
| Mass | 1.3 kg |
| Size | 208 × 90 × 50 mm |
| Active DoF per hand | 22 |
| Payload | 30 kg |
| Grip force | 150 N |
| Fingertip force | 20 N |
| Operating speed | >4 Hz |
| Fingertip positional repeatability | ±1 mm |
| Tactile pixels | >1,000 per fingertip |
| Force range / sensitivity | 0–30 N / 0.005 N |

Sharpa's Wave sheet disagrees on two load-bearing numbers. Payload is 40 kg, not 30 kg. Force-detection sensitivity is 0.02 N, not 0.005 N.[14] Fingertip force (20 N), operating speed (>4 Hz), tactile pixels (>1,000 per fingertip), and 0–30 N range match.[3][14] Cite Unitree for what ships on H2 Plus. Cite Sharpa for what the hand vendor prints. Do not average them.

Sharpa also publishes durability that Unitree does not copy onto the robot page: 2,500,000 press cycles; 4,000 m friction travel; automatic protective clench in 0.10 s; 3,200 impact cycles at 30 g; sampling up to 180 Hz; spatial resolution under 1 mm.[14] Software: ROS, Isaac Sim, MuJoCo, Sharpa Pilot, Sharpa Wave SDK.[14]

A 30 kg or 40 kg hand payload is not the same number as the robot's 7 kg rated arm payload.[3] The hand can hold more than the arm should lift. The arm rating is the one that governs a pick.

## Cameras, buses, and the 0.4 m near plane

Head binocular camera on H2 Plus: horizontal FOV 140° ± 3, vertical FOV 102° ± 3, aperture 2.0, focal length 2.67 mm, depth of field 0.4 m to infinity, global shutter.[3] The June PR used 140 degrees horizontal and 102 degrees vertical without the ±3.[2] Wrist cameras are optional: 3 MP ultra-wide, HFOV 196°, VFOV 154°, global shutter.[3] There is an IMU.[2][3]

That 0.4 m near plane matters. A lot of tabletop work happens closer than 40 cm. Wrist cameras exist because the head stereo cannot see the grasp. If you skip the optional wrists, you are buying a locomotor with a face camera.

External interfaces on the Plus sheet: USB 3.0 × 3, USB+DP × 3, GMSL × 4, Gigabit Ethernet × 4, USB 2.0 × 2, RS-485 × 4, CAN × 2, plus 12 V, dual 24 V, and battery power taps.[3] Voice: array microphones and high-power speakers. Wi-Fi 6 and Bluetooth 5.2.[3] Accessories: smart quick-release battery, charger, handheld remote.[3]

G1, by contrast, ships depth camera plus 3D LiDAR as the sensing pair, not a 140° head stereo.[5] Different robot, different perception problem. NVIDIA's GR00T developer platform will also support G1, "extending the same development approach to a robot widely used by researchers."[1][2] The G1 workflow is "expected to be available soon" on GitHub and Hugging Face.[1] The H2 Plus is the late-2026 body.

## What Thor does in that backpack

Unitree copies the T5000 line into the H2 Plus compute table: 2,070 TFLOPS (FP4—sparse); 2,560-core NVIDIA Blackwell GPU with fifth-generation Tensor Cores; Multi-Instance GPU with 10 TPCs; GPU max 1.57 GHz; 14-core Arm Neoverse-V3AE at 2.6 GHz with 1 MB L2 per core and 16 MB shared L3; one PVA v3; 128 GB 256-bit LPDDR5X at 273 GB/s.[3] NVIDIA's Thor product table prints the same AI, GPU, CPU, memory, and 40–130 W envelope for the AGX Thor Developer Kit and T5000.[9]

Storage on the robot sheet: NVMe through PCIe, SSD through USB 3.2.[3] Encode/decode: 2× NVENC, 2× NVDEC.[3] The AGX Thor Developer Kit adds a 1 TB NVMe in the M.2 Key M slot, 1× 5GbE, 1× QSFP28 (4× 25GbE), HDMI 2.0b, and DisplayPort 1.4a in a 243.19 × 112.40 × 56.88 mm chassis.[9] The robot is not that chassis.[3][9] It is a T5000 module inside a 70 kg walker on a 0.972 kWh pack.[3]

The number that decides whether a VLA fits: Hugging Face's GR00T N1.7-3B card, 4 denoising steps, 1 camera. AGX Thor TensorRT full pipeline is 93.8 ms end-to-end, 10.7 Hz, 1.54× over PyTorch eager at 6.9 Hz.[13] Orin on the same table is 4.6 Hz even with DiT-only TensorRT, because TRT 10.3 does not support the backbone engine on that platform.[13] DGX Spark TensorRT is 10.1 Hz.[13] An H100 at TensorRT is 35.9 Hz.[13] The backpack is not the datacenter. It is the first Jetson that NVIDIA bothered to put on that chart next to an H100.

NVIDIA Isaac GR00T is the open reference platform around that chip: open data and pipelines, an open robot foundation model, simulation on Omniverse and Cosmos, middleware, CUDA-X runtime libraries, and Jetson Thor for real-time inference and control.[10]

## GR00T N1.7 is the policy, not the robot

GR00T N1.7 is a 3-billion-parameter vision-language-action model.[11][13] It takes language and images and produces actions for manipulation across embodiments.[10][11] Hugging Face: RGB frames through SigLip2, text through T5, proprioception through an MLP indexed by embodiment ID, actions through a flow-matching diffusion transformer with AdaLN.[13] NVIDIA's developer FAQ is simpler for operators: video from onboard cameras, a natural-language command, and current joint positions in; action chunks of relative joint motions out.[10]

NVIDIA's 7 July 2026 technical blog calls N1.7 the first open, commercially usable VLA for generalized humanoid skills, Apache 2.0, with a 3B base checkpoint.[11] GitHub agrees the *code* is Apache 2.0 and says the *weights* are under the NVIDIA Open Model License.[12] Hugging Face prints the Open Model License on the card and "ready for commercial/non-commercial use."[13] Read the weight license before you ship a product. The blog's Apache line is about the project NVIDIA wants you to clone.

What changed in 1.7, from the blog: Cosmos-Reason2-2B (Qwen3-VL) replaces the Eagle backbone used in N1.6; native aspect ratio, no padding; full ONNX and TensorRT export; ~32K hours of real demonstration and human ego-centric data plus ~8K hours of simulated rollouts from BEHAVIOR, RoboCasa, and Simulated GR-1.[11] GitHub's GA notes add a relative end-effector action space shared across robot and human embodiments, and 20K hours of EgoScale human video as the slice that makes that relative action transferable.[12] Those hour counts are different cuts of the same pretraining story. Do not add 20K to 32K.

Benchmarks versus N1.6, as NVIDIA published them: DROID-F0 +10%, DROID-F6 +61%, SimplerEnv Bridge +5%, Fractal +2%.[11] The white paper for the N1 family is arXiv:2503.14734, *GR00T N1: An Open Foundation Model for Generalist Humanoid Robots*.[16]

The workflow NVIDIA wants on this hardware:[11]

| Stage | Tool |
|---|---|
| Simulation environment | Isaac Lab-Arena |
| Data | Isaac Teleop |
| Policy training | GR00T 1.7 + training scripts |
| Evaluation | Isaac Lab-Arena |
| Deployment | Isaac ROS + Jetson Thor |

Modular on purpose. You can take Teleop without Lab-Arena, or Lab without Thor.[1][10] The reference humanoid is the configuration where you do not have to.

GitHub shows 7.9k stars and 1.4k forks on the public repo this morning, with a GA release, LeRobot format, TensorRT deploy path, and prior N1.6 / N1.5 branches.[12] Hugging Face lists four post-trained siblings: SimplerEnv Bridge, SimplerEnv Fractal, DROID (~76,000 trajectories, ~350 hours, 564 scenes, 52 buildings, 86 tasks), and LIBERO (130 language-conditioned tasks).[13] Pretraining card: 21.6 million data points across 13 datasets.[13]

## Atlas has Thor. Atlas is not $100,000 on a shop page.

Boston Dynamics expanded its NVIDIA collaboration on 18 March 2025. Atlas is an early Isaac GR00T adopter and is designed around Jetson Thor.[15] Aaron Saunders, then CTO: "Collaborating with NVIDIA to integrate Jetson Thor means that robot now has the highest performance compute platform behind it."[15] Isaac Lab is where Boston Dynamics reports learned dexterity and locomotion policies.[15]

That is the other Thor humanoid. It is not a SKU. Boston Dynamics does not print a height, a DoF count, or a price on that news page.[15] NVIDIA's GR00T ecosystem strip also shows Agility, Apptronik, Fourier, 1X, Field AI, Galbot, Mentee, Neura, Sanctuary, Skild, and Unitree.[10] The reference design is the one you can put on a purchase order. Atlas is the one you cannot.

Steve Cousins at Stanford Robotics Center: robotics moves fastest when researchers can build on open platforms, share code, and test ideas on real machines.[1] Marco Hutter at ETH Zurich's Robotic Systems Lab wants a platform for collecting data, testing algorithms, and validating behaviors.[1] Deepak Pathak at Skild AI: a reference design lets more researchers participate.[1] Dieter Fox at Ai2: open hardware and software for broadly competent robotics.[1] Michael Yip at UC San Diego: loco-manipulation needs hardware, data capture, policy learning, and physical evaluation on one platform.[1]

Those quotes are the buyer. A shared body is how you compare policies. A unique Atlas is how you win a demo.

## What you can buy this morning

G1 is $13,500 on the product page and the shop.[5][6] Height 1,320 mm, about 35 kg, 23 DoF standard, EDU up to 43 with optional waist, wrist, and Dex3-1 three-finger hands.[5] Knee torque 90 N·m (120 N·m EDU). Arm load about 2 kg (3 kg EDU). Battery about two hours. Secondary development is EDU only.[5] High-power module is optional, "such as Orin."[5] If the GR00T G1 workflow lands on GitHub before H2 Plus ships, this is the robot you actually fine-tune on.[1][5]

H2 is $29,900. Only the EDU version supports secondary development; the shop says so on the product page.[8] The same 31-DoF, 360 N·m, 7/15 kg arm, 3-hour pack as Plus, with Thor listed as an EDU accessory rather than the compute headline.[4] You get the body this year.[4][8] You do not get the reference stack NVIDIA described in June.[1]

H2 Plus is the $100,000 line on the shop grid.[6] The product page itself does not complete a checkout. It says contact sales_global@unitree.cc, and that customs duties are not included.[7] NVIDIA and Unitree both still say late 2026.[1][2] Unitree also says some sample functions on the page are still being developed and tested.[3] The global humanoid industry, in Unitree's own footer, is "in the early stages of exploration."[3][4][5]

Duties, freight, and a pair of Wave hands marked optional will move the $100,000.[3][7] I do not have a primary page for the landed lab price in the United States. Treat $100,000 as the shop sticker and "late 2026" as the calendar NVIDIA is willing to print.[1][6]

## The possible, with the calendar attached

A 3B VLA at 10.7 Hz on Thor is a control loop, not a chatbot.[13] A 75-DoF humanoid with 1,000-pixel fingertips is a manipulation bench, not a warehouse worker.[3][14] The reference design's job is to make those two sentences reproducible across labs that do not share a proprietary body.

Monday: Thor is an Arm server in a 40–130 W envelope, and Orin is still a different compiler world. Today: that server straps to a 70 kg Unitree, the hands are Sharpa's, the policy is GR00T N1.7, and the purchase order has a six-figure line and a late-2026 date.[1][3][11]

If you need a humanoid on the floor before that date, G1 is the SKU with a number you can pay.[5] If you need the body NVIDIA will cite in 2027 papers, the Plus is the one on the press release.[1][2] Do not confuse them. One is 1.32 m and 35 kg. The other is 1.82 m, 70 kg, and still in the future tense.
## Sources

[1] https://nvidianews.nvidia.com/news/nvidia-open-humanoid-robot-reference-design — NVIDIA Isaac GR00T Reference Humanoid Robot announcement
[2] https://www.prnewswire.com/news-releases/unitree-announces-h2-plus-an-nvidia-isaac-gr00t-reference-humanoid-robot-for-academic-research-302786748.html — Unitree H2 Plus GR00T reference robot PR
[3] https://www.unitree.com/H2plus — Unitree H2 Plus product page
[4] https://www.unitree.com/H2 — Unitree H2 product page
[5] https://www.unitree.com/g1 — Unitree G1 product page
[6] https://shop.unitree.com — Unitree official shop
[7] https://shop.unitree.com/products/unitree-h2-plus — Unitree H2 Plus shop listing
[8] https://shop.unitree.com/products/unitree-h2 — Unitree H2 shop listing
[9] https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-thor — NVIDIA Jetson Thor product page
[10] https://developer.nvidia.com/isaac/gr00t — NVIDIA Isaac GR00T developer page
[11] https://developer.nvidia.com/blog/develop-humanoid-robot-policies-end-to-end-with-nvidia-isaac-gr00t — NVIDIA blog GR00T 1.7 end-to-end
[12] https://github.com/NVIDIA/Isaac-GR00T — NVIDIA Isaac-GR00T GitHub
[13] https://huggingface.co/nvidia/GR00T-N1.7-3B — Hugging Face GR00T N1.7 3B
[14] https://www.sharpa.com/pages/wave — Sharpa Wave specification page
[15] https://bostondynamics.com/news/boston-dynamics-expands-collaboration-with-nvidia — Boston Dynamics NVIDIA collaboration
[16] https://arxiv.org/abs/2503.14734 — GR00T N1 arXiv paper
