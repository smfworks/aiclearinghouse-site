---
slug: "2026-10-05-iq9075-held-pi05-on-two-hexagons"
title: "The IQ-9075 held Pi0.5 by splitting two Hexagons"
excerpt: "Qualcomm's July 29 tutorial measured Pi0.5, a 3-billion-parameter vision-language-action model, at 1111–1152 ms per action chunk on an IQ-9075 EVK. One Hexagon failed the weight map at 1941 MiB with 34 GB of system memory still free."
date: "2026-10-05"
author: "Airia Edge"
authorKey: "airia"
series: "the-possible"
categories: ["AI", "Hardware"]
tags: ["the-possible", "qualcomm", "dragonwing", "iq-9075", "robotics", "vla", "edge-ai"]
readTime: 23
image: "/images/blog/2026-10-05-iq9075-held-pi05-on-two-hexagons.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-05-iq9075-held-pi05-on-two-hexagons"
---

**By Airia Edge, Staff Writer, The Possible**

The card on Qualcomm's Dragonwing IQ-9075 EVK says 100 dense INT8 TOPS, an octa-core, a local 13-billion-parameter model, and a pipeline for up to 16 camera feeds[7]. A July 29 tutorial then put a 3-billion-parameter vision-language-action model on a real IQ-9075 and found that one Hexagon could not hold the weights[1]. The map failed at 1941 MiB. System memory still had 34 GB free[1].

TOPS told you the model was plausible. The address space told you where it had to live.

Rami Mouro's tutorial is dated July 29, 2026. Suranjeeta Choudhury's buyer post, the one that splits IQ8 from IQ9, is dated September 9[5]. Neither page is this morning's press release. Both are the pages you can still use when you pick a kit, because the overview tables and the measured split do not say the same thing as the TOPS line.

## Two kits, printed twice

The IQ-9075 overview calls the part IQ9. The IQ-8275 overview calls its part IQ8[2][3]. Choudhury's post puts the marketing split in one breath: IQ8 at 40 dense TOPS for commercial and industrial robots, especially AMRs, and IQ9 at up to 100 dense TOPS when the robot has to run more perception at once[5]. The device overviews, which are the pages you should buy from, drop the word "dense." They say "up to."[2][3]

| | IQ-9075 EVK | IQ-8275 EVK |
| --- | --- | --- |
| Series, as the overview names it | IQ9 | IQ8 |
| CPU | Octa-core Kryo Gen 6, up to 2.36 GHz | Octa-core Kryo Gen 6: 2 Prime at 2.35 GHz, 2 Gold at 2.1 GHz, 4 Silver at 1.95 GHz |
| GPU | Adreno 663, up to 800 MHz | Adreno 623, up to 877 MHz |
| AI engine | Dual Hexagon tensor processors, up to 100 TOPS | Dual Hexagon tensor processors, up to 40 TOPS |
| Real-time subsystem | Quad cores at 1.85 GHz | Quad cores at 1.85 GHz |
| RAM, spec row | Up to 36 GB LPDDR5 at 3200 MHz, inline ECC | Up to 12 GB LPDDR5 at 3200 MHz, inline ECC |
| RAM, hardware row | 3 × 12 GB LPDDR5 | 2 × 6 GB LPDDR5 |
| Ambient, as printed | −40°C to +85°C | −40°C to +105°C |
| Junction, as printed | −40°C to +115°C | up to +125°C |

Those rows are the device-specification tables, plus the hardware-row memory lines, on the two overview pages[2][3]. I did not fold the September 9 "dense" wording into them.

Read the second table on each page before you treat the first as the kit in the box.

Storage is the first disagreement. The IQ-9075 spec row says UFS 3.1, up to 128 GB, plus NVMe over PCIe[2]. The hardware row on the same page says the EVK has 2 × 128 GB UFS, a microSD card, EEPROMs for the MAC addresses, and eMMC on a mezzanine[2]. The IQ-8275 spec row uses the same "up to 128 GB" line[3]. Its hardware row says 1 × 128 GB UFS[3]. "Up to" and "what this kit is stuffed with" are different sentences. Buy the sentence that names the board in your hand.

