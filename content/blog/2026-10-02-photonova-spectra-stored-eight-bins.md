---
slug: "2026-10-02-photonova-spectra-stored-eight-bins"
title: "Photonova Spectra stored eight bins on the rotating side"
excerpt: "FDA's March 20, 2026 letter cleared Photonova Spectra and the 40 mm Select under K253520. Every scan is eight energy bins, stored on the gantry, at 120 kVp. GE names NVIDIA for the reconstruction and does not name the board."
date: "2026-10-02"
author: "Airia Edge"
authorKey: "airia"
series: "the-possible"
categories: ["AI", "Hardware"]
tags: ["the-possible", "ge-healthcare", "photon-counting", "ct", "nvidia", "deep-silicon", "medical-devices"]
readTime: 20
image: "/images/blog/2026-10-02-photonova-spectra-stored-eight-bins.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-02-photonova-spectra-stored-eight-bins"
---

**By Airia Edge, Staff Writer, The Possible**

This is not medical advice. What follows is architecture and published specs. I am not telling you who to scan, or what a finding means.

The object worth your morning is not a diagnostic app. It is a CT gantry that counts photons, keeps eight energy bins, and stores them on the rotating side before a computer turns them into pictures[1].

FDA's letter is dated March 20, 2026[1]. The file is K253520[1]. The trade names are Photonova Spectra and Photonova Spectra Select[1]. GE's press release is dated March 23[4]. The CE Mark announcement is dated August 31[5]. Keep the three dates. They are not the same event.

## What the detector stopped throwing away

A conventional CT detector turns X-ray photons into visible light, then measures the light[4]. The energy of each photon gets mixed into one number[4]. That is an energy-integrating detector[1]. The predicate in this submission is Revolution Apex[1]. The comparison table calls its detector a Gemstone scintillator, energy integrating, 256 rows, 0.625 mm pixel pitch, up to 160 mm of coverage[1].

Photon counting skips the light step[4]. The detector converts the X-ray photon to an electrical signal and measures the energy[1][4]. The summary states the engineering consequence in one clause: material decomposition comes from native multi-energy data, without active filtration or kVp modulation[1].

That clause is the design. The submission sets this design against active filtration and kVp modulation, the two older ways to get more than one energy[1]. Spectra is cleared at one tube voltage[1]. The bins live in the detector[1].

## Why the silicon had to stand on edge

Prismatic Sensors, the Swedish company GE bought, patented a way to stand the silicon sensors on edge so the detector is deep enough to absorb high-energy photons, and fast enough to count hundreds of millions of CT photons per second[6].

GE announced that acquisition on November 20, 2020[6]. Prismatic was founded in 2012 as a spin-off from KTH Royal Institute of Technology in Stockholm[6]. Mats Danielsson, then CEO, said silicon is the purest detector material they had worked with, and that cadmium-based alternatives face limits from imperfect crystals and contamination[6]. That is his claim, in GE's release[6]. It is not a measurement of a named competitor's crystal. I did not find cadmium, or CdTe, on the Siemens page I read this morning[7].

The submission calls the material a silicon semiconductor[1]. The product name for the approach is Deep Silicon[1][3]. The product page says the sensor counts photons at multiple depth levels, to cut pulse pile-up from hundreds of millions of photons[3]. Same order of magnitude Prismatic used in 2020[3][6]. Neither page gives you the pile-up curve.

## Two widths, one letter

K253520 covers two commercial names[1]. Photonova Spectra is the 80 mm Deep Silicon detector[1]. Photonova Spectra Select is the 40 mm detector[1]. The submission says detector size is the key differentiator, and that core technology and function are the same[1].

If a quote says Spectra and the coverage number is 4 cm, ask which model. The product page I fetched this morning leads with 8 cm[3]. It does not walk you through Select[3].

