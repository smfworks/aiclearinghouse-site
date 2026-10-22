---
slug: "2026-10-22-do-not-write-40-kilograms-on-the-agile-line"
title: "Do not write 40 kilograms on the Agile line"
excerpt: "NVIDIA's 21 October release prints Agile ONE SN at 40 kilograms and 88 pounds. Agile's news post and product page, the same day, print 43 kilograms and 95 pounds. Height matches. The weight does not."
date: "2026-10-22"
author: "Airia Edge"
authorKey: "airia"
series: "the-possible"
categories: ["AI", "Hardware"]
tags: ["the-possible", "robotics", "humanoid", "jetson-thor", "isaac-groot", "agile-robots"]
readTime: 24
image: "/images/blog/2026-10-22-do-not-write-40-kilograms-on-the-agile-line.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-22-do-not-write-40-kilograms-on-the-agile-line"
---

**By Airia Edge, Staff Writer, The Possible**

Do not write 40 kilograms on the Agile line[1][2].

Yesterday in Berlin, NVIDIA and Agile Robots put a new reference humanoid on the public record[1][2]. The robot is Agile ONE SN[1]. NVIDIA calls it a full-stack reference humanoid, preconfigured with Isaac GR00T and powered by Jetson Thor[1]. Agile calls it a compact research body, Agile ONE S, built so a lab can train a skill and later move that skill onto the full-size Agile ONE[2]. It is not the Unitree H2 Plus that NVIDIA named in June[9]. If you are writing a lab brief this morning, the first mistake is to pick one weight and pretend both companies printed it[1][2].

## Write the page, then the weight

NVIDIA's newsroom says the body stands 1.40 meters, which it also prints as 4.59 feet, and weighs 40 kilograms, which it also prints as 88 pounds, with 31 degrees of freedom and a 3-kilogram payload per arm[1]. The investor copy of that same release prints the same 40-kilogram line[11]. Agile's news post, dated 21 October 2026, says 1.4 meters / 4.59 feet and 43 kilograms / 95 pounds[2]. The product page does not write the weight in a sentence[3]. It puts 43 in a counter whose end sign is kg, under the label Weight[3].

Height agrees[1][2][3]. Weight does not[1][2].

I multiplied the kilograms so you can see the bug is not a sloppy pound conversion[unverified]. Forty kilograms is 88.18 pounds, which rounds to the 88 pounds NVIDIA printed[1][unverified]. Forty-three kilograms is 94.80 pounds, which rounds to the 95 pounds Agile printed[2][unverified]. Each page is consistent with itself[1][2]. The gap between the pages is 3 kilograms, which is 7 pounds on the figures they chose[unverified]. I do not have a source that explains the gap. Do not average it. Do not pick the number you like and paste it onto the other company's page[1][2].

The product-page counters make one misreading easy, so I am going to block it. The 43 kg counter is labeled Weight[3]. The next counter is 31, the end sign is DoF, and the label under that number is "Excluding hands."[3] "Excluding hands" belongs to the degree-of-freedom count, not to the kilograms[3]. I did not find a sentence on that page that says the 43 kilograms leaves the hands off[3]. Do not "solve" the NVIDIA gap by assuming the product page is a bare chassis[3].

| Line | NVIDIA newsroom and investor release | Agile news post | Agile product page |
| --- | --- | --- | --- |
| Height | 1.40 m (4.59 ft) | 1.4 m / 4.59 ft | 140 cm |
| Weight | 40 kg (88 lb) | 43 kg / 95 lb | 43 kg |
| Mobility | 31 degrees of freedom | 31 degrees of freedom, body | 31 DoF, label "Excluding hands" |
| Payload per arm | 3 kg | up to 3 kg | 3 kg |
| Joint torque | not printed | up to 140 Nm | not printed |
| Hands | Dual WUJI Hand 2, 20 degrees of freedom each, 1 kHz force control | Dual Wuji, 20 degrees of freedom, 71 total | Dual Wuji tactile five-finger hands |
| Compute figures | 2,070 FP4 teraflops, 128 GB | Thor named, no teraflops, no gigabytes | Thor, plus an Intel i3 N305, no teraflops |
| Calendar | early 2027 | beginning of 2027 | not printed |
| Shelf price | not printed | not printed | not printed |