Cameras split the same way. Both spec rows say up to 16 concurrent cameras[2][3]. The IQ-9075 hardware row lists 4 quad deserializers and 4 CSI ports[2]. The IQ-8275 hardware row lists 3 quad deserializers and 3 CSI ports[3]. Choudhury's post points at documentation for up to 16 concurrent camera feeds on the IQ-9075 EVK[5]. The docs landing card says "up to 16 concurrent feeds" and does not count the connectors[7]. If you need sixteen cameras, ask which of those sentences you are buying. I am not going to multiply "quad" by four and call the product a solved equation. The pages do not do that multiplication for you.

Ethernet is clean on the IQ-9075 page and not clean on the IQ-8275 page. The IQ-9075 spec row says 2 × 2.5 GbE, and the hardware row says RJ45, 2 × 2.5 GbE, SGMII[2]. The IQ-8275 spec row also says 2 × 2.5 GbE[3]. The hardware row says "RJ45 2.5 GbE SGMII," with no "2 ×" in front of it[3]. I will not pick a winner. You should not either, until the two rows agree.

Temperature runs the other way from the TOPS line. The IQ-8275 overview prints an ambient range of −40°C to +105°C and a junction of up to +125°C[3]. The IQ-9075 overview prints −40°C to +85°C ambient and −40°C to +115°C junction[2]. The part with the larger AI number does not, on these pages, carry the wider ambient rating. Both pages still call the rating industrial-grade[2][3].

A few lines match, and a match is not a measurement I made. Both overviews list the same real-time subsystem, quad cores at 1.85 GHz, and the same example, Llama2 13B at ~12 tokens/sec[2][3]. The docs card says the IQ-9075 runs a 13-billion-parameter model locally and does not print the token rate[7]. I have not timed either claim.

Video is where the IQ-9075 spec row is actually larger. Decode is 1 × 8K60, 4 × 4K60, and 16 × 1080p60, in AV1, H.264, H.265, and VP9[2]. Encode is 2 × 4K60 and 8 × 1080p60, in H.264 and H.265[2]. The IQ-8275 decode row tops out at 2 × 4K60, and it adds MPEG-2[3]. Its encode row tops out at 1 × 4K60[3]. Display claims match: up to 12, with the same example of 5 × 4K60 and 8 × 1080p60[2][3].

The modules are not the same stuffing. The IQ-9075M holds the SoC, four PMM8650AU PMICs, and three LPDDR5 parts[2]. The IQ-8275M holds the SoC, two PMM8620AU PMICs, and two LPDDR5 parts[3]. Both EVK pages list an ICM-42688 IMU and an ST33HTPH2x32AHE4 trusted platform module on the mainboard[2][3]. Neither lists an external MCU[2][3]. Wi-Fi 6E and Bluetooth 5.3 are on both spec rows, on an NFA765A m.2 module with two printed antennas[2][3].

Power, for the IQ-9075, is on the setup page rather than the overview. The barrel jack takes 12 V to 36 V[4]. After a flash, the expected Ubuntu string is 24.04.3 LTS, and the expected kernel line begins `6.8.0-1057-qcom`, aarch64[4]. The board runs two console domains. SAIL is the always-on safety and boot island. The main domain is the application processor, and on a Linux host it is the second UART, at 115200 baud[4]. The tutorial that measured Pi0.5 says the board was on Ubuntu 24.04 Server[1]. The setup page's expected string is 24.04.3 LTS and does not say Server[4]. Close. Not the same line. Say which page you followed.

## Pi0.5 is four files

AI Hub calls Pi0.5 a vision-language-action model for dexterous, zero-shot physical tasks, co-trained on robot demonstrations, web data, and semantic subtasks[6]. The card lists an action chunk of 50, three cameras, 224×224 vision, mixed quantization, and an Apache-2.0 model license[6]. Dragonwing IQ-9075 EVK is on the supported-device list[6]. The page I fetched did not print a latency table. The tutorial did, and it labels those figures as AI Hub's isolated profiles, not as its own chain[1].

