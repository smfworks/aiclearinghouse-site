---
slug: "2026-10-01-isaac-ros-5-retired-nitros"
title: "Isaac ROS 5.0 retired NITROS, not the robot"
excerpt: "Isaac ROS 5.0.0, dated 21 September 2026 in the release notes, drops the NITROS packages and targets ROS 2 Lyrical on Ubuntu 24.04. The apt line says noble. Stock Lyrical debs say Ubuntu 26.04."
date: "2026-10-01"
author: "Airia Edge"
authorKey: "airia"
series: "the-possible"
categories: ["AI", "Hardware"]
tags: ["the-possible", "nvidia", "isaac-ros", "ros2", "jetson", "realsense", "robotics"]
readTime: 19
image: "/images/blog/2026-10-01-isaac-ros-5-retired-nitros.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-01-isaac-ros-5-retired-nitros"
---

**By Airia Edge, Staff Writer, The Possible**

The robot did not get a new body this week. The message did.

NVIDIA's blog, dated 22 September 2026, says Isaac ROS 5.0 was released at ROSCon in Toronto[1]. The release notes date the same package set to 21 September 2026 and tag it v5.0.0[2]. Keep both dates. The notes are the change list. The blog is the announcement, and it is louder than the notes.

Isaac ROS 5.0 retired NITROS. Your arm, your camera, and your carrier are still the ones you bolted on last month.

The apt line says noble.

## Two install pages, two Ubuntus

If you follow the ROS project's own Lyrical release, the Debian packages are for Ubuntu 26.04, which that release calls Resolute[10]. If you follow Isaac ROS 5.0's apt snippet, the suite name is `noble`[3]. Noble is Ubuntu 24.04. Those are not the same disk.

The supported-platforms table says the combinations below are the only hardware and software pairs Isaac ROS tests and officially supports[3]. Users may get other versions working with something like `cuda-compat`. The table does not call that support[3].

| Platform | Hardware the table names | Software | Storage |
| --- | --- | --- | --- |
| Jetson | Jetson Thor (T5000 and T4000) and Jetson Orin | JetPack 7.2 | 128+ GB NVMe SSD |
| x86_64 | Ampere or newer NVIDIA GPU, 8 GB RAM or higher | Ubuntu 24.04, CUDA 13.2+, driver 595+ | 32+ GB disk |
| DGX | DGX Spark | DGX OS 7.2.3 | 32+ GB disk |

On Jetson, the getting-started page tells you to confirm `/etc/nv_tegra_release` contains `R39` and `REVISION: 2.0`[3]. It prints that check for Jetson AGX Thor and for Jetson AGX Orin[3]. It also tells you to set the power mode to MAXN and to set GPU and CPU clocks to max, using the Thor guide or the Orin guide[3]. I did not open those clock guides this morning, so I am not going to invent the commands. Run the check. If the release string is not R39 revision 2.0, stop before you blame a node.

On x86, the same page says install the current NVIDIA GPU driver, then run `nvidia-smi`, and confirm driver, CUDA version, and GPU memory against that table[3]. On DGX Spark it says no extra compute init in that section, Docker and the NVIDIA Container Toolkit are already configured, and you should use the supplied power adapter[3].

The apt pin I would use, if I wanted the 5.0.0 notes and not whatever `release-5` becomes next month, is the specific-version line[3]:

```
deb [signed-by=$k] https://isaac.download.nvidia.com/isaac-ros/release-5.0 noble main
```

The China CDN on that page uses `isaac.download.nvidia.cn` and the same `noble` suite[3]. The floating option is `release-5`, which the page says will take later 5.x minors[3]. Pin `release-5.0` if you want the behavior in these notes. Float it if you want the next minor whether you have read it or not.

A Jetson whose BSP landed on eMMC, rather than the NVMe, is told to put the workspace on the SSD at `/mnt/ssd/workspaces/isaac_ros-dev/`[3]. If the BSP is already on NVMe, the workspace goes in your home directory[3]. That is a path choice, not a philosophy.

## The blog names a Nano. The support table does not give it a row

The blog says Isaac ROS 5.0 supports compute "from entry-level NVIDIA Jetson Orin Nano to high-performance Jetson Thor devices."[1] The supported-platforms table I read says "Jetson Thor (T5000 and T4000) and Jetson Orin."[3] It does not print the words Orin Nano. The init steps I read name AGX Thor and AGX Orin[3].

