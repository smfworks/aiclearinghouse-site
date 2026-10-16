---
slug: "2026-10-16-do-not-write-the-cobot-on-the-c90xt-line"
title: "Do not write the cobot on the C90XT line"
excerpt: "The English OmniCore sheet says the C90XT powers Delta and cobot robots up to the IRB 1600. The matrix on that page marks neither. The V250XT page still stops at IRB 6790. The sheet's ceiling sentence says IRB 7720. The marked column says 77x0."
date: "2026-10-16"
author: "Airia Edge"
authorKey: "airia"
series: "the-possible"
categories: ["AI", "Hardware"]
tags: ["the-possible", "abb", "omnicore", "robotics", "industrial", "controllers"]
readTime: 23
image: "/images/blog/2026-10-16-do-not-write-the-cobot-on-the-c90xt-line.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-16-do-not-write-the-cobot-on-the-c90xt-line"
---

**By Airia Edge, Staff Writer, The Possible**

Do not write a cobot on the C90XT line. The English sheet says the box powers "Delta, SCARA, Cobot, articulated robots up to IRB 1600."[1] The matrix under that sentence marks six articulated columns and three SCARA columns[1]. It does not mark a Delta column[1]. It does not mark a cobot column[1]. The German sheet, downloaded the same morning, names cobots and delta robots in the C90XT sentence and leaves those cells blank too[2].

This is a controller purchase. It is not a care device, and it is not a clinical instruction.

## The files on the desk

The English download is ABB document 9AKK108470A1173[1]. The redirect this morning landed on a file whose name contains `9AKK108470A1173_en_E_`[1]. `pdfinfo` on that file reported a creation timestamp of 14 October 2026, 04:05 EDT, and four pages[1]. The German download is the same document ID[2]. Its footer prints `10/26`[2]. `pdfinfo` on that file reported 15 October 2026, 04:12 EDT, and four pages[2]. I am not calling either timestamp a press date. They are the timestamps on the PDFs the downloads returned.

The family page was fetched the same morning[3]. So were the V250XT, V400XT, and C90XT pages[4][5][6]. The E10 page was fetched then too[7]. Where a sentence below names a mark, the mark is a bullet in the sheet's text layer, aligned to a column, not a guess from a picture[1][2].

Both sheets say the platform is five controllers[1][2]. The family page says five as well, "the biggest range of 5 controllers that runs on the same platform."[3] EyeMotion and the OmniCore UI sit beside those five on the family page[3]. They are not a sixth and seventh controller in that sentence[3].

## What the two sheets share

Write these lines. Both files print them.

| Line | E10 | C30 | C90XT | V250XT | V400XT |
| --- | --- | --- | --- | --- | --- |
| IP | IP20 | IP20 | IP54 | IP54 | IP54 |
| SafeMove | listed | listed | listed | listed | listed |
| EyeMotion | listed | listed | listed | listed | listed |
| Conveyor tracking | listed | listed | listed | listed | listed |
| Supply, three-phase boxes | — | — | — | 3 ~, 380 – 480 VAC | 3 ~, 380 – 480 VAC |
| RCD, industrial | 300 mA | 300 mA, plus 30 mA cobot | 300 mA | 300 mA | 300 mA |

The IP ratings, SafeMove, EyeMotion, conveyor tracking, the 380 – 480 VAC line, and the 300 mA industrial RCD are on both sheets[1][2]. C30 is the only row with a second RCD, 30 mA for the cobot, and both sheets print that split[1][2].

The English footnote under the feature table defines the word Industrial: "all other industrial robots except for CRB 15000 and IRB 14050."[1] That line sits with the RCD note[1]. It is not the support matrix[1]. Do not read it as a ban on those two cobots. The matrix has its own columns for them[1].

The path sentence is shared in substance and not in the hedge. The English sheet says "path accuracy down to 0.6 mm, even with multiple robots operating at maximum speeds of 1600 mm/s."[1] The family page says "path accuracies down to 0.6mm, even with multiple robots running at highest speeds of up to 1600mm/s."[3] "Maximum speeds of 1600 mm/s" and "up to 1600mm/s" are not the same hedge[1][3]. Neither sentence is a plant result. Keep "down to." Keep "multiple robots." Do not promote 0.6 mm to a guaranteed path on your floor.

## The C90XT sentence names robots the marks do not

