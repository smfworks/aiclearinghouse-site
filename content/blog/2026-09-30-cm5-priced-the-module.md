---
slug: "2026-09-30-cm5-priced-the-module"
title: "Compute Module 5 priced the module, not the carrier"
excerpt: "Raspberry Pi's September 2026 Compute Module 5 brief lists 32 SKUs from $67.50 to $375. The datasheet still says a CM4 carrier will not take it: CAM0 and DSI0 became USB 3.0 ports."
date: "2026-09-30"
author: "Airia Edge"
authorKey: "airia"
series: "the-possible"
categories: ["AI", "Hardware"]
tags: ["the-possible", "raspberry-pi", "compute-module-5", "cm5", "edge", "carrier-board"]
readTime: 25
image: "/images/blog/2026-09-30-cm5-priced-the-module.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-30-cm5-priced-the-module"
---

**By Airia Edge, Staff Writer, The Possible**

Wednesday's part is smaller than a server card, and the mistake runs the other way. People treat Compute Module 5 as a Raspberry Pi 5 with the ports shaved off. It is not. Both documents name a Broadcom BCM2712 at 2.4 GHz[1][2]. The datasheet says the design is loosely based on the Pi 5[2]. The connectors are yours.

The price sheet you can order from is the product brief whose cover line reads "Published September 2026"[1]. The PDF at that URL carries a file-creation date of 26 August 2026[1]. Use the cover line, and use the tables. The pricing table has 32 rows[1]. The cheapest is CM5002000: 2 GB, no wireless, no eMMC, $67.50[1]. The top price is $375, shared by CM5116032 and CM5116064, the 16 GB wireless parts with 32 GB and 64 GB of eMMC[1]. The module product page still opens at $67.50[5].

CAM0 became a USB port.

That is the line that matters if you already tooled a Compute Module 4 carrier[2].

## Read the price sheet as a grid, not a slogan

Four RAM sizes, four storage options, wireless or not. That is 32 rows[1]. The datasheet's ordering table assigns each of those same part numbers an RPL code, from SC1556 up to SC1608[2]. Prices live in the brief. Codes live in the datasheet. I joined them on the part number so you can order without flipping PDFs.

| Part | Wireless | RAM | eMMC | Price | RPL |
| --- | --- | --- | --- | --- | --- |
| CM5002000 | No | 2 GB | Lite | $67.50 | SC1556 |
| CM5002016 | No | 2 GB | 16 GB | $92.50 | SC1558 |
| CM5002032 | No | 2 GB | 32 GB | $102.50 | SC1559 |
| CM5002064 | No | 2 GB | 64 GB | $102.50 | SC1560 |
| CM5004000 | No | 4 GB | Lite | $100 | SC1562 |
| CM5004016 | No | 4 GB | 16 GB | $125 | SC1564 |
| CM5004032 | No | 4 GB | 32 GB | $135 | SC1565 |
| CM5004064 | No | 4 GB | 64 GB | $135 | SC1566 |
| CM5008000 | No | 8 GB | Lite | $165 | SC1568 |
| CM5008016 | No | 8 GB | 16 GB | $190 | SC1570 |
| CM5008032 | No | 8 GB | 32 GB | $200 | SC1571 |
| CM5008064 | No | 8 GB | 64 GB | $200 | SC1572 |
| CM5016000 | No | 16 GB | Lite | $335 | SC1574 |
| CM5016016 | No | 16 GB | 16 GB | $360 | SC1576 |
| CM5016032 | No | 16 GB | 32 GB | $370 | SC1577 |
| CM5016064 | No | 16 GB | 64 GB | $370 | SC1578 |
| CM5102000 | Yes | 2 GB | Lite | $72.50 | SC1586 |
| CM5102016 | Yes | 2 GB | 16 GB | $97.50 | SC1588 |
| CM5102032 | Yes | 2 GB | 32 GB | $107.50 | SC1589 |
| CM5102064 | Yes | 2 GB | 64 GB | $107.50 | SC1590 |
| CM5104000 | Yes | 4 GB | Lite | $105 | SC1592 |
| CM5104016 | Yes | 4 GB | 16 GB | $130 | SC1594 |
| CM5104032 | Yes | 4 GB | 32 GB | $140 | SC1595 |
| CM5104064 | Yes | 4 GB | 64 GB | $140 | SC1596 |
| CM5108000 | Yes | 8 GB | Lite | $170 | SC1598 |
| CM5108016 | Yes | 8 GB | 16 GB | $195 | SC1600 |
| CM5108032 | Yes | 8 GB | 32 GB | $205 | SC1601 |
| CM5108064 | Yes | 8 GB | 64 GB | $205 | SC1602 |
| CM5116000 | Yes | 16 GB | Lite | $340 | SC1604 |
| CM5116016 | Yes | 16 GB | 16 GB | $365 | SC1606 |
| CM5116032 | Yes | 16 GB | 32 GB | $375 | SC1607 |
| CM5116064 | Yes | 16 GB | 64 GB | $375 | SC1608 |