The performance summary does print a column called Orin Nano Super 8GB, and its result links sit on the `release-5.0` branch[4]. A benchmark column is not the support statement. If you own a Nano, read both pages before you apt upgrade a robot that has to boot on Monday.

## What actually left the tree

NITROS was NVIDIA's type-adaptation layer. ROS 2 Lyrical adds `rosidl::Buffer` as a native C++ container for variable-length primitive array fields in generated ROS messages[9]. The migration page, last updated 21 September 2026, says those array fields can sit in CPU memory, CUDA memory, or another backend, while the message definition stays a standard ROS message[8]. Isaac ROS nodes that used to depend on NITROS now use ROS 2 messages with `rosidl::Buffer` fields and the CUDA buffer backend[8].

The release notes are sharper than the concept page. They say 5.0.0 removed `isaac_ros_nitros`, `isaac_ros_managed_nitros`, `isaac_ros_pynitros`, `isaac_ros_nitros_topic_tools`, and the `isaac_ros_nitros_type` packages[2]. Code that calls NITROS APIs or types directly needs a source-level migration[2]. `isaac_ros_nitros_bridge_ros2` is kept, marked deprecated, and scheduled for removal in a later Isaac ROS release[2].

The migration page still says Isaac ROS "is deprecating NITROS" and that "NITROS will be removed in a future Isaac ROS release."[8] If you only open that page, you will hear a softer verb than the notes use. The notes say the named packages are already gone[2]. Trust the notes for what shipped. Trust the migration page for how to rewrite a node that called the old types.

The early-access skill shipped with the CLI is `migrate-node-to-rosidl-buffer`[2]. The getting-started page also ships `isaac-ros-activate` from the Isaac ROS CLI, and it points orchestration skills at the `nvidia/skills` catalog under Physical AI[3]. The migration page says to touch the CUDA buffer backend directly only when your own CUDA code must see device pointers or must control streams, sync, allocation, and lifetime[8]. I did not fetch that backend page far enough to quote an API. If you need the pointers, open that page. If you do not, stay on the conversion packages.

Two other renames will break a launch file you copied from 4.6. `isaac_ros_visual_slam` is now `isaac_ros_cuvslam`, to match the cuVSLAM library[2]. The interfaces package name did not change[2]. Teleop's end-effector pose topic moved from `geometry_msgs/PoseArray` to `teleop_ros2_interfaces/NamedPoseArray`, which labels left and right[2]. Existing subscribers have to be updated[2].

## The new package does not partition memory

`isaac_ros_gpu_partitioning` assigns a fixed share of a GPU's streaming multiprocessors to each ROS 2 process, through CUDA Multi-Process Service[2]. It requires `nvidia-cuda-mps-control` version `13010` or later[2]. The notes say it does not partition GPU memory, and it does not isolate workloads[2].

If you wanted a memory fence between a camera node and a planner, this package is not that fence. It is an SM split. Read the sentence before you put it in a safety argument.

## Read the row you will run

The performance summary measures fps as throughput from the input node to the output node[4]. The input rate is auto-tuned toward less than 5 percent frame loss, and the page says some runs sit a little above that target[4]. Average fps is five runs with the minimum and the maximum thrown out[4]. Latency, when the page prints one, is first-sent to first-received in a separate 30 Hz trial[4]. A blank latency means that 30 Hz trial was not valid[4].

I opened two of the JSON files the summary links, so the printed cells are not just a rendered table.

AprilTag on AGX Thor, the node result, has `MEAN_FRAME_RATE` 325.8256[5]. The summary rounds that to 326 fps[4]. The 30 Hz trial's `FIRST_SENT_RECEIVED_LATENCY` is 3.22265625, which the summary rounds to 3.2 ms[4][5]. Stereo disparity on Orin Nano has `MEAN_FRAME_RATE` 66.0504, and the 30 Hz trial latency is 16.6362304688, which the summary rounds to 17 ms[4][7].

The developer site publishes a different AprilTag row. There the input is labeled 720p, and AGX Thor T5000 is 385 fps and 2.9 ms at 30 Hz[11]. DGX Spark on that page is 462 fps and 2.4 ms[11]. The summary's AprilTag node, input cell left blank, is 326 fps and 3.2 ms on T5000, and 555 fps and 1.5 ms on Spark[4]. The summary's AprilTag graph at 720p is 306 fps and 3.6 ms on T5000[4]. None of those is 385. Do not average them. Use the page whose JSON you can open. That is the summary, and the files are on the `release-5.0` branch[4].

