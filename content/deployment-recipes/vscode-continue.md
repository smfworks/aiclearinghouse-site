---
slug: vscode-continue
title: VS Code + Continue for Local AI Coding
excerpt: Set up the most popular local-first coding extension. Connect VS Code to Ollama for autocomplete, chat, and tab completion without sending code to the cloud.
category: IDE Integration
tags:
  - vscode
  - continue
  - ollama
  - local-llm
  - coding
  - autocomplete
order: 2
last_verified: 2026-06-15
difficulty: Beginner
estimated_time: 15 min
---

# VS Code + Continue for Local AI Coding

## The promise

Continue is the most popular open-source AI coding extension for VS Code. Unlike GitHub Copilot or Cursor, it lets you use your own local models through Ollama. Your code never leaves your machine, and you pay zero subscription fees.

This recipe sets up Continue with Ollama for both chat (ask questions about your code) and autocomplete (tab to accept suggestions). It is the standard local coding setup recommended by the clearinghouse.

## What you'll get

- Continue extension installed in VS Code
- Ollama connected for chat and autocomplete
- Context-aware suggestions that understand your entire codebase
- Zero cloud dependency for day-to-day coding

## Prerequisites

- VS Code installed
- Ollama running locally (see [macOS](/deployment-recipes/macos-ollama-silicon) or [Ubuntu](/deployment-recipes/ollama-ubuntu-cuda) recipes)
- A coding model pulled in Ollama (qwen2.5-coder:14b recommended)

## Step 1: Install Continue

In VS Code:

1. Open Extensions (`Cmd+Shift+X` on Mac, `Ctrl+Shift+X` on Linux/Windows)
2. Search for "Continue"
3. Install the extension by Continue Devs

Or via CLI:

```bash
code --install-extension Continue.continue
```

## Step 2: Configure Ollama as provider

Continue uses a `config.json` file for model configuration. Open it:

1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Linux/Windows)
2. Type "Continue: Open Config"
3. Select the option

Add this configuration:

```json
{
  "models": [
    {
      "title": "Local Qwen Coder",
      "provider": "ollama",
      "model": "qwen2.5-coder:14b",
      "apiBase": "http://localhost:11434"
    }
  ],
  "tabAutocompleteModel": {
    "title": "Autocomplete",
    "provider": "ollama",
    "model": "qwen2.5-coder:1.5b",
    "apiBase": "http://localhost:11434"
  },
  "customCommands": [
    {
      "name": "test",
      "prompt": "{{{ input }}}\n\nWrite a comprehensive set of unit tests for the above code. Include edge cases and error handling.",
      "description": "Write unit tests for selected code"
    }
  ]
}
```

Save the file. Continue automatically reloads the configuration.

## Step 3: Pull the models

In your terminal:

```bash
ollama pull qwen2.5-coder:14b
ollama pull qwen2.5-coder:1.5b
```

The 14B model handles chat and complex tasks. The 1.5B model is optimized for fast autocomplete suggestions.

## Step 4: Test the chat

1. Open any code file in VS Code
2. Select a function or block of code
3. Press `Cmd+L` (Mac) or `Ctrl+L` (Linux/Windows) to open Continue panel
4. Ask: "Explain this function" or "Refactor this to use async/await"

You should see responses from your local model. If you see "Connection error," Ollama is not running — start it with `ollama serve`.

## Step 5: Test autocomplete

1. Start typing a function:

```javascript
function calculateTotal(items) {
  //
```

2. Wait 1–2 seconds
3. You should see gray ghost text suggesting the implementation
4. Press `Tab` to accept the suggestion

If autocomplete is not working:
- Check that `qwen2.5-coder:1.5b` is pulled: `ollama list`
- Ensure the `tabAutocompleteModel` is configured in Continue settings
- Try restarting VS Code

## Model recommendations

| Task | Model | RAM needed |
|------|-------|------------|
| Chat / complex tasks | qwen2.5-coder:14b | ~10GB |
| Fast autocomplete | qwen2.5-coder:1.5b | ~2GB |
| Balanced | qwen2.5-coder:7b | ~5GB |
| Apple Silicon | qwen2.5-coder:14b | Runs on 16GB Mac |

## Advanced: Context awareness

Continue automatically includes nearby code as context. For better results:

- Use `@files` to include specific files in the context
- Use `@codebase` to search your entire codebase
- Use `@diff` to include the current git diff

Example prompt:

> @codebase How does authentication work in this project?

## Troubleshooting

### "Connection refused" error

Ollama is not running. Start it:

```bash
ollama serve
```

Or on macOS, ensure the Ollama menu bar app is running.

### Slow autocomplete

The 14B model is too large for autocomplete. Use the 1.5B model for autocomplete and keep the 14B for chat:

```json
"tabAutocompleteModel": {
  "title": "Autocomplete",
  "provider": "ollama",
  "model": "qwen2.5-coder:1.5b"
}
```

### Poor quality suggestions

- Ensure you are using a coding-specific model (qwen2.5-coder, not generic qwen)
- Include more context by selecting the entire function, not just one line
- Use `@files` to include relevant files

## Best fit

Developers who want Copilot-like functionality without cloud dependency or subscription costs. Particularly strong for: security-conscious teams, air-gapped environments, cost-sensitive projects, and anyone who prefers keeping their code local.