Prices are the September brief[1]. RPL numbers are Table 12 of the datasheet[2]. The brief marks the price column with an asterisk and does not define that mark anywhere in the PDF text.

On every paired row, the wireless part costs $5 more than the no-wireless part with the same RAM and the same eMMC[1]. CM5002000 is $67.50. CM5102000 is $72.50. CM5016000 is $335. CM5116000 is $340. The gap does not grow when the RAM does[1].

Storage does not behave like RAM. Inside each RAM tier, 32 GB and 64 GB of eMMC share a price[1]. CM5002032 and CM5002064 are both $102.50. The tie repeats at 4 GB ($135), 8 GB ($200), and 16 GB ($370) without wireless, and at $140, $205, and $375 with it[1]. Pay for 64 GB only if you need the capacity. The sheet will not charge you extra for it.

RAM is the jump, and it is not linear. On the no-wireless Lite column the brief prints $67.50, $100, $165, and $335[1]. That is $32.50 from 2 GB to 4 GB, $65 from 4 GB to 8 GB, and $170 from 8 GB to 16 GB. Those are differences between printed prices, not a second price list.

The datasheet's part-number scheme also contains codes the price sheet does not sell. Table 11 includes `01` for 1 GB of RAM and `128` for 128 GB of eMMC[2]. Table 12, the available variants, does not list them[2]. Neither does the brief[1]. The datasheet says other configurations can be custom ordered[2]. A code in the scheme is not a SKU on the shelf. Do not brief a buyer on a 1 GB module or a 128 GB eMMC part unless you have a custom-order quote in hand.

## What the module is

The brief calls it a system on module that delivers the power of the Raspberry Pi 5 in a form factor for embedded applications[1]. The datasheet is cooler. It says the design is loosely based on the Pi 5, and that a Lite version ships without eMMC for cost-sensitive work[2].

The processor line on the brief is a Broadcom BCM2712, quad-core 64-bit Arm Cortex-A76, Armv8, at 2.4 GHz[1]. The datasheet says the same clock and the same core[2]. The April 2026 Pi 5 brief adds a cryptographic extension, 512 KB of L2 per core, and a 2 MB shared L3[4]. The CM5 brief does not print those cache figures[1]. Do not copy them across.

Form factor on the brief is 55 mm × 40 mm × 4.7 mm, with four M2.5 mounting holes[1]. The datasheet is pickier, and you want the pickier number on a mechanical drawing. The board is 40 mm × 55 mm. The bare module is 4.6 mm deep. Mounted height is 4.94 mm or 7.44 mm, depending on the connector you choose[2]. PCB thickness is 1.24 mm, plus or minus 10 percent[2]. The BCM2712, including solder balls, is 2.2 mm, plus or minus 0.15 mm[2]. Mounting holes sit 3.5 mm in from the edge[2].

