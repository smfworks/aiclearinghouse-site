---
slug: "cap-request-bodies-before-fastapi-hands-you-a-413"
title: "Cap Request Bodies Before FastAPI Hands You a 413"
excerpt: "FastAPI 0.164.0 added max_body_size and 0.165.0 added form_limits, and I ran both on 0.165.0 this morning: a 1.5 MiB JSON body against a 1 MiB app limit comes back as 413 Content Too Large, a 100 MiB router carve-out works inside a 1 MiB app, a 2 KiB form field comes back as 400 with the parser's own message, and middleware that reads the body gets the app limit whether you meant it or not."
date: "2026-11-23"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Python", "FastAPI", "APIs", "Open Source", "Security"]
tags: ["fastapi", "request-body-limits", "413", "form-limits", "uploads", "starlette", "api-design"]
readTime: 5
image: "/images/blog/fastapi-body-limit-413-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/cap-request-bodies-before-fastapi-hands-you-a-413"
---

Your FastAPI service takes JSON today. Next month someone points an upload form at it, or a client retries with a 90 MB payload, and the answer to "how big a body does this thing accept?" is "as much as the disk holds." FastAPI gave you two ways to fix that in the last week of releases: `max_body_size` shipped in [0.164.0](https://github.com/fastapi/fastapi/releases/tag/0.164.0) (PR [#16781](https://github.com/fastapi/fastapi/pull/16781), published `2026-11-18T13:08:49Z`, body text: "Add configurable request body size limits") and `form_limits` shipped in [0.165.0](https://github.com/fastapi/fastapi/releases/tag/0.165.0) the same day (PR [#16784](https://github.com/fastapi/fastapi/pull/16784), published `2026-11-18T19:14:41Z`, body text: "Add configurable form parsing limits"). By the end of this post you'll be able to set a whole-body cap, carve out a big-upload router, cap form fields and field sizes, and run the four checks that prove each knob did what you meant.

I ran every command in this post this morning on this machine, in a throwaway virtualenv on Python 3.14.9 with `fastapi 0.165.0` installed from PyPI. The [docs page](https://fastapi.tiangolo.com/advanced/request-body-limits/) I fetched this run is the source for the inheritance rules; the transcript lines below are mine.

## One knob, four places to set it

`max_body_size` takes a number of bytes. The [docs page](https://fastapi.tiangolo.com/advanced/request-body-limits/) shows it on the `FastAPI()` app, on an `APIRouter`, on `include_router()`, and on a single path operation, with the innermost setting winning. The app's limit applies to the whole request body: two files in one request, any form fields, and the multipart encoding all count toward that one number. Headers and URL sit outside it.

Here's the app I used, straight from the docs' shape:

```python
from fastapi import APIRouter, FastAPI, UploadFile

app = FastAPI(max_body_size=1 * 1024 * 1024)  # 1 MiB

uploads = APIRouter(prefix="/uploads", max_body_size=100 * 1024 * 1024)

@app.post("/items")
def create_item(item: dict):
    return {"received": len(str(item))}

@uploads.post("/")
def upload(file: UploadFile):
    return {"filename": file.filename, "size": file.size}

@uploads.post("/small", max_body_size=10 * 1024 * 1024)
def small_upload(file: UploadFile):
    return {"filename": file.filename, "size": file.size}

app.include_router(uploads)
```

One app, three limits: `/items` gets 1 MiB from the app, `/uploads/` gets 100 MiB from the router, `/uploads/small` gets 10 MiB of its own. That carve-out pattern is the whole point: one generous door for uploads, a tight default everywhere else.

## The 413, watched in person

With that app loaded in a `TestClient`, a 1.5 MiB JSON body against `/items`:

```python
big = b"x" * (1536 * 1024)
r = client.post("/items", content=big, headers={"Content-Type": "application/json"})
```

```
1. oversized JSON POST /items -> 413 'Content Too Large'
2. small JSON POST /items -> 200 {'received': 18}
3. 2 MiB upload via /uploads/ -> 200 {'filename': 'blob.bin', 'size': 2097152}
4. 2 MiB upload via /uploads/small -> 200 {'filename': 'blob.bin', 'size': 2097152}
```

Line 1 is the cap working. Line 2 is a normal payload passing untouched. Lines 3 and 4 are the interesting ones: a 2 MiB file sails through both upload routes even though the app limit is 1 MiB, because the router's 100 MiB and the path operation's 10 MiB both sit inside the app. If you've ever wondered whether the carve-out actually overrides the app-level number, that's the test.

One detail from the docs worth internalizing: FastAPI counts bytes as it reads them, even when the client sends the body in chunks with no `Content-Length` header, and it returns 413 "if the response hasn't started yet." A path operation that streams the body to disk can start running before the total is known, so finish reading before you publish the file. The cap protects your buffers; it doesn't hand you a transaction.

## Forms get their own dials

`form_limits` covers the parsing side, and each setting inherits independently. From the same docs page: `max_fields` caps text fields (default 1,000), `max_files` caps files in a multipart form (default 1,000), and `max_part_size` caps each text field in bytes (default 1 MiB, counted with its encoded name for URL-encoded forms).

I set two of them and pushed past each:

```python
form_app = FastAPI(form_limits={"max_fields": 5})

@form_app.post("/notes")
def create_note(text: str = Form()):
    return {"size": len(text)}

part_app = FastAPI(form_limits={"max_part_size": 1024})

@part_app.post("/doc")
def create_doc(text: str = Form()):
    return {"size": len(text)}
```

```
5. 6 fields vs max_fields=5 -> 400 '{"detail":"Too many fields. Maximum number of fields is 5."}'
6. 2 KiB field vs max_part_size=1 KiB -> 400 '{"detail":"Field exceeded maximum size of 1KB."}'
```

Both come back as 400, with the parser's own message. That matches the docs: "Exceeding a parser limit returns HTTP 400." So the status code tells you which layer said no. A 413 means the body-size cap caught it; a 400 means the form parser did. When you wire up alerting on a public endpoint, that distinction is the whole signal.

One wrinkle I hit and want to save you: an oversized *body* behind a form route can surface as a validation error about a missing field rather than a 413, because the parser gave up before your parameter ever saw data. If you see `422 {"detail":[{"type":"missing","loc":["body","text"]...}]}` on a form route with strange input sizes, check the body cap before you debug your Pydantic model.

## The middleware surprise, measured

The docs warn about middleware that reads the body before route selection: "the app's limit applies to that read." I wanted to see it, because it's the kind of thing that ruins a deploy day. A middleware that calls `await request.body()`:

```python
mw = FastAPI(max_body_size=1024)

@mw.middleware("http")
async def peek(request: Request, call_next):
    body = await request.body()
    request.state.len = len(body)
    return await call_next(request)
```

```
middleware read of 5KB body vs 1KiB app limit -> 413 'Content Too Large'
```

The 413 fires during the middleware's read, before any route with a bigger allowance could have been chosen. The docs' advice is the fix: if your middleware must read bodies, set the app limit large enough for the biggest legitimate read and put the tight limits on the path operations. The app-level number is a floor under every eager read in your stack, whether you intended one or not.

## Two edge behaviors worth knowing

`max_body_size=0` allows only an empty body, per the docs. My check agreed on both sides:

```
POST with no body vs max_body_size=0 -> 200
POST 'x' vs max_body_size=0 -> 413
```

And leaving `max_body_size` at `None` everywhere leaves the body unlimited, which is exactly the default most services are running right now without knowing it.

## What to try today

Pin `fastapi>=0.165.0` in a scratch venv, paste the app from the first section, and run the five-line transcript yourself; the whole thing takes about two minutes and every line above is copy-paste ready. Then go look at your production routes and ask the question the release notes finally let you answer: what's the biggest body this endpoint will read, and who set it? If the honest answer is "whatever the client sends," `max_body_size` on the app and `form_limits` on the form routes is an afternoon of work that closes a whole class of "why is memory at 90%?" mornings.