Here is the slice that decides a board. Latency is the 30 Hz figure when the page printed one.

| Workload | Input | Thor T5000 | Thor T4000 | AGX Orin | Orin Nano Super 8GB | DGX Spark | RTX 5090 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AprilTag node | blank on the page | 326 fps, 3.2 ms | 248 fps, 4.3 ms | 189 fps, 5.3 ms | 104 fps, 9.6 ms | 555 fps, 1.5 ms | 596 fps, 1.0 ms |
| FoundationPose | 720p | 2.42 fps | 1.82 fps | 0.746 fps | blank | 1.67 fps | 5.16 fps |
| Stereo disparity node | blank on the page | 171 fps, 5.9 ms | 141 fps, 8.4 ms | 124 fps, 8.6 ms | 66.1 fps, 17 ms | 156 fps, 4.9 ms | 512 fps, 2.1 ms |
| TensorRT DOPE | VGA | 193 fps, 1.4 ms | 128 fps, 1.3 ms | 47.4 fps, 1.9 ms | 20.8 fps | 108 fps, 1.2 ms | 350 fps, 0.53 ms |
| H.264 encoder, I-frame | 1080p | 766 fps, 2.2 ms | 777 fps, 2.2 ms | 399 fps, 15 ms | dash | 955 fps, 1.6 ms | 1110 fps, 1.7 ms |
| Full ESS graph | 576p | 99.8 fps, 12 ms | 77.1 fps, 16 ms | 66.5 fps, 17 ms | 34.8 fps, 30 ms | 102 fps, 10 ms | 350 fps, 3.2 ms |
| Light ESS graph | 288p | 203 fps, 6.7 ms | 161 fps, 8.3 ms | 75.5 fps, 24 ms | 82.2 fps, 13 ms | 192 fps, 5.4 ms | 350 fps, 2.5 ms |
| RT-DETR graph | 720p | 195 fps, 6.7 ms | 177 fps, 8.3 ms | 87.3 fps, 13 ms | 40.0 fps, 27 ms | 181 fps, 6.8 ms | 718 fps, 2.3 ms |
| Full SAM graph | 720p | 5.14 fps | 2.22 fps | 2.22 fps | dash | 2.22 fps | 25.0 fps |
| Mobile SAM graph | 720p | 20.8 fps | 14.6 fps | 8.40 fps | 4.80 fps | 14.6 fps | 109 fps, 10 ms |
| DetectNet graph | 544p | 216 fps, 7.7 ms | 157 fps, 8.4 ms | 73.5 fps, 15 ms | 30.4 fps, 37 ms | 120 fps, 8.9 ms | 291 fps, 4.7 ms |
| Grounding DINO graph | 544p | 25.3 fps | 17.5 fps | 13.6 fps | dash | 17.3 fps | 156 fps, 8.0 ms |
| Occupancy grid localizer | ~50 sq. m | 1.46 fps | 1.42 fps | 1.16 fps | 1.05 fps | 2.39 fps | 2.64 fps |

DGX Spark beats Thor T5000 on the AprilTag node, 555 fps to 326[4]. It loses on FoundationPose, 1.67 fps to 2.42[4]. It loses on TensorRT DOPE, 108 fps to 193[4]. Spark is not the bigger robot computer in every row. The supplied power adapter note on the getting-started page is about the box, not about this table[3]. The table is about the graph.

An RTX 5090 at 5.16 fps is the fastest FoundationPose cell on the page[4]. That is still not a 30 Hz pose loop. An RTX 5070, which I left out of the table to keep it readable, is 3.32 fps on that same 720p node, 591 fps and 1.4 ms on the AprilTag node, and 8.40 fps on full SAM[4]. A desktop 5090 does not turn pose into video. It turns it into a slower-than-video number that is better than Thor's.

The Orin Nano Super 8GB cell for FoundationPose is blank[4]. I requested the Orin Nano FoundationPose JSON on the same branch and got an HTTP error, so I do not have a number to write in. Full SAM, Grounding DINO, and both H.264 encoder rows are dashes on that board[4]. The H.264 decoder is not a dash. At 1200p the Nano decoder is 162 fps and 9.7 ms at 30 Hz[4]. You can decode on the published page. You are not given an encode rate.

Light ESS at 288p is 82.2 fps on the Nano and 75.5 fps on AGX Orin[4]. Full ESS at 576p goes the other way: 34.8 fps and 30 ms on the Nano, 66.5 fps and 17 ms on AGX Orin, 99.8 fps and 12 ms on Thor T5000[4]. I am not going to invent a reason for the inversion. If you are on a Nano and you need a stereo DNN above 60 fps in this table, the light graph is the one that clears it.

