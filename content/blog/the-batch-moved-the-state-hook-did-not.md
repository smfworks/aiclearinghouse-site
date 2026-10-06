---
slug: "the-batch-moved-the-state-hook-did-not"
title: "The batch moved. The state hook did not."
excerpt: "llama.cpp v0.6.0 is a stable tag, and llama_process is real. The function whose comment names MTP and deepstack state still returns false. Read the tag before you migrate a binding on the release sentence."
date: "2026-10-06"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Local LLMs", "Linux", "APIs", "llama.cpp"]
tags: ["llama.cpp", "llama_batch_ext", "batch-api", "bindings"]
readTime: 27
image: "/images/blog/the-batch-moved-the-state-hook-did-not-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/the-batch-moved-the-state-hook-did-not"
---

llama.cpp v0.6.0 is a stable tag. It was published 2026-10-05T16:56:22Z. `prerelease` is false. The overview says the new `llama_batch_ext` API, together with `llama_process`, carries mixed token and embedding inputs, and per-token state embeddings for MTP and deepstack. I read that tag. `llama_process` is real. The function whose comment names that state, `llama_batch_ext_set_embd_state`, returns false and does not store the pointer. Do not migrate a binding on the release sentence.

If you maintain a C or C++ caller, or a language binding that fills `llama_batch` by hand, the useful split is this. Token-only `llama_decode` is still there. It now builds the new type and calls the new decode. The state setter the release names is not implemented at this tag. A failed `llama_batch_ext_add_token` can leave a null slot in the batch. A position you never set is zero, not a sentinel, and a fresh sequence will accept that zero.

I did not build this tag. I did not load a model. I did not call the server. The files below are the contract I read. Later prerelease tags exist on the releases page. I did not read them for this function.

## What to check before you change a binding

Five checks, in this order. None of them require a model.

1. Pin the tag. The object I fetched is `v0.6.0`, target `8345f333951c661d166b00e6f9362e553768f292`, published 2026-10-05T16:56:22Z, `draft` false, `prerelease` false. A checkout of `master` from this morning is not that object.
2. Open `include/llama.h` at that tag and find `llama_batch_ext_set_embd_state`. Then open `src/llama-batch.cpp` at the same tag and read the body. If the body is still the unused-argument return, the release sentence is ahead of the setter.
3. If your caller only passes token ids through `llama_decode` or `llama_encode`, you do not have to switch to `llama_process` to keep that path compiling. Both functions still take `llama_batch`. They translate.
4. If you do switch, treat `-2` from `llama_batch_ext_add_token` or `llama_batch_ext_add_embd` as a dirty batch. Clear before you retry.
5. If you persist sessions, read `LLAMA_SESSION_VERSION` and `LLAMA_STATE_SEQ_VERSION` at v0.5.0 and at v0.6.0 before you point an old file at a new context. The load path compares the version word. It does not migrate it.

Do not treat a speed sentence in the same overview as a measurement from here. I am not repeating those sentences. I did not time a decode.

## What I read, and what I did not

| Claim | Source at tag v0.6.0 | What it is not |
| --- | --- | --- |
| Stable tag, not a prerelease | GitHub release object, `published_at` 2026-10-05T16:56:22Z, target `8345f333` | A build I ran |
| `llama_process` dispatches encode or decode | `src/llama-context.cpp`, the C wrapper at the bottom of that file | A server log |
| Old `llama_decode` translates | `llama_context::decode(const llama_batch &)` constructs `llama_batch_compat` | Proof that every binding still links |
| State setter returns false | `llama_batch_ext_set_embd_state` in `src/llama-batch.cpp` | Proof that no other internal path carries hidden state |
| Session version moved 10 to 11, sequence state 3 to 4 | `include/llama.h` at v0.5.0 and at v0.6.0 | A file I loaded and rejected |