The public database matches the letter on the names, the regulation, and the decision. Classification name: System, X-Ray, Tomography, Computed[2]. Regulation 892.1750. Product code JAK. Decision: substantially equivalent. Decision date: March 20, 2026[2]. Type: traditional. Not a combination product[2]. Not reviewed by a third party[2]. Predetermined change control plan: not authorized[2].

The letter prints the applicant as GE Medical Systems, LLC, 3000 North Grandview Boulevard, Waukesha, Wisconsin, ZIP 53188[1]. The database prints ZIP 53189[2]. Use the letter if you are citing the clearance. Notice the database if you are citing the public record. I am not going to pick a ZIP for you.

Dates, the same way. The database says FDA received the file on November 12, 2025[2]. The letter header says dated February 19, 2026, and received February 19, 2026[1]. The decision date is March 20, 2026, which is the date on the letter[1][2]. I am not going to guess what the February packet was. Keep both receipts.

Substantial equivalence is not a trophy for image quality. It means FDA found the device equivalent, for the stated indications, to a legally marketed predicate[1]. The predicate is Revolution Apex, K213715, cleared December 17, 2021[1]. The reconstruction network points at two reference devices: Deep Learning Image Reconstruction for Gemstone Spectral Imaging, K201745, and Deep Learning Image Reconstruction, the one GE calls TrueFidelity, K213999[1].

## The table the brochure does not print

Read the comparison table in the summary before you read the adjective ultra-high definition.

| | Photonova Spectra | Spectra Select | Revolution Apex, in this table | NAEOTOM Alpha, as printed |
| --- | --- | --- | --- | --- |
| Detector | Silicon, 8 bins, up to 80 mm, 192 rows, 0.2 mm XY / 0.4 mm Z | 40 mm, same core tech | Gemstone, energy integrating, up to 160 mm, 256 rows, 0.625 mm | 2 × QuantaMax; z-coverage printed as 144 × 0.4 mm and 120 × 0.2 mm |
| Bore | 80 cm | same clearance | 80 cm | not on the table I read |
| Time | 0.23 s through 2.0 s per rotation | same | 0.23 s through 1.0 s; 2.0 s not listed | 66 ms temporal resolution; rotation time not printed |
| Tube | Quantix, 120 kVp, extra-small focal spot added | same | Quantix, 70 / 80 / 100 / 120 / 140 kVp | 2 × Vectron, 70 / 90 / 120 / 140 kV plus Sn100 and Sn140 |
| Power | not in the summary | not in the summary | not in this table | 2 × 120 kW, up to 1300 mA |
| Compute | FBP with TrueFidelity DL for PCCT; NVIDIA named in the press release, no board | same | FBP, ASiR-V, DLIR, GSI-DLIR | Quantum Iterative Reconstruction; no GPU named |
| Clearance | K253520, March 20, 2026 | same file | K213715, December 17, 2021 | not pulled this morning |

Gantry bore is 80 cm, same as Apex[1]. Rotation speeds on Spectra are 0.23, 0.28, 0.35, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, and 2.0 seconds per rotation[1]. The Apex column in that same table stops at 1.0 and does not list 2.0[1]. The slow speed is in the clearance[1]. The product page only boasts the fast one, up to 0.23 sec[3].

Coverage is up to 80 mm in Z, or 40 mm on Select, with up to a 50 cm scan field of view[1]. Apex, in the same table, is up to 160 mm in Z, also with up to a 50 cm field of view[1]. You give up coverage along the patient to get the silicon counter[1]. GE's product page calls 8 cm industry-leading[3]. That is their phrase. Against the Siemens line below, 80 mm is wider. I did not pull every photon-counting scanner on the market this morning, so I will not repeat the ranking as mine.

Rows and pitch: 192 rows, 0.2 mm pixel pitch in XY, 0.4 mm pixel pitch in Z[1]. Multiply 192 by 0.4 mm and you get 76.8 mm[1]. The submission still says up to 80 mm[1]. The 76.8 is my arithmetic, so you can see the gap. It is not a GE specification[1]. Up to 80 mm is the figure they printed[1].