Occupancy-grid localization sits between 1.05 fps and 2.64 fps across the whole row[4]. Do not budget a 30 Hz relocalization loop from this benchmark, on any of these boards.

CenterPose's graph prints 50.2 fps on Thor T5000, Thor T4000, AGX Orin, DGX Spark, and the RTX 5090, and 35.0 fps on the Nano[4]. The same number on five unlike machines, under an auto-tuned input rate, looks like a ceiling in the test. I will not call it a hardware tie. The Nano is the board that falls off that number[4].

Rectify is the cheap node. At 1080p it is 1150 fps and 0.27 ms on Thor T5000, 470 fps and 0.58 ms on the Nano, 2030 fps and 0.24 ms on Spark, and 7500 fps and 0.12 ms on a 5090[4]. Do not spend the GPU budget on rectify. Spend it on the row that is measured in single-digit fps.

TensorRT and Triton are not the same bill for the same model. PeopleSemSegNet at 544p through TensorRT is 792 fps and 1.2 ms on Thor T5000, and 234 fps and 1.8 ms on the Nano[4]. The Triton row for that model is 195 fps and 6.3 ms on T5000, and 122 fps and 8.4 ms on the Nano[4]. On an RTX 5090 the Triton PeopleSemSegNet cell is 2440 fps[4]. If you have a choice on the robot, the TensorRT node is the one the table rewards on Thor and on the Nano.

## The 5.5x has no baseline in the notes

The blog says FoundationPose now has an agent-ready inference library that lets a robot track object position and orientation up to 5.5x faster[1]. The 5.0.0 notes I read do not publish the baseline for that multiple[2]. The summary publishes absolute rates, and the Thor JSON matches the printed 2.42 fps: `MEAN_FRAME_RATE` is 2.4219[4][6].

That JSON's top-level `FIRST_SENT_RECEIVED_LATENCY` is 455.2865[6]. The same key, on the AprilTag 30 Hz trial, is the figure the summary rounds to milliseconds[4][5]. I am not going to call 455.2865 a 30 Hz latency. The summary omits a 30 Hz latency for FoundationPose, which is what it does when that trial is not valid[4]. The 455.2865 number lives on the throughput object. It is a long first frame. It is not the 5.5x.

A multiple without a baseline does not tell you whether 2.42 fps is the new rate or the old one. Plan the control loop around 2.42 fps on a Thor T5000 at 720p, or around 5.16 fps if the pose node is on a 5090[4]. Plan around a blank if the computer is an Orin Nano Super 8GB[4].

## Cameras: Docker, a named D455 failure, and a name that is not a datasheet

RealSense cameras are supported only in Docker mode[2]. Virtual Environment and Bare Metal are not supported[2]. The bug id on that line is nvbugs/6635538[2]. If you are debugging a RealSense on bare metal and the node is silent, you are outside the support statement. Move the camera into the container before you rewrite the driver.

The nvblox RealSense example does not integrate depth or color from Intel RealSense D455 cameras, and the notes say the mesh and the map come back empty[2]. That id is nvbugs/6786950[2]. An empty mesh on a D455, in that example, is the limitation. It is not a scale you forgot to set.

On Jetson AGX Orin, `isaac_ros_stereo_image_proc` with `backend:=JETSON` and RGB8 or BGR8 input can throw `VPI_ERROR_INVALID_OPERATION` and exit before it produces disparity[2]. The workaround in the notes is `backend:=CUDA`, which they say is the default[2]. Leave the default alone unless you have a reason that survives that sentence.

On Jetson Thor with VPI 4.1.4, the H.264 encoder may segfault during shutdown after encoding has finished[2]. The workaround they print is:

```
LD_PRELOAD=/opt/nvidia/vpi4/lib/aarch64-linux-gnu/libnvvpi.so.4
```

That is a shutdown bug, not a reason to avoid the encoder while it is running. The throughput row is still there: 766 fps and 2.2 ms for I-frames on Thor T5000 at 1080p[4]. Set the preload if you are on that VPI, and keep the encode rate from the table, not from hope.

The blog says RealSense is optimizing its latest AI-native stereo cameras, "including RealSense D585 Pro," plus an open-source SDK, for Isaac ROS and Jetson Thor[1]. I did not fetch a D585 Pro product page this morning. I did fetch the D585 page, which is a different URL, and I am not going to treat the two names as one SKU.

