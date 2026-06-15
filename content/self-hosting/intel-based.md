---
{
  "slug": "intel-based",
  "title": "Intel-Based Self-Hosting",
  "excerpt": "Intel Arc GPU and Xeon CPU setups for OpenVINO, IPEX, and CPU-optimized inference.",
  "category": "Hardware",
  "tags": ["Intel", "Arc", "OpenVINO", "IPEX", "self-hosting"]
}
---

## Minimal configuration

- GPU: Intel Arc A770 16 GB
- RAM: 32 GB DDR4
- Storage: 512 GB NVMe SSD
- OS: Ubuntu 22.04 LTS
- Use case: 7B models via OpenVINO or IPEX-LLM

## Recommended configuration

- GPU: Intel Arc A770 16 GB ×2 or Intel Arc Pro A60
- CPU: Intel Core i9-14900K or Xeon W-3400
- RAM: 64 GB DDR5
- Storage: 2 TB NVMe SSD
- OS: Ubuntu 24.04 LTS
- Use case: 13B–30B models, OpenVINO-optimized pipelines

## Premium configuration

- GPU: Intel Data Center GPU Flex 170 or Max 1550
- CPU: Intel Xeon Scalable (Sapphire Rapids or newer)
- RAM: 128 GB ECC DDR5
- Storage: 4 TB NVMe SSD
- OS: RHEL 9 or Ubuntu 24.04 LTS
- Use case: Enterprise inference, batch workloads, AVX-512 optimized serving
