---
slug: smart-home-control
title: Smart Home Control
excerpt: Control lights, thermostats, and sensors through natural-language commands.
category: Integrations
tags:
  - hermes
  - smart-home
  - home-assistant
  - iot
for: Hermes Agent
author: Community
install: hermes skill install smart-home-control
dependencies:
  - Hermes Agent
  - Home Assistant or MQTT broker
  - Network access to devices
image: /images/skills/integrations.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 106
last_verified: 2026-06-15
---

# Smart Home Control

Turn Hermes into a voice- and chat-controlled smart home assistant. Ask it to dim lights, adjust temperature, check sensors, or run scenes through Home Assistant.

## What it is

A skill that maps natural-language commands to Home Assistant entities or MQTT topics. It understands room names, device types, and scenes so you do not have to remember exact entity IDs.

## Who it targets

- Smart home enthusiasts using Home Assistant.
- Families who want a textable house assistant.
- Anyone building custom IoT automations.

## Dependencies

- Hermes Agent
- Home Assistant or MQTT broker
- Network access to devices

## How to install

```bash
hermes skill install smart-home-control
```

## Skill source

- [Hermes Agent skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)