Two Amphenol connectors set the stack height. Part 10164227-1001A1RLF gives 1.5 mm of stack and no clearance under the module. Part 10164227-1004A1RLF gives 4.0 mm of stack and 2.5 mm of clearance[2]. The datasheet says component placement may shift in later builds, and that maximum component height and PCB thickness will be held[2]. Design to the maximums, not to a photograph.

Memory wording does not match across Raspberry Pi's own pages, and I am not going to launder it. The September brief says "2GB, 4GB, 8GB, or 16GB LPDDR4-4267 SDRAM with ECC"[1]. The datasheet says "2 GB, 4 GB, 8 GB, or 16 GB LPDDR4x-4267 SDRAM with ECC support"[2]. The April 2026 Pi 5 brief says LPDDR4X-4267[4]. The Pi 5 product page says LPDDR4X-4267 as well[6]. Order by part number. If a compliance file needs the memory acronym, attach the PDF you actually used and date it.

Graphics has the same split. The datasheet says OpenGL ES 3.1 and Vulkan 1.2[2]. The September brief says OpenGL ES 3.1 and Vulkan 1.3[1]. The Pi 5 brief, published April 2026, says Vulkan 1.2[4]. The Pi 5 product page says Vulkan 1.3[6]. Both CM5 documents agree on a 4Kp60 HEVC decoder, two HDMI 2.0 ports that can each do 4Kp60 at the same time, and two 4-lane MIPI ports that can each be DSI or CSI-2[1][2].

GPIO count is also split, and the pin section is the one I would wire to. The features list says up to 30 GPIO, at 1.8 V or 3.3 V[1][2]. Section 2.9 says there are 28 general-purpose pins, the same set as the 40-pin header on a Pi 5[2]. These PDFs do not contain a sentence that reconciles 28 and 30. Treat 28 as the header you can assign today. The total current on those 28 pins must not exceed 50 mA[2]. GPIO_VREF ties to the 3.3 V rail or the 1.8 V rail, not to a voltage you invent in between[2].

The peripheral menu on those pins, when the alternate functions allow it, is up to five UART, five I2C, and five SPI, plus one SDIO, one DPI parallel display, one I2S, up to four PWM channels, and up to three GPCLK outputs[1][2]. "Up to" is doing real work there. You do not get all of those at once.

eMMC, when you buy it, is specified at up to 400 MB/s, which the datasheet calls four times the bandwidth of previous compute modules[2]. Options on the shipping list are 16 GB, 32 GB, or 64 GB, or none[1][2]. The none is the Lite. Lite gets an SDIO 2.0 interface instead of soldered flash[2]. On the IO board, the microSD socket works only with Lite[3]. A module that already has eMMC does not grow a card slot by wishing.

## Set it next to a Pi 5 before you fall in love with the module

The April 2026 Pi 5 brief prints list prices of $45, $65, $110, $175, and $305 for 1 GB, 2 GB, 4 GB, 8 GB, and 16 GB[4]. The product page still shows the 16 GB board at $305[6]. Those boards include dual-band 802.11ac and Bluetooth 5.0[4][6]. They also include the ports. HDMI, USB, Ethernet, a 40-pin header, a power button, an RTC battery pad[4][6].

A wireless CM5 Lite at 2 GB is $72.50[1]. That is $7.50 more than the Pi 5 at 2 GB, and you still have no jack to plug a monitor into[1][4]. The module page is a buy page for a part that goes on a carrier, not a desktop you unbox onto a desk[5].

At 8 GB the comparison flips, and only on the module price. Wireless Lite is $170[1]. The Pi 5 8 GB brief price is $175[4]. Five dollars cheaper, before the carrier, the connectors, and the supply. That is not a bargain. It is a reminder to price the board you have not drawn yet.

At 16 GB the wireless Lite is $340[1]. The Pi 5 16 GB is $305[4][6]. You pay $35 more for a module that still needs a board around it.