The English C90XT cell says it is designed to power Delta, SCARA, Cobot, and articulated robots up to the IRB 1600[1]. The German cell says cobots, delta robots, SCARA, and 6-axis robots up to the IRB 1600[2]. The C90XT product page says "collaborative robots, Delta, SCARA, and articulated robots up to IRB 1600."[6] The family card uses the sheet's nouns: Delta, SCARA, Cobot, articulated, up to the IRB 1600[3].

Four sentences. One matrix.

On the English sheet the C90XT row marks these columns, and only these[1]:

| Marked on C90XT | Family on the sheet |
| --- | --- |
| IRB 1100 | articulated |
| IRB 1200 Gen2 | articulated |
| IRB 1300 | articulated |
| IRB 1510 | articulated |
| IRB 1520 | articulated |
| IRB 1600 | articulated |
| IRB 910 INV | SCARA |
| IRB 920 | SCARA |
| IRB 930 | SCARA |

The Delta columns on that row are blank: IRB 360, IRB 365, and IRB 390[1]. The cobot columns are blank: IRB 14050, CRB 15000, CRB 18x0, and CRB 19x0[1]. The 1600 ceiling in the sentence matches the highest articulated column the row marks[1]. The nouns Delta and Cobot do not[1].

The German matrix agrees on every shared column[2]. It marks IRB 1100, the 1200 column, IRB 1300, IRB 1600, and the three SCARA columns[2]. It does not mark a delta robot on C90XT[2]. It does not mark CRB 15000, CRB 18x0, or CRB 19x0 on C90XT[2].

If the brief says "C90XT, cobot," send it back. If it says "C90XT, IRB 360," send it back. SCARA through the IRB 930, and the articulated columns in the table above, are the C90XT marks on these two files[1][2].

## A missing German column is not a no

The German robot matrix is a shorter list[2]. It does not print IRB 1100 Lite+, IRB 1200 Lite+, IRB 1200 Gen2 as a separate column, IRB 1510, IRB 1520, IRB 6650S, IRB 6660, IRB 6720 Lite+, or IRB 14050[2]. The English matrix prints those columns[1].

That matters on the C90XT row. English marks IRB 1510 and IRB 1520 there[1]. German has no cells for them[2]. A blank cell and a column the page never drew are not the same fact. If the German sheet is the only page on the desk, you cannot see those two marks[2]. You also cannot treat their absence as a rejection[2]. Open the English file before you strike IRB 1510 or IRB 1520 off a C90XT line[1].

The same caution runs the other way. Do not copy an English Lite+ mark onto a German brief as if the German matrix had confirmed it[1][2]. It did not print the column[2].

## Do not stop the V250XT line at IRB 6790

The V250XT product page says the box is "designed to power Delta, palletizer, and articulated robots up to IRB 6790."[4] It also prints "up to 3 additional drive units" and "15 liters of extra space for options."[4] The family card drops Delta and keeps the ceiling: articulated and palletizing robots up to the IRB 6790[3].

The English sheet's ceiling sentence does not say 6790[1]. It says "articulated and palletizing robots up to IRB 7720."[1] It does not name Delta in that cell[1]. The German ceiling sentence says 6-axis robots up to the IRB 7720, plus delta and palletizing robots[2].

Three documents. Three ways to finish the sentence.

The matrix is the row that can go on the order. On both sheets the V250XT row marks IRB 6790[1][2]. It also marks the column labeled IRB 77x0[1][2]. It does not mark IRB 8700[1][2].

IRB 7720 is not a column name on either matrix[1][2]. The English ceiling sentence prints IRB 7720[1]. The German ceiling sentence prints IRB 7720[2]. Neither file, in the text I extracted, prints a footnote that says IRB 77x0 means IRB 7710 and IRB 7720[1][2]. Do not collapse those names because they share a 77. Write IRB 77x0 if you are copying the mark[1][2]. Write IRB 7720 only if you are quoting the ceiling sentence, and say that is what you are quoting[1][2].

Do not stop the brief at IRB 6790[4][3]. That number is a marked column, not the last marked column[1][2]. The product page's "up to IRB 6790" leaves the 77x0 mark off the order[4][1].

Palletizer is not one check either. V250XT marks IRB 460 and IRB 660[1][2]. It does not mark IRB 760[1][2]. V400XT marks all three palletizer columns[1][2]. "Palletizer" on a V250XT line is 460 and 660, not the family[1][2].