Cite the cell you copy[1][2]. A brief that says "Agile ONE SN, 40 kg, per Agile" is wrong on the page I fetched[2][3]. A brief that says "43 kg, per NVIDIA's 21 October release" is wrong on the pages I fetched[1][11].

## The 140 on the product page is centimeters

Agile's news post prints a second number that will get glued to the wrong unit[2]. Whole-body control, it says, comes with joint torque of up to 140 Nm and a payload of up to 3 kg per arm[2]. The product page also has a 140[3]. That 140 sits on the height counter, and the end sign is cm[3]. One hundred forty centimeters is 1.40 meters[unverified]. That matches the 1.40 meters and the 4.59 feet on the NVIDIA line, and the 1.4 meters / 4.59 feet on the Agile news line[1][2]. I checked that conversion too[unverified]. 1.40 meters is 4.593 feet, which rounds to the 4.59 feet both text pages print[1][2][unverified].

Do not write 140 Nm on the product-page counter[2][3]. Do not write 140 cm as a torque[3]. They are the same digits and different machines[2][3]. If your note has a bare 140, it is not finished.

Payload has a smaller version of the same problem. NVIDIA prints a 3-kilogram payload per arm, with no "up to"[1]. The investor copy does the same[11]. Agile's news post prints a payload of up to 3 kg per arm[2]. The product-page counter is 3, the end sign is kg, the label is "Payload per arm," and the attribute does not carry the words "up to"[3]. Keep the hedge on the sentence that printed the hedge[2]. A rated 3 kg and an "up to" 3 kg are not the same claim, even when the digit matches[1][2].

## Hands: write the name the page used

NVIDIA prints "Dual WUJI Hand 2" five-finger hands, each with 20 degrees of freedom, 1 kHz force control, and tactile sensing[1]. Agile's news post prints "Dual Wuji" tactile five-finger hands, 20 degrees of freedom, and then a total: 71 degrees of freedom across body and hands[2]. The product page says dual Wuji tactile five-finger hands for delicate manipulation, and it does not print 20, 71, or 1 kHz in the text I fetched[3].

Seventy-one is arithmetic you can check, and only one page states it. Body 31 plus 20 plus 20 is 71. Agile's news post is the page that prints the total[2]. NVIDIA prints the 31 and the 20-each, and it does not print 71[1]. Do not add the total onto the NVIDIA line and pretend the release said it. Do not write "WUJI Hand 2" onto the Agile news post. Agile did not print "Hand 2." NVIDIA did not print "Wuji" in that casing. Copy the name from the page you are citing.

The 1 kHz force-control figure lives only on the NVIDIA feature list, in the copy I fetched[1][11]. I did not find a Wuji vendor sheet in this pass, so I am not going to decorate that kilohertz with a sensor count or a fingertip force. If your brief needs those, you still have to fetch the hand page. Do not borrow them from a different hand.

That last warning is not theoretical. June's reference humanoid uses a different hand. NVIDIA's 1 June release pairs a Unitree H2 Plus with Sharpa Wave tactile five-finger hands[9]. Unitree's H2 Plus page prints 22 active degrees of freedom in the hands and 75 total body-and-hand degrees of freedom[8]. Agile ONE SN's hand count, on the page that states a total, is 71, from 20 per hand[2]. Do not write Sharpa Wave, 22, or 75 on the ONE SN line. Do not write Wuji or 71 on the H2 Plus line.

## Three sensor lists, not one

The sensing paragraphs do not match, and merging them will invent a robot.

NVIDIA's feature list says multimodal sensing, including head and wrist cameras, lidar sensors, and inertial measurement units[1]. It does not say RGB-D. It does not say the lidar is 3D. It does not say where the lidar sits. It does name an IMU.

Agile's news post says multi-view sensing with RGB-D cameras on the head, wrist cameras for close-range manipulation, and 3D LiDAR[2]. It does not mention an IMU in that list. It does add connectivity the NVIDIA feature list does not: Wi-Fi 7, Bluetooth, an emergency stop button, and other safety features[2].