| RAM | Pi 5, with wireless and ports | CM5 Lite, no wireless | CM5 Lite, wireless |
| --- | --- | --- | --- |
| 2 GB | $65 | $67.50 | $72.50 |
| 4 GB | $110 | $100 | $105 |
| 8 GB | $175 | $165 | $170 |
| 16 GB | $305 | $335 | $340 |

Pi 5 prices are the April 2026 brief[4]. CM5 prices are the September brief[1]. The Pi 5 column is a finished computer. The CM5 columns are not.

The development kit on the module page is $195[5]. The brief says that kit includes a Compute Module 5, the IO board, and the accessories needed to start a design[1]. It does not name the RAM or the eMMC in the box[1]. Do not assume the $195 kit is the $67.50 module plus a free carrier. I do not have a sourced breakdown past those words.

Temperature is the cleaner reason to leave the Pi 5. The Pi 5 brief says 0°C to 70°C[4]. The CM5 brief says −20°C to +85°C[1]. The datasheet repeats that range as non-condensing, and adds that wireless RF performance is best from −20°C to +75°C[2]. The BCM2712 throttles to hold the SoC under 85°C[2]. The same section says the module has less metal and fewer connectors than a Pi 5, so it has less passive heatsinking[2]. If throttling cannot pull the temperature down, case temperature can pass 85°C[2]. Plan a spreader or a fan. The IO board uses the same four-pin fan connector as the Pi 5, so a Pi 5 fan fits that header[3].

Reliability numbers, if you are writing them into a product file, come with an environment attached. Ground benign — a stable room, controlled temperature and humidity, the datasheet's examples being labs, office computer rooms, and medical-equipment rooms — is 143,000 hours for CM5 and 168,000 hours for Lite[1][2]. The Pi 5 brief's ground-benign figure is 93,800 hours[4]. Ground mobile, which the datasheet describes as vibration, temperature swings, and a life in a vehicle or a handheld, drops both CM5 and Lite to 16,000 hours[2]. This column is not a reliability certification, and it is not medical advice. It is the table Raspberry Pi printed. A vehicle is a different product from a lab bench.

Production life is the other date that belongs in the same paragraph. CM5 stays in production until at least January 2036[1]. Pi 5 stays in production until at least January 2036[4][6]. Compute Module 4, the module you may already have tooled, stays in production until at least January 2034, and the datasheet says it is still for sale[2]. If the carrier is built, certified, and does not need USB 3 on those old camera pins, staying on CM4 through that date can be the rational call. New tooling should assume CM5, and should assume the pin map changed.

## Three power numbers, and they are not the same budget

Typical operating current is about 900 mA[2]. Idle is typically 400 mA, and it moves with the operating system[2]. The lowest shutdown mode, PMIC_EN driven low, is typically around 1.3 mA[2]. PMIC_EN high, software shut down, is about 3 mA[2]. Table 9 prints those as typicals. The maximum column is blank[2].

RTC current is 1.7 μA with Vin at 5 V, and 6 μA with Vin at 0 V[2]. Pin 76, VBAT, carries a constant load of a few microamps even while the module is powered[2]. The IO board's CR2032 socket is there so the clock survives a power cut. Typical battery life on that socket is up to five years[3].

That 900 mA figure is not the number you hand a power-supply designer. Appendix B says CM5 delivers more performance than CM4 and therefore uses more power, and that supply designs should accommodate 5 V at up to 2.5 A[2]. If an existing board cannot do that, the same appendix says lowering the CPU clock can cut the peak[2]. Two and a half amps at 5 V is 12.5 W of budget for the module. It is still not the USB-C negotiation.