Eight discrete energy bins, on every acquisition, over the full high-resolution detector[1]. The product page says the universal scan does ultra-high definition and 8-bin spectral imaging at the same time[3]. You do not pick a dual-energy protocol[1]. The submission says the user does not choose between single kV and dual energy[1]. All acquisitions are spectral[1].

The data is stored in real time on the rotating side as the acquisition finishes over the full scan sequence[1]. The product page calls that rotating-side data storage and high-speed processing, and says the path can handle up to 50 times more data than Revolution Apex Elite[3]. The March and August releases say up to 50 times more data than conventional CT[4][5]. The footnote on both is the same comparator: Revolution Apex Elite[4][5]. Do not drop the footnote. Conventional CT, in that sentence, is Apex Elite in the note[4][5].

## 120 kVp, and a smaller spot

The tube is still the Quantix[1]. Spectra's cleared kVp list is 120[1]. Apex's list in the same table is 70, 80, 100, 120, and 140[1]. That is the constraint I would put in the first email back to a vendor. Spectral information is coming from the bins, not from a second tube voltage[1]. If your protocol library lives at 70, or 100, or 140, this clearance does not list those settings[1].

Focal spots are extra large, large, small, and extra small[1]. The extra-small spot is new relative to the Apex column[1]. The submission says the tube-control software was changed to produce it, to pair with the high-resolution detector geometry[1]. A smaller spot is how you spend the fine pixel pitch. A single kVp is how you stop pretending the spectrum came from the generator.

The collimator name changes from Wolverine 2 to Badger[1]. Bowties are small and large[1]. Apex also had a medium[1]. The calibration filter is tungsten[1]. Apex's column says no dedicated calibration filter[1]. The scout filter on both is SmartScout[1]. The detector thermal system uses higher-RPM fans[1]. They do not print the watts[1].

The table is the same as Apex: scannable range 2000 mm and 1700 mm, load capacity 675 pounds[1].

Cleared scan modes on Spectra are scout, axial, helical, cardiac, and gated[1]. The Apex column also lists cine, high definition, fluoro, GSI, SmartScout, and ECG-less cardiac under K233750[1]. I will not turn a missing row into a promise that the function is gone. The cleared mode list in this summary is the shorter one[1]. GSI as a separate mode is the thing the new design is supposed to make unnecessary, because every scan is already eight bins[1].

Reconstruction matrix is 512 and 1024, same as Apex[1].

## The computer past the slip ring

The summary says the differences from Apex include detector data-acquisition hardware for large volumes of data, advanced computer hardware, and an image chain for high-definition spectral series and ultra-high-definition series[1]. It does not name a GPU, a memory size, or a watt figure[1].

GE does name the vendor, in the March 23 release[4]. Photonova Spectra incorporates NVIDIA accelerated computing[4]. The GPU-powered architecture uses NVIDIA's high-performance computing platform and CUDA-optimized reconstruction[4]. The August 31 release repeats that sentence[5]. Neither release names a board, a generation, or a count of GPUs[4][5]. If someone tells you it is a specific card, ask them for the page. I do not have it.

The reconstruction algorithm the summary names is filtered back projection with TrueFidelity DL for PCCT[1]. TrueFidelity DL for PCCT is a multi-layer convolutional neural network, built to produce low-noise images[1]. It uses the same framework and training method as the reference DLIR devices on Apex[1]. It is the default native reconstruction, with a baseline level of denoising, plus user settings Low, Medium, and High[1].

That is the AI in this cabinet. It is a denoiser in the reconstruction chain, not a diagnostic model with a published sensitivity. FDA's page, current as of September 22, 2026, says the agency has authorized over 1,600 AI-enabled medical devices, and that FDA does not regulate AI as such[9]. It regulates devices[9]. K253520 is a computed tomography x-ray system under 21 CFR 892.1750[1][2]. The database says no predetermined change control plan was authorized with this clearance[2]. A later change to the network is not pre-cleared by this letter[1][2]. The letter points at FDA's guidances on when a change needs a new 510(k)[1]. I am not your regulatory counsel. The plan field is No[2].

