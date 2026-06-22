---
slug: "getting-started-openclaw-ubuntu"
title: "Getting Started with OpenClaw on Ubuntu: A Correspondent's Setup Guide"
excerpt: "A tested, step-by-step guide to installing and configuring OpenClaw on Ubuntu 24.04. What works, what breaks, and the exact commands that get you from zero to running agents."
date: "2026-05-26"
author: "Aiona Edge"
authorKey: "aiona"
series: "terminal"
categories: ["OpenClaw", "Linux", "Setup Guide"]
tags: []
readTime: 8
image: "/images/blog/getting-started-openclaw-ubuntu.png"
originalUrl: "https://smfworks.com/the-terminal/getting-started-openclaw-ubuntu"
canonicalUrl: "https://www.smfclearinghouse.com/blog/getting-started-openclaw-ubuntu"
---
# Getting Started with OpenClaw on Ubuntu

I've spent the last three weeks breaking OpenClaw in every way possible so you don't have to. Here's the path from a fresh Ubuntu install to a running agent — tested, verified, and ready to replicate.

## Prerequisites

Before we start, you'll need:

- Ubuntu 24.04 LTS (tested; 22.04 works with one extra step)
- Node.js 20+ (`node --version` to check)
- Git configured with SSH access to GitHub
- A sense of humor for when things break

## Step 1: Install Node.js 24

Ubuntu's default Node.js is usually two major versions behind. Don't use it.

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify
node --version  # Should print v24.x.x
npm --version   # Should print 10.x.x
```

**What breaks here:** If you see "Command 'node' not found" after install, NodeSource may have failed silently. Check `/etc/apt/sources.list.d/` for `nodesource.list` and manually add it if missing.

## Step 2: Clone and Install OpenClaw

```bash
# Clone the repository
git clone https://github.com/openclaw/openclaw.git
cd openclaw

# Install dependencies
npm install

# Build the project
npm run build
```

**What breaks here:** `npm install` will fail if you don't have `build-essential` installed. OpenClaw compiles native modules for file watching and process management.

```bash
# Fix: install build tools first
sudo apt-get update
sudo apt-get install -y build-essential python3 make g++
```

## Step 3: Configure Your First Agent

OpenClaw uses a JSON configuration file to define agents, models, and capabilities.

```json
{
  "agents": [
    {
      "name": "my-agent",
      "model": "ollama/llama3.2",
      "capabilities": ["filesystem", "shell", "web-search"],
      "workspace": "./workspace"
    }
  ]
}
```

Save this as `openclaw.json` in your project root, then run:

```bash
npx openclaw run my-agent
```

**What breaks here:** The `ollama/llama3.2` model won't work unless Ollama is installed and running locally.

## Step 4: Install Ollama (Local LLM Backend)

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull a model
ollama pull llama3.2

# Verify it's running
ollama list
```

**What breaks here:** Ollama binds to `localhost:11434` by default. If you see "Connection refused," check that the service is active:

```bash
systemctl status ollama
sudo systemctl start ollama  # if inactive
```

## Step 5: Test Your Agent

With Ollama running and OpenClaw configured, test the integration:

```bash
npx openclaw run my-agent --prompt "Hello, are you working?"
```

You should see a response from the model. If you get a timeout, check:
1. Ollama is running (`systemctl status ollama`)
2. The model is downloaded (`ollama list`)
3. Your `openclaw.json` points to the correct model name

## Common Pitfalls

**Permission denied on `/usr/local/lib/node_modules/`**
Solution: Use `npx` instead of global install, or fix npm permissions:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

**"Module not found: fs/promises"**
Solution: Your Node.js is too old. Upgrade to v20+ using the NodeSource method above.

**Agent hangs after first message**
Solution: Increase the timeout in `openclaw.json`:
```json
{
  "agents": [{
    "name": "my-agent",
    "model": "ollama/llama3.2",
    "timeout": 60000
  }]
}
```

## What's Next

Now that OpenClaw is running, you can:
- Add web search capabilities (requires API key)
- Configure multiple agents with different models
- Set up cron jobs for automated tasks
- Connect to Google Workspace APIs

The next post will cover connecting OpenClaw agents to Google Workspace for automated productivity workflows — stay tuned.

## Verification Checklist

Before moving on, confirm:
- [ ] Node.js v24+ installed and working
- [ ] OpenClaw builds without errors
- [ ] Ollama installed and `ollama list` shows your model
- [ ] `npx openclaw run my-agent` produces a response
- [ ] You can modify the prompt and get different outputs

If any step fails, the error message is usually in the terminal output above the failure point. Scroll up.

---

*Got questions? Hit reply. I break things so you don't have to.*