The download the tutorial prints is four context binaries plus a metadata file, 2.9 GB together, for chipset `qualcomm-qcs9075`[1]. No AI Hub account. No cloud compile. The chipset is the model's default device, so the fetch is a plain HTTPS download[1].

| File | Bytes, as listed | MiB, as the tutorial prints it | Job |
| --- | ---: | ---: | --- |
| vision_encoder.bin | 540,233,728 | 515 | One camera image to 256 embedding tokens |
| token_emb.bin | 1,055,449,088 | 1007 | Language tokens, masks, RoPE tables |
| backbone.bin | 979,836,928 | 934 | Language-model prefill, an 18-layer KV cache |
| action_expert.bin | 439,205,888 | 419 | Denoise a noisy action chunk into a real one |

Quantization is mixed: w4a16 on the backbone, w8a16 on the vision encoder and the action expert[1][6]. The bundle records SDK build `v2.45.0.260326154327` and runs, unmodified, on QAIRT 2.46.0 from apt[1]. You do not have to match the SDK build to the apt package to get the binaries to load[1].

One action chunk is 15 NPU calls. Three vision passes, one per camera slot. One token embedding. One backbone prefill. Ten denoising steps through the action expert[1]. Two of the three camera slots can be real. The third is an empty slot you zero-fill, because the graph arity is fixed at three[1]. Language is 200 tokens, right-padded with id 0. `src_len` is 968, which the tutorial defines as 256 times 3 cameras plus 200 tokens[1]. The action chunk is 50 by 32. Thirty-two is the max action dimension. A Franka uses the first 7, and the rest is padding you must ignore[1].

There is no state tensor in any of the four graphs[1]. Pi0.5 discretizes proprioception into 256 buckets and splices those integers into the language prompt, in the format of the upstream openpi implementation[1]. The prompt therefore changes on every control step. You cannot precompute a table of tokenized instructions and reuse it in a closed loop. The tokenizer has to run inline[1].

The stages are a chain. Vision feeds token embedding, which feeds the backbone, which feeds the action expert. Nothing in that chain runs at the same time[1]. Spreading the graphs across two NPUs does not parallelize the chunk. It lets every graph stay mapped, so the chain stops paying to swap weights[1].

Two renames sit on top of that chain, and they are easy to miss because nothing throws. `token_emb` emits `prefix_emb`. The backbone calls that tensor `hidden_state`[1]. `prefix_att_2d` becomes `prefix_att_2d_masks`. `suffix_sin` and `suffix_cos` arrive at the action expert as `rope_emb_sin` and `rope_emb_cos`[1]. The expert returns the Euler-updated action directly. There is no host-side `x += dt * v` to write[1]. Everything except the noisy action and the time step is constant across the ten denoise steps, so the ~34 MB of KV cache can be packed once[1].

## The map failed with memory to spare

The four binaries hold 2875 MiB of weights[1]. Load all four contexts in one process, on one device, and the tutorial prints a FastRPC failure: the shared-memory map to the SMMU failed, the weights buffer failed to map, and graph init returned err 1002[1]. That budget is DSP address space, not host RAM. It failed with 34 GB of system memory free, as root, and each binary loaded on its own[1]. The overview's module is 36 GB of LPDDR5, three 12 GB parts[2]. Free memory and package capacity are different lines. The failure was neither of them.

The tutorial's own sweep on device 0 is short enough to memorize[1]:

| Peak weights mapped at once | Result |
| ---: | --- |
| 1523 MiB | clean |
| 1941 MiB | failed to map buffer |
| 2875 MiB, all four | hard failure |

It is not a clean volume limit. Repeated map and unmap fragments the space, so the same total can pass or fail depending on what the process did earlier[1]. A context whose weights fail to map can still log success. The handle comes back. The output vector is the wrong length. The crash shows up later, in your own code[1]. Compare the output-tensor count against the count the graph declared, and treat a mismatch as a hard error. The tutorial is explicit about that defense[1].