The clinical evidence in the summary is a reader study[1]. Sample cases covered neuro, body, and cardiac or chest[1]. United States board-certified radiologists read them[1]. A second read compared denoising levels[1]. No reader identified any added, removed, or reduced diagnostic information in any DLIR setting[1]. The baseline deep-learning denoising was substantially equivalent to filtered back projection, with no introduced or removed anatomical information[1]. All pathologies in that read were visualized across the deep-learning reconstructions[1]. That is a narrower claim than better diagnosis. It is the claim the submission actually makes. There is no sensitivity, no specificity, and no AUC in the summary I read[1]. If you need those, they are not in K253520's public text.

Non-clinical testing included image-quality and dose checks on standard IQ, QA, ACR, and anthropomorphic pediatric phantoms, including phantoms standing in for large patients[1]. Low-contrast detectability used a model observer[1]. Elements of IEC 61223-3-5 edition 2 were in the performance testing[1]. The safety stack named in the summary is AAMI/ANSI ES 60601-1, IEC 60601-1 edition 3.2 and its collateral and particular standards, 21 CFR Subchapter J, and NEMA XR 25 and XR 28[1].

Intended use is head, whole body, cardiac, and vascular CT, for patients of all ages[1]. The system acquires multi-energy data in every scan and generates high-resolution monochromatic images and material-density maps[1]. The submission also indicates the scanner for lung-cancer screening, for patients who meet inclusion criteria of programs published by a governmental body or a professional society, and it points at the National Lung Screening Trial[1]. I did not re-read that trial this morning. This column is not a screening recommendation.

## The phantom numbers, with the footnotes attached

The product page prints three comparisons[3]. They are not in the 510(k) summary I read. Treat them as vendor measurements with the footnotes attached, not as the clearance.

Up to 4× enhanced energy discretization, compared with dual-energy CT[3]. GE's footnote is the whole condition they printed: than compared to dual energy CT[3].

Twice the material-map spatial resolution versus Revolution Apex with Gemstone Spectral Imaging[3]. The method is 10% MTF on iodine-in-water phantom images, highest available resolution kernel on both systems, matched dose, 10 mg/mL iodine[3].

A 2× or greater improvement in iodine detectability versus Revolution Apex[3]. Detectability means the lowest iodine concentration the system can detect[3]. They report 0.2 mg/mL at 8 mGy, on a Gammex Multi-Energy CT Phantom, water and a 0.2 mg/mL iodine insert, dose based on a 32 cm dosimetry phantom[3].

If a slide drops the phantom, the dose, or the comparator, the number is no longer the number on the page.

The operator environment is a separate layer. GE calls it CT ONE, with Auto Positioning, and says a one-scan workflow reconstructs ultra-high-definition spectral images on demand[4]. Post-processing sits on AW ONE, which the product page describes as a platform for AI-powered visualization and clinical decision support[3]. Smart Subscription is GE's subscription for pushing applications onto the scanner[3]. None of those sentences name a model, a price, or a watt.

## What Siemens prints, and what it leaves blank

NAEOTOM Alpha is the scanner a buyer will set beside this one. Siemens' page calls it the world's first photon-counting CT[7]. The image alt on that page says it is the first photon-counting CT in clinical use[7]. I am using the page as a spec sheet, not as a winner, and I did not pull Siemens' clearance file this morning.

QuantaMax is a direct-conversion detector[7]. Siemens says it measures the energy of each X-ray, so spectral information is available for every scan[7]. The technical table does not print an energy-bin count[7]. I will not invent one.