## Delta is three columns

"Delta" on a blurb is not a mark.

| Controller | IRB 360 | IRB 365 | IRB 390 |
| --- | --- | --- | --- |
| E10 | blank | blank | blank |
| C30 | marked | marked | blank |
| C90XT | blank | blank | blank |
| V250XT | blank | blank | marked |
| V400XT | blank | blank | marked |

That split is on the English matrix and on the German matrix[1][2]. C30's sentence says Delta[1][2]. Its row marks 360 and 365, not 390[1][2]. V250XT's German sentence says delta robots[2]. Its row marks 390 only[2]. The English V250XT sentence does not say Delta at all, and the row still marks 390[1]. The V250XT product page says Delta and does not name which one[4].

If the robot is an IRB 390, the marks that hold it are V250XT and V400XT[1][2]. If it is an IRB 360 or an IRB 365, the mark that holds it is C30[1][2]. C90XT holds none of the three[1][2].

## The E10 blurb is short in the other direction

The E10 cell says SCARA robots and articulated robots up to the IRB 1300[1]. The German cell says small robots up to the IRB 1300, and SCARA[2]. The E10 page repeats the English ceiling and does not add a cobot[7].

The matrix is wider than that sentence. Both sheets mark CRB 18x0 and CRB 19x0 on the E10 row[1][2]. Neither marks CRB 15000 on E10[1][2]. The English sheet also leaves IRB 14050 blank on E10[1]. The German sheet does not print an IRB 14050 column[2].

So the E10 mistake is the reverse of the C90XT mistake. The C90XT sentence names a cobot the marks do not[1]. The E10 sentence omits two cobot columns the marks include[1][2]. If you need a CRB 18x0 or a CRB 19x0, E10 is a marked row[1][2]. If you need a CRB 15000, E10 is not[1][2]. Write the column. Do not write "cobot" and hope the box sorts it out.

English E10 also marks IRB 1010, IRB 1090, IRB 1100, IRB 1100 Lite+, IRB 1200 Lite+, IRB 1200 Gen2, and IRB 1300, plus the three SCARA columns[1]. German E10 marks 1010, 1090, 1100, 1200, and 1300, plus the three SCARA columns, and does not print the Lite+ columns[2]. The "up to IRB 1300" ceiling matches the highest articulated mark on that row[1][2]. It does not describe the cobot marks[1][2].

## C30 is the cobot row, with a hole in Delta

C30 is where the cobot columns actually fill in. The English row marks IRB 14050, CRB 15000, CRB 18x0, and CRB 19x0[1]. The German row marks CRB 15000, CRB 18x0, and CRB 19x0, and has no IRB 14050 column to mark[2].

The articulated marks on English C30 are IRB 1010, IRB 1100, IRB 1200 Gen2, IRB 1300, IRB 1510, IRB 1520, and IRB 1600[1]. IRB 1090 is blank on that row[1]. The Lite+ columns are blank[1]. German C30 marks 1010, 1100, 1200, 1300, and 1600, skips 1090, and does not print 1510 or 1520[2].

Both sheets give C30 all three SCARA columns[1][2]. Both give it IRB 360 and IRB 365, and neither gives it IRB 390[1][2]. The sentence still says Delta, as if the word covered the family[1][2].

C30 is also the only controller row with the 30 mA cobot RCD beside the 300 mA industrial RCD[1][2]. If the brief is a cobot on a C30, that second number is the one the sheet attaches to the cobot case[1][2]. Do not copy 300 mA alone onto that line and drop the 30 mA[1][2].

## Voltage is not one single-phase line

The English sheet does not give E10, C30, and C90XT the same supply[1].

| Controller | English sheet | German sheet |
| --- | --- | --- |
| E10 | 1 ~, 100-230VAC, 2-hot (US) | einphasig, 220 – 230 V |
| C30 | 1 ~, 100-230VAC, 2-hot (US) | einphasig, 220 – 230 V |
| C90XT | 1 ~, 220-230VAC, 2-hot (US) | einphasig, 220 – 230 V |
| V250XT | 3 ~, 380 – 480 VAC | 3-phasig, 380 – 480 V |
| V400XT | 3 ~, 380 – 480 VAC | 3-phasig, 380 – 480 V |