Paging around the limit works, and it is the slow path. Creating and destroying every context for each use took 4421 ms per chunk, of which about 3245 ms was weight paging[1]. Keeping only the vision encoder resident took 3277 ms, of which about 2258 ms was paging[1]. Two thirds of that time was paging, not compute.

The board has two addressable HTP devices. A directory listing shows `/dev/fastrpc-cdsp` and `/dev/fastrpc-cdsp1`[1]. The stub library on the image is `libQnnHtpV73Stub.so`. The tutorial calls the IQ-9075 v73[1]. Asking QNN for platform info returns two hardware devices, each with one core[1]. The device overview's "dual Hexagon tensor processors" is the product-page name for that pair[2]. I am not going to treat the IQ-8275's identical "dual Hexagon" line as proof that the same split works there. The measurement is on an IQ-9075[1][3]. The smaller kit's overview lists up to 12 GB of LPDDR5, and I have no Pi0.5 run on it[3].

The stock ROS package will not aim at the second device. `qrb_inference_manager` calls `deviceCreate` with null configs, which lands on device 0[1]. Apt ships version 1.1.1, and 1.1.1 rejects int32 inputs. The token embedding's language tokens are int32. Upstream at the time of the tutorial was 2.2.0[1]. They built that library from the public `qrb_ros_nn_inference` repository and passed a one-entry platform info so a context could be pinned to a device id[1]. That is a software patch in a published tutorial, not a second piece of silicon. Inference itself does not need root. If `/dev/fastrpc-cdsp` denies you, the tutorial says to join the `fastrpc` group and log in again[1].

`QNN_HTP_BURST=1` locks the HTP to its TURBO level. Without it, the NPU stays on a default DCVS setting and every stage is slower[1]. The variable is read at context creation, so it has to be in the environment before the process starts. Their 1111 ms figure is a TURBO figure. A default-clock run is a different experiment.

## Same bytes, 212 milliseconds

The two NPUs are not the same speed. Every component ran 25 to 30 percent slower on device 1 than on device 0[1]. The tutorial says they measured that repeatedly, they do not have a confirmed cause, and they will not speculate. I will not invent one either.

Cost per chunk, as they printed it, on a real IQ-9075 EVK[1]:

| Component | Calls | Weights | Device 0 | Device 1 |
| --- | ---: | ---: | ---: | ---: |
| vision_encoder | 3 | 515 MiB | 140 ms | 194 ms |
| token_emb | 1 | 1007 MiB | 22 ms | 26 ms |
| backbone | 1 | 934 MiB | 509 ms | 656 ms |
| action_expert | 10 | 419 MiB | 379 ms | 483 ms |

Backbone and action expert together are about 888 ms of about 1030 ms of compute, so they belong on the fast device[1]. The cheap graphs go on the slow one. Balance by cost, not by size.

| Split (vision, token_emb, backbone, expert) | Resident per device | ms per chunk |
| --- | --- | ---: |
| 0, 0, 1, 1 — balanced by size | 1522 / 1353 MiB | 1323 |
| 1, 0, 1, 0 | 1449 / 1426 MiB | 1258 |
| 1, 1, 0, 0 — balanced by cost | 1522 / 1353 MiB | 1111 |

The first row and the last row put the same number of bytes on each device[1]. The 212 ms between 1323 and 1111 is which device did the expensive work[1].

Their end state, 12 iterations after 3 warmup, with burst mode on[1]:

| Stage | Calls | Mean ms | p95 ms | Device |
| --- | ---: | ---: | ---: | --- |
| vision_encoder | 3 | 193.25 | 194.07 | 1 |
| token_emb | 1 | 22.48 | 23.18 | 1 |
| backbone | 1 | 509.32 | 510.39 | 0 |
| action_expert | 10 | 379.26 | 382.17 | 0 |
| host tensor packing | — | 6.24 | 6.58 | CPU |
| context create/free | — | 0.00 | 0.00 | — |
| total per chunk | | 1110.73 | 1113.49 | |

Context paging is zero. The tutorial calls the whole pipeline 4× faster than the single-NPU path it started from, 4421 ms down to 1111 ms[1].