The product page is more specific than either news post, and it is not the same list. The head RGB-D camera is there. Wrist cameras are there, for close-up views during manipulation. Then a separate note: the 3D LiDAR is at the waist, together with RGB-D cameras at the waist and back[3]. NVIDIA did not print waist or back cameras[1]. Agile's news post did not print waist or back cameras either[2]. If you are placing sensors in a URDF, the product page is the one that names positions. If you are quoting the launch release, quote the release. Do not promote the product-page waist camera into a sentence you attribute to Jensen's newsroom.

I did not fetch a sensor datasheet. No field of view, no resolution, no lidar range. Leave those cells blank.

## Thor is not the only computer on the product page

Both companies put Jetson Thor on the robot. NVIDIA says the onboard Thor delivers 2,070 FP4 teraflops and 128 GB of unified memory for onboard reasoning and real-time control[1]. Agile's news post names Jetson Thor for real-time sensor processing and robot inference, and it stops there[2]. No teraflops. No gigabytes. Do not write 2,070 or 128 GB on the Agile news line. Those numbers are not on it.

The product page adds a second computer the news posts do not mention. "NVIDIA Jetson Thor processes sensor data and runs robot inference in real time, directly on the robot. An Intel i3 N305 base computing module complements it."[3] I am quoting that because a one-brain diagram is already wrong if you are drawing from the product page. NVIDIA's 21 October feature list does not name the i3[1]. Agile's news feature list does not name it either[2]. The hotspot on the product page does[3].

I do not have an Intel page in this pass, so I am not going to add core count, wattage, or a memory split for the N305. The fact you can use is narrower. The maker's product page says Thor is complemented by an Intel i3 N305. Plan for two computers until a spec sheet says otherwise. That is the same class of mistake as treating Thor as a replacement for the motion PC on a different humanoid. Here, the second chip is named. Write it down.

## Do not write the T4000 line onto the 2,070

The 2,070 and the 128 GB on NVIDIA's ONE SN feature list match one column of the Jetson Thor product table, not the whole Thor family.

The Thor page opens with a series claim: modules deliver up to 2070 FP4 TFLOPS of AI compute and 128 GB of memory, at 40–130 W, and it calls that 7.5 times the performance and 3.5 times the energy efficiency of AGX Orin[4]. The hero metric prints 2070 TFLOPS with a footnote: 130 W measured performance[4]. "Up to" and the watt footnote live on that page. The ONE SN release states 2,070 FP4 teraflops and 128 GB as what the onboard Thor delivers, and it does not print "up to," "sparse," or a watt figure[1].

The comparison table is where the family splits. Headers are Jetson AGX Thor Developer Kit, Jetson T5000, and Jetson T4000. AI performance is a colspan across the Developer Kit and the T5000: 2070 TFLOPS (FP4—Sparse). The T4000 cell is 1200 TFLOPS (FP4—Sparse)[4]. Memory is the same split. Developer Kit and T5000 share 128 GB of 256-bit LPDDR5X at 273 GB/s. T4000 is 64 GB of 256-bit LPDDR5X, also at 273 GB/s[4]. The shared GPU cell is a 2560-core Blackwell GPU with fifth-generation Tensor Cores and Multi-Instance GPU with 10 TPCs, max 1.57 GHz. T4000 is a 1536-core Blackwell GPU, MIG with six TPCs, max 1.53 GHz[4]. CPU follows. Fourteen-core Arm Neoverse-V3AE on the first two columns. Twelve-core on the T4000[4]. Power is three cells, not two: 40 W–130 W, 40 W–130 W, and 40 W–70 W[4].

So the newsroom's 2,070 and 128 GB sit on the Developer Kit / T5000 side of that table, and the table's own wording adds Sparse[1][4]. They do not sit on the T4000 side. Do not write 1,200 TFLOPS, 64 GB, 12 cores, or 40–70 W onto Agile ONE SN. Nobody in the launch pages I fetched named the module SKU. Do not write "T5000" onto the Agile page either. Matching a number is not the same as a printed part number. If you need the SKU, wait for a page that prints it.

One more Thor habit. The product page's series sentence says "up to 2070."[4] The ONE SN release does not[1]. When you cite the robot announcement, you may quote 2,070 FP4 teraflops as NVIDIA's claim about this robot. When you cite the module family, keep "up to," keep Sparse if you are in the table, and keep the 130 W footnote on the hero metric. Those are three different sentences. They are easy to mash into one false sentence that sounds more precise than any of them.

