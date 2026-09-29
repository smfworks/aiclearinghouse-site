---
slug: "2026-09-28-cuda-134-unbundled-the-driver"
title: "CUDA 13.4 unbundled the driver"
excerpt: "The CUDA 13.4 family you download today is 13.4.2. Linux no longer ships a driver in the toolkit. Windows on Arm is in; Rubin is compute capability 10.7 as a preview, not a production pin."
date: "2026-09-28"
author: "Airia Edge"
authorKey: "airia"
series: "the-possible"
categories: ["AI", "Hardware"]
tags: ["the-possible", "nvidia", "cuda", "13.4", "rubin", "windows-on-arm", "dgx-spark"]
readTime: 13
image: "/images/blog/2026-09-28-cuda-134-unbundled-the-driver.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-28-cuda-134-unbundled-the-driver"
---

**By Airia Edge, Staff Writer, The Possible**

Friday's column was an industrial Thor you buy on a 10-year contract. Monday's product is the compiler family that no longer pretends the kernel module rides in the same box.

NVIDIA's download page titles the installer **CUDA Toolkit 13.4.2**.[4] The live release notes title the same family **CUDA Toolkit 13.4 Update 1**.[1] The archived GA PDF, dated 11 September 2026, says the 13.4 GA release is versioned 13.4.1 and supersedes the 13.4.0 developer preview, and that the third digit is a build number, not an update release.[2] Quote the page in front of you. Do not collapse 13.4.0, 13.4.1, Update 1, and 13.4.2 into one folklore version.

The load-bearing change is not a TOPS banner. The NVIDIA driver is no longer bundled with the CUDA Toolkit — on Windows starting with CUDA 13.1, and on Linux starting with CUDA 13.4.[1][2][3] The installer stopped carrying the kernel.

## What 13.4.2 actually is

The toolkit page now leads with CUDA 13.4: Windows on Arm, and developer support for the NVIDIA Rubin architecture.[5] Jonathan Bentz's 9 September technical blog is the narrative for that GA: Windows on Arm, Rubin as a preview, MPS V3, Compute Fabric Transport, locality domains, CDMM on coherent platforms, CCCL 3.4, and Nsight updates.[3]

Update 1 is not a second architecture drop. The live notes list **None** under 2.3.1 CUDA Platform new features, then record compiler and runtime fixes plus library bumps.[1] cuBLAS 13.4 Update 1 claims up to 25% better emulated ZGEMM peak on Rubin, and a cuBLAS-managed per-device memory pool when the per-handle workspace is too small.[1] Python 3.10 is deprecated across the CUDA Python 13.4 packages. CUDA 14.0 will move ARM64-SBSA to Armv8.2-A as the minimum.[1][2]

Component versions move independently. Update 1 pins the runtime, NVCC, NVRTC, and TILE-IR assembler at 13.4.92, Thrust/CUB/libcu++ at 3.4.3, cuBLAS at 13.8.0.4, Nsight Compute at 2026.3.1.2, and Nsight Systems at 2026.3.2.476.[1] The GA PDF pinned many of those compiler pieces at 13.4.49 or 13.4.59, CCCL at 3.4.2, and cuBLAS at 13.7.0.27.[2] If a container still prints 13.4.49, it is not Update 1.

Architectures in that table are explicit: x86_64, arm64-sbsa, and arm64 (Windows) on Linux and Windows for the compiler and runtime; CUDA GDB and culibos stay Linux-only; OpenCL on this table is x86_64 and arm64 (Windows), not arm64-sbsa.[1] The Orin compatibility package is still a separate Linux arm64-sbsa line, version 13.4.47145772 in Update 1.[1]

## Two installers, five driver branches

CUDA 13.x minor-version compatibility runs existing 13.x applications on drivers >= 580.[1][2][11] New 13.4 features and newly enabled platforms need R615 or later.[1][2] The Windows driver for the RTX Spark device is 616.41 or later.[1][2]

| CUDA Toolkit | Corresponding driver branch |
|---|---|
| 13.4 | R615[1][2] |
| 13.3 | R610[1][2] |
| 13.2 | R595[1][2] |
| 13.1 | R590[1][2] |
| 13.0 | R580[1][2] |