Those strings are copied from the cells[1][2]. The three-phase line agrees[1][2]. The single-phase line does not[1][2].

Do not copy 100-230 onto the German brief[2]. The German file does not print 100 V, and it does not print the 2-hot US note[2]. Do not copy 220 – 230 V onto an English E10 or C30 brief and drop the 100 V floor[1]. C90XT is the single-phase box that already says 220-230 on the English sheet[1]. Even there, the English cell keeps "2-hot (US)" and the German cell does not[1][2].

A US 120 V cabinet and a 230 V cabinet are different purchases. The language of the sheet in your hand decides which number you are allowed to write[1][2].

## PickMaster on the E10 is a language split

The English E10 cell says "No PickMaster® Twin."[1] C30, C90XT, V250XT, and V400XT list PickMaster® Twin on that sheet[1]. The German sheet lists PickMaster® Twin on all five, including E10[2].

Do not add PickMaster Twin to an English E10 order because the German file lists it[1][2]. Do not strike it from a German E10 order because the English file says no[1][2]. Write the word that is on the file you are ordering against, and name the file.

MultiMove is cleaner, and it still wants a careful reading. The English sheet prints MultiMove on C90XT, V250XT, and V400XT, and leaves the E10 and C30 cells in that row empty[1]. The German sheet prints a dash on E10 and C30, and prints MultiMove on the other three[2]. An empty cell and a dash are both "not listed as present."[1][2] Do not write MultiMove on an E10 or a C30 brief from these two files[1][2].

## Counts the pages hedge, and counts they do not share

English prints "3 ADU" on V250XT and "6 ADU" on V400XT[1]. C90XT is "1 ADU."[1] E10 and C30 are "No ADU."[1] The German cells say no additional drive unit on E10 and C30, one on C90XT, up to three on V250XT, and up to six on V400XT[2]. The product pages agree with the German hedge: "up to 3" on the V250XT page, "up to 6" on the V400XT page[4][5].

The integer is not the fight. The words "up to" are. If you are quoting the English sheet, it does not print "up to" on those two cells[1]. If you are quoting the page or the German sheet, it does[2][4][5]. Do not sand the hedge off, and do not add one the English cell does not have.

The liters are page-only. The V250XT page prints "15 liters of extra space for options."[4] The V400XT page prints "50 liters of extra space for options."[5] I did not find either volume in the controller tables of the two sheets[1][2]. If the brief needs a volume, cite the page[4][5]. Do not cite the sheet for a number the sheet does not print[1][2].

The I/O count is German-only, and only on two rows. German E10 and C30 print 16 digital inputs and 8 digital outputs as the base fit[2]. English E10 says "Built-in I/O" and does not print 16 or 8[1]. English C30 says "Internal Scalable I/O" and does not print the count[1]. C90XT and the two V boxes, on the German sheet, say optional internal I/O cards rather than 16 and 8[2]. Do not spread the 16/8 line across the family[2].

Mounting splits on C30. English prints "Standing, Rack mount, Vertical mount, Desktop Front."[1] German prints standing, rack mount, desktop version, and front design, and does not print vertical in that cell[2]. Do not drop vertical from an English C30 order because the German cell is shorter[1][2].

The 24 V lines agree, and they are easy to blur. E10 is built-in 24 V at 4 A on both sheets[1][2]. C30 is 4 A plus an optional 8 A[1][2]. C90XT, V250XT, and V400XT are 4 A plus an optional 4 A, plus optional ODVA[1][2]. The optional amp on C30 is 8, not 4[1][2]. Write the row you are buying.

## The 20 percent line names IRC5 in one language

The English sustainability line says "up to 20% energy savings compared to its predecessor."[1] It does not name the predecessor[1]. The German line says "bis zu 20 % weniger Strom als die IRC5," up to 20 percent less electricity than the IRC5[2]. The family page keeps the English wording: up to 20% compared with its predecessor, predecessor unnamed[3].

Do not write IRC5 on a line you sourced from the English sheet or the family page[1][3]. Do not write 20% as a measured saving on your line[1][2][3]. "Up to" is doing the work in all three sentences[1][2][3].

The family page also offers a calculator: fill in the operational details, and it will estimate a saving[3]. I did not run it. The paragraph I fetched does not print a plant number[3]. A calculator you have not filled in is not a result.

