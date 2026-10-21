---
{
  "slug": "minimax-m3-1-flash",
  "title": "MiniMax M3.1 Flash",
  "excerpt": "MiniMax's October 19, 2026 Flash model. Flat rate is $0.15 / $0.60 per million tokens, cached input is $0.015, and the docs table lists a 1,000,000-token window. The blog says weights come later. One docs line already calls it open-weight.",
  "category": "MiniMax",
  "tags": ["agentic", "coding", "long-context", "multimodal"],
  "provider": "MiniMax",
  "input_price": 0.15,
  "output_price": 0.6,
  "cached_input_price": 0.015,
  "context_window": 1000000,
  "mmlu": null,
  "humaneval": null,
  "arena": null,
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 99,
  "last_verified": "2026-10-21"
}
---

# MiniMax M3.1 Flash

## What to do with it

If you already call MiniMax through an OpenAI-compatible client, the model id on the docs page is `MiniMax-M3.1-Flash`. Set the effort field. The OpenAI-compatible example uses `reasoning_effort`. The Anthropic-compatible example uses `output_config.effort`. Both examples on the page I read set that field to `max`.

Don't download weights from a sentence. The October 19 blog says weights will be released later. The model-invocation page, fetched the same morning, calls it "an ultra-efficient open-weight model" in the table description. Those two sentences don't agree. Until a weights URL is on the blog, treat the API as the thing you can call.

## What MiniMax published

The blog is dated 2026-10-19 and titled "MiniMax M3.1 Flash: Redefining Agent Performance and Cost." The opening says they officially roll out MiniMax M3.1 Flash. It also says Space Bunny, which processed more than 200 trillion tokens while operating anonymously, was an early version of this model. That token count is their sentence. This card did not audit it.

The same post says online inference is nearly three times faster and usage cost is 70% lower than its predecessor. It does not name the predecessor in the paragraphs I read. It says everyday output speeds can reach 200+ tokens per second, with median (P50) speeds consistently reaching 170+ tokens per second. It says that speed comes from more aggressive sparsity.

Availability, in the blog's words: MiniMax API, M Plan, and MiniMax Code. A Pro model "will also arrive later."

## Price and window

Blog pricing, flat, per 1 million tokens: $0.15 input, $0.60 output, $0.015 cached input. The post says agentic-task usage cost is 70% lower than the predecessor. It does not print the predecessor's rate card in the text I read, so this card doesn't invent one.

The model-invocation guide lists `MiniMax-M3.1-Flash` with a context window of 1,000,000. The accordion under that table says the window is for long documents, codebases, and multi-step agent sessions. The same page says input can include text, images, and video. I did not open a separate video spec.

Base URLs on that page:

- OpenAI-compatible: `https://api.minimax.io/v1`
- Anthropic-compatible: `https://api.minimax.io/anthropic`

The call itself is in the deployment recipe `minimax-m3-1-flash-openai-compatible`. This card did not send a request.

## Scores on the blog, not on this desk

These numbers are MiniMax's. They are not an independent run.

- OSWorld V2: 61.7. The blog says first among Chinese models.
- Agents' Last Exam: 29.6. Same "first among Chinese models" claim.
- BankerToolBench: 76.2
- DeepSWE v1.1: 73.7%
- CyberGym: 82%
- AutomationBench-AA: "among the top performers." No score in the paragraphs I read.

MMLU and HumanEval are blank here because that blog post did not print them.

## Sources

- Blog, 2026-10-19: https://www.minimax.io/blog/minimax-m31f
- Model invocation, including the 1,000,000-token row and both client examples: https://platform.minimax.io/docs/guides/text-generation