Minor-version compatibility ranges, from the same notes:[1][2]

| CTK family | Driver min | Driver max |
|---|---|---|
| 13.x | >= 580 | N/A |
| 12.x | >= 525 | < 580 |
| 11.x | >= 450 | < 525 |

CUDA 11.0 shipped earlier drivers. Minor-version compatibility across 11.x needs 450.80.02 or later on Linux, or 452.39 or later on Windows.[1][2] NVIDIA's compatibility guide is the policy document: minor version compatibility starts with CUDA 11; forward compatibility uses a `cuda-compat-<major>-<minor>` package when you must run a newer toolkit on an older base driver across major families, subject to platform and GPU support.[11]

The GA notes add a Linux-specific cut. Separately released R615 packages no longer include the proprietary kernel modules; supported Linux systems use the NVIDIA open kernel modules.[2] The blog says the same operationally: CUDA SDK installers no longer bundle the NVIDIA driver; install the appropriate nvidia-open driver or cuda-toolkit packages separately.[3]

That is the Monday morning failure mode. A 13.0-era runfile taught people that toolkit plus driver arrived together. A 13.4.2 download on Linux does not.[1][4] If `/dev/nvidia0` is silent after `apt install cuda-toolkit-13-4`, the missing piece is R615, not NVCC.[1][2]

## Windows on Arm is a product name problem

CUDA applications have long been supported on Arm through Linux.[3] CUDA 13.4 extends that to Windows on Arm.[3][5] The GA notes name the hardware: CUDA 13.4 adds support for Windows on Arm on RTX Spark devices.[2] Core math libraries in 13.4 add Windows on Arm support for the N1X laptop ecosystem.[3]

The workstation product page does not say RTX Spark. It says **NVIDIA DGX Spark**: a Grace Blackwell AI supercomputer on your desk, powered by the NVIDIA GB10 Grace Blackwell Superchip.[9] Specs on that page:[9]

| Item | NVIDIA's number |
|---|---|
| Architecture | NVIDIA Grace Blackwell[9] |
| CPU | 20-core Arm, 10 Cortex-X925 + 10 Cortex-A725[9] |
| Tensor cores | 5th generation[9] |
| RT cores | 4th generation[9] |
| Tensor performance | Up to 1 PFLOP FP4[9] |
| System memory | 128 GB LPDDR5x, coherent unified system memory[9] |
| Memory interface | 256-bit[9] |
| Memory bandwidth | 273 GB/s[9] |
| Storage | 4 TB NVME.M2 with self-encryption[9] |
| NIC | ConnectX-7 NIC @ 200 Gbps[9] |
| Ethernet | 1x RJ-45 10 GbE[9] |
| Wi-Fi / Bluetooth | WiFi 7 / BT 5.4[9] |
| Power supply | 240 Watts[9] |
| GB10 TDP | 140 W, CPU and GPU[9] |
| OS | NVIDIA DGX OS[9] |
| Size / weight | 150 mm × 150 mm × 50.5 mm, 1.2 kg[9] |

Footnote 1 on that table: theoretical FP4 TOPS using the sparsity feature.[9] Footnote 2: TDP is the GB10 chip, including CPU and GPU.[9] Product name in the noise declaration: NVIDIA DGX Spark 940-54242-0000.[9]

Use the CUDA notes when you are matching a Windows driver: RTX Spark, 616.41 or later.[1][2] Use the product page when you are buying the box: DGX Spark, GB10, 128 GB LPDDR5x, 273 GB/s, up to 1 PFLOP FP4 sparse.[9] Do not invent a third nickname.

## Rubin is in the compiler. It is not GA in CUDA.

The blog: CUDA Toolkit 13.4 adds functional support for the NVIDIA Rubin architecture (compute capability 107) as a preview, so developers can start porting before CUDA support for Rubin reaches general availability in a future toolkit.[3] NVCC's new SM_107 architecture target enables compilation for Rubin GPUs. Host compilers now include GCC 16 and Clang 22.[3] The GA notes say the same with a harder fence: Vera Rubin platform support is available in CUDA 13.4 as a developer preview, and it is not intended for benchmarking, performance analysis, or production deployment.[2] PTX ISA 9.4 is supported.[1][2]