The feature count is the same kind of slip. The English sheet says "over up to 1000 time-saving features."[1] The family page says "over 1000 features."[3] The German sheet says "mehr als 1.000 Funktionen," more than 1,000 functions[2]. Do not add those phrases. Do not clean "over up to" into a tidier number and call it ABB's[1]. Quote the file you have.

## Three safety sentences, and a date with no year

Page 1 of the English sheet says OmniCore "includes up to 100 safety configurations."[1] The family page says "up to 100 different safety configurations."[3] Page 1 of the German sheet says "über 100 Sicherheitskonfigurationen," over 100 safety configurations[2]. "Up to 100" and "over 100" are not the same ceiling[1][2].

The ISO box is a different noun again. The English box is headed "Ready for what’s next in robot safety – ISO 10218: 2025."[1] It says ABB Robotics is "fully compliant" with that standard "From June 1."[1] The year is not in that sentence[1]. The upgrade it names is software, RobotWare 8.0, and it says no costly hardware changes are needed[1]. The feature line is "100+ new software safety features, such as monitored speed, SafeMove, normal stop, manual high-speed limits, safer mode transitions, state control, mechanical rigidity, and etc."[1] Quote the "and etc." It is on the page[1].

The German box says "Seit dem 1. Juni erfüllt ABB Robotics vollständig die Anforderungen der neuen Sicherheitsnorm ISO 10218:2025."[2] It names a software upgrade to RobotWare 8.0 and says costly hardware changes are not required[2]. It says "Über 100 neue softwarebasierte Sicherheitsfunktionen," over 100 new software-based safety functions[2]. The 1 June date in that sentence has no year[2].

Do not write 2025 or 2026 onto "June 1" or "1. Juni."[1][2] The standard number carries 2025[1][2]. The date does not[1][2]. Do not add "up to 100 configurations" to "100+ new software safety features" and call the sum a spec[1]. One is a configuration count on page 1[1]. The other is a feature count in the ISO box[1]. SafeMove appears in both conversations, which makes the mix easy[1]. It does not make them one number[1].

Page 1 also says the platform "complies with future safety standards."[1] Page 4 says it is fully compliant from June 1[1]. Those two sentences sit in the same PDF[1]. I am not going to decide which June they mean. The file does not say[1].

The English box says the ISO line "Applies to both collaborative and industrial robot applications."[1] That is a scope sentence for the safety claim[1]. It is not a C90XT support mark[1]. A safety standard that covers collaborative applications does not put a cobot dot in the C90XT row[1].

## Four option numbers have no mark

The family page says "All major communication protocols" are integrated in one platform, and that OmniCore "works with all major robotics communication protocols."[3] The sheets print an option list with a legend[1][2]. The English legend is "Available configurations."[1] The German legend is "Verfügbare Konfiguration."[2] A dot is a marked configuration[1][2]. An empty cell is not a lab test. It is an option number the sheet did not mark[1][2].

These four rows have no mark on any of the five controllers, on both sheets[1][2]:

| Option | Number | English marks | German marks |
| --- | --- | --- | --- |
| EtherCAT Master | 3075-1 | none | none |
| CIP Safety Scanner | 3026-1 | none | none |
| CC-Link IE Safety Master | 3074-1 | none | none |
| CC-Link IE Safety Device | 3074-2 | none | none |

DeviceNet, single channel, option 3029-1, is marked on C30, C90XT, V250XT, and V400XT, and blank on E10, on both sheets[1][2]. Do not write DeviceNet on an E10 line from these files[1][2].

The rows that are marked on all five, on both sheets, include PROFINET Controller 3020-1, PROFINET Device 3020-2, EtherNet/IP Scanner 3024-1, EtherNet/IP Adapter 3024-2, CC-Link IE FB Master 3066-1, CC-Link IE FB Device 3066-2, EtherCAT Device 3075-2, PROFIenergy 3021-1, PROFIsafe Controller 3023-1, PROFIsafe Device 3023-2, CIP Safety Adapter 3026-2, and EtherCAT FSoE Device 3076-2[1][2].

Read the pair, not the family name. EtherCAT Device 3075-2 is marked[1][2]. EtherCAT Master 3075-1 is not[1][2]. CIP Safety Adapter 3026-2 is marked[1][2]. CIP Safety Scanner 3026-1 is not[1][2]. CC-Link IE FB master and device are marked[1][2]. CC-Link IE Safety master and device are not[1][2]. "EtherCAT" on the brief, with no option number, is how a 3075-1 line gets written onto a sheet that never marked it[1][2].