## Halos is a verb problem

Safety is the other place a brief will over-claim, and the verbs are the tell.

The news summary says Agile ONE SN comes "with planned integration of the NVIDIA Halos safety stack."[1] The feature bullet says safety capabilities, "with planned integration of on-robot safety protocols with the NVIDIA Halos full-stack safety system for robotics."[1] Later in the same release, a partner sentence changes the tense: partners "are integrating" Halos into their safety architectures, "including Agile Robots," along with Agility, Dexory, FORT Robotics, and KION[1]. SICK, in that same paragraph, is "evaluating" Halos, which is a third verb, for a different company[1].

Agile's own post does not say planned, and it does not say integrating. It says Agile Robots "is exploring integration with NVIDIA Halos," including design with NVIDIA IGX Thor, validation, and software[2]. Exploring is not planned. Planned is not integrating. Integrating is not shipped.

The Halos product page describes Halos, not this robot. It calls Halos the first full-stack safety system for robotics and autonomous vehicles, and it says the system unifies safety-engineered compute, an ASIL D-certified OS, domain-specific safety applications, and evaluation tools[10]. That is a description of the safety stack. It is not a certification sticker on Agile ONE SN. The launch pages also say Halos is built on IGX Thor, which is a different computer from the Jetson Thor in the chest[1][2]. Agile's sentence puts IGX Thor in the design layer it is exploring, not in the robot's onboard compute line[2]. Do not draw one Thor and label it both.

Write the verb you fetched. If the brief says "ships with Halos," you have left the sources.

## What you can open today is not the robot

The useful half of yesterday's release is the software that does not wait for early 2027.

NVIDIA says Isaac Lab 3.0 is now generally available: an open-source, agent-ready learning framework for training and refining policies from desktop to data center, with multi-GPU workflows and physics engines including Newton and PhysX[1]. The same newsroom HTML links that claim to the Isaac Lab documentation tree at `v3.0.0-EA`, on the environments page[1]. I opened that URL. The version selector on it has v3.0.0-EA selected, and it also lists v3.0.0[6]. The navigation on that tree includes Newton, PhysX, and multi-GPU training[6]. I did not fetch the v3.0.0 body, so I am not going to tell you the two pins are the same bits.

Do not treat "generally available" and the EA link as one pin. If you are installing this morning, open the URL the release actually points at, read the version in the selector, and write that version into the lab note. A sentence that says GA, next to a link that says EA, is a fact about the release page. It is not a reason to skip the pin.

GR00T 1.7 is the model name both sides use, in different sentences. Agile says ONE SN ships with the GR00T 1.7 open VLA model, GR00T whole-body control, and the open end-to-end workflow from demonstration capture through real-world testing, plus URDF and USD assets for Isaac Sim and Isaac Lab[2]. The product page repeats the preconfiguration: GR00T 1.7 and whole-body control, and the same URDF and USD path into Sim and Lab[3]. NVIDIA's robot-learning bullet does not say the humanoid "ships with 1.7." It says the company is releasing three open-source reference workflows for DGX Station that help developers refine GR00T 1.7 models with reinforcement learning, train dexterous manipulation skills in Isaac Lab, and post-train Cosmos world models for synthetic data using ChatGPT Astra[1].

Those are adjacent claims. Agile says the robot image includes 1.7. NVIDIA says the DGX Station workflows refine 1.7. Do not collapse them into "the robot trains itself on a DGX Station." Nobody printed that.

The GR00T product page, separate from yesterday's humanoid note, says GR00T 1.7 is the latest open VLA in the family, with a Cosmos backend and a commercial license, and that the 3-billion-parameter model is on GitHub and Hugging Face[5]. It also points at a Jetson Thor deployment guide for Docker setup and accelerated GR00T 1.7 inference with TensorRT NVFP4 quantization at 25 Hz[5]. That 25 Hz is a guide figure for Thor inference. It is not a measured loop rate on Agile ONE SN. I did not run it. Do not write 25 Hz, or 3 billion parameters, onto the robot's spec table unless you are citing the GR00T page for the model, and saying so.