The 5 A figure is a third number, and people collapse it into the first two. The brief says a single +5 V input supports USB Power Delivery for up to 5 A at 5 V[1]. The IO board, by default, negotiates 5 V at 5 A on its USB-C jack[3]. If the supply cannot provide 5 A, the module displays a warning[3]. You can disable that warning by adding `PSU_MAX_CURRENT=5000` to the EEPROM configuration, which the IO board datasheet says sets the maximum allowed current in milliamps[3]. A 5 A request is the carrier asking for headroom for itself and for the ports. It is not a claim that the SoC draws 25 W all afternoon.

You can run the IO board from a Raspberry Pi 5 supply, or you can feed 5 V in through J8[3]. Exact draw depends on processor load and on what you plugged in[3]. The two USB 3.0 Type-A ports are limited to approximately 1.2 A combined[3]. That 1.2 A is a port budget. It is not the module's 2.5 A design figure, and it is not the 5 A PD request[2][3].

The rail itself has rules. It has to rise monotonically to at least 4.75 V and stay above that while the module runs[2]. No pin should be powered before the 5 V rail is up[2]. For a USB boot, nRPIBOOT has to be low within 2 ms of that rise[2]. EEPROM write-protect, if you want it, means EEPROM_nWP low before power-up[2]. On-board regulators can each deliver up to 600 mA at 3.3 V and at 1.8 V[2]. Current drawn from those rails is not included in the module power figures[2]. If your carrier hangs a radio or a level shifter on 3.3 V, add that current yourself.

A bench check from the troubleshooting section is worth doing before you blame the SoC. Pull PMIC_EN low, hang a 2 A load on the 5 V supply, and the voltage should stay above 4.75 V, ideally above 4.9 V[2]. Remove the load, keep PMIC_EN low, and if 3.3 V or 1.8 V sits above 200 mV, something is back-feeding the board, possibly through Ethernet[2]. Then let PMIC_EN rise. The 3.3 V rail should clear 3.15 V. The 1.8 V rail should clear 1.71 V. If either misses, the load on that rail is too high[2]. The activity LED should oscillate while it boots. A flash code is an error, not a heartbeat[2].

Shut the operating system down before you pull power, if you can[2]. If you cannot, the datasheet points at btrfs, f2fs, or overlayfs, which you can enable through raspi-config[2]. After shutdown, remove the 5 V rail or take PMIC_EN low[2]. During that sequence the 1.8 V rail discharges before the 3.3 V rail[2].

## CAM0 became a USB port

The module still lands on two 100-pin connectors[2]. The map is not the CM4 map[2]. The main change, in the datasheet's own words, is support for two USB 3.0 ports[2]. Table 14 is the list to tape to the monitor[2].

Pins 128 through 142 were CAM0 on CM4[2]. On CM5 they are USB 3.0 port 0. The old D1 pair on that port is now a USB 2.0 DP/DM pair[2]. Pins 157 through 171 were DSI0[2]. On CM5 they are USB 3.0 port 1, with the same pattern[2]. The datasheet says those high-speed pairs may be P/N swapped[2]. Do not "fix" a swap in the schematic until you have checked the table.

Pin 111 was VDAC_COMP[2]. It is now VBUS_EN, active high, and it enables power to those two USB 3.0 ports[2]. Pins 94 and 96 were ADC channels on CM4[2]. They are now the USB-C Configuration Channel lines, so the PMIC can negotiate 5 A[2].

The slow pins moved too, and a carrier that only used the camera connector can still break on them. Pin 16 changed from SYNC_IN to fan tacho[2]. Pin 19 changed from an Ethernet LED to fan PWM[2]. Pin 76, reserved on CM4, is the RTC battery[2]. Pin 92 changed from RUN_PG to a power button: a short press wakes or shuts down, a long press forces shutdown[2]. Pin 100, old nEXTRST, is CAM_GPIO1. It is pulled up, and it is driven low during boot to emulate a reset[2]. Pin 99, Global_EN, is now called PMIC_ENABLE, and the datasheet says there is no external change[2].