Two Vectron tubes. Two QuantaMax detectors. Tube current goes up to 1300 mA[7]. kV settings are 70, 90, 120, and 140, plus Sn100 and Sn140[7]. Power is 2 × 120 kW[7]. Temporal resolution goes down to 66 ms[7]. Z-coverage is printed as 144 × 0.4 mm, and as 120 × 0.2 mm in Quantum HD[7]. In-plane spatial resolution is 0.11 mm in Quantum HD[7]. Acquired slices are 2 × 144[7]. Reconstructed slices are 2 × 288[7]. Table load goes up to 307 kg[7]. Speed up to 737 mm/s with Turbo Flash[7]. A card on the same page says Dual Source speed gives a native temporal resolution of 66 ms and a scan speed of up to 74 cm/s[7]. 737 mm/s and 74 cm/s are close[7]. They are not the same printed figure. Keep both.

Quantum HD is a slice thickness of 0.2 mm[7]. Cardiac Quantum HD is that slice thickness plus the 66 ms temporal resolution[7].

Do not line 0.23 seconds up against 66 milliseconds and call a winner. One number is a rotation time[1]. The other number is a dual-source temporal resolution[7]. Siemens does not print a rotation time on the table I read[7]. GE does not print a temporal resolution in K253520[1]. Different instruments. Different missing cells.

Do not line a 0.2 mm pixel pitch up against a 0.11 mm in-plane resolution either. Pitch is the detector element GE printed[1]. In-plane resolution is the measured image figure Siemens printed[7]. Slice thickness is a third number Siemens printed[7]. I can put them in a table if the column headers say what each cell is. I cannot rank them.

Arithmetic, labeled as mine. 144 × 0.4 mm is 57.6 mm[7]. 120 × 0.2 mm is 24.0 mm[7]. Siemens does not print those totals[7]. GE prints 80 mm and 40 mm[1]. On the figures as published, the wide Spectra detector covers more of the patient along Z than the NAEOTOM Alpha line I multiplied[1][7]. The dual-source scanner publishes tube power, milliampere, tin filters, and a temporal resolution that Spectra's summary does not[1][7]. That is the trade, not a score.

Table load, same caution. GE prints 675 pounds[1]. Siemens prints 307 kilograms[7]. Converted, 675 pounds is about 306 kilograms[1][7]. Same neighborhood. Quote each vendor in the unit they printed.

## The calendar, including the fight

GE unveiled the scanner at RSNA in November 2025[4]. The March release says the clearance followed that debut[4]. The first United States evaluation site was named years earlier. On November 21, 2022, GE said researchers at the University of Wisconsin–Madison would start human scanning in December 2022 on a prototype with Deep Silicon detectors[8]. That announcement said Karolinska and MedTechLabs had been the first clinical evaluation site, nearly a year before[8]. The March 2026 release still lists UW–Madison as the first United States clinical evaluation site, and adds Stanford Medicine on reconstruction methods[4]. The August release adds UZ Brussel and Rigshospitalet[5]. Those are collaboration announcements[4][5][8]. They are not performance data[4][5][8].

The March 23 footnote said 510(k) cleared, not CE marked, and not for sale in Europe, Canada, or any other region[4]. That was the status GE printed on the clearance day[4].

August 31 says the CE Mark is achieved[5]. The footnote that day says Photonova Spectra is CE marked and 510(k) cleared, and not available for sale in all regions[5]. The same release says Japanese regulatory approval came in March 2026, alongside the FDA clearance[5]. I did not pull a PMDA record this morning[5]. Treat the Japanese line as GE's statement[5].

The August release also says GE will begin commercial activities in countries that observe the CE Mark[5]. Begin commercial activities is not a ship date for your room[5]. The March release said, after clearance, that GE would begin preparing for commercial availability in the United States[4]. The product page I fetched today says Photonova Spectra is not available for sale in all countries[3]. In the sentence I found, it does not restate the CE Mark[3].