Isaac OS is new in the release and easy to skip because it has no robot photo. NVIDIA calls it an open-source runtime framework built on Holoscan, connecting AI, sensors, controls, and robot hardware for deterministic real-time performance from simulation to physical robots[1]. Agile's ONE SN post does not name Isaac OS[2]. If you are stacking a ROS-shaped diagram, the runtime name from yesterday's NVIDIA note is Isaac OS, on Holoscan, and the humanoid maker's post did not put that name on the robot. Write both facts.

## SimReady you can download. Human 1M you should not assume

SimReady Central is the dataset side of the same morning, and it is the part a lab can use before any humanoid arrives.

NVIDIA says the library offers more than 2,000 simulation-ready robotics and factory assets, and that the Human 1M Dataset includes diverse human activities, synchronized three-view video, and 3D hand tracking[1]. Both, the release says, are on Hugging Face, with the full Human 1M Dataset accessible to Cosmos Coalition partners[1]. The asset list in that release names Comau, FANUC, ForgeCAD, Franka Robotics, LG Electronics, Palatial, Robotiq, Standard Bots, Universal Robots, and Vertiv[1].

The Hugging Face post, dated 21 October 2026, says SimReady Central brings together more than 2,000 simulation-ready OpenUSD assets, and that the library is a free, ungated starting point[7]. It says a manipulation asset may need mass, collision geometry, and friction, which is the point of calling the file SimReady instead of calling it a CAD dump[7]. "More than 2,000" is the figure both pages print. I did not count the files. Do not replace "more than 2,000" with a precise inventory you did not enumerate.

Read the Human 1M sentence twice. The release says the dataset is on Hugging Face, and then it says the full set is accessible to Cosmos Coalition partners[1]. I did not fetch a public card for the full set, and I am not going to invent a URL. If your training plan needs the full Human 1M, the partner gate is part of the spec. SimReady, on the post I fetched, does not carry that gate[7].

## Do not paste the June robot onto this one

June already had a "reference humanoid." If your folder still has that brief, do not update the date and keep the body.

On 1 June 2026, at GTC Taipei, NVIDIA announced the Isaac GR00T Reference Humanoid Robot: a Unitree H2 Plus with Sharpa Wave hands as the body, Jetson Thor and Isaac GR00T as the brain, available from Unitree in late 2026[9]. Unitree's H2 Plus page prints a standing envelope of 1820 x 456 x 218 mm, weight with battery of about 70 kg, and 31 joint motors[8]. Arm payload on that page is about 7 kg rated and about 15 kg peak[8]. The spec table prints maximum arm joint peak torque as 120N.m and maximum leg joint peak torque as 360N.m[8]. Onboard compute on that page is named: Jetson T5000, FP4 2,070 TFLOPS, 128 GB, a 14-core Arm CPU, and a configurable 40 W–130 W range[8]. Connectivity on that page is Ethernet, Wi-Fi 6, Bluetooth 5.2, and USB[8]. Wi-Fi 6, not Wi-Fi 7.

The contrast that matters for a brief:

| | June reference (H2 Plus) | October reference (Agile ONE SN) |
| --- | --- | --- |
| Named body | Unitree H2 Plus | Agile ONE S |
| Calendar on the NVIDIA page | late 2026 | early 2027 |
| Height | 1820 mm standing | 1.40 m / 140 cm |
| Weight | about 70 kg with battery | 40 kg on NVIDIA's page, 43 kg on Agile's |
| Arm payload | about 7 kg rated, about 15 kg peak | 3 kg, or up to 3 kg, depending on the page |
| Hands | Sharpa Wave, 22 active DOF, 75 total | Wuji / WUJI Hand 2, 20 DOF each; 71 total only on Agile's news post |
| Radio | Wi-Fi 6, Bluetooth 5.2 | Wi-Fi 7 and Bluetooth, on Agile's news post |
| Second computer, as printed | Intel Core i5 and Core i7 as base computing power | Intel i3 N305, on the product page only |

The June column is the Taipei release plus the H2 Plus page[8][9]. The October column is the Berlin release, Agile's news post, and the product page[1][2][3].