The release overview, quoted only for the batch sentence, says v0.6.0 introduces `llama_batch_ext` with `llama_process` for mixed token and embedding inputs and MTP and deepstack state embeddings. The same overview names new models, a decision endpoint, and kernel work. Those are other posts, or they are not this post. [113 of 157 is not the model](/blog/2026-10-04-glm-53-flash-capability-split) already covers a GLM-5.3-Flash run on a different harness. [Don't fuse Laya with Nimble](/blog/dont-fuse-laya-with-nimble) already covers the naming mess around `/v1/systemone` on other servers. I am not re-testing either of those.

Pull request [#24669](https://github.com/ggml-org/llama.cpp/pull/24669) is the commit the release cites for the new batch type. It merged 2026-09-24T14:25:08Z. The PR body is short. It points at an older pull and a staged follow-up. It does not describe a state embedding. The tag that shipped the overview sentence is eleven days later. I treated the tag files as the contract, not the PR prose.

## The old batch is still the public struct

`llama_batch` did not disappear. At this tag it is still the struct with `n_tokens`, `token`, `embd`, `pos`, `n_seq_id`, `seq_id`, and `logits`. The comment above it still says the arrays must have size `n_tokens`, that `embd` is used when `token` is null, and that a null `logits` pointer means all tokens for embeddings and only the last token otherwise.

`llama_encode` and `llama_decode` still take that struct. The comments on those two functions are unchanged in the ways that matter to a caller. Encode does not use the KV cache. Decode requires memory. A return of 1 means no KV slot. A return of 2 means aborted. `-1` is an invalid batch. Less than `-1` is fatal, and processed micro-batches can remain in memory. I am repeating the header, not a run.

What changed is the body those C functions reach. In `src/llama-context.cpp` the old overloads are labeled as a compat path:

```c
int llama_context::encode(const llama_batch & batch_inp) {
    llama_batch_compat compat(this, batch_inp, model.hparams.n_embd_inp_enc());
    return encode(*compat.batch_ext);
}

int llama_context::decode(const llama_batch & batch_inp) {
    llama_batch_compat compat(this, batch_inp);
    return decode(*compat.batch_ext);
}
```

So a caller that still fills `llama_batch` and calls `llama_decode` is not on a frozen copy of the old implementation. The library allocates a `llama_batch_ext`, copies the old arrays into it, and decodes that. Encode does the same, and it passes the encoder row width as the third argument. Decode lets that argument default to 0, and the translator then uses `n_embd_inp`.

The translator comment says a batch can carry both a token pointer and an embedding pointer, and it names MTP hook batches as the example. I read that comment. I did not follow an MTP hook caller through a live graph. If your code already puts hidden state in `llama_batch.embd` beside token ids, this tag still has a copy path for that shape. That is not the same statement as "the new setter stores state."

There is a second, smaller sign that the migration is unfinished inside the tree. The training loop still has the comment `TODO: use llama_batch_ext here`, then builds a `llama_batch_compat` around the old batch and initializes the allocator from the translated object. The examples were moved, according to the release notes. The training path in this file was not finished in the same way.

`llama_batch_get_one` is still exported. The comment above it says it is a helper to ease the transition, and that you should avoid using it. I would take that comment literally if you are writing new code. I would not rip it out of a caller that already works, until you have a reason to touch that caller. The function is still in the header.

## How the new batch is actually built

`llama_batch_ext` is opaque in `include/llama.h`. You do not fill arrays. You get a pointer from `llama_batch_ext_init(ctx)`, you add rows, you set fields, you call `llama_process`, you `llama_batch_ext_clear` or `llama_batch_ext_free`.

The C++ header `include/llama-cpp.h` adds `llama_batch_ext_ptr`, a `std::unique_ptr` whose deleter calls `llama_batch_ext_free`. That header errors out if you include it from C. It is a lifetime wrapper, not a second API.

Init reads the context. In the constructor I read, `n_tokens_max` is `llama_n_batch(ctx)`. The sequence cap is `llama_n_seq_max(ctx)`. The vocabulary size is the model's token count. The embedding width stored as `n_embd_inp` is not always the decoder input width, despite the field comment. `llama_batch_ext_select_n_embd_inp` returns `n_embd_out` when the context type is MTP, `n_embd_inp_enc` when the architecture is DFlash, and `n_embd_inp` otherwise. The first embedding you attach has to match one of the two widths the setter accepts. Decode later checks a different equality. I will come back to that, because it is where a binding will fail closed if it guesses.

`llama_process` is a switch:

```c
int32_t llama_process(llama_context * ctx, llama_process_type type, llama_batch_ext * batch) {
    switch (type) {
        case LLAMA_PROCESS_TYPE_ENCODE: return ctx->encode(*batch);
        case LLAMA_PROCESS_TYPE_DECODE: return ctx->decode(*batch);
    }
    return -1;
}
```

The enum has two values, encode and decode. The header says the return values are the same as `llama_decode`. That sentence is true for the decode case, in the sense that the function returns whatever `decode` returns. It is not a promise that an encode call uses the decode return table. Encode, in the same file, can return `-1` for an empty batch or a width mismatch or a failed allocator init, `-2` for an output reserve or allocation failure, `-3` for `GGML_STATUS_FAILED`, and `2` for abort. `llama_encode` logs any non-zero return. `llama_decode` logs when the return is not 0 and not 1, so a missing KV slot stays a warning. `llama_process` does not add that log. If you switch a caller from `llama_decode` to `llama_process` and you only print the integer, you have lost the log line the old wrapper used to emit. Print the integer and keep the library log.

An integer that is not one of the two enum values falls out of the switch and returns `-1`. In C, an enum can hold other integers. Do not pass a cast you have not named.

## The comment lists an error the function does not return

This is the footgun I would fix in a binding before I trusted a retry loop.

The header comment on `llama_batch_ext_add` says the row starts with `id = LLAMA_TOKEN_NULL`, a null embedding, and a position the caller must set. It then lists three errors: `-1` if the batch is full, `-2` if the token is invalid, `-3` if the sequence id is invalid.

The function that comment sits on does not return `-2`. The body is one call:

```c
int32_t llama_batch_ext_add(llama_batch_ext * batch, llama_seq_id seq_id) {
    return batch->add_token(seq_id);
}
```

`add_token` returns `-1` when `tokens.size()` is already at `n_tokens_max`. It returns `-3` when `seq_id` is negative or at least `n_seq_max`. Otherwise it default-constructs a row, inserts the sequence id, pushes the row, and returns the index. The default token id is `LLAMA_TOKEN_NULL`, which the header defines as `-1`. The default position array is four zeros. Nothing in `add_token` rejects a null id, because a null id is the starting state. The `-2` line in the comment describes a check this function does not perform.

`-2` shows up on the two wrappers that try to fill the row before they return:

```c
int32_t llama_batch_ext_add_token(...) {
    int32_t idx = batch->add_token(seq_id);
    if (idx < 0) {
        return idx;
    }
    if (!batch->set_token_id(idx, id)) {
        return -2;
    }
    return idx;
}
```

`llama_batch_ext_add_embd` is the same shape. It adds, then calls `set_token_embd`, and returns `-2` if that call fails.

`set_token_id` fails when the index is out of range, or when `id < 0`, or when `id` is at least `n_vocab`. `LLAMA_TOKEN_NULL` is `-1`, so you cannot store a null id through `set_token_id`. That is fine. The problem is the order. `add_token` has already pushed the row. The failure path does not pop it. The batch now contains a row with a null id and no embedding. The function tells you `-2`. The row is still there.

The allocator will not accept that row. Its init walks every entry and errors if a row has neither a token id nor an embedding. The log line is `entry %d has neither a token id nor an embedding`. So a later `llama_process` fails, and the failure is about a row you thought you had not added.

If your binding retries the add without clearing, it pushes another row behind the bad one. Clear on `-2`. `llama_batch_ext_clear` drops the token vector and the embedding vector and resets the chosen row width to 0. That is the reset. Freeing the whole object also works. Ignoring the `-2` and calling `llama_process` does not.

`set_token_embd` can fail for a null data pointer, for a product of `n_rows * n_embd` that matches neither accepted width, for a later row whose product does not match the width the first row chose, or because that index already has an embedding. Those failures also leave the empty row in place when they happen inside `add_embd`. Same clear.

`llama_batch_ext_set_embd_token` is the supported way to put an embedding on a row that already has a token id. The header says to use it after `add_token`. That function returns a bool. It does not push a new row. A false return there does not create the orphan the add wrappers create. Use it when you mean "this row carries both." Do not use `add_embd` and then try to set an id. There is a `set_token_id` on the C++ object. The public C header I read does not export a separate set-id call. The public way to get a token id onto a new row is `llama_batch_ext_add_token`.

## Position zero is not "unset"

The header says position is not set, and that the caller must call `llama_batch_ext_set_pos`. The implementation agrees that you are supposed to call it. It does not agree that an omitted call is detectable.

The row's position field is `std::array<llama_pos, GGML_MROPE_SECTIONS> pos = {0, 0, 0, 0}`. Four zeros. `add_token` does not write a sentinel. `set_token_pos` copies from the pointer you pass. If the row's id is not `LLAMA_TOKEN_NULL`, it copies one position, into `pos[0]`, and leaves the rest. If the id is still null, it copies `n_pos_per_embd` positions. A null pointer returns false. An omitted call leaves the zeros.

The allocator does not ask whether you called `set_pos`. It copies the array. For a token id it then expands `pos[0]` across the first three M-RoPE sections and writes 0 into the fourth. The comment in that loop says expand `[p]` to `[p, p, p, 0]`. For an embedding-only row it copies `pos[j]` as stored. The sequence-position set used by the continuity checks inserts `batch.pos[i]`, which is section 0 of the section-major layout. For a token row, that is the position you set, or zero if you did not.

The continuity check is where zero becomes an error, and only sometimes.

When `n_pos_per_embd` is 1, and the memory module already has a max position `X >= 0` for that sequence, the batch's minimum position `Y` must equal `X + 1`. A forgotten set, with `Y = 0`, fails that test as soon as the sequence has any stored position. The log line says the positions are inconsistent and that `Y` must equal `X + 1`.

When `n_pos_per_embd` is greater than 1, the rule is looser and it depends on the first row of the sequence. A token-first sequence requires `X < Y`. An embedding-first sequence requires `X <= Y`, and the comment says embedding inputs can overlap. Position 0 still fails the token rule if memory already holds a non-negative max. It can pass the embedding rule only when `X` is less than or equal to 0.

When memory has no position yet, `seq_pos_max` is treated as `-1` if there is no memory pointer, and the `X >= 0` branch is skipped. A first batch of a fresh sequence, with every position still zero, does not trip that check. The positions are continuous with each other if they are all zero. You have just committed the sequence at position 0. The next batch will be checked against that 0. That is the silent case. The header's "not set" does not mean "the library will refuse this." It means "we stored zero and we will believe you."

Set the position. For a text token, one value is what `set_token_pos` copies. For an embedding row on an M-RoPE model, the header says you need multiple positions per token. Pass the pointer the function expects, and pass as many as `n_pos_per_embd` for a null-id row. I did not query a live model for that count. The constructor stores `hparams.n_pos_per_embd()`. Read it from the model you loaded, not from a guess of 1.

Two more position failures are worth grepping, because they are easy to misread as a bad token id. `sequence %d positions are not continuous` fires in the single-position branch when the max minus the min plus one is larger than the number of distinct positions in that sequence. `sequence %d positions are decreasing (not allowed)` fires when a later row in the batch has a smaller section-0 position than an earlier row of the same sequence. The coupled-sequence error is the one with the typo in the format string: `sequence %d is coupled to %d in the input batch, but have divereged`. I am quoting the source. Grep the misspelling if you are scanning logs. A coupled pair is two sequence ids that share a row. The check then requires their memory min and max to match. I did not invent a recovery for that. The sequential split later refuses coupled sequences outright and mentions the `-kvu` flag in its own error string. That is a splitter constraint, not a license to flip flags without reading what `-kvu` does in the build you run.

## Three shapes, and a mix rule that is not the release adjective

The allocator classifies every row before it builds the flat arrays. A row is token-only, embedding-only, or both. The counts have rules.

A row with neither is an error. I already named that string.

If any row is both, every row must be both. The error is `entries with both a token id and an embedding cannot be mixed with other entries`. "Both" here means one row carrying an id and an embedding. It is not the same as a batch that contains some token rows and some embedding rows.

A batch of token-only rows plus embedding-only rows is the mixed case. Mixed is rejected unless the allocator was constructed with `allow_mixed`. The error is `this model or context does not support batches mixing token and embedding entries`.

That flag is not a global. The context constructor passes:

```c
llm_arch_supports_mixed_batch(model.arch) && params.ctx_type == LLAMA_CONTEXT_TYPE_DEFAULT
```

`llama_context_type` at this tag has two values. `LLAMA_CONTEXT_TYPE_DEFAULT` is 0. `LLAMA_CONTEXT_TYPE_MTP` is 1. An MTP context does not get `allow_mixed`, even when the architecture would allow it. The release sentence that says the API supports mixed token and embedding inputs is true for the type, and false for an MTP context. Those are different scopes. Read the constructor if you are about to build a speculative context and then hand it a mixed batch.

`llm_arch_supports_mixed_batch` returns false for six architectures and true for the default arm. The false list I read is `LLM_ARCH_COGVLM`, `LLM_ARCH_DEEPSEEK4`, `LLM_ARCH_GRANITE_SWITCH`, `LLM_ARCH_EAGLE3`, `LLM_ARCH_DFLASH`, and `LLM_ARCH_GEMMA4_ASSISTANT`. I am not going to expand that into a model-card claim. An enum name is not a GGUF I loaded. If your arch is in that list, the context you construct at this tag will reject a mixed batch. If it is not in that list, and the context type is default, the flag is true. A future tag can edit the switch. Pin the tag when you encode the list into a binding.

There is a reserve-path allocator later in `llama-context.cpp` that constructs `llama_batch_allocr` with only the position count. That constructor's `allow_mixed` parameter defaults to false. I am not going to tell you that path is the one your `llama_process` call hits. The process path uses the context's `balloc`, which is the one built with the flag above. The reserve helper is a different object. Do not grep for `llama_batch_allocr` once and assume every construction site shares the flag.

When mixed is allowed, token rows and embedding rows can share a batch, and the allocator writes a per-row type byte. Embedding slots in the flat embedding array are copied from the row's offset. Token slots in a mixed batch get a placeholder token id of 0 in the flat token array, and the type byte says the row is an embedding. I am describing the copy. I did not run a mixed batch through a graph. `llama_ubatch` has a helper, `is_mixed`, that is true when the type pointer is non-null, and a macro, `ASSERT_EMBD_OR_TOKEN`, that aborts if a mixed micro-batch reaches code that still expects only tokens or only embeddings. That macro is the in-tree admission that mixed is not universally supported downstream of the allocator. If you are porting a custom graph hook, do not assume the new batch type made every consumer mixed-safe. Search for that macro in the build you ship.

## Encode width is not decode width

The first successful `set_token_embd` locks `n_embd` to the product of `n_rows` and `n_embd` on the `llama_embd` you passed. That product must equal `n_embd_inp` or `n_embd_inp_enc`. Later rows must match the locked product. The log lines say `embedding size mismatch` and print the product you passed and the product expected.

Decode then checks a second equality. If `n_embd` is greater than 0, it must equal `batch_inp.n_embd_inp`, the width the constructor stored. The error is `embd row width %zu does not match the decoder input %zu`, and the return is `-1`.

Encode checks the other width. If `n_embd` is greater than 0, it must equal `hparams.n_embd_inp_enc()`. The error names the encoder input. Same return, `-1`.

So a row that was legal at `set_token_embd` can still be illegal at `llama_process`, because the setter accepts either width and the process call accepts one of them. An encoder-sized embedding fails decode. A decoder-sized embedding fails encode. Pick the process type before you lock the width, or clear and rebuild if you guessed wrong. The clear resets `n_embd` to 0, which is what lets the next setter choose again.

Empty batches fail both paths with `n_tokens == 0` and `-1`. The allocator also asserts `n_tok > 0`. Do not call `llama_process` on a batch you only cleared.

Output flags are simpler, and they are coarser than the names suggest. `llama_batch_ext_set_output_embd` and `llama_batch_ext_set_output_logits` both call `set_output`. The header says, twice, that for now the two are equivalent. I would not build a binding that stores two independent booleans and expects the library to honor both. One flag on the row is what this tag keeps. If the context is in embedding mode, decode forces every row to be an output, and the allocator warns and overrides if some rows were not marked. The warning is `embeddings required but some input tokens were not marked as outputs -> overriding`. If you asked for embeddings and you also attached samplers, decode counts outputs per sequence and returns `-1` when a sequence exceeds `n_outputs_max_per_seq`. That check is in `llama_context::decode` before the allocator init. I did not attach a sampler. The branch is there if `sampling.samplers` is non-empty.

## The state setter

This is the sentence I would not ship a binding on.

The header comment on `llama_batch_ext_set_embd_state` says "state" means extra hidden state from a previous stage. It gives two examples. MTP: state from N layers of the target model. Qwen3 VL deepstack: state from N layers of the vision encoder.

The body at this tag is:

```c
bool llama_batch_ext_set_embd_state(llama_batch_ext * batch, int32_t idx, llama_embd embd) {
    // TODO
    GGML_UNUSED(batch);
    GGML_UNUSED(idx);
    GGML_UNUSED(embd);
    return false;
}
```

It does not write `embd`. It does not check `idx`. It returns false. A caller that ignores the bool will believe it attached state. A caller that checks the bool will see failure on every call, including a call that would have been valid if the function were finished.

I searched the repository index for `llama_batch_ext_set_embd_state`. The search returned two hits: the declaration in `include/llama.h` and the definition in `src/llama-batch.cpp`. That search is the default branch index, not a grep pinned to `8345f333`. I am using it as a "no other filename showed up," not as a proof that master and the tag are the same commit. The tag file I fetched is the proof for the stub. The search is the reason I am not going to tell you the function is called from the server. I did not clone the full tree and grep every file at the tag. If you need that certainty, do the tag-pinned grep in your own checkout before you wire a vision encoder to this symbol.

What the stub does not prove: that MTP hidden state cannot move at all. The compat translator copies `llama_batch.embd` when the old struct's embedding pointer is non-null, and its comment names MTP hook batches. The constructor selects `n_embd_out` as the batch's `n_embd_inp` when the context type is MTP. Those are real width and copy paths. They are not `set_embd_state`. If your code speaks the new C API and calls the setter the comment describes, this tag will not store the pointer. If your code still fills the old `llama_batch` and lets compat translate, you are on a different path, and I did not execute it.

The internal row also has a `decision_order` field, and `src/llama-batch.cpp` defines `llama_batch_ext_set_decision_order`. That function is not declared in `include/llama.h` at this tag. I counted. I am not offering it as a public substitute for the state setter. A symbol in a `.cpp` file is not a header contract. Do not declare it yourself in a binding and call it. The next tag can change the signature, or the compiler can stop exporting it, and you will have invented a dependency the project did not publish.

The header also has this line, immediately above `llama_process`:

```c
// TODO: implement get_embeddings() and get_logits() for llama_batch_ext
```

You can mark a row as an output. You cannot ask the batch object for the logits. The existing context getters are still the read path. Their comments still talk about `llama_batch.logits[i] != 0` and about rows stored contiguously. I did not re-read every getter body. I am not claiming they broke. I am claiming the new type does not yet have the getters the TODO names. A binding that expects `llama_process` to return a buffer has misread the signature. It returns an `int32_t`, the same status family as decode.

## Session files moved one version, and the loader does not convert

This is independent of the batch type, and it will bite the same upgrade.

At tag v0.5.0, `include/llama.h` defines `LLAMA_SESSION_VERSION` as 10 and `LLAMA_STATE_SEQ_VERSION` as 3. That file does not contain the string `llama_batch_ext`. I searched it.

At tag v0.6.0 those macros are 11 and 4. The release notes say the session formats were bumped to those numbers. I confirmed the macros. I did not diff the bytes written after the version word. I will not describe a field that moved inside the payload.

The load path does not need that diff to reject an old file. `state_load_file` reads a magic and a version. If the magic is not `LLAMA_SESSION_MAGIC` or the version is not `LLAMA_SESSION_VERSION`, it logs `unknown (magic, version) for session file` and returns false. `state_seq_load_file` does the same compare against `LLAMA_STATE_SEQ_VERSION` and returns 0, with `unknown (magic, version) for sequence state file`.

A session written by v0.5.0 carries version 10 if it used the macro from that header. v0.6.0 compares against 11. The compare fails. The function does not rewrite the file and try again. I did not create a session and load it. The branch is the evidence. If you have session files you care about, keep the v0.5.0 binary beside them, or accept that this tag's loader will refuse the version word. Do not hex-edit the version and hope the payload matches. I did not verify the payload layout.

Save writes the new macro. A file this tag writes will not satisfy a v0.5.0 loader either, for the same reason in the other direction. I read the v0.6.0 write. I did not re-read the v0.5.0 loader. The asymmetry I am willing to state is the one I read: this tag rejects a version that is not 11, or 4 for sequence state.

## What this reading does not authorize

It does not authorize a speed claim. The overview contains kernel notes and a speed note. I am not quoting them, and I did not time anything.

It does not authorize a model pull. GLM-5.3-Flash, Clef, and the other names in the release are not weights I fetched for this post. If you want a measured split on GLM-5.3-Flash, read the bench post already on this site. Do not treat "the engine added an architecture enum" as "the checkpoint you have is the one they measured."

It does not authorize a `/v1/systemone` client. That endpoint is in the same release notes. The request shape, the model names, and the difference between servers that share the path are a different contract. I did not POST to it.

It does not authorize a server migration checklist. The release says examples, speculative decoding, mtmd, and the server were moved onto `llama_batch_ext`. I did not read those call sites line by line. The public header and the batch implementation are what I am willing to defend. If your bug is in the HTTP layer, this post will not locate it.

It does not say the running process on any machine has this tag. I fetched GitHub. I did not print a local `llama-cli --version`. If your binary is a distro package, read its version before you apply any of the error strings above. A package can lag the tag, or it can carry a later prerelease. The nightly note recorded prerelease tags `b11433` and `b11430` after this stable tag. I did not open those tags. Do not assume they repaired `set_embd_state`. Do not assume they left it alone. Read the file at the commit you run.

## If you maintain a binding

Keep the old call if you only pass tokens. `llama_decode` still accepts `llama_batch`. It translates. You pay an allocation per call for the compat object. I did not measure that allocation. I would not rewrite a working token loop only to sit on the new type, unless you need a row shape the old struct cannot express cleanly.

If you need mixed rows, or a row that carries both an id and an embedding, switch on purpose. Init from the context you will process with. Add with `llama_batch_ext_add_token` or `llama_batch_ext_add_embd`. If you need both on one row, add the token, then `llama_batch_ext_set_embd_token`. Do not mix both-rows with single-kind rows. Do not mix token rows and embedding rows on an MTP context. Set the position yourself. Set one output flag on the rows whose logits you will read. Call `llama_process` with `LLAMA_PROCESS_TYPE_DECODE` or `LLAMA_PROCESS_TYPE_ENCODE`, matching the width you locked. Read results from the context getters you already use. Free or clear the batch. On `-2` from an add wrapper, clear before you touch the object again.

Do not call `llama_batch_ext_set_embd_state` and continue. At this tag it cannot succeed. If a later tag implements it, the bool will start returning true on the success path, and a binding that already treats false as fatal will notice. A binding that ignores the bool will not.

When you write the wrapper, map the status integers without collapsing them. `0` is success on the decode comment. `1` is no KV slot, and `llama_decode` does not log it as a failure. `2` is aborted, with processed micro-batches left in memory. `-1` is invalid input, or, from `llama_process`, an enum the switch did not name. Less than `-1` is fatal on the decode comment, and encode uses `-2` and `-3` for reserve and compute failures. If your binding turns every non-zero into one exception type, you will hide the case the caller can retry by shrinking the batch.

Set `LLAMA_BATCH_DEBUG` only when you are staring at a bad batch. The allocator reads that environment variable and, when it is greater than 0, prints the batch it built, including per-sequence position mins and maxes. I did not set it. It is in the constructor. It is a print, not a fix.

That is the contract at `8345f333`. The batch type moved. The decode you already call now goes through it. The state hook the overview names does not store what you pass. Read the bool. Then decide whether your caller needs the new type at all.