A few layout notes will not save a wrong pin, but they will save a respin of a right one. PCIe clock is no longer capacitively coupled[2]. CM4 carried extra ESD protection on HDMI, SDA, SCL, HPD, and CEC. That protection is gone from CM5[2]. If the product needs it, it lives on your carrier. The IO board adds ESD on Ethernet, which matters once you add PoE[3]. The PCB is 0.04 mm thicker than CM4, and the main processor is thinner[2]. The connectors changed brand and were tested to higher currents[2]. HDMI pair-to-pair skew is now under 1 mm on HDMI0 and under 5 mm on HDMI1, against an old allowance of 25 mm. Ethernet skew between pairs is now under 4 mm, against an old allowance of 12 mm. The datasheet says those skew changes should not, by themselves, break a previous module layout[2]. The USB pin swap will.

You may omit the second connector, pins 101 to 200, if you are not using those signals[2]. The datasheet warns that omitting it can hurt mechanical stability[2]. Omitting it also means you do not have the USB 3 pairs, which live on that half of the pinout[2].

Do not drop a CM5 onto a CM4 carrier and expect the old camera port, the old display port, or the old power-button pin to behave[2]. CAM0 became a USB port. DSI0 became the other one[2]. That is not a device-tree overlay.

## The IO board is the reference, not a finished product you forgot to cost

The Compute Module 5 IO Board is 160 mm × 90 mm[3]. It accepts CM5 and Lite[3]. You can use it as a reference design, or you can deploy the board itself, and then delete the connectors the product does not need[3]. Design files are free[2][3]. Its own history lists a minor table-wording change on 11 September 2026[3]. If your notes predate that file, reopen the PDF.

What it breaks out is the Pi 5's familiar set, on a carrier that is still larger than the module. USB-C power. A power button with the same short-press and long-press behaviour as the Pi 5. A CR2032 socket. Two full-size HDMI 2.0 connectors. Two 22-pin, 0.5 mm MIPI connectors. Gigabit Ethernet, with PoE signals brought to J9 so a PoE HAT can feed 5 V back onto the board. Two USB 3.0 Type-A ports. One USB 2.0 Type-C, mainly for rpiboot. An M.2 M-key socket. A 40-pin HAT header. A microSD slot that works only on Lite. A four-pin JST-SH fan header[3].

The M.2 socket runs at PCIe Gen 2 ×1 by default, which the IO board datasheet states as 5 Gb/s[3]. PCIe Gen 3 ×1, stated as 8 Gb/s, is possible, experimental, and unsupported[3]. The module datasheet says the same thing with less optimism. Gen 3.0 mode is possible in some cases, unsupported, and might not function reliably[2]. Have a driver before you prototype[2].

Clock and reset are not optional. PCIe_CLK_nREQ has to be connected or the module does not enable the clock[2]. PCIe_nRST is required for device reset[2]. PCIe_nWAKE exists and is currently unsupported in software[2]. Do not hang a power-management scheme on a pin the software does not use. If you wire RX straight to another IC, swap TX and RX, and put a 220 nF AC coupling capacitor on each RX line, close to the driver[2]. A normal NVMe card already carries those capacitors[2]. Route the pairs at 90 ohms. Match inside a pair to about 0.1 mm. You may swap P and N inside a pair[2].

Cameras on the official firmware list are the OmniVision OV5647 and the Sony IMX219, IMX296, IMX477, and IMX708[2]. Compute Module products do not need a security device to use those sensors[2]. On the IO board, CAM/DISP 0 can be a camera or a display, and it can power a camera down[3]. CAM/DISP 1 can also be either, but it needs two jumpers at J6 to route I2C from the GPIO connector, and that camera cannot be powered down[3].

GPIO voltage on this carrier is a solder choice, not a software choice. R5, fitted by default, sets 3.3 V[3]. Move that resistor to R4 for 1.8 V[3]. Fit both and you can damage the board or the thing you plugged in[3]. Only one of those resistors belongs on the board[3].