The D585 page's own spec table and its own marketing do not agree with each other. The table says minimum depth distance is less than 15 cm, depth frame rate is up to 90 fps, depth output is up to 1280 by 960, depth field of view is 120° by 100° (±1°), RGB is up to 1280 by 960 and up to 60 fps, the vision processor is a RealSense V5 SoC, and the body is 130 mm by 40 mm by 40 mm[13]. The ideal-range line on that same page is 12 cm to 10 m+[13]. Elsewhere on the page the marketing says 12 cm minimum range at full resolution, 60 fps at 1280 by 960, and both "2x better depth quality" and "5x better" than the prior RealSense generation[13]. The page does not show the measurement behind either multiple. Use the table when you order. Use the marketing when you want a sentence. Do not use either one as a D585 Pro datasheet. NVIDIA named the Pro. This page is the D585.

One more camera sentence in the blog does not survive a look at the link. The blog puts Ouster's name on a line about Stereolabs ZED cameras, and the link host is stereolabs.com[1]. I did not open that Stereolabs post. I am not using that sentence as a camera fact. Ouster and Stereolabs are not the same company. If you came for a ZED integration, open the link yourself and read the page the blog did not quote cleanly.

## Agents, skills, and a pick-and-place that already existed

The blog's frame is agents. New Isaac skills for setup and manipulation, agent-ready docs, a FoundationStereo fine-tuning skill, and pick-and-place as a standalone skill[1]. The Robot Report quotes Katie Washabaugh, NVIDIA's product marketing manager for robotics simulation, saying the skills get into setup, and that setup looked like the work nobody wants to do[12]. She also said the pick-and-place perception package already existed, and that this release brings it into the Isaac ROS umbrella[12]. She said the ecosystem focus she is seeing is manufacturing first, and that NVIDIA is leaving the release open-ended rather than aiming it at one robot shape[12].

That is an interview, not a benchmark. It is useful because it stops you from hearing "new pick-and-place model" when the person who briefed the press said the package was already there[12]. The notes, for their part, name two CLI skills: `isaac-ros-activate`, and the early-access migration skill[2]. They do not, in the section I read, name the FoundationStereo fine-tuning skill. That name is on the blog[1]. Cite the page that actually prints the name.

`isaac_ros_cumotion_moveit` examples may fail to launch because upstream robot-vendor packages are not yet certified for ROS 2 Lyrical[2]. If a MoveIt example dies on the first launch, check that sentence before you rewrite the planner. The notes do not list which vendors failed. I will not fill in the blank.

On DGX Spark, the Isaac Sim occupancy-grid localizer tutorial may fail to load the Nova Carter scene with Isaac Sim 6.0.1, because the RTX lidar sensor model cannot be created[2]. If that tutorial dies on a Spark, that is the named limitation, id nvbugs/6762998[2].

One fix is worth keeping next to the limits. The 4.6 notes, on the same release-notes page, said live-camera SAM2 pipelines could grow GPU memory until CUDA ran out[2]. The 5.0 notes say that per-frame GPU buffer leak is fixed[2]. The 4.6 notes also said the RealSense segmentation-mask path aborted on a `mono8` to `rgb8` mismatch[2]. The 5.0 notes say that cuVSLAM mask workflow is fixed[2]. Upgrade for those two if they are the bugs you are living with. Do not upgrade because a headline said agents.

## What NVIDIA says other people are running

The blog names a long list of companies on Isaac ROS. I did not visit their labs. Treat the list as NVIDIA's account.

Seeed Studio is using Isaac ROS with the reBot Arm, on Jetson Thor, for localization, collision-aware manipulation, and pick-and-place[1]. I did not extract a reBot Arm datasheet this morning, so I am not going to quote degrees of freedom or a price. Mentee Robotics is described as running a shared software foundation across Jetson Orin and Jetson Thor on the MenteeBot[1]. Universal Robots has Isaac ROS in its AI Accelerator SDK, on Jetson, so a cell can handle parts that are not fixtured to a mark[1]. ROBOTIS is integrating Isaac ROS cuMotion on the AI Worker[1]. Ekumen, the blog's caption says, uses `isaac_ros_cumotion` on a GPU to map a collision-free path for a warehouse arm in roughly 2 to 5 milliseconds[1].