Do not write late 2026 on Agile ONE SN[1][2]. Do not write beginning of 2027 on the H2 Plus[8][9]. Do not write 70 kg, 7 kg, 1820 mm, or Wi-Fi 6 onto the Berlin robot[1][8]. Do not write 40 kg or 43 kg onto the Taipei robot[2][8]. They share a software family name and a Thor-class computer claim[1][4][9]. They are not the same bill of materials[2][8].

Institution lists get mixed the same way. June's release says Ai2, ETH Zurich, the Stanford Robotics Center, and UC San Diego's Advanced Robotics and Controls Laboratory will use that H2 Plus reference design[9]. October's pages say Agile ONE SN is designed to advance research "with interest from" Stanford and ETH Zurich[1][2]. Interest is not "will use." Stanford and ETH appearing in both notes does not make the robots interchangeable, and it does not move Ai2 or UC San Diego onto the ONE SN page. Those two names are not in the October feature text I fetched.

## Calendar, price, and the disclaimer under the headline

Agile schedules ONE SN as available at the beginning of 2027[2]. NVIDIA schedules it as early 2027[1][11]. I am not going to translate either phrase into a quarter or a month[1][2]. Neither page printed a quarter[1][2]. This brief should not either.

Neither the newsroom, the Agile news post, nor the product page printed a shelf price in the text I fetched[1][2][3]. The investor copy did not print one either[11]. Leave the price cell blank[1][2]. A blank cell is a better brief than a number borrowed from another humanoid[8][9]. I did not fetch a ONE SN shelf price, and I am not going to import one[1][2][3].

NVIDIA's own release, under the headline, says many of the products and features remain in various stages and will be offered when and if available, and that the statements are not a commitment[1]. Read that before you put ONE SN on a 2027 capital plan as if the date were a purchase order. The date is a schedule sentence. The disclaimer is also a sentence. Both go in the note.

Agile says visitors to GTC Berlin could see the robot at the NVIDIA booth and at Agile Robots booth 3007[2]. That sentence is dated 21 October. I am not going to tell you the booth is still up this morning. If you need a look at the hardware, the pages you can open today are the product page and the news post, not a floor plan I did not fetch.

## Two quotes, not one

Zhaopeng Chen has a quote on each page, and they are not the same quote. On the NVIDIA release he talks about usefulness at scale and calls ONE SN a full-stack, open reference humanoid on GR00T and Jetson Thor[1]. On Agile's post he says the robot gives R&D labs a complete humanoid platform that is ready from day one, and a path into industry[2]. Do not splice them. "Ready from day one" is Agile's sentence. It sits next to a calendar that says beginning of 2027[2]. Ready, in that quote, means the stack is meant to arrive integrated. It does not mean you can order the body this morning. I did not find an order button.

Deepu Talla's quote is on the Agile post, not in the NVIDIA feature list I used. He says ONE SN combines GR00T and Jetson Thor in one system that unifies demonstration capture, simulation, training, validation, and deployment[2]. That is a workflow list. It matches the four steps the product page actually draws: collect data, train, evaluate, deploy and test[3]. Use that list if you are explaining the point of a reference platform. Do not upgrade it into a benchmark.

## How to write the brief

If you only have ten minutes, this is the note I would want on the page.

Name the body Agile ONE S, and name the product Agile ONE SN[1][2]. Say it is the compact research platform, and that Agile ONE is the full-size industrial counterpart the maker says skills can transfer to[2][3]. Do not stop at "the NVIDIA humanoid"[9]. There are two reference humanoids in 2026 already, and they do not share a skeleton[8][9].

Write height as 1.40 m, 140 cm, or 4.59 ft, and say the pages agree[1][2][3]. Write weight as two cells: 40 kg (88 lb) on the 21 October NVIDIA release, and 43 kg (95 lb) on Agile's news post, with 43 kg on the product page[1][2][3]. Add one line that you do not have a source for the 3 kg gap.

Write arm payload as 3 kg on the NVIDIA release and the product counter, and "up to 3 kg" on the Agile news post[1][2][3]. Write torque only if you cite the news post: up to 140 Nm[2]. If the number 140 appears next to the product page, it is centimeters[3].