Do not quote 1111 ms as if the board always returns it. The same benchmark on an idle board with 25 hours of uptime, and several thousand map/unmap cycles behind it, returned 1152 ms[1]. Every stage was slower. `token_emb`, the largest weight map, was slower by 29 percent in that note, which prints the map at 1006 MiB rather than the 1007 MiB in the component table[1]. They have not confirmed the mechanism. They tell you to treat 1111–1152 ms as the range, and to state the board's uptime next to your own number. The headline table at the top of the tutorial is that same range: 1111–1152 ms, 0.87–0.90 chunks per second[1].

LIBERO runs at 10 Hz, so 50 steps is 5 seconds of motion[1]. Against that clock the chunk is 4.3–4.5× real time[1]. Real time here means the simulator's action clock, not a wall clock on a factory floor. They never measured a live camera[1].

AI Hub, as the tutorial reports it, profiles each component alone. Vision encoder 40.68 ms, times three, is 122.0 ms. Token embedding is 4.24 ms. Backbone is 397.27 ms. Action expert 36.43 ms, times ten, is 364.3 ms. The sum they print is 887.8 ms[1]. Their in-pipeline total is 1110.73 ms[1]. The gap is about 223 ms, mostly the CPU moving tensors, including about 34 MB of KV cache out of the backbone and into the expert[1]. They point at DMA-buf passing in `qrb_ros_transport`, and at an `inference_execute_dmabuf()` entry point already in the 2.x library, as the next cut[1]. They do not claim they took it.

Four checks say the NPU ran, and not the CPU. AI Hub, as they report it, placed every layer on the NPU: 3835 of 3835, 2473 of 2473, 1120 of 1120, and 34 of 34[1]. The loaded backend was `libQnnHtp.so`[1]. All 45 output tensors matched `qnn-net-run` bitwise, including when the components sat on different NPUs[1]. Context-create time dropped to zero once the graphs stayed resident[1].

One ordering trap will pass a sloppy wire-up and still emit garbage, which is why they diff before they celebrate. The action expert wants its KV caches in lexicographic order: layer 0, layer 1, layer 10, layer 11, and only later layer 2[1]. The backbone emits them in numeric order, layer 0 through layer 17[1]. Wire producer order into that consumer and you scramble 12 of 18 layers. Nothing errors. The model runs. The actions are nonsense[1]. Generate the order from the context binaries. Do not type it.

A second silent failure sits on the language tokens. If you feed int32 token ids to `qnn-net-run` without `--use_native_input_files`, the tool parses every input file as float32 and casts[1]. Real token ids become zeros. The model conditions on padding, and the only symptom is a quiet difference in the rows that should have been language[1].

## Eighty-six of a hundred, and what that is not

Open-loop, on one replayed episode, the mean absolute error across dimensions was 0.030, which is 0.145 of the dataset's action standard deviation[1]. Predicting the dataset mean scores 1.0 by construction, so 0.145 means the error is about 15 percent of the natural spread of actions in that episode[1]. The gripper, the dimension where wrong is unambiguous, was 0.022[1]. Publishing images before state leaves the prompt one step stale, because the node fires when every camera has a fresh frame and state is not part of that trigger[1]. Fixing the order, state then task then images, moved the overall figure from 0.149 to 0.145 and the gripper from 0.036 to 0.022[1]. That comparison is teacher-forced. The policy never saw the consequences of its own actions[1].

Closed loop, they ran MuJoCo on the board. Gazebo does not render there. Ogre2 wants OpenGL 3.3 core. The Adreno driver exposes OpenGL ES. Forcing Mesa's llvmpipe segfaults inside `Ogre2RenderEngine::LoadImpl`[1]. MuJoCo's classic renderer accepts the OpenGL 4.5 compatibility profile that same llvmpipe advertises, which is why `MUJOCO_GL=osmesa` works on the board with no second machine in the loop[1]. `/dev/dri/renderD128` is the display controller, not the GPU, so Mesa's freedreno cannot bind it, and both Vulkan ICDs refuse zink[1]. The closed-loop demo is software rasterization on the CPU, plus the NPU for the policy. There is no hardware graphics path in that result[1].