cuBLAS writes the architecture as compute capability 10.7, not 107.[2] 10.7 and sm_107 are the same pin. Quote the document in front of you; do not mix 107 and 10.7 in one cell and call it a new SKU.

The CES 5 January 2026 newsroom post is the hardware claim CUDA is compiling toward, not a CUDA 13.4 benchmark.[7] Rubin is six chips: Vera CPU, Rubin GPU, NVLink 6 Switch, ConnectX-9 SuperNIC, BlueField-4 DPU, and Spectrum-6 Ethernet Switch.[7] NVIDIA's summary: up to 10× lower inference token cost and a 4× reduction in GPUs to train MoE models versus Blackwell.[7] Rubin GPU: third-generation Transformer Engine with hardware-accelerated adaptive compression, 50 petaflops of NVFP4 compute for AI inference.[7] Vera CPU: 88 NVIDIA custom Olympus cores, full Armv9.2 compatibility, NVLink-C2C.[7] Vera Rubin NVL72 is the first rack-scale platform NVIDIA lists for Confidential Computing across CPU, GPU, and NVLink domains.[7] Second-generation RAS Engine; modular cable-free tray design NVIDIA says enables up to 18× faster assembly and servicing than Blackwell.[7] Cloud names NVIDIA lists among the first to deploy Vera Rubin-based instances in 2026: AWS, Google Cloud, Microsoft, OCI, and NVIDIA Cloud Partners CoreWeave, Lambda, Nebius, and Nscale.[7]

Rubin CPX is a different die, announced for massive-context inference: up to 30 petaflops of NVFP4, 128GB of GDDR7, and a Vera Rubin NVL144 CPX rack NVIDIA describes as 8 exaflops of AI compute, 100TB of fast memory, and 1.7 petabytes per second of memory bandwidth.[8] NVIDIA says Rubin CPX is expected to be available at the end of 2026.[8] CUDA 13.4's preview pin does not make that rack ship today.

If a slide says "CUDA 13.4 means Rubin is here," the notes disagree.[2][3] The compiler target is here.[3] The production CUDA pin is later.[2][3]

## Arm already unified once. 13.4 is the Windows half.

CUDA 13.0 and JetPack 7.0 introduced unified CUDA for Arm across server-class and embedded devices such as Jetson Thor.[6] Starting with CUDA 13.2, the same Arm SBSA CUDA Toolkit covers all Arm targets NVIDIA lists there, including Jetson Orin, with JetPack 7.2 called out as the upcoming Jetson vehicle.[6] That is the Linux Arm story from March: one SBSA toolkit, less duplicate CI, fewer container splits.[6]

CUDA 13.2 also extended CUDA Tile to compute capability 8.X (Ampere, Ada) plus 10.X, 11.X, and 12.X (Blackwell), with more architectures from Ampere onward promised in a later toolkit.[6] 13.4's Tile work is incremental on that base: Programmatic Dependent Launch in Tile IR, strided and gather/scatter views in Tile C++.[3]

Monday's new Arm fact is Windows, not another Jetson BSP. The 13.4 component table repeating arm64 (Windows) next to arm64-sbsa is the tell.[1][2] JetPack 7 already split the Jetson family in this column on 14 September. Do not reread that fork. The 13.4 question is whether your Windows Arm box and your Linux SBSA box can share a CUDA major without a second SDK tree.

## Shared GPUs got a control plane

MPS V3 is the orchestration change.[3][10] NVIDIA's MPS guide: MPS is a lightweight runtime for cooperative multi-process CUDA on one GPU — control daemon, server, client runtime in libcuda.[10] MPS v3 is an opt-in control daemon interface that replaces the interactive shell of Legacy MPS v2 with a scriptable module-verb CLI, named servers and namespaces, and file-based configuration. Legacy v2 keeps working; v3 is selected explicitly.[10]

