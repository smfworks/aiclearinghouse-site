---
slug: docker-compose-ai-stack
title: Docker Compose Full AI Stack
excerpt: One command to deploy Ollama, Open WebUI, and Nginx with SSL. The production-ready foundation for self-hosted AI infrastructure.
category: Self-Hosting
tags:
  - docker
  - docker-compose
  - ollama
  - open-webui
  - nginx
  - ssl
  - production
  - self-hosting
order: 3
last_verified: 2026-06-15
difficulty: Advanced
estimated_time: 60 min
---

# Docker Compose Full AI Stack

## The promise

Running individual AI tools is simple. Running them together securely, with reverse proxy, SSL, and persistence, is where most people get stuck. This recipe gives you a single `docker-compose.yml` that deploys:

- **Ollama** — the local LLM engine
- **Open WebUI** — a ChatGPT-like web interface
- **Nginx** — reverse proxy with SSL termination
- **Persistent volumes** — models and data survive container restarts

One command: `docker compose up -d`. Production-ready architecture.

## What you'll get

- Complete AI stack running in Docker
- HTTPS access via Nginx with Let's Encrypt
- Persistent model storage (no re-download on restart)
- Web UI accessible at `https://ai.yourdomain.com`
- Ollama API available internally on the Docker network

## Prerequisites

- Docker and Docker Compose installed
- A domain name pointing to your server
- Ports 80 and 443 open
- 20GB free disk space (models are large)
- Optional but recommended: a server with a GPU

## Step 1: Create the directory structure

```bash
mkdir ~/ai-stack && cd ~/ai-stack
mkdir -p {nginx/conf.d,ollama-data,webui-data}
```

## Step 2: Create docker-compose.yml

```yaml
services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    volumes:
      - ./ollama-data:/root/.ollama
    ports:
      - "11434:11434"
    environment:
      - OLLAMA_ORIGINS=*
    restart: unless-stopped
    # Uncomment for NVIDIA GPU support:
    # deploy:
    #   resources:
    #     reservations:
    #       devices:
    #         - driver: nvidia
    #           count: 1
    #           capabilities: [gpu]

  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: open-webui
    volumes:
      - ./webui-data:/app/backend/data
    ports:
      - "3000:8080"
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
      - WEBUI_AUTH=False
      - WEBUI_NAME=AI Stack
    depends_on:
      - ollama
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - open-webui
    restart: unless-stopped
```

## Step 3: Configure Nginx

Create `nginx/conf.d/default.conf`:

```nginx
server {
    listen 80;
    server_name ai.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ai.yourdomain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    location / {
        proxy_pass http://open-webui:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /ollama/ {
        proxy_pass http://ollama:11434/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Step 4: Set up SSL

For Let's Encrypt (recommended):

```bash
# Install certbot
docker run -it --rm --name certbot \
  -v "$(pwd)/nginx/ssl:/etc/letsencrypt" \
  -v "$(pwd)/nginx/www:/var/www/certbot" \
  certbot/certbot certonly \
  --standalone \
  -d ai.yourdomain.com \
  --agree-tos \
  --email your-email@example.com
```

Copy certificates:

```bash
sudo cp /etc/letsencrypt/live/ai.yourdomain.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/ai.yourdomain.com/privkey.pem nginx/ssl/
```

## Step 5: Start the stack

```bash
docker compose up -d
```

Verify:

```bash
docker compose ps
```

All services should show "Up".

## Step 6: Pull your first model

```bash
docker exec -it ollama ollama pull qwen3.5:9b
```

## Step 7: Access the web interface

Navigate to `https://ai.yourdomain.com`. You should see the Open WebUI login screen.

## Step 8: Configure the UI

1. Create an admin account
2. Go to Settings → Models
3. Verify qwen3.5:9b appears
4. Start a new chat and test

## Maintenance

### Update the stack

```bash
docker compose pull
docker compose up -d
```

### Backup models

```bash
tar -czf ollama-backup-$(date +%Y%m%d).tar.gz ollama-data/
```

### View logs

```bash
docker compose logs -f ollama
docker compose logs -f open-webui
```

## Adding GPU support

For NVIDIA GPUs, uncomment the `deploy` section in `docker-compose.yml` and ensure the NVIDIA Container Toolkit is installed:

```bash
# Install NVIDIA Container Toolkit
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list

sudo apt update
sudo apt install -y nvidia-container-toolkit
sudo systemctl restart docker
```

## Troubleshooting

### "Bind for 0.0.0.0:80 failed"

Another service is using port 80. Check with:

```bash
sudo lsof -i :80
```

Stop the conflicting service or change the port mapping in docker-compose.yml.

### Models not persisting

Ensure the volume mount is correct:

```bash
ls -la ollama-data/
```

You should see `models/` directory. If empty, check Docker volume permissions.

### SSL certificate errors

If using self-signed certificates for testing, add the `-k` flag to curl or accept the warning in your browser. For production, use Let's Encrypt.

## Best fit

Teams and individuals who want a production-ready, reproducible AI infrastructure. Docker Compose makes this stack portable between development laptops, home servers, and cloud VPS instances.
