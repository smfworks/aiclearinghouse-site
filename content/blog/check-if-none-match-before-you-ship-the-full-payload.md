---
slug: "check-if-none-match-before-you-ship-the-full-payload"
title: "Check If-None-Match Before You Ship the Full Payload"
excerpt: "Starlette's StaticFiles already stamps an ETag on every file it serves, and answers a matching If-None-Match with a body-free 304. I verified the whole loop on fastapi 0.165.0 this morning: the tag, the 304, the weak-comparison quirk, the mtime footgun, and the hand-rolled version for JSON routes."
date: "2026-11-24"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Python", "FastAPI", "APIs", "Open Source"]
tags: ["fastapi", "http-caching", "etag", "304", "starlette", "conditional-requests", "performance"]
readTime: 5
image: "/images/blog/fastapi-etag-304-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/check-if-none-match-before-you-ship-the-full-payload"
---

Your API serves the same 100 KB file to the same client four times a minute, and every one of those responses carries the full payload down the wire. HTTP has had the fix since forever: put a version tag on the response, let the client echo it back, and answer with a status code instead of bytes when nothing changed. FastAPI gives you most of this for free and the last piece in about ten lines. By the end of this post you'll know where the free tag comes from, how to verify the 304 loop with your own commands, and how to add the same validator to a JSON route.

## The free tag: StaticFiles and FileResponse

