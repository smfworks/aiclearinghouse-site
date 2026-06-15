---
slug: setting-up-hermes-gateway
title: "Setting Up a Hermes Agent Gateway: Messaging, Memory, and Multi-Platform Deployment"
excerpt: "Connect Hermes Agent to Telegram, Discord, Slack, WhatsApp, and Email. A complete setup guide with platform-specific configurations, memory tuning, and security hardening."
category: Guides
tags:
  - hermes
  - gateway
  - telegram
  - discord
  - slack
  - multi-platform
order: 6
last_verified: 2026-06-15
---

# Setting Up a Hermes Agent Gateway: Messaging, Memory, and Multi-Platform Deployment

## What a Hermes gateway gives you

Hermes Agent is powerful on its own, but it lives in a terminal by default. A gateway extends it into the messaging platforms you already use — Telegram, Discord, Slack, WhatsApp, Signal, Email — so your agent follows you everywhere.

**What you will build:**
- One agent process serving multiple platforms simultaneously
- Persistent memory across conversations
- Platform-specific response formatting
- Secure message routing and permission controls

---

## Architecture overview

```
┌─────────────────────────────────────┐
│         Hermes Agent Core           │
│  (Reasoning, memory, skills, tools)  │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       │   Gateway     │
       │  (Router +   │
       │   Formatter) │
       └───┬───┬───┬───┘
           │   │   │
      ┌────┘   │   └────┐
      ▼        ▼        ▼
   Telegram  Discord   Slack
   WhatsApp   Email    Signal
```

**Key insight:** One agent, many faces. The same reasoning core handles requests from all platforms, but responses are formatted for each platform's conventions.

---

## Prerequisites

Before setting up the gateway:

1. **Hermes Agent installed and running.** Follow the [Getting Started with Hermes Agent](/getting-started/hermes-agent) guide.
2. **A persistent host.** The gateway must run 24/7. Options:
   - Home server or Raspberry Pi
   - VPS (DigitalOcean, Linode, Hetzner — $5–$10/month)
   - Docker container on existing infrastructure
3. **Platform accounts.** Telegram bot, Discord bot, Slack app, etc.
4. **Optional but recommended:**
   - Reverse proxy (Nginx or Traefik) for SSL
   - Domain name for webhook endpoints
   - Monitoring (Uptime Kuma, Healthchecks.io)

---

## Step 1: Configure the gateway core

Hermes uses a `gateway.yaml` configuration file. Create it in your workspace:

```yaml
# ~/.hermes/gateway.yaml
gateway:
  # Core settings
  host: 0.0.0.0
  port: 8080
  
  # Memory persistence
  memory:
    enabled: true
    backend: sqlite  # or postgres, redis
    path: ~/.hermes/memory.db
    session_ttl: 30d  # Keep sessions for 30 days
    
  # Platform connections
  platforms:
    telegram:
      enabled: true
      bot_token: ${TELEGRAM_BOT_TOKEN}
      webhook_url: https://hermes.yourdomain.com/webhook/telegram
      allowed_chats: []  # Empty = all chats allowed
      
    discord:
      enabled: true
      bot_token: ${DISCORD_BOT_TOKEN}
      allowed_guilds: []  # Empty = all guilds allowed
      allowed_channels: []  # Empty = all channels allowed
      
    slack:
      enabled: true
      app_token: ${SLACK_APP_TOKEN}
      bot_token: ${SLACK_BOT_TOKEN}
      signing_secret: ${SLACK_SIGNING_SECRET}
      allowed_workspaces: []  # Empty = all workspaces allowed
      
    whatsapp:
      enabled: true
      session_name: hermes-whatsapp
      # WhatsApp requires QR code scan on first run
      
    email:
      enabled: true
      imap_server: imap.gmail.com
      imap_port: 993
      username: ${EMAIL_USERNAME}
      password: ${EMAIL_APP_PASSWORD}
      poll_interval: 60  # seconds
      allowed_senders: []  # Empty = all senders allowed
      
  # Security
  security:
    require_approval_for:
      - file_write
      - api_call
      - email_send
    allowed_file_patterns:
      - "*.md"
      - "*.txt"
      - "*.json"
    blocked_patterns:
      - "*.env"
      - "*secret*"
      - "*password*"
      
  # Response formatting
  formatting:
    telegram:
      max_length: 4096
      use_markdown: true
      use_html: false
      
    discord:
      max_length: 2000
      use_markdown: true
      split_long_messages: true
      
    slack:
      max_length: 4000
      use_blocks: true
      thread_responses: true
      
    email:
      max_length: 50000
      use_html: true
      include_summary: true
```

---

## Step 2: Platform-specific setup