## The pendant lines the sheets share

The controller fight is above. The pendant block is the part you can copy.

Both sheets print a FlexPendant with an 8-inch multi-touch display at 800 by 480, IP54, operating temperature 0°C to 45°C, storage −25°C to 55°C, humidity 5% to 95% non-condensing[1][2]. Cables are 3 m, 10 m, and 30 m, with extensions of 15 m, 22 m, and 30 m, and a maximum length of 52 m[1][2]. The enabling device is a three-position switch, and the pendant can come off during operation so more than one robot can share it[1][2].

The E-Device block, on both sheets, wants a Windows 10 or 11 64-bit tablet or PC, at least 8 GB of RAM, and a display of 1024 by 768 or higher[1][2]. The tablet is not included[1][2]. USB-C output is 5 V, 3 A, 15 W maximum[1][2]. E-Device cables are 5 m and 10 m[1][2]. Hot-swap of the E-Device is a separate note from hot-swap of the FlexPendant, and the English sheet says a custom device on different E-Devices does not need the hot-swap option[1].

Those numbers matched across the two files[1][2]. I would still quote the file in your hand. Agreement this morning is not a promise that the next revision keeps the 52 m maximum[1][2].

## What to write on the brief

Name the file first. English revision E of 9AKK108470A1173, or the German file with footer 10/26[1][2]. Then name the controller, then the robot column, then the option number. A family noun is not a column.

If the robot is a cobot and the controller on the draft is a C90XT, stop[1][2]. Move the robot to a row the matrix marks. CRB 15000 is marked on C30, not on C90XT or E10[1][2]. CRB 18x0 and CRB 19x0 are marked on E10 and on C30, not on C90XT[1][2]. IRB 14050 is marked on English C30, and the German sheet does not print that column[1][2].

If the robot is an IRB 77x0 and the controller is a V250XT, the matrix marks it[1][2]. Do not replace that column with IRB 6790[4][1]. Do not replace it with IRB 7720 unless you are quoting the ceiling sentence and you say so[1][2]. IRB 8700 is a V400XT mark, not a V250XT mark[1][2].

If the robot is a delta, name the model. IRB 390 is V250XT and V400XT[1][2]. IRB 360 and IRB 365 are C30[1][2]. None of the three is C90XT[1][2].

If the robot is a palletizer, name the model. IRB 760 is V400XT only, on these two matrices[1][2]. IRB 460 and IRB 660 are marked on both V boxes[1][2].

If the supply is single-phase, copy the voltage string from the language you are ordering in, including the 2-hot note when the English cell has it[1][2]. If the line is PickMaster Twin on an E10, the English cell says no and the German cell lists it[1][2]. If the option number is 3075-1, 3026-1, 3074-1, or 3074-2, neither sheet marks it on any of the five[1][2]. The family page's line about all major communication protocols does not fill those cells[3].

The matrix is the row that can go on the order. The sentence above it is a summary. On the C90XT, the summary names robots the marks do not[1][2].

## Sources

[1] https://search.abb.com/library/Download.aspx?DocumentID=9AKK108470A1173&LanguageCode=en&DocumentPartId=&Action=Launch — ABB OmniCore controller datasheet, English, document 9AKK108470A1173, filename revision E
[2] https://search.abb.com/library/Download.aspx?DocumentID=9AKK108470A1173&LanguageCode=de&DocumentPartId=&Action=Launch — ABB OmniCore controller datasheet, German, document 9AKK108470A1173, footer 10/26
[3] https://www.abb.com/global/en/areas/robotics/products/controllers/omnicore — ABB OmniCore controller family page
[4] https://www.abb.com/global/en/areas/robotics/products/controllers/omnicore/omnicore-v250xt — ABB OmniCore V250XT product page
[5] https://www.abb.com/global/en/areas/robotics/products/controllers/omnicore/omnicore-v400xt — ABB OmniCore V400XT product page
[6] https://www.abb.com/global/en/areas/robotics/products/controllers/omnicore/omnicore-c90xt — ABB OmniCore C90XT product page
[7] https://www.abb.com/global/en/areas/robotics/products/controllers/omnicore/omnicore-e10 — ABB OmniCore E10 product page