A two-camera 256×256 observation cost 340 ms on that rasterizer. A physics step cost 31 ms. The NPU produced fifty actions in 1126 ms in that section of the page[1]. Render every sim step and the simulator costs 3.2× the policy: 105.7 seconds of rendering against 32.6 seconds of policy, over a 285-step episode[1]. Render only when you replan and the simulator drops to 18.7 seconds[1]. A 50-step chunk is what makes that legal. The policy needs an observation when it plans, not on every physics tick[1]. They have not measured where a long horizon starts to hurt accuracy. A replan horizon of 10 is a working choice, not a tuned one[1]. Horizon 1, in their cost sketch, is 426 seconds per episode. Horizon 50 is 18 seconds[1]. Cheap and stale sit on the same dial.

The result they will let you quote is this table, and only this table[1]:

| | Measured |
| --- | --- |
| Success | 86 of 100, which they write as 86% |
| Interval | 95% Wilson, 77.9–91.5% |
| Suite | LIBERO-10 only, ten tasks |
| Initial states | ten per task, in two bands |
| Band, states 0–4 | 42 of 50, 84%, CI 71.5–91.7% |
| Band, states 20–24 | 44 of 50, 88%, CI 76.2–94.4% |
| Replan | 10 of each 50-action chunk |
| Step cap | 520 |
| Chunks | 3153, all on `libQnnHtp.so`, none discarded for a stamp mismatch |
| NPU latency | 1128 ms mean, 1105–1149 ms across the 100 episodes |
| Wall clock | 90 minutes |

Half of the ten tasks were solved 10 of 10[1]. The hard task, "put the yellow and white mug in the microwave and close it," was 4 of 10, and it was the only task that scored low in both bands[1]. "Put both moka pots on the stove" went 2 of 5, then 5 of 5[1]. Five episodes do not resolve a task. The two bands overlap, which is why they pooled them, and they say so[1].

Every one of the fourteen failures ran to exactly 520 steps[1]. They did not diverge, thrash, or emit nonsense. They ran out of step budget mid-task. The failure mode is "too slow for the cap," which makes the cap part of the result[1]. A null policy, zeros or uniform-random actions, scored 0 of 24 on the same harness, and the goal predicate was not already true at reset[1]. Without that check, a high rate could have been a broken predicate[1].

LIBERO's full evaluation is 4 suites × 10 tasks × 50 initial states[1]. This is one suite and ten states per task. They say 86% carries about a ±7-point interval and is not a benchmark figure[1]. They also refuse a comparison to published pi0-class results, because they have not checked that those papers used the same horizon and the same step cap[1]. Copy that refusal. Forty of every fifty predicted actions are thrown away at the next replan when the horizon is 10[1]. That looks wasteful until you notice it is what lets the loop run on a fresh observation at all.

Four conventions will zero the rate without throwing. They settled each by comparing against the recorded dataset, not by reading a comment[1]. Both cameras need a 180° rotation: correlation against the dataset frame was +0.82 rotated, and −0.05 unrotated[1]. The 8-D state layout is end-effector position, axis-angle, and two gripper joints, with a max error of 0.0057 against the dataset's own state[1]. Gripper sign is −1 open and +1 closed[1]. Sim steps per action is exactly one: 8.65 mm of tracking error for one step, against 217 mm for two[1].

The axis-angle branch is the nasty one. LIBERO's home pose points the gripper straight down, so the rotation angle sits almost exactly at π, which is the discontinuity[1]. Pinning the branch by the sign of the quaternion's scalar part flips a rollout from +3.14 to −3.14 while the wrist has not moved. Because state is spliced into the prompt as discrete bins, the policy reads that jump as a full turn between two control steps[1]. The recorded dataset never wraps. The rule that matches it is continuity against the previous state, not a fixed sign test[1].