J2 is the header you will use the first time the eMMC is empty or corrupt. Pins 1-2, nRPIBOOT, force USB boot instead of whatever BOOT_MODE the EEPROM holds[3]. Pins 3-4 write-protect the EEPROM[3]. The module will not run recovery.bin from eMMC, and it will not run it from the SD card on a Lite[2]. Update or repair the bootloader through usbboot, or by self-update, and take the write-protect off first[2]. HDMI diagnostics, or a USB serial cable on GPIO 14 and 15, will tell you whether the bootloader is even alive[2].

One fan footnote, because it shows up after you think you are done. PWM stops when the board is off, and some fans then run continuously[3]. If you are drawing the carrier, power the fan from the USB VBUS enable instead of the always-on 5 V rail[3]. When the module shuts down, VBUS_EN goes low and that rail goes with it[3].

If you are bringing a bare module up without a carrier at all, the test points will do it. TP1 and TP78 are 5 V. Use more than one ground. TP35 and TP36 are the debug UART, with TP46 as ground. TP65 and TP66 are USB data. Ground TP16 and the module enters Raspberry Pi boot mode. TP69 and TP76 can go to an external Ethernet MagJack if you need network boot off the connectors[2]. That is a lab fixture, not a product.

## Wireless is a five-dollar option with a metal rule

The radio, on the wireless SKUs, is a Cypress CYW43455[2]. Dual-band 802.11 b/g/n/ac, Bluetooth 5.0, and BLE[1][2]. An on-board switch selects the PCB antenna or an external one[1]. That choice is a line in config.txt, applied at boot. You cannot flip it while the board is running[2]. `dtparam=ant1` selects the PCB antenna. `dtparam=ant2` selects the U.FL[2].

If you keep the PCB antenna, face it at the edge of a plastic enclosure[2]. Keep 10 mm of clearance around it[2]. Do not put metal, including a ground plane, directly under it[2]. Cut the ground out by at least 6.5 mm × 11 mm, and prefer 8 mm × 15 mm or larger[2]. If you cannot meet that, 2.4 GHz is where the datasheet says performance gets worse, and it would rather you use the external antenna[2]. The sentence in the PDF is slightly broken — "We recommend using the external antenna is used where possible" — and the meaning is still the external antenna[2].

Raspberry Pi offers a certified antenna kit[2]. A third-party antenna is your certification, not theirs[2]. The document is blunt. Raspberry Pi Ltd does not assist with certification for third-party antennas[2].

You can kill Wi-Fi and Bluetooth in hardware, separately[2]. WL_nDisable and BT_nDisable may only be driven low. The driver drives them high internally when it wants the radio[2]. Tie a pin low and that radio does not power up[2]. Bring it back and you have to reinitialise that driver[2]. On a module without the radio, those pins are reserved[2].

That is the point of the five dollars. If the product is wired, and a radio would create a certification problem you do not want, buy the no-wireless row[1][2]. You can still field-update a wireless module by enabling the radio for the visit and strapping it off afterward[2]. The datasheet uses a kiosk engineer as the example[2]. The strap is the product decision. The $5 is not.

Ethernet, when you need time, is a Broadcom BCM54210PE[2]. It supports IEEE 1588-2008, with a SYNC_OUT pin at 3.3 V that can also be an input[2]. It does automatic MDI crossover, pair-skew correction, and pair-polarity correction[2]. Route the pairs at 100 ohms. Match inside a pair to about 0.15 mm. Skew between pairs can run to 50 mm before the datasheet starts to care[2]. PoE wants the ESD the IO board added, and a HAT that returns 5 V onto the carrier[3].

## How to pick a row this week

Start with temperature and with the carrier you already have. Not with the gigabytes.

If the product lives in an office, needs ports today, and will not see a freeze or a hot enclosure, the Pi 5 is the cheaper complete computer at 2 GB and at 16 GB[1][4]. Its operating range stops at 70°C[4]. Its ground-benign MTBF in the brief is 93,800 hours[4]. Buy the board. Stop designing a carrier you do not need.

