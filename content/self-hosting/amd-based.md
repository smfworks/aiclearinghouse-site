---
{
  "slug": "amd-based",
  "title": "AMD-Based Self-Hosting",
  "excerpt": "ROCm-compatible AMD GPU builds for open-source inference and training stacks.",
  "category": "Hardware",
  "tags": ["AMD", "ROCm", "Radeon", "self-hosting", "GPU"]
}
---

## Minimal configuration

- GPU: AMD Radeon RX 6700 XT 12 GB
- RAM: 32 GB DDR4
- Storage: 512 GB NVMe SSD
- OS: Ubuntu 22.04 LTS with ROCm
- Use case: 7B models on ROCm-supported inference engines

## Recommended configuration

- GPU: AMD Radeon RX 7900 XTX 24 GB
- RAM: 64 GB DDR5
- Storage: 2 TB NVMe SSD
- OS: Ubuntu 24.04 LTS with ROCm 6.x
- Use case: 13B–30B models, local training with PyTorch/ROCm

## Premium configuration

- GPU: AMD Instinct MI210 or MI300X
- RAM: 128 GB ECC DDR5
- Storage: 4 TB NVMe SSD
- OS: Ubuntu 24.04 LTS or RHEL 9 with ROCm
- Use case: Production inference clusters, large-scale fine-tuning