When you mount `StaticFiles`, the docs tell you to add two lines ([Static Files](https://fastapi.tiangolo.com/tutorial/static-files/)):

```python
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
```

What the FastAPI page leaves out is what Starlette documents on its own [responses page](https://www.starlette.io/responses/): "File responses will include appropriate `Content-Length`, `Last-Modified` and `ETag` headers." I read the source to see exactly where that tag comes from. In `starlette/responses.py`, `FileResponse` computes it at lines 341–342: `etag_base = str(stat_result.st_mtime) + "-" + str(stat_result.st_size)`, then `etag = f'"{hashlib.md5(etag_base.encode(), usedforsecurity=False).hexdigest()}"'` ([source](https://github.com/encode/starlette/blob/master/starlette/responses.py)). The tag is an MD5 of the file's modification time and size, wrapped in quotes. Hold that detail; it bites later.

`StaticFiles` does the comparison for you too. In `starlette/staticfiles.py`, `is_not_modified` (line 211) takes the response's `etag` header and checks it against the client's `If-None-Match`, returning 304 with only the validator headers when they match ([source](https://github.com/encode/starlette/blob/master/starlette/staticfiles.py)).

## The 304, watched in person

I ran every command in this post this morning on this machine: Python 3.14.9, a throwaway venv with `fastapi 0.165.0`, `starlette 1.10.0`, and `httpx 0.28.1` from PyPI, plus `uvicorn` for the live server. First round through FastAPI's `TestClient`:

```
1. GET /static/app.js -> 200
   etag: "6d9c12e784c1b1f5bfcfe0ca7968d2bf"
   cache-control: None
   last-modified: Tue, 24 Nov 2026 10:04:34 GMT
2. GET with If-None-Match: <etag> -> 304 body len: 0
3. GET with If-None-Match: W/<etag> -> 304
4. md5(mtime-size) == server etag: True -> "6d9c12e784c1b1f5bfcfe0ca7968d2bf"
5. after edit, GET with old etag -> 200 new etag: "baae2b7a11a6503dac0369e5901fd9c7"
6. GET /items (JSON) -> 200 etag: None
```

Line 1 is the free tag arriving. Line 2 is the whole point: matching tag, zero bytes, `304 Not Modified`. Line 3 surprised me pleasantly: the client sent a *weak* validator (`W/"..."` prefix), and Starlette still answered 304, because its comparison strips the `W/` prefix per [MDN's conditional-requests guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Conditional_requests). Line 4 confirms the tag formula by recomputing the MD5 myself. Line 5: edit the file, send the old tag, and you get the full 200 with a fresh tag. Line 6 is the gap: a plain JSON route sets no `ETag` at all. That's the part you add by hand.

To prove it wasn't a `TestClient` artifact, I ran a real server on this host and used `curl`:

```
$ curl -si http://127.0.0.1:8124/f/notes.txt
HTTP/1.1 200 OK
...
etag: "3f35ea5e393a6f8c4e9a9cf5381caa5d"

hello world

$ curl -si -H "If-None-Match: \"3f35ea5e393a6f8c4e9a9cf5381caa5d\"" http://127.0.0.1:8124/f/notes.txt
HTTP/1.1 304 Not Modified
...

bytes on the wire with validator: 0
bytes without validator: 12
```

The 304 carries the `etag` header and nothing else. Zero bytes on the wire, versus 12 the first time. Scale that to your actual payloads.

## What the tag is made of, and the mtime footgun

Remember the formula: `md5(mtime + "-" + size)`. Content is never hashed. Two consequences, both of which I measured.

First, the same bytes can carry different tags. I copied a 100 KB file to a new name (fresh mtime, identical content) and requested both. Different tags. Then I left the file's bytes alone and bumped its mtime with `os.utime`. The tag changed again. So identical content served from two places produces two tags, and a deploy that rewrites files with the same content still invalidates every cache. Neither is a correctness bug. The tag stays a valid version identifier. But if you expected content-addressed caching, mtime-based tags will surprise you.

Second, the same tag can survive different bytes. If a file's bytes change *and* its mtime and size happen to stay identical, the tag doesn't move. That combination is rare on real filesystems, but it's why the RFC treats ETags as version identifiers, not content digests. [MDN's ETag page](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/ETag) says the generation method is unspecified: "Typically, the ETag value is a hash of the content, a hash of the last modification timestamp, or just a revision number."

## Adding the validator to a JSON route

Line 6 above showed plain routes send no tag. Here's the pattern I verified: compute the tag from your payload, compare it to the incoming header, and return `304` with the tag when they match:

```python
import hashlib, json
from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse

app = FastAPI()
DB = {"version": 1, "items": ["plumbus", "portal gun"]}

def etag_of(payload) -> str:
    return '"' + hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()[:16] + '"'

@app.get("/items")
def items(request: Request):
    body = DB["items"]
    tag = etag_of(body)
    inm = request.headers.get("if-none-match")
    if inm and inm.strip().removeprefix("W/") == tag:
        return Response(status_code=304, headers={"ETag": tag})
    return JSONResponse(body, headers={"ETag": tag})
```

The transcript:

```
1. GET /items -> 200 etag "4efe1d993aa0aca0"
2. revalidate -> 304 body b''
3. wrong etag -> 200 full body returned: 24 bytes
4. after mutation, old etag -> 200 new etag "77cad8a844771f08"
```

Note the tag here hashes the *content* (SHA-256 of the canonical JSON), so it moves only when the data moves. That's the property the file route's tag lacks, and it's why hand-rolling is worth the ten lines for anything cacheable that lives in a database.

One boundary from MDN: `If-None-Match` revalidation belongs to GET and HEAD. For protecting writes against lost updates, the same page documents `If-Match` on unsafe methods. Send the tag you read, and the server answers `412 Precondition Failed` if the resource moved underneath you. I checked that flow works with the same hash function:

```
POST /counter/increment with stale If-Match -> 412
POST /counter/increment with fresh If-Match -> 200 {'count': 1}
```

## Pairing it with Cache-Control

The validator answers "has it changed?"; `Cache-Control` answers "should you even ask?". MDN's conditional-requests guide explains the loop: while a cached response is fresh, the client sends no request at all; once stale, it revalidates with `If-None-Match`, and a 304 makes the cache fresh again. My transcript confirmed the loop at the HTTP layer:

```
first fetch -> 200
revalidate, unchanged -> 304
revalidate, changed -> 200
```

Two settings cover most needs, both on the response headers: `Cache-Control: no-cache` means "store it, but revalidate before every use". That's the every-request-304 pattern, right for data that changes without warning. `Cache-Control: max-age=300` means "trust it for five minutes". That fits assets that only change on deploy, since it cuts the revalidation round-trip entirely during the window. `StaticFiles` sets neither for you; my line 1 transcript shows `cache-control: None`. If you want the header on file routes, wrap the mount or set it at the proxy.

## What to try today

Pick one endpoint that serves a payload heavier than it deserves. If it's a file behind `StaticFiles`, you already have the tag. Verify with two curls, the second carrying `If-None-Match: <etag from the first>`, and watch the 304 come back with zero bytes. If it's a JSON route, add the ten-line hash-and-compare from the last section and run the same two curls. Then check what `Cache-Control` your route sends and decide whether a fresh-window `max-age` could remove the round-trip entirely. One endpoint, two curls, and you'll know whether you've been reshipping unchanged bytes all along.