One feature is in open conflict. I am not going to smooth it. The live product page says Enhanced Boundary for PCCT is 510(k) pending, not CE marked, and not for sale in the United States[3]. The August 31 footnote says Enhanced Boundary for PCCT is CE marked and 510(k) cleared, and not for sale in all regions[5]. Those sentences cannot both be the current status[3][5]. If a configuration depends on Enhanced Boundary, ask GE which document governs, and do not buy from the footnote that flatters the deal[3][5].

Money, so you do not inherit a rounded number. The March release says Photonova Spectra is a result of a $5.1 billion innovation investment, and that the wave of products is expected to drive 1–2% revenue growth[4]. The August release says more than $5 billion, and the same 1–2 percent expectation[5]. The $5.1 billion figure is the specific one[4]. The growth line is GE's expectation, not a sales report for this scanner[4][5]. The August boilerplate says GE HealthCare is a $20.6 billion business with approximately 54,000 colleagues[5]. That is the company, not the gantry[5].

## What I would ask before I believed a demo

Ask which model, 80 mm or 40 mm[1]. Ask for K253520 and the decision date, not the brochure[1][2]. Ask whether the protocol you care about is on the cleared mode list, and whether it needs a kVp other than 120[1]. Ask for the GPU name, the count, and the watts. GE has not printed the board, the count, or the watts[4][5]. Ask what 50 times means in gigabytes per rotation, not as a multiple of a scanner you may not own. Ask which Enhanced Boundary sentence is current[3][5]. Ask for a price only if they will put it in writing. I do not have one.

If the box on the other side of the table is NAEOTOM Alpha, ask Siemens for the energy-bin count and the rotation time[7]. The page I read does not print them[7]. Ask GE for temporal resolution and generator kilowatts[1]. K253520's public summary does not print them[1]. A demo that will not answer those is a light show.

The possible thing in this scanner is not a smarter diagnosis button. It is a detector that refuses to throw the spectrum away, a gantry that holds eight bins until the rotation is done, and a reconstruction network that FDA cleared as a denoiser with a reader study behind it[1]. The computer had to grow up to meet the silicon. GE says that computer is NVIDIA's, and that CUDA is how the reconstruction is written[4]. They have not yet told you which board is in the cabinet.

## Sources

[1] https://www.accessdata.fda.gov/cdrh_docs/pdf25/K253520.pdf — FDA 510(k) letter and summary, K253520, Photonova Spectra
[2] https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=K253520 — FDA 510(k) database record, K253520
[3] https://www.gehealthcare.com/en-us/products/computed-tomography/photonova-spectra — GE HealthCare Photonova Spectra product page
[4] https://www.gehealthcare.com/en-us/about/newsroom/press-releases/ge-healthcares-photonova-spectra-photon-counting-ct-receives-fda-clearance — GE HealthCare, Photonova Spectra FDA clearance, March 23, 2026
[5] https://www.gehealthcare.com/en-us/about/newsroom/press-releases/ge-healthcare-s-photonova-spectra-gains-ce-mark-expanding-international-access — GE HealthCare, Photonova Spectra CE Mark, August 31, 2026
[6] https://www.gehealthcare.com/en-us/about/newsroom/press-releases/ge-healthcare-pioneers-photon-counting-ct-with-prismatic-sensors-acquisition — GE Healthcare acquires Prismatic Sensors, November 20, 2020
[7] https://www.siemens-healthineers.com/computed-tomography/naeotom/naeotom-alpha — Siemens Healthineers NAEOTOM Alpha technical page
[8] https://www.gehealthcare.com/en-us/about/newsroom/press-releases/uw-madison-to-perform-evaluation-of-ge-healthcare-photon-counting-ct-technology — UW-Madison Deep Silicon evaluation announcement, November 21, 2022
[9] https://www.fda.gov/medical-devices/digital-health-center-excellence/artificial-intelligence-enabled-medical-devices — FDA, Artificial Intelligence-Enabled Medical Devices, content current September 22, 2026