Action semantics are embodiment-specific. The published export targets LIBERO's 7-DoF Franka Panda. Its output is not a valid joint command for a different arm[1]. Normalization statistics live outside the graph. Raw joint values produce a meaningless prompt[1]. The NPUs are exclusive: two processes each mapping the full bundle contend for the same CDSP budget, and both slow down[1]. The ~1600 MiB per-device ceiling they work to is empirical and conservative, not a documented limit[1].

## What you can do with the pages

If you are picking a kit this week, start with the two overview tables, not the TOPS adjective. The IQ-8275 is the 12 GB, up-to-40-TOPS board, with a published ambient ceiling of +105°C and an Adreno 623 at up to 877 MHz[3]. The IQ-9075 is the 36 GB, up-to-100-TOPS board, with a published ambient ceiling of +85°C, an Adreno 663 at up to 800 MHz, an 8K60 decode line, and four CSI ports against the smaller kit's three[2][3]. Both pages claim dual Hexagons and up to 16 cameras[2][3]. Only the IQ-9075 has a published measurement of a 3-billion-parameter policy that needed both Hexagons to stay resident[1]. I have no Pi0.5 timing for the IQ-8275, and I will not invent one.

If you are bringing an IQ-9075 up, the setup page is the contract. Twelve to 36 volts on the barrel jack. Main console on the second UART at 115200. Expected image Ubuntu 24.04.3 LTS, kernel line `6.8.0-1057-qcom`[4]. Change the password on first login. The page tells you to. The tutorial's measurement image is Ubuntu 24.04 Server, arm64, headless, and every command runs on the board[1]. The stock IoT PPA is already on that image. Adding it a second time produces a fatal apt conflict over `Trusted`[1]. Budget about 35 GB of free disk. The model is 2.9 GB. Builds and dumps take the rest[1]. Downloads are about 3 GB[1].

If you are running a model that is four graphs, do not read 100 TOPS as "it fits." A clean map at 1523 MiB and a failure at 1941 MiB is the evidence they printed, on device 0, with host RAM to spare[1]. Put the expensive stages on device 0 until you have your own timing that says otherwise. Their cost-balanced split, vision and token embedding on device 1, backbone and expert on device 0, is the 1111 ms row[1]. Lock burst mode before the process starts if you want to sit in that column, and write the uptime next to the millisecond[1]. Measure with nothing else on the NPU[1].

If you need a watt number, these pages do not have one. The tutorial lists it under honest limitations: no power measurement, no thermal measurement, no sustained soak, no live camera[1]. The overviews do not print a board power either[2][3]. A robot power budget is still your measurement. So is a Gazebo demo. This board's published closed loop is MuJoCo on a software rasterizer, not a hardware GPU path[1].

The possible thing here is not a bigger sticker. It is two Hexagons with separate maps, unequal speed, and a 3-billion-parameter policy that stays resident only when you schedule them as two devices[1][2]. One hundred TOPS made Pi0.5 plausible. The second NPU made the chunk practical, at 4.3–4.5× the simulator's action clock, on a protocol the authors tell you not to call a benchmark[1].

## Sources

[1] https://dragonwingdocs.qualcomm.com/tutorials/pi05-vla-on-dragonwing-npu.md — Run the Pi0.5 VLA model on the Dragonwing IQ-9075 NPU
[2] https://dragonwingdocs.qualcomm.com/Ubuntu/devices/iq9075-evk/device-overview.md — Dragonwing IQ-9075 EVK device overview
[3] https://dragonwingdocs.qualcomm.com/Ubuntu/devices/iq8275-evk/device-overview.md — Dragonwing IQ-8275 EVK device overview
[4] https://dragonwingdocs.qualcomm.com/Ubuntu/devices/iq9075-evk/set-up-the-device.md — Set up the IQ-9075 EVK
[5] https://www.qualcomm.com/developer/blog/2026/09/accelerating-robotics-development-dragonwing-iq8-dragonwing-iq9 — Accelerating robotics development with Dragonwing IQ8 and IQ9
[6] https://aihub.qualcomm.com/models/pi05 — Pi0.5 on Qualcomm AI Hub
[7] https://dragonwingdocs.qualcomm.com — Qualcomm Dragonwing documentation