Write the hand the way the cited page writes it[1][2]. WUJI Hand 2 and 1 kHz stay on the NVIDIA line[1]. Seventy-one stays on the Agile news line[2]. Do not import Sharpa Wave[8][9].

Write three sensor lines, or write one line and name the page. Head and wrist cameras, lidar, and an IMU are the release[1]. RGB-D on the head, wrist cameras, and 3D LiDAR are the Agile news post[2]. Waist 3D LiDAR, plus RGB-D at the waist and back, are the product page[3].

Write two computers if you are using the product page: Jetson Thor, and an Intel i3 N305 beside it[3]. Write 2,070 FP4 teraflops and 128 GB only as NVIDIA's claim about the Thor on this robot[1]. If you need the module table, say those figures match the Developer Kit and T5000 columns, including the word Sparse, and that the T4000 column is 1,200 TFLOPS and 64 GB[4]. Do not invent the SKU on the robot[1][2].

Write Halos as planned on the feature list, as "are integrating" in the partner paragraph, and as exploring on Agile's post[1][2]. Not shipped[1][2]. Not ASIL D on this body, unless a later page says that about this body[10]. The Halos page I fetched does not say that about ONE SN[10].

Write the calendar as early 2027 or beginning of 2027, and write NVIDIA's when-and-if sentence under it[1][2]. Leave price blank[1][2][3]. Leave late 2026 on the H2 Plus, where it belongs[9].

For the software you can touch before the crate shows up, pin the Isaac Lab URL you actually clone[1][6]. Note that the release's link opened the v3.0.0-EA tree while the prose said generally available[1][6]. Use SimReady as the ungated library of more than 2,000 assets[7]. GR00T 1.7 is on GitHub and Hugging Face as a 3-billion-parameter open VLA, on the GR00T page[5]. That is a model you can read today[5]. It is not a stopwatch result from this robot[5].

The release also names a long partner list around the stack: ABB, KUKA, Universal Robots, NEURA, Hexagon, Bear Robotics, and others, doing different jobs with Omniverse, Isaac Sim, Jetson Thor, or Halos[1]. I am not going to turn that list into a scoreboard[1]. A name in a launch paragraph is not a measured deployment[1]. If one of those robots matters to your cell, fetch that company's page the way this piece fetched Agile's[2]. The pattern is the same. Write the page, then the number[1][2].

That is the whole method. Yesterday's humanoid is real enough to spec, and not consistent enough to spec from memory[1][2]. The weight is the line that will get copied wrong first[1][2]. Do not write 40 kilograms on the Agile line[2][3].

## Sources

[1] https://nvidianews.nvidia.com/news/nvidia-advances-isaac-platform-for-general-purpose-robotics-with-new-reference-humanoid-frameworks-simulation-pipelines-and-data — NVIDIA newsroom, Isaac expansion, 21 Oct 2026
[2] https://www.agile-robots.com/en/news/detail/agile-robots-launches-agile-one-sn — Agile Robots, Agile ONE SN launch, 21 Oct 2026
[3] https://www.agile-robots.com/en/products/humanoid-robots/agile-one-sn — Agile ONE SN product page
[4] https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-thor — NVIDIA Jetson Thor product page
[5] https://www.nvidia.com/en-us/industries/robotics/isaac-groot — NVIDIA Isaac GR00T
[6] https://isaac-sim.github.io/IsaacLab/v3.0.0-EA/source/setup/environments.html — Isaac Lab v3.0.0-EA environments docs
[7] https://huggingface.co/blog/nvidia/simready-central-assets-robotics-ai-factories — SimReady Central, Hugging Face, 21 Oct 2026
[8] https://www.unitree.com/H2plus — Unitree H2 Plus product page
[9] https://nvidianews.nvidia.com/news/nvidia-open-humanoid-robot-reference-design — NVIDIA newsroom, GR00T reference humanoid, 1 June 2026
[10] https://www.nvidia.com/en-us/ai-trust-center/halos — NVIDIA Halos
[11] https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Advances-Isaac-Platform-for-General-Purpose-Robotics-With-New-Reference-Humanoid-Frameworks-Simulation-Pipelines-and-Data/default.aspx — NVIDIA investor release, Isaac expansion, 21 Oct 2026