### Telegram

**Create a bot:**
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` and follow prompts
3. Copy the bot token (looks like `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

**Set environment variable:**
```bash
export TELEGRAM_BOT_TOKEN="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
```

**Configure webhook (recommended for production):**
```bash
# Set webhook with BotFather or via API
curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  -d "url=https://hermes.yourdomain.com/webhook/telegram"
```

**Test:**
```bash
# Start Hermes gateway
hermes gateway start

# In Telegram, message your bot
# You should see a response within 5 seconds
```

### Discord

**Create a bot:**
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create New Application → Bot → Add Bot
3. Copy the bot token
4. Enable "Message Content Intent" under Privileged Gateway Intents

**Get bot token:**
```bash
export DISCORD_BOT_TOKEN="YOUR_DISCORD_BOT_TOKEN"
```

**Add bot to server:**
1. OAuth2 → URL Generator
2. Scopes: `bot`
3. Bot permissions: `Send Messages`, `Read Message History`, `Embed Links`
4. Copy URL and visit it in browser
5. Select server and authorize

**Test:**
```bash
hermes gateway start
# In Discord, @mention your bot or send a DM
```

### Slack

**Create a Slack app:**
1. Go to [Slack API](https://api.slack.com/apps)
2. Create New App → From scratch
3. Add permissions:
   - `app_mentions:read`
   - `channels:history`
   - `chat:write`
   - `im:history`
   - `mpim:history`
4. Install to workspace
5. Copy Bot User OAuth Token and Signing Secret

**Set environment variables:**
```bash
export SLACK_BOT_TOKEN="xoxb-your-bot-token"
export SLACK_SIGNING_SECRET="your-signing-secret"
export SLACK_APP_TOKEN="xapp-your-app-token"
```

**Enable Socket Mode (for development):**
1. Go to Socket Mode in Slack app settings
2. Enable Socket Mode
3. Generate app-level token with `connections:write`
4. Copy App Token (starts with `xapp-`)

**Test:**
```bash
hermes gateway start
# In Slack, @mention your bot in any channel
```

### WhatsApp

**Prerequisites:**
- A phone number not currently on WhatsApp (or willing to switch)
- Hermes installed with WhatsApp bridge support

**Setup:**
```bash
# Install WhatsApp bridge dependencies
pip install hermes-whatsapp

# Start WhatsApp authentication
hermes gateway whatsapp auth

# Scan QR code with WhatsApp mobile app
# (Settings → Linked Devices → Link a Device)
```

**Important:** WhatsApp bridges are unofficial and may break with WhatsApp updates. Use Telegram or Discord for critical workflows.

### Email

**Setup:**
```bash
# Generate app password (not your main password!)
# Gmail: https://myaccount.google.com/apppasswords
export EMAIL_USERNAME="you@gmail.com"
export EMAIL_APP_PASSWORD="abcd efgh ijkl mnop"
```

**Configure IMAP:**
```yaml
email:
  enabled: true
  imap_server: imap.gmail.com
  imap_port: 993
  username: ${EMAIL_USERNAME}
  password: ${EMAIL_APP_PASSWORD}
  poll_interval: 60
  allowed_senders:
    - "team@yourcompany.com"
    - "alerts@yourcompany.com"
  subject_filters:
    - "hermes:"
    - "[agent]"
```

**Security note:** Email is the least secure channel. Restrict allowed senders strictly and require approval for all actions.

---

## Step 3: Memory configuration

Hermes has three memory layers. Configure them for your use case.

### Layer 1: Session memory (in-context)

What the agent remembers within a single conversation thread.

```yaml
memory:
  session:
    max_messages: 50  # Keep last 50 messages in context
    summarization_threshold: 20  # Summarize older messages when context grows
```

### Layer 2: Cross-session memory (persistent)

What the agent remembers across different conversations and platforms.

```yaml
memory:
  persistent:
    backend: sqlite  # sqlite, postgres, or redis
    path: ~/.hermes/memory.db
    
    # What to remember
    user_preferences: true  # "I prefer Python over JavaScript"
    task_history: true      # "You helped me refactor auth last week"
    code_patterns: true     # "This team uses snake_case"
    
    # Privacy controls
    encrypt_at_rest: true
    retention_days: 365
```

### Layer 3: Skill memory (learned patterns)

Reusable skills the agent creates from repeated tasks.

```yaml
memory:
  skills:
    auto_create: true       # Create skills after complex tasks
    review_required: true   # Human reviews before saving
    storage: ~/.hermes/skills/
    
    # Skill examples
    # - "generate-unit-tests": "Given a function, generate pytest tests"
    # - "deploy-to-vercel": "Build and deploy Next.js app to Vercel"
```

---

## Step 4: Security hardening

### Platform isolation

Each platform should have its own permissions. Telegram users should not automatically have Discord permissions.

```yaml
security:
  platform_policies:
    telegram:
      max_requests_per_minute: 10
      allowed_tools: ["file_read", "web_search", "code_execute"]
      require_approval_for: ["file_write", "api_call"]
      
    discord:
      max_requests_per_minute: 5
      allowed_tools: ["file_read", "web_search"]
      require_approval_for: ["code_execute", "file_write"]
      
    slack:
      max_requests_per_minute: 20
      allowed_tools: ["file_read", "web_search", "code_execute", "file_write"]
      require_approval_for: ["api_call", "email_send"]
```

### User authentication

```yaml
security:
  authentication:
    telegram:
      allowed_users:
        - "123456789"  # Your Telegram user ID
      blocked_users: []
      
    discord:
      allowed_roles:
        - "Admin"
        - "Developer"
      allowed_users:
        - "your_discord_user_id"
```

### Webhook security

```yaml
security:
  webhooks:
    telegram:
      verify_signature: true
      secret_token: ${WEBHOOK_SECRET}
      
    slack:
      verify_signature: true
      signing_secret: ${SLACK_SIGNING_SECRET}
```

---

## Step 5: Monitoring and alerts

### Health checks

```yaml
monitoring:
  health_check:
    enabled: true
    interval: 60  # seconds
    endpoints:
      - "https://hermes.yourdomain.com/health"
      
  alerts:
    telegram:
      enabled: true
      chat_id: "123456789"  # Your admin chat
      
    email:
      enabled: true
      to: "alerts@yourdomain.com"
```

### Uptime monitoring with Uptime Kuma

```bash
# Install Uptime Kuma
docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data louislam/uptime-kuma:1

# Add monitor:
# Type: HTTP(s)
# URL: https://hermes.yourdomain.com/health
# Interval: 60s
```

---

## Step 6: Testing your gateway

### Platform-by-platform test

**Telegram:**
```bash
# Send message to bot
curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -d "chat_id=YOUR_CHAT_ID" \
  -d "text=Hello Hermes, can you summarize the latest commits?"
```

**Discord:**
```bash
# Send message via gateway API
curl -X POST "https://hermes.yourdomain.com/api/discord/send" \
  -H "Authorization: Bearer ${HERMES_API_KEY}" \
  -d '{"channel_id": "CHANNEL_ID", "message": "Hello Hermes"}'
```

**Slack:**
```bash
# Test with Slack API
curl -X POST "https://slack.com/api/chat.postMessage" \
  -H "Authorization: Bearer ${SLACK_BOT_TOKEN}" \
  -d "channel=CHANNEL_ID" \
  -d "text=Hello Hermes"
```

### End-to-end test

```bash
# Start gateway
hermes gateway start

# Check logs
journalctl -u hermes-gateway -f

# Verify all platforms are connected
hermes gateway status
# Expected output:
# telegram: connected ✓
# discord: connected ✓
# slack: connected ✓
# whatsapp: connected ✓
# email: connected ✓
```

---

## Troubleshooting

### "Gateway starts but no platform connects"

1. Check environment variables: `env | grep TELEGRAM`
2. Verify tokens are correct (no extra spaces or quotes)
3. Check firewall: `sudo ufw status`
4. Verify webhook URLs are reachable from the internet

### "Platform connects but agent does not respond"

1. Check Hermes core is running: `hermes status`
2. Verify model is loaded: `hermes models list`
3. Check logs for errors: `journalctl -u hermes -f`
4. Test agent directly: `hermes chat "hello"`

### "Agent responds but with wrong formatting"

1. Check formatting config in `gateway.yaml`
2. Verify platform-specific templates exist
3. Check max_length settings (Discord limits are strict)

### "Memory not persisting across sessions"

1. Check SQLite database exists: `ls ~/.hermes/memory.db`
2. Verify permissions: `chmod 644 ~/.hermes/memory.db`
3. Check disk space: `df -h ~/.hermes/`
4. Review retention policy in config

---

## Summary: Minimum viable gateway

If you do nothing else, set up:

1. **One platform** (Telegram is easiest)
2. **One memory layer** (SQLite session memory)
3. **Basic security** (allowed_users list)
4. **Health monitoring** (Uptime Kuma or similar)

You can add platforms and complexity later. Start with one working channel.

**Related:**
- [Getting Started with Hermes Agent](/getting-started/hermes-agent)
- [Securing Agent Tool Permissions](/guides/securing-agent-tool-permissions)
- [Agent Directory](/agents) — filter by messaging platforms