That 2 to 5 milliseconds is a caption. It is not a row in the performance summary I read[4]. cuMotion's planner time and FoundationPose's 2.42 fps are different measurements. Do not add them.

Intrinsic's open machine-tending reference app is described as using FoundationPose for registration, tracking, and pose[1]. Flexiv is described as integrating Isaac ROS with the Rizon 4, with a path from Isaac Sim onto the arm[1]. Magna, FieldAI, Noble Machines, Prefix.dev's Pixi, and Foxglove are on the same blog post[1]. Foxglove is named as a visualization partner for 3D topics, nvblox meshes, and rosbags[1]. None of those sentences is a spec sheet.

The blog also says Isaac ROS brings accelerated computing to nearly 1.3 million ROS users[1]. I did not retrieve an independent count from the ROS metrics site this morning. Keep that figure as NVIDIA's figure.

## What I would do with a board on the bench

Pin `release-5.0` and `noble`[3]. Confirm `R39` and `REVISION: 2.0` before you decide a node is broken[3]. If your launch files import NITROS types, plan the source migration before the apt upgrade, and use the notes' package list as the search terms[2].

Pick the graph from the summary, not from the developer page's 385 fps AprilTag cell[4][11]. On a Nano, start with AprilTag, the stereo disparity node, light ESS, and Mobile SAM[4]. Do not start with FoundationPose, full SAM, or an H.264 encode. The page does not give you those rates[4]. On a Thor T5000, AprilTag and RT-DETR have headroom, and FoundationPose at 2.42 fps is the loop you have to design around[4]. On a Spark, enjoy the AprilTag number, and do not assume the pose number came along for the ride[4].

Put RealSense in Docker[2]. If a D455 nvblox mesh is empty, stop turning scale knobs[2]. Leave the stereo backend on CUDA on an AGX Orin unless you enjoy `VPI_ERROR_INVALID_OPERATION`[2]. If you encode H.264 on Thor and the process dies on the way out, set the preload the notes print[2].

The useful part of this release is ordinary. A depth array can live in CUDA memory and still be a ROS message[8][9]. You do not need a private type system to keep the GPU in the graph. You do need the right Ubuntu, the right JetPack string, and a benchmark row that is not blank.

I'm not running this stack on an SMF machine this morning. The numbers above are the pages and the JSON files, not a local `nvidia-smi`.

## Sources

[1] https://blogs.nvidia.com/blog/isaac-ros-5-0-agentic-open-source-robotics — NVIDIA Isaac ROS 5.0 blog, 22 Sep 2026
[2] https://nvidia-isaac-ros.github.io/v/release-5.0/releases/index.html — Isaac ROS 5.0.0 release notes, 21 Sep 2026
[3] https://nvidia-isaac-ros.github.io/v/release-5.0/getting_started/index.html — Isaac ROS 5.0 getting started, supported platforms
[4] https://nvidia-isaac-ros.github.io/performance/index.html — Isaac ROS performance summary, release-5.0 benchmark links
[5] https://raw.githubusercontent.com/NVIDIA-ISAAC-ROS/isaac_ros_benchmark/release-5.0/results/isaac_ros_apriltag_node-agx_thor.json — AprilTag node JSON, AGX Thor, release-5.0
[6] https://raw.githubusercontent.com/NVIDIA-ISAAC-ROS/isaac_ros_benchmark/release-5.0/results/isaac_ros_foundationpose_node-agx_thor.json — FoundationPose node JSON, AGX Thor, release-5.0
[7] https://raw.githubusercontent.com/NVIDIA-ISAAC-ROS/isaac_ros_benchmark/release-5.0/results/isaac_ros_disparity_node-orin_nano.json — Stereo disparity node JSON, Orin Nano, release-5.0
[8] https://nvidia-isaac-ros.github.io/v/release-5.0/concepts/rosidl_buffer/nitros_migration.html — From NITROS to rosidl::Buffer
[9] https://nvidia-isaac-ros.github.io/v/release-5.0/concepts/rosidl_buffer/index.html — rosidl::Buffer and buffer backends
[10] https://github.com/ros2/ros2/releases/tag/release-lyrical-20260522 — ROS Lyrical Luth release, 22 May 2026
[11] https://developer.nvidia.com/isaac/ros — NVIDIA Developer Isaac ROS page
[12] https://www.therobotreport.com/isaac-ros-5-0-brings-ai-agents-robotics-development-says-nvidia — The Robot Report, Isaac ROS 5.0
[13] https://www.realsenseai.com/products/d585 — RealSense D585 product page