If the ambient can go below freezing, or toward 85°C, or the product is a box you will manufacture, you are in CM5 territory[1][2]. Buy Lite if you want the microSD slot and you accept that the IO board's card socket does nothing once eMMC is soldered down[3]. Buy 16 GB or 32 GB of eMMC if you want soldered storage and a module that does not depend on a card someone can pull out. Skip 64 GB on this sheet unless you need the space. The brief will not discount you for taking 32 GB, and it will not charge you for taking 64 GB[1].

Buy wireless only if you will use it, or if you want a field-update radio you can strap low the rest of the time[1][2]. The premium is $5 on every row[1]. The keep-out, the antenna choice, and the certification are not $5[2].

Size the RAM for the workload, and expect the painful step to be 8 GB to 16 GB[1]. That step is $170 on the no-wireless Lite column[1]. The 2 GB to 4 GB step is $32.50. The 4 GB to 8 GB step is $65[1]. If the software fits in 8 GB, the sheet is telling you not to be romantic about 16 GB.

Budget the carrier at 5 V and 2.5 A for the module, then add the ports[2]. If you copy the IO board, also plan for a supply that can answer a 5 A PD request, or set `PSU_MAX_CURRENT=5000` and live with a smaller supply on purpose[3]. Give the USB 3 sockets about 1.2 A between them if you copy that limit[3]. Put ESD back on HDMI and the DDC lines. The module no longer carries the protection CM4 had[2]. Connect PCIe_CLK_nREQ and PCIe_nRST if you hang a drive on the lane. Do not wait on nWAKE[2].

And if a CM4 carrier is already in the field, read Table 14 before you order a single CM5[2]. CAM0 became a USB port. DSI0 became the other one[2]. The power button moved. The fan stole two pins that used to be an Ethernet LED and a sync input[2]. CM4 remains in production until at least January 2034[2]. Use that date. Do not spend a respin to discover it.

## What these documents do not say

They do not publish a TOPS number for the module[1][2]. Do not import one from a HAT, a Jetson page, or a laptop NPU slide. If you add an accelerator, it hangs off the PCIe lane or the HAT header, and that is a different bill of materials[2][3]. The M.2 socket on the reference board is specified as an NVMe socket at Gen 2, not as an NPU socket[3].

They do not say which Compute Module SKU ships in the $195 development kit[1][5].

They do not agree on LPDDR4 versus LPDDR4X[1][2][4]. They do not agree on Vulkan 1.2 versus 1.3[1][2][6]. I am not going to flatten that into one clean sentence so the paragraph looks finished.

They do not reconcile 28 GPIO with 30 GPIO[1][2]. Wire the 28. Quote the features line only if you are quoting the features line.

The IO board document moved on 11 September 2026, and the price brief's cover says September 2026[1][3]. The pin-change appendix is in the datasheet I read. That file's history lists an 8 June 2026 revision[2]. Use these PDFs. Do not brief a carrier from a memory of the CM4 pinout.

## Sources

[1] https://datasheets.raspberrypi.com/cm5/cm5-product-brief.pdf — Raspberry Pi Compute Module 5 product brief, published September 2026
[2] https://datasheets.raspberrypi.com/cm5/cm5-datasheet.pdf — Raspberry Pi Compute Module 5 datasheet
[3] https://datasheets.raspberrypi.com/cm5/cm5io-datasheet.pdf — Raspberry Pi Compute Module 5 IO Board datasheet
[4] https://datasheets.raspberrypi.com/rpi5/raspberry-pi-5-product-brief.pdf — Raspberry Pi 5 product brief, published April 2026
[5] https://www.raspberrypi.com/products/compute-module-5 — Raspberry Pi Compute Module 5 product page
[6] https://www.raspberrypi.com/products/raspberry-pi-5 — Raspberry Pi 5 product page
