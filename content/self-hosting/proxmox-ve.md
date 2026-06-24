---
slug: proxmox-ve
title: "Proxmox VE Self-Hosting"
excerpt: "Run AI workloads and agent VMs on Proxmox VE. Combine bare-metal performance with VM isolation, GPU passthrough, and easy snapshots."
category: "Virtualization"
tags:
  - proxmox
  - virtualization
  - kvm
  - lxc
  - gpu-passthrough
  - self-hosting
order: 4
last_verified: "2026-06-24"
---

# Proxmox VE Self-Hosting

## Why Proxmox VE for AI

Proxmox VE is a Debian-based hypervisor that combines KVM virtual machines and LXC containers in a single web interface. For self-hosting AI, it offers the best of both worlds: bare-metal GPU access in VMs and lightweight containers for supporting services. You can snapshot before risky upgrades, isolate agents per VM, and pass through NVIDIA or AMD GPUs to inference workloads.

This guide covers a Proxmox VE setup tuned for AI agents and LLM inference.

---

## Recommended hardware

| Component | Recommendation |
|-----------|----------------|
| CPU | Modern x86_64 with VT-x/AMD-V and IOMMU support |
| RAM | 64GB minimum, 128GB+ for large models |
| GPU | NVIDIA RTX / datacenter card or AMD GPU with ROCm support |
| Boot disk | SSD or NVMe for OS and VM images |
| Storage | Separate fast pool for model weights and datasets |
| Network | Gigabit minimum, 10GbE preferred for multi-node |

---

## Base installation

1. Download the Proxmox VE ISO from https://www.proxmox.com.
2. Write it to a USB drive and boot the target machine.
3. Install to the boot disk, configuring:
   - Hostname and network
   - Root password
   - Email for alerts
4. After first boot, update the system:

```bash
apt update && apt dist-upgrade -y
```

5. Add the no-subscription repository if you do not have a support contract:

```bash
sed -i 's/^deb \(.*\) pve-enterprise$/deb \1 pve-no-subscription/' /etc/apt/sources.list.d/pve-enterprise.list
```

---

## GPU passthrough setup

GPU passthrough lets a VM control the GPU directly. This gives the best inference performance for NVIDIA cards.

### Enable IOMMU

Edit `/etc/default/grub` and add `intel_iommu=on iommu=pt` or `amd_iommu=on iommu=pt` to `GRUB_CMDLINE_LINUX_DEFAULT`, then:

```bash
update-grub
reboot
```

Verify IOMMU groups:

```bash
dmesg | grep -i iommu
```

### Blacklist host GPU drivers

For NVIDIA cards, prevent the host from binding the GPU:

```bash
echo "blacklist nouveau" >> /etc/modprobe.d/blacklist.conf
echo "blacklist nvidia" >> /etc/modprobe.d/blacklist.conf
update-initramfs -u
reboot
```

### Configure the VM

In the Proxmox web UI:

1. Set the VM machine type to `q35`.
2. Add the GPU as a PCI device, checking `All Functions`, `ROM-Bar`, and `PCI-Express`.
3. Install the NVIDIA drivers inside the VM.
4. Install Docker and the NVIDIA Container Toolkit as described in the [Linux self-hosting guide](/self-hosting/linux).

---

## Recommended VM layout

| VM / LXC | Purpose | Notes |
|----------|---------|-------|
| **AI gateway VM** | OpenClaw / Hermes gateway | Small GPU optional |
| **Inference VM** | Ollama or vLLM | GPU passthrough required |
| **Storage LXC** | Model cache, vector DB | Mount host storage pool |
| **Dev agent VM** | Cline, Aider, test workloads | Snapshot before experiments |
| **Monitoring LXC** | Prometheus, Grafana | Lightweight observability |

---

## Storage for model weights

Model files are large. Avoid storing them inside VM boot disks.

```bash
# Create a ZFS or directory-backed storage pool in Proxmox
# Mount it into the inference VM as a virtual disk or NFS share
mkdir -p /mnt/models
mount /dev/mapper/models--pool /mnt/models
```

For multi-VM access, export the model directory over NFS from a storage LXC:

```bash
apt install -y nfs-kernel-server
echo "/mnt/models 10.0.0.0/24(rw,sync,no_subtree_check)" >> /etc/exports
exportfs -a
```

---

## Networking basics

- Use a dedicated VLAN or bridge for AI workloads.
- Assign static IPs to inference and gateway VMs.
- Expose only the gateway and web interfaces; keep inference APIs internal.
- Use a reverse proxy VM or container for TLS termination.

---

## Backups and snapshots

Proxmox makes this easy. Before any major change:

```bash
# Web UI or CLI
qm snapshot <vmid> before-qwen-upgrade
```

Schedule backups of important VMs to a secondary storage pool or NFS share.

---

## Security basics

- Keep Proxmox and guest OSes updated.
- Use separate service accounts inside VMs.
- Limit SSH to a management VLAN or VPN.
- Run inference APIs on internal networks only.
- Enable firewall rules per VM in the Proxmox UI.

---

## Quick-start command summary

```bash
# Install updates
apt update && apt dist-upgrade -y

# Enable IOMMU, then reboot
# Configure VM with q35 + GPU PCI passthrough
# Inside the VM:
sudo apt update
sudo apt install -y nvidia-driver-550 nvidia-container-toolkit docker.io
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
curl -fsSL https://ollama.com/install.sh | sh
ollama pull qwen3.5:9b
```

**Related:**
- [Linux Self-Hosting](/self-hosting/linux)
- [NVIDIA-Based Self-Hosting](/self-hosting/nvidia-based)
- [Deployment Recipes](/deployment-recipes)