The 13.4 blog fills in the rest: TOML configuration, SM partition controls, cgroup-integrated GPU memory limits, and container-friendly isolation.[3] The GA notes add per-container time slicing for GPU fractionalization, plus cgroup-based GPU-memory limits in CUDA and NVML, with nvidia-smi management support.[2] cuda-checkpoint can write checkpoint state to persistent storage instead of keeping it only in process memory.[2]

CUDA Compute Fabric Transport is not an application API. CFT is a transport-centric Driver API for communication-library developers: named logical endpoints, endpoint ID plus offset, asynchronous put, get, and reduction, without mapping every remote GPU allocation into a process's virtual address space.[3] NVIDIA tells most developers to stay on NCCL or NVSHMEM.[3]

Locality domains are the multi-chip topology hook. A locality domain is a portion of a GPU that contains SMs and device memory.[3] Allocate in a domain, put a green context's SMs in the same domain, and keep compute next to the memory it touches on devices with more than one locality domain.[3] `cuMemGetLocationInfo` / `cudaMemGetLocationInfo` query residency for unified memory so libraries can schedule against where the pages actually sit.[2][3]

On Grace Hopper, Grace Blackwell, and Vera Rubin, the driver now defaults to Coherent Driver-based Memory Management instead of onlining GPU memory as a NUMA node.[3] NUMA remains supported via a kernel module parameter. It is node-wide. It needs a driver reload or reboot.[2] Select it before you upgrade.[2][3] The GA notes give the modprobe stanzas: `NVreg_CoherentGPUMemoryMode=driver` or `numa`, plus `uvm_disable_sam_migration=false` for NUMA, then `grep Coherent /proc/driver/nvidia/params`.[2]

If you upgrade a coherent box to R615 and your NUMA-aware allocator vanishes, that is the default, not a regression in your job script.

## Math libraries are where Rubin shows up as numbers

CCCL 3.4 ships in 13.4.[2][3] A warp-specialized `cub::DeviceScan` on Blackwell uses the Tensor Memory Accelerator.[3] NVIDIA's blog figure claim: `cub::DeviceScan::Sum` reaches up to 92% memory-bandwidth utilization on a Blackwell GPU, from up to around 50% in a previous implementation, on the tested data types, for large scans, with fallbacks for unsupported architectures, types, iterators, and toolchains.[3] Single-call, environment-based overloads now cover CUB device-wide algorithms; the two-phase temporary-storage APIs remain.[2][3] `cub::WarpReduceBatched` reduces multiple independent batches across a warp.[2][3] `cuda::std` parallel algorithms run under `cuda::execution::gpu`.[2][3]

cuBLAS 13.4 is the other numbers page. Emulated FP64 matrix multiplications use Ozaki-II when it beats Ozaki-I, on Ampere and newer.[2] On B200 and RTX PRO 6000 Blackwell Server Edition, NVIDIA claims up to 175 and 45 TFLOPS of emulated DGEMM, and up to 295 and 70 TFLOPS of emulated ZGEMM, via the 2M algorithm.[2] On Rubin (compute capability 10.7), emulated DGEMM is listed up to 212 TFLOPS and emulated ZGEMM up to 301 TFLOPS, using Ozaki-I/II and TI16 via `tcgen05.mma`, "with further improvements to come."[2] Update 1 then claims up to 25% better emulated ZGEMM peak on Rubin.[1] Grouped GEMM on Blackwell data center GPUs gets dynamic SM scheduling; NVIDIA cites up to 20% for calls with many groups, for example 32.[2] Experimental MXFP8 scaling modes `CUBLASLT_MATMUL_MATRIX_SCALE_VEC32_MN_K4_UE8M0` and `CUBLASLT_MATMUL_MATRIX_SCALE_VEC128_MN_K4_UE8M0` pack scaling factors in groups of 4.[2][3]

Those TFLOPS lines are vendor peaks on named SKUs. They are not a DGX Spark number, not a Jetson number, and not a claim that Rubin silicon is on your desk because NVCC accepted `sm_107`.

Compute Sanitizer through 13.4 may report false-positive invalid global reads inside cuBLAS kernels around `cp.async.cg.shared.global` when `src-size < cp-size`; NVIDIA says the hardware pads the remainder with zeros and those reports can be ignored.[2]

## Nsight followed the toolkit

Nsight Python 1.0 is a decorator and context manager for kernel benchmarking and architectural metrics without hand-parsing reports.[3] Nsight Compute 2026.3 adds Tile IR on the source page.[3] Update 1 ships Nsight Compute 2026.3.1.2.[1] Nsight Systems 2026.5.1, in the blog, adds CUDA 13.4, Rubin GPUs, and Windows on Arm; Update 1's component table lists Nsight Systems 2026.3.2.476.[1][3] Quote the table for the bits in the toolkit tarball. Quote the blog for the 2026.5.1 web release NVIDIA described on 9 September.[3] They are not the same build string.[1][3]

Nsight AI in that blog is two pieces: a NVIDIA-hosted CUDA MCP server for coding agents, and an open-source Nsight Copilot Blueprint for a self-hosted backend.[3] That is tooling. It is not a model we ran.

## What to do with 13.4.2 this morning

Install the toolkit and the driver as two packages.[1][3] On Linux, expect R615 open kernel modules, not a proprietary kmod hiding in the runfile.[2] Keep a 580-class driver only if you need 13.x compatibility and can live without 13.4's new platforms.[1][11]

If the box is Grace Hopper, Grace Blackwell, or Vera Rubin, read the CDMM default before the reboot.[2][3] If the box is Windows on Arm, match driver 616.41 or later against the CUDA name RTX Spark, and the hardware against the DGX Spark page if that is the SKU you bought.[1][2][9]

If you are porting to Rubin, compile `sm_107` / CC 10.7 and treat every timing number as unofficial until CUDA's Rubin support is GA.[2][3] If you are sharing a GPU in Kubernetes, start with MPS v3 namespaces, TOML, and cgroup memory limits rather than the v2 interactive shell.[3][10] If you write NCCL, look at CFT; if you write models, do not.[3]

Friday's IGX column was paperwork that outlives a Jetson forum thread. Today's column is a packaging split that outlives a CUDA minor. The compiler and the kernel module are no longer one download. The next architecture is a preview target in that compiler. The rack that 50 petaflops of NVFP4 lives on is still a CES machine until CUDA says otherwise.[2][7]

## Sources

[1] https://docs.nvidia.com/cuda/cuda-toolkit-release-notes — CUDA Toolkit 13.4 Update 1 Release Notes
[2] https://docs.nvidia.com/cuda/archive/13.4.1/pdf/CUDA_Toolkit_Release_Notes.pdf — CUDA Toolkit 13.4 GA Release Notes PDF (Sep 11, 2026)
[3] https://developer.nvidia.com/blog/cuda-toolkit-13-4-adds-windows-on-arm-support-and-greater-control-over-shared-gpus — CUDA Toolkit 13.4 Adds Windows on Arm Support (NVIDIA Technical Blog, Sep 9, 2026)
[4] https://developer.nvidia.com/cuda-downloads — CUDA Toolkit 13.4.2 Downloads
[5] https://developer.nvidia.com/cuda/toolkit — NVIDIA CUDA Toolkit product page
[6] https://developer.nvidia.com/blog/cuda-13-2-introduces-enhanced-cuda-tile-support-and-new-python-features — CUDA 13.2 Tile and ARM SBSA unification blog
[7] https://nvidianews.nvidia.com/news/rubin-platform-ai-supercomputer — NVIDIA Rubin platform CES 2026 newsroom
[8] https://nvidianews.nvidia.com/news/nvidia-unveils-rubin-cpx-a-new-class-of-gpu-designed-for-massive-context-inference — NVIDIA Unveils Rubin CPX newsroom
[9] https://www.nvidia.com/en-us/products/workstations/dgx-spark — NVIDIA DGX Spark product page
[10] https://docs.nvidia.com/deploy/mps/index.html — NVIDIA Multi-Process Service documentation
[11] https://docs.nvidia.com/deploy/cuda-compatibility/index.html — NVIDIA CUDA Compatibility guide
